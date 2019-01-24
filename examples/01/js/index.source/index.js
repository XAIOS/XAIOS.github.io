iw = innerWidth
ih = innerHeight
sw = iw / 720
sh = ih / 1135

PRE = 31
PATH = 'img/'
LOAD = ['pop/bg_msg', 'pop/bg_rule', 'pop/bg_score', 'pop/btn_again', 'pop/btn_index', 'pop/close', 'pop/score_hand', 'pop/score_light', 'pop/score_plus', 'pop/score_title', 'pop/tips_0', 'pop/tips_1', 'pop/tips_2', 'btn_rule', 'btn_start', 'floor', 'game/stars', 'logo', 'moon', 'music_0', 'music_1', 'score', 'shadow', 'table', 'timer', 'title']

const {
  Body,
  World,
  Bodies
} = Matter

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

foods = []
clouds = []
s_line = Suit(20, 190)
s_food = Suit(227, 160)
s_food_core = Suit(200, 110)
s_rabbit_0 = Suit(134, 151)
s_rabbit_1 = Suit(60, 60)
s_cloud = Suit(186, 112)

new App({
  data: {
    error: '',
    rule: '',
    score: 0,
    score_top: ih * .6 + sw * 250,
    stage_top: ih * .4,
    score_high: 0,
    time_sec: '00'
  },
  watch: {
    load(val) {
      val == PRE && this.Init()
    }
  },
  computed: {
    progress() {
      return (this.load / PRE * 100).toFixed(2)
    }
  },
  methods: {
    Init() {
      setTimeout(() => {
        this.page = 'index'
        setTimeout(() => {
          this.alert = '歡迎瀏覽本示例'
          this.cando = true
        }, 4200)
      }, new Date - this.load_time > 2000 ? 0 : 2000)
    },
    Rule() {
      if (this.cando)
        this.ralert = 'rule'
    },
    ToStart() {
      if (!this.cando) return
      this.page = 'game'
      if (this.first) {
        this.ralert = 'tips'
      } else if (this.engine) {
        this.PlayAgain()
      } else {
        this.Start()
        this.Timer()
      }
    },
    Timer() {
      this.time_sec = 60
      this.timer = setInterval(() => {
        this.time_sec = this.time_sec > 10 ? this.time_sec - 1 : FormatNum(this.time_sec - 1)
        this.time_sec == '00' && this.GameOver()
      }, 1000)
    },
    ToIndex() {
      this.RalertClose()
      this.page = 'index'
    },
    Start() {
      this.engine = Matter.Engine.create()
      this.render = Matter.Render.create({
        engine: this.engine,
        element: document.querySelector('.page_game'),
        options: {
          width: iw,
          height: ih,
          pixelRatio: devicePixelRatio,
          wireframes: false
        }
      })

      this.engine.timing.timeScale = 1.1

      this.rabbit_0 = Bodies.rectangle(iw / 2, s_line.h * 1.1, s_rabbit_0.w, s_rabbit_0.h, {
        isStatic: true,
        render: {
          sprite: {
            xScale: s_rabbit_0.w / this.img_rabbit_0.width,
            yScale: s_rabbit_0.h / this.img_rabbit_0.height,
            texture: `${PATH}game/rabbit_0.png`
          }
        }
      })
      this.rabbit_1 = Bodies.rectangle(iw / 2, s_line.h * 1.1, s_rabbit_1.w, s_rabbit_1.h, {
        isStatic: true,
        render: {
          sprite: {
            xScale: s_rabbit_1.w / this.img_rabbit_1.width,
            yScale: s_rabbit_1.h / this.img_rabbit_1.height,
            texture: `${PATH}game/rabbit_1.png`
          }
        }
      })

      this.line = Bodies.rectangle(iw / 2, s_line.h * .42, s_line.w, s_line.h, {
        isStatic: true,
        render: {
          sprite: {
            xScale: s_line.w / this.img_line.width,
            yScale: s_line.h,
            texture: `${PATH}game/line.png`
          }
        }
      })
      this.ground = Bodies.rectangle(iw / 2, ih * .63 + sw * 250, iw * .75, 40 * sh, {
        friction: 2,
        frictionStatic: 2,
        isStatic: true,
        render: {
          visible: false
        }
      })

      World.add(this.engine.world, [this.rabbit_1, this.line, this.rabbit_0, this.ground])
      this.base = [this.rabbit_1, this.line, this.rabbit_0, this.ground]

      Matter.Engine.run(this.engine)
      Matter.Render.run(this.render)

      Matter.Events.on(this.engine, 'afterUpdate', () => {
        if (foods.length > 1 && this.droping_food.position.y > this.deadline)
          this.GameOver()

        var flag
        clouds.forEach((i, index) => {
          Body.setPosition(i, Matter.Vector.create(i.position.x + sw, i.position.y))
          if (i.position.x > iw + s_cloud.w || i.position.y > ih + s_cloud.h) {
            flag = true
            World.remove(this.engine.world, i)
            clouds.splice(index, 1)
            if (i.position.y < ih + s_cloud.h)
              this.NewCloud(i.position.y)
          }
        })
        clouds = clouds.filter(i => i.position.x < iw + s_cloud.w || i.position.y < ih + s_cloud.h)
      })

      this.ShakeLine()
      this.Cloud()
      this.NewFood()

      this.render.canvas.style.cssText += 'background:transparent;'
      this.render.canvas.addEventListener('click', () => this.DropFood())
    },
    Reset() {
      $id('food_shadow').style.opacity = 0
      foods.forEach(i => World.remove(this.engine.world, i))
      clouds.forEach(i => World.remove(this.engine.world, i))
      Body.setPosition(this.ground, Matter.Vector.create(iw / 2, ih * .63 + sw * 250))

      foods = []
      clouds = []
      this.score = 0
      this.stage_top = ih * .4
      this.score_top = ih * .6 + sw * 250
      this.deadline = ih

      this.die = false
    },
    PlayAgain() {
      if (!this.die) return
      this.RalertClose()
      this.Reset()
      this.Cloud()
      this.Timer()
      this.NewFood()
      Matter.Render.run(this.render)
    },
    GameOver() {
      if (this.die) return
      this.die = true
      clearInterval(this.timer)

      setTimeout(() => {
        Matter.Render.stop(this.render)
        this.score_high = this.score > this.score_high ? this.score : this.score_high
        this.ralert = 'score'
      }, 2000)
    },
    Cloud() {
      this.NewCloud(ih * .2)
      setTimeout(() => this.NewCloud(ih * .4), 1000)
    },
    NewCloud(y) {
      var cloud = Bodies.rectangle(-s_cloud.w / 2, y || this.food.position.y, s_cloud.w, s_cloud.h, {
        isStatic: true,
        collisionFilter: {
          category: 0
        },
        render: {
          sprite: {
            xScale: s_cloud.w / this.img_cloud.width,
            yScale: s_cloud.h / this.img_cloud.height,
            texture: `${PATH}game/cloud.png`
          }
        }
      })

      clouds.push(cloud)

      this.engine.world.bodies = clouds.concat(foods).concat(this.base)
      Matter.Composite.setModified(this.engine.world, true, true, false)
    },
    TipsEnd() {
      if (!this.first) return
      this.first = false
      this.RalertClose()
      this.Start()
      this.Timer()
    },
    ShakeLine() {
      var deg = 40
      var time = 1000
      var mode = To.easing.quadInOut
      var vector = Matter.Vector.create(iw / 2, 0)
      Body.rotate(this.line, Math.PI / 180 * deg, vector)

      var angle = {
        deg
      }

      var angle_bak = deg

      var Progress = () => {
        Body.rotate(this.line, Math.PI / 180 * (angle.deg - angle_bak), vector)

        var x = (this.line.vertices[2].x + this.line.vertices[3].x) / 2
        var y = (this.line.vertices[2].y + this.line.vertices[3].y) / 2

        Body.setPosition(this.rabbit_0, Matter.Vector.create(x, y + s_rabbit_0.h * .1))
        Body.setPosition(this.rabbit_1, Matter.Vector.create(x, y + s_rabbit_1.h * .1))

        if (this.food)
          Body.setPosition(this.food, Matter.Vector.create(x, y + s_food.h * .36))

        angle_bak = angle.deg
      }

      (function todo() {
        To.get(angle).to({
          deg: -deg
        }, time, mode).progress(Progress).end(() => {
          To.get(angle).to({
            deg
          }, time, mode).progress(Progress).end(todo).start()
        }).start()
      })()
    },
    NewFood() {
      var x = (this.line.vertices[2].x + this.line.vertices[3].x) / 2
      var y = (this.line.vertices[2].y + this.line.vertices[3].y) / 2 + s_food.h * .36

      this.food = Bodies.rectangle(x, y, s_food_core.w, s_food_core.h, {
        density: 0.1,
        friction: 2,
        frictionStatic: 2,
        isStatic: true,
        render: {
          sprite: {
            xScale: s_food.w / this.img_food.width,
            yScale: s_food.h / this.img_food.height,
            texture: `${PATH}game/food.png`
          }
        }
      })

      foods.push(this.food)

      this.engine.world.bodies = clouds.concat(foods).concat(this.base)
      Matter.Composite.setModified(this.engine.world, true, true, false)
      if (!(foods.length % 3))
        this.NewCloud()
    },
    DropFood() {
      if (!this.food || this.die) return
      var food = this.droping_food = this.food
      this.food = null

      if (foods.length > 1)
        this.deadline = foods[foods.length - 2].position.y - s_food_core.h / 2

      setTimeout(() => {
        if (this.die) return
        this.score_top = food.position.y - s_food.h * .4
        if (foods.length == 1) {
          var x = food.position.x
          var y = food.position.y - ih * .4 + s_food.h * .46

          $id('food_shadow').style.cssText += `top:${y}px;left:${x}px;opacity:1;`
        }
        if (food.position.y - s_food_core.h / 2 < ih / 2) {
          this.MoveStage(() => {
            this.score += 1
            this.NewFood()
          })
        } else {
          this.score += 1
          this.NewFood()
        }
      }, 1000)

      this.musicing && this.music_drop.play()
      Body.setStatic(food, false)
    },
    MoveStage(cb) {
      var move = {
        h: ih / 3
      }

      var move_bak = ih / 3
      this.deadline += ih / 3

      foods.forEach(i => Body.setStatic(i, true))

      To.get(move).to({
        h: 0
      }, 800, To.easing.quadOut).progress(() => {
        var h = move_bak - move.h

        if (this.stage_top < ih * 1.2)
          this.stage_top += h

        this.score_top += h

        Body.setPosition(this.ground, Matter.Vector.create(iw / 2, this.ground.position.y + h))
        foods.forEach(i => Body.setPosition(i, Matter.Vector.create(i.position.x, i.position.y + h)))
        clouds.forEach(i => Body.setPosition(i, Matter.Vector.create(i.position.x, i.position.y + h)))
        move_bak = move.h
      }).end(() => {
        foods.forEach(i => Body.setStatic(i, false))
        cb()
      }).start()
    }
  },
  created() {
    ['cloud', 'food', 'line', 'rabbit_0', 'rabbit_1'].forEach(i => {
      this[`img_${i}`] = new Image
      this[`img_${i}`].onload = () => ++this.load
      this[`img_${i}`].onerror = () => this.error = `资源加载失败：${i}`
      this[`img_${i}`].src = `${PATH}game/${i}.png`
    })

    LOAD.forEach(i => {
      var img = new Image
      img.onload = () => ++this.load
      img.onerror = () => this.error = `资源加载失败：${i}`
      img.src = `${PATH}${i}.png`
    })

    this.InitBgm('music/bgm.mp3')
    this.bgm_music.volume = .8

    this.music_drop = new Audio
    this.music_drop.preload = true
    this.music_drop.src = 'music/drop.mp3'

    this.first = true

    this.rule = '示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则'
  },
  mounted() {
    this.load_time = new Date
    this.page = 'loading'
  }
})
