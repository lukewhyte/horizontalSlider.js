(function($) {

  var pluginName = 'horizontalSlider',
      defaults = {
        rate: 1000,
        counter: 1
      };

  function HorizontalSlider(element, options) {
    this.$wrap = $(element);
    this.$slides = this.$wrap.children();

    this.options = $.extend({}, defaults, options);

    this.total = this.$slides.toArray().length;
    this.sWidth = this.$slides.width();
    this.init();
  }

  HorizontalSlider.prototype = {
    move: function(current, next, direction) {
      var $current = $('div.slide[data-index="'+current+'"]'),
          $next = $('div.slide[data-index="'+next+'"]'),
          that = this;

      if (direction === 'forward') {
        var nextLeft = this.sWidth,
            nextCurrent = this.sWidth * -1;
        this.options.counter = (current === this.total) ? 1 : current + 1;
      } else {
        var nextLeft = this.sWidth * -1;
            nextCurrent = this.sWidth;
        this.options.counter = (current === this.total) ? 1 : current + 1;
      }

      $next.css({
        marginLeft: nextLeft,
        display: 'block'
      });
      $current.animate({
        marginLeft: nextCurrent
      }, {
        duration: this.options.rate,
        queue: false
      });
      $next.animate({
        marginLeft: 0
      }, {
        duration: this.options.rate,
        queue: false,
        complete: function() {
          that.reset();
        }
      });
    },

    click: function(target) {
      var current = this.options.counter;
          next = 0;
      if ($(target).is('.back')) {
        next = (current === 1) ? this.total : current - 1;
        this.move(current, next, 'back');
      } else if ($(target).is('.forward')) {
        next = (current === this.total) ? 1 : current + 1;
        this.move(current, next, 'forward');
      } else {
        return(false);
      }
    },

    reset: function() {
      this.$slides.css('margin-left', 0);
      $('div.slide').not('[data-index="' + this.options.counter + '"]').hide();
    },

    buildButtons: function() {
      var buttons = '<div class="slider-btns"><div class="back" href="#" alt="slider left arrow button"></div>';
      buttons += '<div class="forward" href="#" alt="slider right arrow button"></div></div>';
      $(buttons).appendTo(this.$wrap);
    },

    setCss: function() {
      this.$wrap.css({
        position: 'relative',
        left: 0,
        overflow: 'hidden',
        width: this.sWidth,
        height: this.$slides.height()
      });

      this.$slides.each(function(i,e) {
        $(e).attr('data-index', i + 1)
            .css({
              position: 'absolute',
              left: 0
            });
      });

      $('div.slide').not('[data-index="' + this.options.counter + '"]').hide();
    },

    init: function() {
      var that = this;
      this.setCss();
      this.buildButtons();
      this.$wrap.click(function(e) {
        that.click(e.target);
      });
    }
  };

  $.fn[pluginName] = function(options) {
    return this.each(function() {
      if (!$.data(this, pluginName)) {
        $.data(this, pluginName, new HorizontalSlider(this, options));
      }
    });
  };

}(jQuery));