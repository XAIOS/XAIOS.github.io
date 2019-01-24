iw = innerWidth * devicePixelRatio
ih = innerHeight * devicePixelRatio

PRE = 37
PATH = 'img/'
LOAD = ['pop/bg_award', 'pop/bg_gift', 'pop/bg_lucky', 'pop/bg_msg', 'pop/bg_rule', 'pop/btn_close', 'pop/btn_info', 'pop/btn_submit', 'pop/btn_sure', 'pop/gift', 'index/arrow_0', 'index/arrow_1', 'index/bg', 'index/earth', 'game/bg', 'game/earth', 'index/cat', 'index/flower_l', 'index/flower_r', 'index/gift', 'index/ring', 'index/rule', 'index/start', 'index/into', 'music_0', 'music_1', 'pop/tips', 'index/title']

function Suit(w, h, e) {
  var s = w / h
  w /= 720
  h = h / 1135 * ih

  w = h * s > iw * w ? iw * w : h * s
  h = w / s

  if (!e) {
    return {
      w: Math.ceil(w),
      h: Math.ceil(h)
    }
  }

  e.w = Math.ceil(w)
  e.h = Math.ceil(h)
}

function Cat(owner) {
  Suit(112, 156, this)

  var v = -ih / 65

  this.x = iw / 2 - this.w / 2
  this.y = ih - this.h
  this.vx = 0
  this.vy = v

  this.img = owner.img_cat

  this.Jump = () => {
    this.vy = v
    this.img = owner.img_cat_jump
    owner.bgm && owner.music_j.play()
    setTimeout(() => this.img = owner.img_cat, 200)
  }

  this.Draw = () => owner.ctx.drawImage(this.img, this.x, this.y, this.w, this.h)
}

function Gold(cloud, owner) {
  this.x = cloud.x
  this.y = cloud.y

  var km = {
    offset: Suit(74, 80),
    Draw() {
      owner.ctx.drawImage(owner.img_km, this.x, this.y, this.w, this.h)
    }
  }

  var txt = {
    offset: Suit(130, 40),
    text: cloud_num / 5,
    Draw() {
      owner.ctx.font = `italic ${20 * iw / 720}px sans-serif`
      owner.ctx.fillText('KM', this.x + owner.km_width, this.y)
      owner.ctx.font = `italic ${32 * iw / 720}px sans-serif`
      owner.ctx.fillText(this.text, this.x, this.y)
    }
  }

  var gold = {
    offset: Suit(-6, 66),
    img: owner[`img_g${Math.ceil(Math.random() * 5)}`],
    Draw() {
      owner.ctx.drawImage(this.img, this.x, this.y, this.w, this.h)
    }
  }

  Suit(107, 104, km)
  Suit(100, 100, gold)

  this.offset = km.h
  this.w = cloud.w
  this.run = cloud.run
  this.vx = 2

  this.Draw = () => {
    [km, txt, gold].forEach(i => {
      i.x = this.x + i.offset.w
      i.y = this.y - i.offset.h
      i.Draw()
    })
  }
}

function Cloud(owner) {
  Suit(191, 70, this)

  this.x = Math.random() * (iw - this.w)
  this.y = clouds.length == cloud_max ? 0 : ih / cloud_max * clouds.length

  this.vx = 2
  this.run = Math.random() > (.8 / owner.score)

  this.Draw = () => owner.ctx.drawImage(owner.img_cloud, this.x, this.y, this.w, this.h)

  cloud_num += 1
  if (!(cloud_num % 5))
    golds.push(new Gold(this, owner))
}

function Reset(owner) {
  golds = []
  clouds = []
  cloud_num = 0
  owner.score = 0

  for (var i = 0; i < cloud_max; i++)
    clouds.push(new Cloud(owner))

  owner.cat = new Cat(owner)
}

g = ih / 3000
cloud_max = 4
cat_vx = 12 / 720 * iw

