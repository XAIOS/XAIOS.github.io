PRE=18,PATH='img/',LOAD=['bg','game/base','game/core','game/core_blink','game/start','index/award','index/blink','index/light','index/sl_0','index/sl_1','index/start','index/title','pop/bg_msg','pop/close','rotate'],GAME=['green','orange','yellow'],step=[0,1,2,3,4,9,14,19,24,23,22,21,20,15,10,5,6,7,8,13,18,17,16,11,12],position=[{x:396,y:393},{x:792,y:131},{x:792,y:0},{x:660,y:0},{x:528,y:0},{x:396,y:0},{x:264,y:0},{x:132,y:0},{x:0,y:0},{x:264,y:393},{x:132,y:393},{x:0,y:393},{x:792,y:262},{x:660,y:262},{x:528,y:262},{x:396,y:262},{x:264,y:262},{x:132,y:262},{x:0,y:262},{x:660,y:131},{x:528,y:131},{x:396,y:131},{x:264,y:131},{x:132,y:131},{x:0,y:131}],cells=[],res=Array.from({length:25},function(a,b){return b}),function(){for(var a,b,c=res.length;c;)a=Math.floor(Math.random()*c--),b=res[a],res[a]=res[c],res[c]=b}();function Cell(a,b){var c=this;this.img=app['img_'+b],this.Move=function(a){c.i=a,c.p=position[a],c.x=Math.ceil(a%5*app.c_w),c.y=Math.floor(a/5)*app.c_h},this.Move(a),this.Draw=function(){return app.ctx.drawImage(c.img,c.p.x,c.p.y,130,129,c.x,c.y,app.c_w,app.c_h)}}new App({data:{error:''},watch:{load:function load(a){a==PRE&&this.Init()}},computed:{progress:function progress(){return 100*(this.load/PRE)+'%'}},methods:{Init:function Init(){var a=this;setTimeout(function(){a.page='index',setTimeout(function(){a.cando=!0,a.alert=_wel},4e3)},2e3<new Date-this.load_time?0:2e3)},ToGame:function ToGame(){if(this.cando){this.page='game';var a=$id('game'),b=getComputedStyle(document.getElementsByClassName('game_box')[0]);this.cw=a.width=parseInt(b.width)*devicePixelRatio,this.c_w=131*(this.cw/655),this.ch=a.height=parseInt(b.height)*devicePixelRatio,this.c_h=127*(this.ch/633),this.ctx=a.getContext('2d'),this.ralert='rule'}},Start:function Start(){var a=this;if(void 0===res[0])return void(this.alert='\u6F14\u793A\u5DF2\u7ED3\u675F');if(!this.running){this.running=!0;var b=0,c=1;this.cell=new Cell(0,'orange');var d=function(e){var f=1<b?e+20:e;c=++c%25,a.cell.Move(step[c]),c||++b,100<f&&step[c]==res[0]?setTimeout(function(){cancelAnimationFrame(a.timer),cells.push(new Cell(res[0],'yellow')),a.FormatCell(),res.shift()},300):setTimeout(function(){return d(f)},f)};d(50),this.Run()}},Run:function Run(){this.ctx.clearRect(0,0,this.cw,this.ch),cells.forEach(function(a){return a.Draw()}),this.cell.Draw(),this.timer=requestAnimationFrame(this.Run)},FormatCell:function FormatCell(){var a=this,b=cells.map(function(a){return a.i}),c=b.includes(12)?[b.includes(0)&&b.includes(6)&&b.includes(18)&&b.includes(24),b.includes(2)&&b.includes(7)&&b.includes(17)&&b.includes(22),b.includes(4)&&b.includes(8)&&b.includes(16)&&b.includes(20),b.includes(10)&&b.includes(11)&&b.includes(13)&&b.includes(14)]:'';this.ctx.clearRect(0,0,this.cw,this.ch),cells.forEach(function(b){c&&(12==b.i||(0==b.i||6==b.i||18==b.i||24==b.i)&&c[0]||(2==b.i||7==b.i||17==b.i||22==b.i)&&c[1]||(4==b.i||8==b.i||16==b.i||20==b.i)&&c[2]||(10==b.i||11==b.i||13==b.i||14==b.i)&&c[3])&&(b.img=a.img_green),b.Draw()}),this.running=!1}},created:function created(){var a=this;this._isMobile&&(LOAD.forEach(function(b){var c=new Image;c.onload=function(){return++a.load},c.onerror=function(){return a.error='\u8CC7\u6E90\u52A0\u8F09\u5931\u6557\uFF1A'+b},c.src=''+PATH+b+'.png'}),GAME.forEach(function(b){a['img_'+b]=new Image,a['img_'+b].onload=function(){return++a.load},a['img_'+b].onerror=function(){return a.error='\u8CC7\u6E90\u52A0\u8F09\u5931\u6557\uFF1Agame/'+b},a['img_'+b].src=PATH+'game/'+b+'.png'}))},mounted:function mounted(){this._CheckMobile()&&(InitContact(),this.load_time=new Date,this.page='loading')}});