new App({data:{db:''},methods:{Pre:function Pre(a){vant.ImagePreview({images:a.imgs,showIndicators:!0})}},created:function created(){this.db=db.map(function(a){a.imgs=[];for(var b=0;b<a.img;b++)a.imgs.push('repo/'+a.link+'/img/example/'+b+'.jpg');return a.user=a.user.split(','),a})},mounted:function mounted(){this._CheckMobile()&&(this.page='index')}});