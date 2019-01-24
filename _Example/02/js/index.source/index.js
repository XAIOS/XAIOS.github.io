PRE = 38
PATH = 'img/'
LOAD = ['pop/bg_coin', 'pop/bg_lucky', 'pop/bg_msg', 'pop/bg_rule', 'pop/btn_close', 'pop/gift_1', 'pop/gift_2', 'pop/light', 'pop/title_get', 'btn_add', 'btn_dot_box', 'btn_music_0', 'btn_music_1', 'btn_rule', 'dot/1', 'dot/2', 'dot/3', 'dot/4', 'dot/5', 'dot/6', 'loading/bg', 'loading/light', 'loading/loading', 'loading/word', 'map/map_0', 'map/map_1', 'map/map_2', 'map/map_3', 'map/sun', 'people/00', 'people/01', 'people/10', 'people/11', 'people/20', 'people/21', 'people/30', 'people/31', 'award']

map_size = {}
map_change = [10, 22, 33, 44]
map = map.map(m => {
  return m.map(l => {
    return l.map(n => {
      n.style = n.style || {}
      if (map_size[n.suit]) {
        n.style.width = map_size[n.suit].w
        n.style.height = map_size[n.suit].h
      } else {
        var [w, h] = n.suit.split(',')
        var s = w / h

        w /= 720
        h = h / 1135 * innerHeight

        w = h * s > innerWidth * w ? innerWidth * w : h * s
        h = w / s

        n.style.width = Math.ceil(w) + 'px'
        n.style.height = Math.ceil(h) + 'px'

        map_size[n.suit] = {
          w: n.style.width,
          h: n.style.height
        }
      }

      return n
    })
  })
})

new App({
  data: {
    map_0: map[0],
    map_1: map[1],
    map_2: map[2],
    map_3: map[3],
    dot: 6,
    area: 4,
    life: 0,
    rule: '',
    index: '',
    people: '',
    people_transition: '',
    get_coin: '',
    lucky_img: '',
    lucky_name: '',
    people_img: 0,
    people_face: 0,
    error: '',
    record: '',
    award: '',
    dot_shake: '',
    gift_open: '',
    desc_luck: ''
  },
  computed: {
    progress() {
      return (this.load / PRE * 100).toFixed(0)
    }
  },
  watch: {
    load(val) {
      val == PRE && this.Init()
    },
    index(val) {
      var i = step[val]
      i = map[i[0]][i[1]][i[2]]
      var item = this.$refs[`map_${this.area}`][i.index]
      var top = (this.area == 1 || this.area == 2) ? this.c_t + item.offsetTop : innerHeight + item.offsetTop
      var left = (this.area == 2 || this.area == 3) ? innerWidth + item.offsetLeft : this.c_l + item.offsetLeft

      this.people = `translate(${left + item.offsetWidth / 2 - this.p_w}px,${top + item.offsetHeight / 2 - this.p_h}px)`
      this.people_face = i.face
    }
  },
  methods: {
    Init() {
      setTimeout(() => {
        this.page = 'game'
        this.$nextTick(() => {
          this.c_t = $id('cell_box').offsetTop
          this.c_l = $id('cell_box').offsetLeft
          this.p_w = $id('cell_people').offsetWidth / 2
          this.p_h = $id('cell_people').offsetHeight / 2

          setTimeout(() => {
            this.area = 0
            setTimeout(() => {
              var i = step[0]
              i = map[i[0]][i[1]][i[2]]
              var item = this.$refs[`map_${this.area}`][i.index]
              var top = (this.area == 1 || this.area == 2) ? this.c_t + item.offsetTop : innerHeight + item.offsetTop
              var left = (this.area == 2 || this.area == 3) ? innerWidth + item.offsetLeft : this.c_l + item.offsetLeft

              this.people = `translate(${left + item.offsetWidth / 2 - this.p_w}px,-${this.p_h}px)`
              this.people_face = i.face

              $id('cell_people').style.opacity = 1
              setTimeout(() => {
                this.people_transition = 'transform 1.2s linear'
                this.index = 0
              })

              setTimeout(() => {
                this.alert = '歡迎瀏覽本示例'
                this.looping = false
                this.people_transition = 'transform .3s linear'
              }, 1500)
            }, 600)
          }, 1400)
        })
      }, new Date - this.load_time > 2000 ? 0 : 2000)
    },
    Rule() {
      if (!this.looping)
        this.ralert = 'rule'
    },
    Start() {
      if (this.looping) return
      if (!this.life) {
        this.AddLife()
        return
      }
      this.m_loop.play()
      this.looping = true
      this.dot_shake = true
      this.loop = setInterval(() => this.dot = Math.ceil(Math.random() * 6), 200)
      this.life -= 1

      setTimeout(() => {
        clearInterval(this.loop)
        this.dot_shake = false
        this.dot = Math.ceil(Math.random() * 6)
        this.m_loop.pause()
        this.Go(this.dot)
        this.people_loop = setInterval(() => this.people_img = +!this.people_img, 300)
      }, 2000)
    },
    AddLife() {
      if (!this.looping) {
        this.life += 100
        this.alert = '遊戲機會添加成功'
      }
    },
    Cell(item) {
      if (item.type && !this.looping) {
        this.ralert = 'desc'
        this.desc_luck = item.type == 2
      }
    },
    Go(num) {
      if (map_change.includes(this.index)) {
        setTimeout(() => {
          this.area = this.area == 3 ? 0 : this.area + 1
          setTimeout(() => this.Step(--num), 1100)
        }, 500)
      } else {
        this.people_opacity = 1
        setTimeout(() => this.Step(--num), 500)
      }
    },
    Step(num) {
      this.index = this.index == step.length - 1 ? 0 : this.index + 1
      num ? this.Go(num) : this.Stop()
    },
    Stop() {
      setTimeout(() => {
        clearInterval(this.people_loop)

        var cell = step[this.index]
        cell = map[cell[0]][cell[1]][cell[2]]

        if (cell.type == 1) {
          this.get_coin = Math.ceil(Math.random() * 100)
          this.ralert = 'get_coin'
        } else if (cell.type == 2) {
          this.ralert = 'gift_light'
          setTimeout(() => {
            this.gift_open = true
            setTimeout(() => {
              this.m_box.pause()
              this.ralert = 'lucky'
            }, 3000)
          }, 2000)
        }

        this.looping = false
      }, 500)
    }
  },
  created() {
    LOAD.forEach(i => {
      var img = new Image
      img.onload = () => ++this.load
      img.onerror = () => this.error = `資源加載失敗：${i}`
      img.src = `${PATH}${i}.png`
    })

    this.InitBgm('music/bgm.mp3')

    var Music = (name, src) => {
      this[name] = new Audio
      this[name].loop = true
      this[name].preload = true
      this[name].addEventListener('play', () => this.bgm_music.volume = .5)
      this[name].addEventListener('pause', () => this.bgm_music.volume = 1)
      this[name].src = `music/${src}.mp3`
    }

    Music('m_box', 'm_box')
    Music('m_loop', 'm_loop')

    this.life = 100
    this.looping = true

    this.rule = '示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则示例用游戏规则'
  },
  mounted() {
    this.load_time = new Date
    this.page = 'loading'
  }
})
