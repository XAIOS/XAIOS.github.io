var _slicedToArray=function(){function a(a,b){var c=[],d=!0,e=!1,f=void 0;try{for(var g,h=a[Symbol.iterator]();!(d=(g=h.next()).done)&&(c.push(g.value),!(b&&c.length===b));d=!0);}catch(a){e=!0,f=a}finally{try{!d&&h['return']&&h['return']()}finally{if(e)throw f}}return c}return function(b,c){if(Array.isArray(b))return b;if(Symbol.iterator in Object(b))return a(b,c);throw new TypeError('Invalid attempt to destructure non-iterable instance')}}();PRE=36,PATH='img/',LOAD=['pop/bg_coin','pop/bg_lucky','pop/bg_msg','pop/btn_close','pop/gift_1','pop/gift_2','pop/light','pop/title_get','btn_add','btn_dot_box','btn_music_0','btn_music_1','dot/1','dot/2','dot/3','dot/4','dot/5','dot/6','loading/bg','loading/light','loading/loading','loading/word','map/map_0','map/map_1','map/map_2','map/map_3','map/sun','people/00','people/01','people/10','people/11','people/20','people/21','people/30','people/31','award'],map_size={},map_change=[10,22,33,44],map=map.map(function(a){var b=Math.ceil;return a.map(function(a){return a.map(function(a){if(a.style=a.style||{},map_size[a.suit])a.style.width=map_size[a.suit].w,a.style.height=map_size[a.suit].h;else{var c=a.suit.split(','),d=_slicedToArray(c,2),e=d[0],f=d[1],g=e/f;e/=720,f=f/1135*innerHeight,e=f*g>innerWidth*e?innerWidth*e:f*g,f=e/g,a.style.width=b(e)+'px',a.style.height=b(f)+'px',map_size[a.suit]={w:a.style.width,h:a.style.height}}return a})})}),new App({data:{map_0:map[0],map_1:map[1],map_2:map[2],map_3:map[3],dot:6,area:4,life:0,index:'',people:'',people_transition:'',get_coin:'',lucky_img:'',lucky_name:'',people_img:0,people_face:0,error:'',record:'',award:'',dot_shake:'',gift_open:'',desc_luck:''},computed:{progress:function progress(){return(100*(this.load/PRE)).toFixed(0)}},watch:{load:function load(a){a==PRE&&this.Init()},index:function index(a){var b=step[a];b=map[b[0]][b[1]][b[2]];var c=this.$refs['map_'+this.area][b.index],d=1==this.area||2==this.area?this.c_t+c.offsetTop:innerHeight+c.offsetTop,e=2==this.area||3==this.area?innerWidth+c.offsetLeft:this.c_l+c.offsetLeft;this.people='translate('+(e+c.offsetWidth/2-this.p_w)+'px,'+(d+c.offsetHeight/2-this.p_h)+'px)',this.people_face=b.face}},methods:{Init:function Init(){var a=this;setTimeout(function(){a.page='game',a.$nextTick(function(){a.c_t=$id('cell_box').offsetTop,a.c_l=$id('cell_box').offsetLeft,a.p_w=$id('cell_people').offsetWidth/2,a.p_h=$id('cell_people').offsetHeight/2,setTimeout(function(){a.area=0,setTimeout(function(){var b=step[0];b=map[b[0]][b[1]][b[2]];var c=a.$refs['map_'+a.area][b.index],d=1==a.area||2==a.area?a.c_t+c.offsetTop:innerHeight+c.offsetTop,e=2==a.area||3==a.area?innerWidth+c.offsetLeft:a.c_l+c.offsetLeft;a.people='translate('+(e+c.offsetWidth/2-a.p_w)+'px,-'+a.p_h+'px)',a.people_face=b.face,$id('cell_people').style.opacity=1,setTimeout(function(){a.people_transition='transform 1.2s linear',a.index=0}),setTimeout(function(){a.alert=_wel,a.looping=!1,a.people_transition='transform .3s linear'},1500)},600)},1400)})},2e3<new Date-this.load_time?0:2e3)},Start:function Start(){var a=Math.ceil,b=this;return this.looping?void 0:this.life?void(this.m_loop.play(),this.looping=!0,this.dot_shake=!0,this.loop=setInterval(function(){return b.dot=a(6*Math.random())},200),this.life-=1,setTimeout(function(){clearInterval(b.loop),b.dot_shake=!1,b.dot=a(6*Math.random()),b.m_loop.pause(),b.Go(b.dot),b.people_loop=setInterval(function(){return b.people_img=+!b.people_img},300)},2e3)):void this.AddLife()},AddLife:function AddLife(){this.looping||(this.life=900>this.life?this.life+100:999,this.alert='\u904A\u6232\u6A5F\u6703\u6DFB\u52A0\u6210\u529F')},Cell:function Cell(a){a.type&&!this.looping&&(this.ralert='desc',this.desc_luck=2==a.type)},Go:function Go(a){var b=this;map_change.includes(this.index)?setTimeout(function(){b.area=3==b.area?0:b.area+1,setTimeout(function(){return b.Step(--a)},1100)},500):(this.people_opacity=1,setTimeout(function(){return b.Step(--a)},500))},Step:function Step(a){this.index=this.index==step.length-1?0:this.index+1,a?this.Go(a):this.Stop()},Stop:function Stop(){var a=this;setTimeout(function(){clearInterval(a.people_loop);var b=step[a.index];b=map[b[0]][b[1]][b[2]],1==b.type?(a.get_coin=Math.ceil(100*Math.random()),a.ralert='get_coin'):2==b.type&&(a.ralert='gift_light',setTimeout(function(){a.gift_open=!0,setTimeout(function(){a.m_box.pause(),a.ralert='lucky'},3e3)},2e3)),a.looping=!1},500)},RalertClose:function RalertClose(){this.gift_open=!1,this.ralert=''}},created:function created(){var a=this;if(this._isMobile){LOAD.forEach(function(b){var c=new Image;c.onload=function(){return++a.load},c.onerror=function(){return a.error='\u8CC7\u6E90\u52A0\u8F09\u5931\u6557\uFF1A'+b},c.src=''+PATH+b+'.png'}),this.InitBgm('music/bgm.mp3');var b=function(b,c){a[b]=new Audio,a[b].loop=!0,a[b].preload=!0,a[b].addEventListener('play',function(){return a.bgm_music.volume=.5}),a[b].addEventListener('pause',function(){return a.bgm_music.volume=1}),a[b].src='music/'+c+'.mp3'};b('m_box','m_box'),b('m_loop','m_loop'),this.life=100,this.looping=!0}},mounted:function mounted(){this._CheckMobile()&&(InitContact(),this.load_time=new Date,this.page='loading')}});