var fs = require('fs'),
	connect = require('connect'),
	serveIndex = require('serve-index'),
	logger = require('morgan'),
	WebSocket = require('faye-websocket'),
	path = require('path'),
	url = require('url'),
	http = require('http'),
	send = require('send'),
	es = require("event-stream"),
	os = require('os'),
	chokidar = require('chokidar');
require('colors');

var INJECTED_CODE = fs.readFileSync(`${__dirname}/injected.html`, 'utf8')

var LiveServer = {
	server: null,
	watcher: null
};

function escape(html) {
	return String(html)
		.replace(/&(?!\w+;)/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

function staticServer(root) {
	return function(req, res, next) {
		if (req.method !== "GET" && req.method !== "HEAD") return next();
		var reqpath = url.parse(req.url).pathname;
		var hasNoOrigin = !req.headers.origin;
		var injectTag = null
		var sourcePath

		function directory() {
			var pathname = url.parse(req.originalUrl).pathname;
			res.statusCode = 301;
			res.setHeader('Location', pathname + '/');
			res.end('Redirecting to ' + escape(pathname) + '/');
		}

		function file(filepath) {
			if (hasNoOrigin && ['.html', '.htm'].includes(path.extname(filepath).toLocaleLowerCase())) {
				injectTag = true
				sourcePath = filepath
			}
		}

		function error(err) {
			if (err.status === 404) return next();
			next(err);
		}

		function inject(stream) {
			if (injectTag) {
				var len = INJECTED_CODE.length + res.getHeader('Content-Length')
				res.setHeader('Content-Length', len)
				var originalPipe = stream.pipe
				stream.pipe = function(resp) {
					originalPipe.call(stream, es.replace(/.*/, fs.readFileSync(sourcePath, 'utf8') + INJECTED_CODE)).pipe(resp)
				}
			}
		}

		send(req, reqpath, {
				root
			})
			.on('error', error)
			.on('directory', directory)
			.on('file', file)
			.on('stream', inject)
			.pipe(res);
	};
}

function entryPoint(staticHandler, file) {
	if (!file) return function(req, res, next) {
		next();
	};

	return function(req, res, next) {
		req.url = "/" + file;
		staticHandler(req, res, next);
	};
}

/**
 * Start a live server with parameters given as an object
 * @param host {string} Address to bind to (default: 0.0.0.0)
 * @param port {number} Port number (default: 80)
 * @param root {string} Path to root directory (default: cwd)
 * @param watch {array} Paths to exclusively watch for changes
 * @param ignore {array} Paths to ignore when watching files for changes
 * @param ignorePattern {regexp} Ignore files by RegExp
 * @param mount {array} Mount directories onto a route, e.g. [['/components', './node_modules']].
 * @param file {string} Path to the entry point file
 * @param wait {number} Server will wait for all changes, before reloading
 * @param htpasswd {string} Path to htpasswd file to enable HTTP Basic authentication
 * @param middleware {array} Append middleware to stack, e.g. [function(req, res, next) { next(); }].
 */
LiveServer.start = function(options) {
	options = options || {};
	var host = options.host || '0.0.0.0';
	var port = options.port || 80;
	var root = options.root || process.cwd();
	var mount = options.mount || [];
	var watchPaths = options.watch || [root];
	var file = options.file;
	var staticServerHandler = staticServer(root);
	var wait = options.wait === undefined ? 100 : options.wait;
	var browser = options.browser || null;
	var htpasswd = options.htpasswd || null;
	var cors = options.cors || false;
	var https = options.https || null;
	var proxy = options.proxy || [];
	var middleware = options.middleware || [];

	// Setup a web server
	var app = connect();

	if (options.spa) {
		middleware.push("spa");
	}
	// Add middleware
	middleware.map(function(mw) {
		if (typeof mw === "string") {
			var ext = path.extname(mw).toLocaleLowerCase();
			if (ext !== ".js") {
				mw = require(path.join(__dirname, "middleware", mw + ".js"));
			} else {
				mw = require(mw);
			}
		}
		app.use(mw);
	});

	// Use http-auth if configured
	if (htpasswd !== null) {
		var auth = require('http-auth');
		var basic = auth.basic({
			realm: "Please authorize",
			file: htpasswd
		});
		app.use(auth.connect(basic));
	}
	if (cors) {
		app.use(require("cors")({
			origin: true, // reflecting request origin
			credentials: true // allowing requests with credentials
		}));
	}
	mount.forEach(function(mountRule) {
		var mountPath = path.resolve(process.cwd(), mountRule[1]);
		if (!options.watch) // Auto add mount paths to wathing but only if exclusive path option is not given
			watchPaths.push(mountPath);
		app.use(mountRule[0], staticServer(mountPath));
	});
	proxy.forEach(function(proxyRule) {
		var proxyOpts = url.parse(proxyRule[1]);
		proxyOpts.via = true;
		proxyOpts.preserveHost = true;
		app.use(proxyRule[0], require('proxy-middleware')(proxyOpts));
	});
	app.use(staticServerHandler) // Custom static server
		.use(entryPoint(staticServerHandler, file))
		.use(serveIndex(root, {
			icons: true
		}));

	var server, protocol;
	if (https !== null) {
		var httpsConfig = https;
		if (typeof https === "string") {
			httpsConfig = require(path.resolve(process.cwd(), https));
		}
		server = require("https").createServer(httpsConfig, app);
		protocol = "https";
	} else {
		server = http.createServer(app);
		protocol = "http";
	}

	// Handle server startup errors
	server.addListener('error', function(e) {
		if (e.code === 'EADDRINUSE') {
			var serveURL = protocol + '://' + host + ':' + port;
			console.log('%s is already in use. Trying another port.'.yellow, serveURL);
			setTimeout(function() {
				server.listen(0, host);
			}, 1000);
		} else {
			console.error(e.toString().red);
			LiveServer.shutdown();
		}
	});

	// Handle successful server
	server.addListener('listening', () => LiveServer.server = server)

	// Setup server to listen at port
	server.listen(port, host);

	// WebSocket
	var clients = [];
	server.addListener('upgrade', function(request, socket, head) {
		var ws = new WebSocket(request, socket, head);

		if (wait > 0) {
			(function() {
				var wssend = ws.send;
				var waitTimeout;
				ws.send = function() {
					var args = arguments;
					if (waitTimeout) clearTimeout(waitTimeout);
					waitTimeout = setTimeout(function() {
						wssend.apply(ws, args);
					}, wait);
				};
			})();
		}

		ws.onclose = function() {
			clients = clients.filter(function(x) {
				return x !== ws;
			});
		};

		clients.push(ws);
	});

	var ignored = [
		function(testPath) { // Always ignore dotfiles (important e.g. because editor hidden temp files)
			return testPath !== "." && /(^[.#]|(?:__|~)$)/.test(path.basename(testPath));
		}
	]

	if (options.ignore)
		ignored = ignored.concat(options.ignore);
	if (options.ignorePattern)
		ignored.push(options.ignorePattern);

	// Setup file watcher
	LiveServer.watcher = chokidar.watch(watchPaths, {
		ignored: ignored,
		ignoreInitial: true
	});

	function handleChange(changePath) {
		var ex_name = path.extname(changePath)
		if (ex_name != '.ts')
			clients.forEach(function(ws) {
				if (ws)
					ws.send(ex_name === '.css' ? 'refreshcss' : 'reload')
			})
	}

	LiveServer.watcher.on("add", handleChange).on("change", handleChange)

	return server;
}

LiveServer.shutdown = function() {
	var watcher = LiveServer.watcher;
	watcher && watcher.close();
	var server = LiveServer.server;
	server && server.close();
}

module.exports = LiveServer
