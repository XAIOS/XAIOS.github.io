PRE=53,PATH='img/',LOAD=['index/ani_0','index/ani_1','index/ani_2','index/ani_3','index/ani_4','index/ani_5','index/ani_6','game/bg_num','game/btn_build','game/btn_get','game/btn_rotate','game/build','game/c0','game/c1','game/c2','game/c3','game/c4','game/i0','game/i1','game/i2','game/i3','game/i4','game/n0','game/n1','game/n2','game/n3','game/n4','game/p0','game/p1','game/p2','game/p3','game/p4','game/sel','index/bg','index/bg_mask','index/bg_plus','index/btn_start','index/flower','loading','index/logo','pop/bg_msg','pop/btn_close','pop/btn_take','pop/g0','pop/g1','pop/g2','pop/g3','pop/g4','pop/t0','pop/t1','pop/tips_close','pop/title_first','pop/title_get'],new App({data:{error:'',card:'',build:'',build_img:'',build_style:'',swiper_index:-1,get_id:0},watch:{load:function load(a){a==PRE&&this.Init()}},methods:{Init:function Init(){var a=this;KWhale.Loading.Stop(function(){a.page='index',setTimeout(function(){a.cando=!0,a.alert=_wel_simple},3200)})},Sel:function Sel(a){this.swiper_index=a,this.swiper.slideTo(a)},GetNew:function GetNew(){this.get_id=Math.floor(5*Math.random()),this.card[this.get_id].num+=1,this.ralert='get',this.can_build=!this.card.some(function(a){return!a.num})},RalertClose:function RalertClose(){this.can_build&&this.ShowBuild(),'get_first'==this.ralert&&(this.card[this.get_id].num+=1),this.ralert=''},Start:function Start(){var a=this;this.cando&&(this.page='game',setTimeout(function(){return a.ralert='tips'},800),this.$nextTick(function(){a.swiper=new Swiper('.cards',{initialSlide:0,slidesPerView:'auto',centeredSlides:!0,watchSlidesProgress:!0,onProgress:function onProgress(b,a){var c=b.activeIndex,d=b.slides[c];if(d){a=(a-.25*c)/.25;var e=Math.abs(a);d.children[0].style.transform='translateY(-50%) scale('+(1-.25*e)+')';var f=0<a?b.slides[c+1]:b.slides[c-1];f&&(f.children[0].style.transform='translateY(-50%) scale('+(1<.25*e+.75?1:.25*e+.75)+')')}for(var g=0;g<b.slides.length;g++)b.slides[g].style.transform='translate3d('+5*b.slides[g].progress+'%, 0, 0)'},onTransitionEnd:function onTransitionEnd(b){a.swiper_index=b.activeIndex;for(var c=0;c<b.slides.length;c++)b.slides[c].children[0].style.transform='translateY(-50%) scale('+(c==b.activeIndex?1:.75)+')'}})}))},TipsClose:function TipsClose(){this.ralert='get_first'},Rotate:function Rotate(a){var b=this;a!=this.swiper_index||(this.card[a].rotate=0,this.card[a].open=!this.card[a].open,setTimeout(function(){return b.card[a].rotate=b.card[a].open?2:1},600))},ShowBuild:function ShowBuild(){this.build_style='',this.build_img=!0,this.build=!0},Build:function Build(){var a=this;this.build=!1,this.build_style={top:'2%',opacity:0,transform:'translateY(-50%) scale(.1)'},setTimeout(function(){return a.build_img=!1},1400),this.can_build=!1,this.card.forEach(function(a){return a.num--})}},created:function created(){var a=this;this._isMobile&&(LOAD.forEach(function(b){var c=new Image;c.onload=function(){return++a.load},c.onerror=function(){return a.error='\u8D44\u6E90\u52A0\u8F7D\u5931\u8D25\uFF1A'+b},c.src=''+PATH+b+'.png'}),this.get_id=Math.floor(5*Math.random()),this.card=[{},{},{},{},{}].map(function(a){return a.num=0,a.open=!1,a.rotate=1,a}))},mounted:function mounted(){this._CheckMobile()&&(InitContact(),this.page='loading',KWhale.Loading.Init({id:'loading',width:3,color:'#fff',logo:PATH+'loading.png'}))}});