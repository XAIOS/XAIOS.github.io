iw = innerWidth * devicePixelRatio
ih = innerHeight * devicePixelRatio

PRE = 46

PATH = 'img/'
LOAD = ['pop/bg_draw', 'pop/bg_long', 'pop/bg_lucky', 'pop/bg_msg', 'pop/btn_close', 'pop/btn_info', 'pop/btn_submit', 'pop/cloud_0', 'pop/cloud_1', 'pop/draw', 'pop/tips', 'pop/title_mine', 'pop/title_msg', 'pop/title_rule', 'pop/title_will', 'pop/will', 'award', 'btn_into', 'btn_into_word', 'index/bg', 'index/bg_circle', 'index/btn_mine', 'index/btn_rule', 'index/btn_start', 'index/btn_will', 'index/cloud', 'index/man', 'index/title', 'index/tree_0', 'index/tree_1', 'index/vip', 'music_0', 'music_1']
LOAD_GAME = ['gold', 'cloud_0', 'cloud_1', 'kill', 'p_0', 'p_1', 'p_3', 'p_j', 'p_d', 'line_0', 'line_1', 'line_2', 'line_3']

function Suit(w, h, e) {
  var s = w / h
  w /= 720
  h = h / 1135 * ih

  w = h * s > iw * w ? iw * w : h * s
  h = w / s

  e.w = Math.ceil(w)
  e.h = Math.ceil(h)
}

function Gold(cloud, owner) {
  cloud.gold = this
  Suit(89, 79, this)

  var area = Math.floor(Math.random() * 2)
  if (cloud[`child_${area}`].w < this.w)
    area = +!area

  this.x = Math.floor(Math.random() * (cloud[`child_${area}`].w - this.w)) + cloud[`child_${area}`].x
  this.y = cloud.y - this.h * .8
  this.area = area

  this.Draw = () => !this.geted && owner.ctx.drawImage(owner.img_gold, this.x, this.y, this.w, this.h)
}

function Kill(cloud, owner) {
  Suit(56, 87, this)

  if (cloud.gold) {
    var g = cloud.gold
    var child = cloud[`child_${g.area}`]

    var childs = [{
      x: child.x,
      w: g.x - child.x - this.w - g.w / 2
    }, {
      x: g.x + g.w * 1.5,
      w: child.x + child.w - g.x - g.w * 1.5
    }, cloud[`child_${+!g.area}`]]

    var area = Math.floor(Math.random() * 3)

    while (childs[area].w < this.w)
      area = ['', 1, 2, 0][area + 1]

    this.x = Math.floor(Math.random() * (childs[area].w - this.w)) + childs[area].x
  } else {
    var area = Math.floor(Math.random() * 2)
    if (cloud[`child_${area}`].w < this.w)
      area = +!area

    this.x = Math.floor(Math.random() * (cloud[`child_${area}`].w - this.w)) + cloud[`child_${area}`].x
  }

  this.y = cloud.y - this.h * .8

  this.Draw = () => owner.ctx.drawImage(owner.img_kill, this.x, this.y, this.w, this.h)
}

function Cloud(owner) {
  this.y = (clouds.length == cloud_max ? ih - clouds_b : clouds_b * clouds.length) + clouds_b * 2
  this.random = Math.floor(Math.random() * (iw - cloud_b))

  this.child_0 = {
    x: 0,
    w: this.random
  }
  this.child_1 = {
    x: this.random + cloud_b,
    w: iw - this.random - cloud_b
  }

  cloud_num++
  Math.random() > .6 && golds.push(new Gold(this, owner))
  Math.random() > (4 / cloud_num) && kills.push(new Kill(this, owner))

  this.Draw = () => {
    var max_0 = this.child_0.w
    for (var i = 0; max_0 > 0; i++) {
      owner.ctx.drawImage(owner.img_cloud_0, max_0 - cloud_size.w, this.y - cloud_y, cloud_size.w, cloud_size.h)
      max_0 -= cloud_size.w / 2
    }

    var max_1 = this.child_1.x
    for (var i = 0; max_1 < iw; i++) {
      owner.ctx.drawImage(owner.img_cloud_1, max_1, this.y - cloud_y, cloud_size.w, cloud_size.h)
      max_1 += cloud_size.w / 2
    }
  }
}