new App({
  data: {
    error: '',
    rule: '',
    list: [],
    score: 0,
    name: '',
    phone: '',
    address: '',
    saved: false
  },
  watch: {
    load(val) {
      val == PRE && this.Init()
    }
  },
  filters: {
    fixed(val) {
      return val.toFixed(1)
    }
  },
  methods: {
    Init() {
      Reset(this)

      window.addEventListener('deviceorientation', e => {
        var deg = Math.abs(e.gamma) / 10
        this.cat.vx = (deg > 6 ? 6 : deg) / 6 * cat_vx

        if (this.cat.vx > cat_vx)
          this.cat.vx = cat_vx
        else if (this.cat.vx < -cat_vx)
          this.cat.vx = -cat_vx

        if (e.gamma > 0) {
          this.cat.to_r = true
          this.cat.to_l = false
        } else {
          this.cat.to_l = true
          this.cat.to_r = false
        }
      })

      KWhale.Loading.Stop(() => {
        this.page = 'index'
        setTimeout(() => {
          this.cando = true
          this.alert = '欢迎浏览本示例'
        }, 3400)
      })
    },
    Into() {
      if (this.cando)
        this.alert = '点击此处原为打开外部链接'
    },
    AwardList() {
      if (this.cando)
        this.ralert = 'award'
    },
    Rule() {
      if (this.cando)
        this.ralert = 'rule'
    },
    Start() {
      if (!this.cando) return
      this.ctx.clearRect(0, 0, iw, ih)
      this.page = 'game'

      if (this.first) {
        this.ralert = 'tips'
      } else {
        if (this.starting) return
        this.starting = true
        Reset(this)
        setTimeout(this.Run, 600)
        this.music_j.play()
      }
    },
    Info() {
      this.ralert = 'lucky'
    },
    GameStart() {
      if (this.starting) return
      this.starting = true
      this.RalertClose()
      this.Run()
      this.first = false
      this.music_j.play()
    },
    Run() {
      this.ctx.clearRect(0, 0, iw, ih)
      this.Calc()
      clouds.forEach(i => i.Draw())
      golds.forEach(i => i.Draw())
      this.cat.Draw()
      this.running = requestAnimationFrame(this.Run)
    },
    Calc() {
      var cat = this.cat
      if (cat.to_l)
        cat.x -= cat.vx
      else
        cat.x += cat.vx

      if (cat.y + cat.h > ih && !cat.jumped)
        cat.Jump()
      if (cat.y > ih && !cat.isDead)
        this.GameOver()

      if (cat.x > iw)
        cat.x = -cat.w
      else if (cat.x < -cat.w)
        cat.x = iw

      golds.forEach(i => {
        if (i.run) {
          if (i.x < 0 || i.x + i.w > iw)
            i.vx *= -1
          i.x += i.vx
        }
      })

      clouds.forEach(i => {
        if (i.run) {
          if (i.x < 0 || i.x + i.w > iw)
            i.vx *= -1
          i.x += i.vx
        }
      })

      if (cat.y >= ih / 2 - cat.h / 2) {
        cat.y += cat.vy
        cat.vy += g
      } else {
        golds.forEach((i, index) => {
          if (cat.vy < 0)
            i.y -= cat.vy

          if (i.y - i.offset > ih)
            golds.splice(index, 1)
        })

        clouds.forEach((p, i) => {
          if (cat.vy < 0)
            p.y -= cat.vy

          if (p.y > ih)
            clouds[i] = new Cloud(this)
        })

        cat.vy += g

        if (cat.vy >= 0) {
          cat.y += cat.vy
          cat.vy += g
        }
      }

      if (cat.vy > 0)
        clouds.forEach(i => {
          if ((cat.x + cat.w / 2 < i.x + i.w) && (cat.x + cat.w / 2 > i.x) && (cat.y + cat.h > i.y + 4) && (cat.y + cat.h < i.y + i.h)) {
            cat.jumped = true
            if (!i.kissed) {
              i.kissed = true
              this.score += .2
            }
            cat.Jump()
          }
        })
    },
    GameOver() {
      this.starting = false
      this.cat.isDead = true
      this.cat.y > ih && setTimeout(this.Stop)

      if (this.saved)
        this.alert = '游戏结束'
      else
        this.ralert = 'draw'
    },
    Stop() {
      cancelAnimationFrame(this.running)
    },
    RalertClose() {
      if (this.page == 'game' && this.ralert == 'lucky') this.page = 'index'
      this.ralert = this.page == 'index' && this.ralert == 'lucky' ? 'award' : ''
    },
    AlertClose() {
      if (this.alert == '游戏结束')
        this.page = 'index'
      this.alert = ''
    },
    Submit() {
      if (!this.name) {
        Toast('请输入您的姓名')
      } else if (!this.phone) {
        Toast('请输入您的手机号码')
      } else if (!this.address) {
        Toast('请输入您的联系地址')
      } else {
        Toast('信息提交成功')
        this.saved = true
      }
    },
    Draw() {
      this.list = [{}]
      this.ralert = 'lucky'
    }
  },
  created() {
    ['cat', 'cat_jump', 'km', 'cloud', 'g1', 'g2', 'g3', 'g4', 'g5'].forEach(i => {
      this[`img_${i}`] = new Image
      this[`img_${i}`].onload = () => ++this.load
      this[`img_${i}`].onerror = () => this.error = `资源加载失败：${i}`
      this[`img_${i}`].src = `${PATH}game/${i}.png`
    })

    LOAD.forEach(i => {
      let img = new Image
      img.onload = () => ++this.load
      img.onerror = () => this.error = `资源加载失败：${i}`
      img.src = `${PATH}${i}.png`
    })

    this.InitBgm('music/bgm.mp3')

    this.music_j = new Audio
    this.music_j.preload = true
    this.music_j.src = 'music/jump.mp3'

    this.first = true

    this.rule = '示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则'
  },
  mounted() {
    this.page = 'loading'

    KWhale.Loading.Init({
      id: 'loading',
      width: 5,
      color: '#fff',
      logo: `${PATH}logo.png`
    })

    this.canvas = $id('game')
    this.canvas.width = iw
    this.canvas.height = ih
    this.ctx = this.canvas.getContext('2d')
    this.ctx.textAlign = 'right'
    this.ctx.fillStyle = '#552435'
    this.ctx.font = `italic ${20 * iw / 720}px sans-serif`
    this.km_width = this.ctx.measureText('KM').width
  }
})
