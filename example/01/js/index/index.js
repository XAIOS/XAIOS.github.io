iw=innerWidth,ih=innerHeight,sw=iw/720,sh=ih/1135,PRE=31,PATH='img/',LOAD=['pop/bg_msg','pop/bg_rule','pop/bg_score','pop/btn_again','pop/btn_index','pop/close','pop/score_hand','pop/score_light','pop/score_plus','pop/score_title','pop/tips_0','pop/tips_1','pop/tips_2','btn_rule','btn_start','floor','game/stars','logo','moon','music_0','music_1','score','shadow','table','timer','title'];var _Matter=Matter,Body=_Matter.Body,World=_Matter.World,Bodies=_Matter.Bodies;function Suit(a,b,c){var d=Math.ceil,e=a/b;return a/=720,b=b/1135*ih,a=b*e>iw*a?iw*a:b*e,b=a/e,c?void(c.w=d(a),c.h=d(b)):{w:d(a),h:d(b)}}foods=[],clouds=[],s_line=Suit(20,190),s_food=Suit(227,160),s_food_core=Suit(200,110),s_rabbit_0=Suit(134,151),s_rabbit_1=Suit(60,60),s_cloud=Suit(186,112),new App({data:{error:'',rule:'',score:0,score_top:.6*ih+250*sw,stage_top:.4*ih,score_high:0,time_sec:'00'},watch:{load:function load(a){a==PRE&&this.Init()}},computed:{progress:function progress(){return(100*(this.load/PRE)).toFixed(2)}},methods:{Init:function Init(){var a=this;setTimeout(function(){a.page='index',setTimeout(function(){a.alert='\u6B61\u8FCE\u700F\u89BD\u672C\u793A\u4F8B',a.cando=!0},4200)},2e3<new Date-this.load_time?0:2e3)},Rule:function Rule(){this.cando&&(this.ralert='rule')},ToStart:function ToStart(){this.cando&&(this.page='game',this.first?this.ralert='tips':this.engine?this.PlayAgain():(this.Start(),this.Timer()))},Timer:function Timer(){var a=this;this.time_sec=60,this.timer=setInterval(function(){a.time_sec=10<a.time_sec?a.time_sec-1:FormatNum(a.time_sec-1),'00'==a.time_sec&&a.GameOver()},1e3)},ToIndex:function ToIndex(){this.RalertClose(),this.page='index'},Start:function Start(){var a=this;this.engine=Matter.Engine.create(),this.render=Matter.Render.create({engine:this.engine,element:document.querySelector('.page_game'),options:{width:iw,height:ih,pixelRatio:devicePixelRatio,wireframes:!1}}),this.engine.timing.timeScale=1.1,this.rabbit_0=Bodies.rectangle(iw/2,1.1*s_line.h,s_rabbit_0.w,s_rabbit_0.h,{isStatic:!0,render:{sprite:{xScale:s_rabbit_0.w/this.img_rabbit_0.width,yScale:s_rabbit_0.h/this.img_rabbit_0.height,texture:PATH+'game/rabbit_0.png'}}}),this.rabbit_1=Bodies.rectangle(iw/2,1.1*s_line.h,s_rabbit_1.w,s_rabbit_1.h,{isStatic:!0,render:{sprite:{xScale:s_rabbit_1.w/this.img_rabbit_1.width,yScale:s_rabbit_1.h/this.img_rabbit_1.height,texture:PATH+'game/rabbit_1.png'}}}),this.line=Bodies.rectangle(iw/2,.42*s_line.h,s_line.w,s_line.h,{isStatic:!0,render:{sprite:{xScale:s_line.w/this.img_line.width,yScale:s_line.h,texture:PATH+'game/line.png'}}}),this.ground=Bodies.rectangle(iw/2,.63*ih+250*sw,.75*iw,40*sh,{friction:2,frictionStatic:2,isStatic:!0,render:{visible:!1}}),World.add(this.engine.world,[this.rabbit_1,this.line,this.rabbit_0,this.ground]),this.base=[this.rabbit_1,this.line,this.rabbit_0,this.ground],Matter.Engine.run(this.engine),Matter.Render.run(this.render),Matter.Events.on(this.engine,'afterUpdate',function(){1<foods.length&&a.droping_food.position.y>a.deadline&&a.GameOver();var b;clouds.forEach(function(c,d){Body.setPosition(c,Matter.Vector.create(c.position.x+sw,c.position.y)),(c.position.x>iw+s_cloud.w||c.position.y>ih+s_cloud.h)&&(b=!0,World.remove(a.engine.world,c),clouds.splice(d,1),c.position.y<ih+s_cloud.h&&a.NewCloud(c.position.y))}),clouds=clouds.filter(function(a){return a.position.x<iw+s_cloud.w||a.position.y<ih+s_cloud.h})}),this.ShakeLine(),this.Cloud(),this.NewFood(),this.render.canvas.style.cssText+='background:transparent;',this.render.canvas.addEventListener('click',function(){return a.DropFood()})},Reset:function Reset(){var a=this;$id('food_shadow').style.opacity=0,foods.forEach(function(b){return World.remove(a.engine.world,b)}),clouds.forEach(function(b){return World.remove(a.engine.world,b)}),Body.setPosition(this.ground,Matter.Vector.create(iw/2,.63*ih+250*sw)),foods=[],clouds=[],this.score=0,this.stage_top=.4*ih,this.score_top=.6*ih+250*sw,this.deadline=ih,this.die=!1},PlayAgain:function PlayAgain(){this.die&&(this.RalertClose(),this.Reset(),this.Cloud(),this.Timer(),this.NewFood(),Matter.Render.run(this.render))},GameOver:function GameOver(){var a=this;this.die||(this.die=!0,clearInterval(this.timer),setTimeout(function(){Matter.Render.stop(a.render),a.score_high=a.score>a.score_high?a.score:a.score_high,a.ralert='score'},2e3))},Cloud:function Cloud(){var a=this;this.NewCloud(.2*ih),setTimeout(function(){return a.NewCloud(.4*ih)},1e3)},NewCloud:function NewCloud(a){var b=Bodies.rectangle(-s_cloud.w/2,a||this.food.position.y,s_cloud.w,s_cloud.h,{isStatic:!0,collisionFilter:{category:0},render:{sprite:{xScale:s_cloud.w/this.img_cloud.width,yScale:s_cloud.h/this.img_cloud.height,texture:PATH+'game/cloud.png'}}});clouds.push(b),this.engine.world.bodies=clouds.concat(foods).concat(this.base),Matter.Composite.setModified(this.engine.world,!0,!0,!1)},TipsEnd:function TipsEnd(){this.first&&(this.first=!1,this.RalertClose(),this.Start(),this.Timer())},ShakeLine:function ShakeLine(){var a=Math.PI,b=this,c=To.easing.quadInOut,d=Matter.Vector.create(iw/2,0);Body.rotate(this.line,a/180*40,d);var e={deg:40},f=40,g=function(){Body.rotate(b.line,a/180*(e.deg-f),d);var c=(b.line.vertices[2].x+b.line.vertices[3].x)/2,g=(b.line.vertices[2].y+b.line.vertices[3].y)/2;Body.setPosition(b.rabbit_0,Matter.Vector.create(c,g+.1*s_rabbit_0.h)),Body.setPosition(b.rabbit_1,Matter.Vector.create(c,g+.1*s_rabbit_1.h)),b.food&&Body.setPosition(b.food,Matter.Vector.create(c,g+.36*s_food.h)),f=e.deg};(function a(){To.get(e).to({deg:-40},1000,c).progress(g).end(function(){To.get(e).to({deg:40},1000,c).progress(g).end(a).start()}).start()})()},NewFood:function NewFood(){var a=(this.line.vertices[2].x+this.line.vertices[3].x)/2,b=(this.line.vertices[2].y+this.line.vertices[3].y)/2+.36*s_food.h;this.food=Bodies.rectangle(a,b,s_food_core.w,s_food_core.h,{density:.1,friction:2,frictionStatic:2,isStatic:!0,render:{sprite:{xScale:s_food.w/this.img_food.width,yScale:s_food.h/this.img_food.height,texture:PATH+'game/food.png'}}}),foods.push(this.food),this.engine.world.bodies=clouds.concat(foods).concat(this.base),Matter.Composite.setModified(this.engine.world,!0,!0,!1),foods.length%3||this.NewCloud()},DropFood:function DropFood(){var a=this;if(this.food&&!this.die){var b=this.droping_food=this.food;this.food=null,1<foods.length&&(this.deadline=foods[foods.length-2].position.y-s_food_core.h/2),setTimeout(function(){if(!a.die){if(a.score_top=b.position.y-.4*s_food.h,1==foods.length){var c=b.position.x,d=b.position.y-.4*ih+.46*s_food.h;$id('food_shadow').style.cssText+='top:'+d+'px;left:'+c+'px;opacity:1;'}b.position.y-s_food_core.h/2<ih/2?a.MoveStage(function(){a.score+=1,a.NewFood()}):(a.score+=1,a.NewFood())}},1e3),this.musicing&&this.music_drop.play(),Body.setStatic(b,!1)}},MoveStage:function MoveStage(a){var b=this,c={h:ih/3},d=ih/3;this.deadline+=ih/3,foods.forEach(function(a){return Body.setStatic(a,!0)}),To.get(c).to({h:0},800,To.easing.quadOut).progress(function(){var a=d-c.h;b.stage_top<1.2*ih&&(b.stage_top+=a),b.score_top+=a,Body.setPosition(b.ground,Matter.Vector.create(iw/2,b.ground.position.y+a)),foods.forEach(function(b){return Body.setPosition(b,Matter.Vector.create(b.position.x,b.position.y+a))}),clouds.forEach(function(b){return Body.setPosition(b,Matter.Vector.create(b.position.x,b.position.y+a))}),d=c.h}).end(function(){foods.forEach(function(a){return Body.setStatic(a,!1)}),a()}).start()}},created:function created(){var a=this;['cloud','food','line','rabbit_0','rabbit_1'].forEach(function(b){a['img_'+b]=new Image,a['img_'+b].onload=function(){return++a.load},a['img_'+b].onerror=function(){return a.error='\u8D44\u6E90\u52A0\u8F7D\u5931\u8D25\uFF1A'+b},a['img_'+b].src=PATH+'game/'+b+'.png'}),LOAD.forEach(function(b){var c=new Image;c.onload=function(){return++a.load},c.onerror=function(){return a.error='\u8D44\u6E90\u52A0\u8F7D\u5931\u8D25\uFF1A'+b},c.src=''+PATH+b+'.png'}),this.InitBgm('music/bgm.mp3'),this.bgm_music.volume=.8,this.music_drop=new Audio,this.music_drop.preload=!0,this.music_drop.src='music/drop.mp3',this.first=!0,this.rule='\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219\u793A\u4F8B\u7528\u6E38\u620F\u89C4\u5219'},mounted:function mounted(){this.load_time=new Date,this.page='loading'}});