function Player(owner) {
  this.img_data = {
    '0': {},
    '1': {},
    '3': {},
    'j': {},
    'd': {}
  }

  Suit(65, 155, this.img_data['0'])
  Suit(102, 155, this.img_data['1'])
  Suit(98, 155, this.img_data['3'])
  Suit(152, 109, this.img_data.j)
  Suit(187, 157, this.img_data.d)

  this.img_data['2'] = this.img_data['0']

  this.Jump = () => {
    if (Math.floor(this.vy) != Math.floor(-fall_v)) return
    this.jumping = true
    this.jumping_max = false
    owner.bgm && owner.music_j.play()
    this.vy = -fall_v
    jump_v = jump_max
  }

  this.Choose = type => {
    if (this.die && type != 'd') return
    this.w = this.img_data[type].w
    this.h = this.img_data[type].h
    this.img = owner[`img_p_${type}`]
    if (this.type == 'j' && type != 'j' && type != 'd' && this.vy == -fall_v)
      this.y -= this.img_data['0'].h - this.img_data.j.h
    this.type = type
  }

  var run_time = 80
  var run_timer
  var run_start

  this.Run = () => this.type != 'd' && this.Choose(this.type == 'j' || this.type == 3 ? 0 : ++this.type)

  this.ToRun = () => {
    var now = Date.now()
    if (!run_start)
      run_start = now

    if (now - run_start >= run_time) {
      this.Run()
      run_start = now
    } else {
      clearTimeout(run_timer)
      run_timer = setTimeout(this.Run, run_time)
    }
  }

  this.Choose(3)

  this.x = this.w / 2
  this.y = 100 / 1135 * ih
  this.vx = 0
  this.vy = player_v

  this.Draw = () => {
    if (this.to_l) {
      owner.ctx.translate(iw, 0)
      owner.ctx.scale(-1, 1)
    }

    owner.ctx.drawImage(this.img, (this.to_l ? iw - this.x : this.x) - this.w / 2, this.y += this.vy, this.w, this.h)

    if (this.to_l) {
      owner.ctx.translate(iw, 0)
      owner.ctx.scale(-1, 1)
    }
  }
}

function Line(owner) {
  var line_size = {}
  var node_size = {}
  Suit(10, 20, node_size)
  Suit(68, 56, line_size)

  var offset = 20 / 1135 * ih

  var lines = []
  var line_num = (iw - node_size.w * 2 + line_size.w / 5) / (line_size.w * .8)
  for (var i = 0; i < line_num; i++)
    lines.push(i % 3 + 1)

  var node_1_y = ih - offset - node_size.h
  var line_1_y = ih - offset / 2 - line_size.h
  var line_0_y = offset / 2

  this.deadline_0 = line_0_y + line_size.h / 2
  this.deadline_1 = line_1_y + line_size.h / 2

  var change_time = 120
  var change_timer
  var change_start

  this.Change = () => lines.push(lines.shift())

  this.ToChange = () => {
    var now = Date.now()
    if (!change_start)
      change_start = now

    if (now - change_start >= change_time) {
      this.Change()
      change_start = now
    } else {
      clearTimeout(change_timer)
      change_timer = setTimeout(this.Change, change_time)
    }
  }

  this.Draw = () => {
    owner.ctx.drawImage(owner.img_line_0, 0, node_1_y, node_size.w, node_size.h)
    owner.ctx.translate(iw, 0)
    owner.ctx.scale(-1, 1)
    owner.ctx.drawImage(owner.img_line_0, 0, offset, node_size.w, node_size.h)
    owner.ctx.drawImage(owner.img_line_0, 0, node_1_y, node_size.w, node_size.h)
    owner.ctx.translate(iw, 0)
    owner.ctx.scale(-1, 1)

    lines.forEach((n, i) => owner.ctx.drawImage(owner[`img_line_${n}`], node_size.w - line_size.w / 10 + i * line_size.w * .8, line_0_y, line_size.w, line_size.h))
    lines.forEach((n, i) => owner.ctx.drawImage(owner[`img_line_${n}`], node_size.w - line_size.w / 10 + i * line_size.w * .8, line_1_y, line_size.w, line_size.h))
    this.ToChange()
  }
}

cloud_size = {}
Suit(156, 80, cloud_size)

