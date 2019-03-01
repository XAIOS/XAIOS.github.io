(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{168:function(t,s,a){"use strict";a.r(s);var n=a(0),e=Object(n.a)({},function(){this.$createElement;this._self._c;return this._m(0)},[function(){var t=this,s=t.$createElement,a=t._self._c||s;return a("div",{staticClass:"content"},[a("h1",{attrs:{id:"开发准备"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#开发准备","aria-hidden":"true"}},[t._v("#")]),t._v(" 开发准备")]),t._v(" "),a("p",[t._v("aml 的开发基于以 aml 为后缀的文件，这些文件在最后会根据配置文件被转为 html、aspx 或 cshtml 后缀。在项目启动的时候，直接按原先的开发模式部署文件，只需要将 html 后缀的文件改为 aml 后缀即可，demo 如下：")]),t._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[t._v("|- project_test\n|   |- css\n|   |- js\n|   |- index.html\n")])])]),a("p",[t._v("将 html 后缀的文件改为 aml 后缀：")]),t._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[t._v("|- project_test\n|   |- css\n|   |- js\n|   |- index.aml\n")])])]),a("p",[t._v("然后创建一个处理文件的 js：")]),t._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[t._v("|- project_test\n|   |- css\n|   |- js\n|   |- index.aml\n|\n|- aml_test.js\n")])])]),a("p",[t._v("在 js 文件中输入以下内容：")]),t._v(" "),a("div",{staticClass:"language-js extra-class"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// aml_test.js")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 引入 aml 处理逻辑，具体指向需根据实际情况判断")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" aml "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("require")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'./AML/index'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 第一个参数传入监听目录，预处理器将监听目录中所有 aml 文件的更改，实时输出文件")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 第二个参数为开始监听后的回调函数，用于在控制台中输出开始提示，无参数传入")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("aml")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'project_test'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" console"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("log")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token template-string"}},[a("span",{pre:!0,attrs:{class:"token string"}},[t._v("`\\r\\n  正在监听 aml 项目：project_test`")])]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])]),a("p",[t._v("此时开发准备就完成了，将 js 的执行程序改为 node.js 后可以直接双击 js 文件运行，之后就可以开始对 aml 文件的编辑了，每次保存后都会更新输出文件。")]),t._v(" "),a("div",{staticClass:"tip custom-block"},[a("p",{staticClass:"custom-block-title"},[t._v("TIP")]),t._v(" "),a("p",[t._v("aml 是通过监听目录进行转义的，适用于各种项目的目录配置，但和 Clever Page 一样，aml 诞生于非构建类项目，本身也可以看作一个构建器，所以并不适用于构建类项目，而且既然已经用到了构建工具，aml 的用处也就不大了。")])])])}],!1,null,null,null);s.default=e.exports}}]);