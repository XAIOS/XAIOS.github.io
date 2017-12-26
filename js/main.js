_menuOn = false

function _menuShow() {
  $('nav a').addClass('menu-active')
  $('.menu-bg').show()
  $('.menu-item').css({
    opacity: 0
  })
  TweenLite.to('.menu-container', 1, {
    padding: '0 40px'
  })
  TweenLite.to('.menu-bg', 1, {
    opacity: '.92'
  })
  TweenMax.staggerTo('.menu-item', .5, {
    opacity: 1
  }, .3)
  _menuOn = true

  $('.menu-bg').hover(function() {
    $('nav a').toggleClass('menu-close-hover')
  })
}

function _menuHide() {
  $('nav a').removeClass('menu-active');
  TweenLite.to('.menu-bg', .5, {
    opacity: 0,
    onComplete: function() {
      $('.menu-bg').hide()
    }
  })
  TweenLite.to('.menu-container', .5, {
    padding: '0 100px'
  })
  $('.menu-item').css({
    opacity: 0
  })
  _menuOn = false
}

$('nav a').click(function() {
  _menuOn ? _menuHide() : _menuShow()
})

$('.menu-bg').click(function(e) {
  if (_menuOn && e.target === this)
    _menuHide()
})

$('.archive-post').css({
  opacity: 0
})

TweenMax.staggerTo('.archive-post', .4, {
  opacity: 1
}, .15)

$('.menu-bg').on('touchmove', function(e) {
  e.preventDefault()
})