cloud_max = 4
cloud_b = 140 / 720 * iw
cloud_y = 20 / 1135 * ih
clouds_b = (ih + cloud_size.h) / (cloud_max - 1)
cloud_err = 20 / 1135 * ih

fall_v_source = 2.4 / 1135 * ih
player_v = 6.2 / 1135 * ih
player_vx = 12 / 720 * iw
jump_max = 1.5 / 1135 * ih
jump_v_up = .08 / 1135 * ih
jump_v_down = .13 / 1135 * ih

new App({
  data: {
    error: '',
    rule: '',
    awards: '',
    name: '',
    phone: '',
    address: '',
    saved: '',
    score: 0
  },
  watch: {
    load(val) {
      val == PRE && this.Init()
    }
  },
  methods: {
    Init() {
      KWhale.Loading.Stop(() => {
        this.page = 'index'
        setTimeout(() => {
          this.alert = '欢迎浏览本示例'
          this.cando = true
        }, 3600)
      })

      var canvas = $id('game')
      canvas.width = iw
      canvas.height = ih
      this.ctx = canvas.getContext('2d')

      this.img_p_2 = this.img_p_0

      this.p = new Player(this)
      $id('game').addEventListener('click', () => this.p.Jump())
      window.addEventListener('deviceorientation', e => {
        var deg = Math.abs(e.gamma) / 10
        this.p.vx = (deg > 6 ? 6 : deg) / 6 * player_vx

        if (e.gamma > 0) {
          this.p.to_r = true
          this.p.to_l = false
        } else {
          this.p.to_l = true
          this.p.to_r = false
        }
      })
    },
    Rule() {
      if (this.cando)
        this.ralert = 'rule'
    },
    Mine() {
      if (this.cando)
        this.ralert = 'mine'
    },
    ClickStart() {
      if (!this.cando) return
      if (this.first)
        this.ralert = 'tips'
      else
        this.StartGame()
    },
    StartGame() {
      if (this.going) return
      this.going = true
      this.Reset()
      this.page = 'game'
      this.Run()
    },
    HowClose() {
      this.first = false
      this.RalertClose()
      this.StartGame()
    },
    WillCome() {
      if (!this.cando) return
      this.ralert = 'will'
    },
    Into() {
      this.alert = '点击此处原为打开外部链接'
    },
    Submit() {
      if (!this.name) {
        Toast('请填写你的姓名')
      } else if (!this.phone) {
        Toast('请填写你的手机号码')
      } else if (!this.address) {
        Toast('请填写你的收货地址')
      } else {
        this.alert = '信息提交成功'
        this.saved = true
      }
    },
    ReStart() {
      this.RalertClose()
      this.StartGame()
    },
    Draw() {
      this.awards = [{}]
      this.ralert = 'lucky'
    },
    RalertClose() {
      if (this.ralert == 'lucky' && this.page == 'index')
        this.ralert = 'mine'
      else
        this.ralert = ''
    },
    AlertClose() {
      if (this.alert == '信息提交成功')
        this.RalertClose()
      if (this.page == 'game')
        this.page = 'index'

      this.alert = ''
    },
    Reset() {
      fall_v = 0
      this.score = 0
      golds = []
      kills = []
      clouds = []
      cloud_num = 0
      setTimeout(() => fall_v = fall_v_source, 1600)

      for (var i = 0; i < cloud_max; i++)
        clouds.push(new Cloud(this))

      this.p = new Player(this)
      this.line = new Line(this)
    },
    Run() {
      this.ctx.clearRect(0, 0, iw, ih)
      this.Calc()
      this.p.Draw()
      golds.forEach(i => i.Draw())
      kills.forEach(i => i.Draw())
      clouds.forEach(i => i.Draw())
      this.line.Draw()
      this.running = requestAnimationFrame(this.Run)
    },
    PointCalc(a, b, x) {
      return a < x && x < b
    },
    Calc() {
      var p = this.p
      var gold_del
      var kill_del
      var clouds_p_flag = 0

      fall_v = fall_v >= fall_v_source * 1.6 ? fall_v_source * 1.6 : fall_v_source * (1 + (cloud_num - cloud_max) * .06)

      clouds.forEach((n, i) => {
        n.y -= fall_v

        if (!p.jumping && (p.x - p.w / 2 == iw || p.x == -p.w / 2 || (
            this.PointCalc(n.y, n.y + cloud_err, p.y + p.h) &&
            (
              this.PointCalc(n.child_0.x, n.child_0.x + n.child_0.w - p.w / 2, p.x - p.w / 2) ||
              this.PointCalc(n.child_0.x + p.w / 2, n.child_0.x + n.child_0.w, p.x + p.w / 2) ||
              this.PointCalc(n.child_1.x, n.child_1.x + n.child_1.w - p.w / 2, p.x - p.w / 2) ||
              this.PointCalc(n.child_1.x + p.w / 2, n.child_1.x + n.child_1.w, p.x + p.w / 2) ||

              this.PointCalc(p.x - p.w / 2, p.x + p.w / 2, n.child_0.x) ||
              this.PointCalc(p.x - p.w / 2, p.x + p.w, n.child_0.x + n.child_0.w) ||
              this.PointCalc(p.x, p.x + p.w / 2, n.child_1.x) ||
              this.PointCalc(p.x - p.w / 2, p.x + p.w / 2, n.child_1.x + n.child_1.w)
            )
          )))
          p.vy = -fall_v
        else
          ++clouds_p_flag

        if (n.y < -cloud_size.h)
          clouds[i] = new Cloud(this)
      })

      if (clouds_p_flag == cloud_max && !p.jumping)
        p.vy = player_v

      if (p.vy != -fall_v)
        p.Choose(3)
      else
        p.ToRun()

      if (p.jumping) {
        p.Choose('j')
        if (p.jumping_max) {
          p.vy += jump_v += jump_v_up
          if (p.vy > player_v)
            p.jumping = false
        } else {
          p.vy -= jump_v -= jump_v_down
          if (jump_v < 0)
            p.jumping_max = true
        }
      }

      golds.forEach((n, i) => {
        n.y -= fall_v

        if (!n.geted && this.PointCalc(n.y, n.y + n.h, p.y + p.h * .9) && (
            this.PointCalc(n.x, n.x + n.w, p.x + p.w * .4) ||
            this.PointCalc(n.x, n.x + n.w, p.x - p.w * .4)
          )) {
          n.geted = true
          this.score++
        }

        if (n.geted || n.y < -n.h)
          gold_del = i
      })

      gold_del !== undefined && golds.splice(gold_del, 1)

      kills.forEach((n, i) => {
        n.y -= fall_v

        if (!this.p.die && this.PointCalc(n.y, n.y + n.h, p.y + p.h * .9) && (
            this.PointCalc(n.x, n.x + n.w, p.x + p.w * .4) ||
            this.PointCalc(n.x, n.x + n.w, p.x - p.w * .4)
          ))
          this.GameOver()

        if (n.y < -n.h)
          kill_del = i
      })

      kill_del !== undefined && kills.splice(kill_del, 1)

      if (p.y < this.line.deadline_0 || p.y + p.h > this.line.deadline_1)
        this.GameOver()

      if (p.to_l)
        p.x -= p.vx
      else
        p.x += p.vx

      if (p.vx > player_vx)
        p.vx = player_vx
      else if (p.vx < -player_vx)
        p.vx = -player_vx

      if (p.x - p.w / 2 > iw)
        p.x = -p.w / 2
      else if (p.x < -p.w / 2)
        p.x = iw + p.w / 2
    },
    GameOver() {
      if (this.p.die) return
      this.going = false
      this.p.die = true
      this.p.Choose('d')
      setTimeout(() => cancelAnimationFrame(this.running))

      if (this.awards.length)
        this.alert = '游戏结束'
      else
        this.ralert = 'draw'
    },
    Info() {
      this.ralert = 'lucky'
    }
  },
  created() {
    LOAD.forEach(i => {
      var img = new Image
      img.onload = () => ++this.load
      img.onerror = () => this.error = `资源加载失败：${i}`
      img.src = `${PATH}${i}.png`
    })

    LOAD_GAME.forEach(i => {
      this[`img_${i}`] = new Image
      this[`img_${i}`].onload = () => ++this.load
      this[`img_${i}`].onerror = () => this.error = `资源加载失败：${i}`
      this[`img_${i}`].src = `${PATH}game/${i}.png`
    })

    this.InitBgm('music/bgm.mp3')

    this.music_j = new Audio
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
  }
})
