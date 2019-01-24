PRE = 23
PATH = 'img/'
LOAD = ['bg', 'game/base', 'game/core', 'game/core_blink', 'game/start', 'index/award', 'index/blink', 'index/light', 'index/sl_0', 'index/sl_1', 'index/start', 'index/title', 'law', 'pop/bg_law', 'pop/bg_msg', 'pop/close', 'pop/rule', 'pop/rule_close', 'rotate', 'rule']
GAME = ['green', 'orange', 'yellow']

step = [0, 1, 2, 3, 4, 9, 14, 19, 24, 23, 22, 21, 20, 15, 10, 5, 6, 7, 8, 13, 18, 17, 16, 11, 12]
position = [{
  x: 396,
  y: 393,
  w: 130,
  h: 129
}, {
  x: 792,
  y: 131,
  w: 130,
  h: 129
}, {
  x: 792,
  y: 0,
  w: 130,
  h: 129
}, {
  x: 660,
  y: 0,
  w: 130,
  h: 129
}, {
  x: 528,
  y: 0,
  w: 130,
  h: 129
}, {
  x: 396,
  y: 0,
  w: 130,
  h: 129
}, {
  x: 264,
  y: 0,
  w: 130,
  h: 129
}, {
  x: 132,
  y: 0,
  w: 130,
  h: 129
}, {
  x: 0,
  y: 0,
  w: 130,
  h: 129
}, {
  x: 264,
  y: 393,
  w: 130,
  h: 129
}, {
  x: 132,
  y: 393,
  w: 130,
  h: 129
}, {
  x: 0,
  y: 393,
  w: 130,
  h: 129
}, {
  x: 792,
  y: 262,
  w: 130,
  h: 129
}, {
  x: 660,
  y: 262,
  w: 130,
  h: 129
}, {
  x: 528,
  y: 262,
  w: 130,
  h: 129
}, {
  x: 396,
  y: 262,
  w: 130,
  h: 129
}, {
  x: 264,
  y: 262,
  w: 130,
  h: 129
}, {
  x: 132,
  y: 262,
  w: 130,
  h: 129
}, {
  x: 0,
  y: 262,
  w: 130,
  h: 129
}, {
  x: 660,
  y: 131,
  w: 130,
  h: 129
}, {
  x: 528,
  y: 131,
  w: 130,
  h: 129
}, {
  x: 396,
  y: 131,
  w: 130,
  h: 129
}, {
  x: 264,
  y: 131,
  w: 130,
  h: 129
}, {
  x: 132,
  y: 131,
  w: 130,
  h: 129
}, {
  x: 0,
  y: 131,
  w: 130,
  h: 129
}]

cells = []

res = Array.from({
  length: 25
}, (i, index) => index);

(function() {
  var i, temp
  var length = res.length
  while (length) {
    i = Math.floor(Math.random() * (length--))
    res[length] = [res[i], res[i] = res[length]][0]
  }
})()

function Cell(index, type) {
  this.img = app[`img_${type}`]

  this.Move = index => {
    this.i = index
    this.p = position[index]
    this.x = Math.ceil(index % 5 * app.c_w)
    this.y = Math.floor(index / 5) * app.c_h
  }

  this.Move(index)

  this.Draw = () => app.ctx.drawImage(this.img, this.p.x, this.p.y, this.p.w, this.p.h, this.x, this.y, app.c_w, app.c_h)
}

new App({
  data: {
    rule: '',
    error: ''
  },
  watch: {
    load(val) {
      val == PRE && this.Init()
    }
  },
  computed: {
    progress() {
      return this.load / PRE * 100 + '%'
    }
  },
  methods: {
    Init() {
      setTimeout(() => {
        this.page = 'index'
        setTimeout(() => {
          this.cando = true
          this.alert = '欢迎浏览本示例'
        }, 4000)
      }, new Date - this.load_time > 2000 ? 0 : 2000)
    },
    Rule() {
      if (this.cando)
        this.ralert = 'rule'
    },
    Law() {
      if (this.cando)
        this.ralert = 'law'
    },
    ToGame() {
      if (!this.cando) return
      this.page = 'game'

      var canvas = $id('game')
      var style = getComputedStyle(document.getElementsByClassName('game_box')[0])
      this.cw = canvas.width = parseInt(style.width) * devicePixelRatio
      this.c_w = this.cw / 655 * 131
      this.ch = canvas.height = parseInt(style.height) * devicePixelRatio
      this.c_h = this.ch / 633 * 127
      this.ctx = canvas.getContext('2d')
    },
    Start() {
      if (res[0] === undefined) {
        this.alert = '演示已结束'
        return
      }
      if (this.running) return
      this.running = true

      var round = 0
      var index = 1
      var slow, draw, map

      this.cell = new Cell(0, 'orange')

      var Time = time => {
        var new_time = round > 1 ? time + 20 : time
        index = ++index % 25

        this.cell.Move(step[index])

        index || ++round

        if (new_time > 100 && step[index] == res[0])
          setTimeout(() => {
            cancelAnimationFrame(this.timer)
            cells.push(new Cell(res[0], 'yellow'))
            this.FormatCell()
            res.shift()
          }, 300)
        else
          setTimeout(() => Time(new_time), new_time)
      }

      Time(50)

      this.Run()
    },
    Run() {
      this.ctx.clearRect(0, 0, this.cw, this.ch)
      cells.forEach(i => i.Draw())
      this.cell.Draw()
      this.timer = requestAnimationFrame(this.Run)
    },
    FormatCell() {
      var list = cells.map(i => i.i)
      var lines = list.includes(12) ? [list.includes(0) && list.includes(6) && list.includes(18) && list.includes(24), list.includes(2) && list.includes(7) && list.includes(17) && list.includes(22), list.includes(4) && list.includes(8) && list.includes(16) && list.includes(20), list.includes(10) && list.includes(11) && list.includes(13) && list.includes(14)] : ''

      this.ctx.clearRect(0, 0, this.cw, this.ch)
      cells.forEach(i => {
        if (lines && (i.i == 12 || ((i.i == 0 || i.i == 6 || i.i == 18 || i.i == 24) && lines[0]) || ((i.i == 2 || i.i == 7 || i.i == 17 || i.i == 22) && lines[1]) || ((i.i == 4 || i.i == 8 || i.i == 16 || i.i == 20) && lines[2]) || ((i.i == 10 || i.i == 11 || i.i == 13 || i.i == 14) && lines[3])))
          i.img = this.img_green
        i.Draw()
      })
      this.running = false
    }
  },
  created() {
    LOAD.forEach(i => {
      var img = new Image
      img.onload = () => ++this.load
      img.onerror = () => this.error = `資源加載失敗：${i}`
      img.src = `${PATH}${i}.png`
    })

    GAME.forEach(i => {
      this[`img_${i}`] = new Image
      this[`img_${i}`].onload = () => ++this.load
      this[`img_${i}`].onerror = () => this.error = `資源加載失敗：game/${i}`
      this[`img_${i}`].src = `${PATH}game/${i}.png`
    })

    this.rule = '示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则'
  },
  mounted() {
    this.load_time = new Date
    this.page = 'loading'
  }
})
