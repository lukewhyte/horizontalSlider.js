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
    moveForward: function() {
      var current = this.options.counter,
          next = (current === this.total) ? 1 : current + 1,
          $current = $('div.slide[data-index="'+current+'"]'),
          $next = $('div.slide[data-index="'+next+'"]');

      $next.css('margin-left', this.sWidth);
      $current.animate({
        marginLeft: this.sWidth * -1,
      }, {
        duration: this.options.rate,
        queue: false
      });
      $next.animate({
        marginLeft: 0,
      }, {
        duration: this.options.rate,
        queue: false
      });
    },

    moveBack: function() {},

    click: function(target) {
      if ($(target).is('.back')) {
        this.moveBack();
      } else if ($(target).is('.forward')) {
        this.moveForward();
      } else {
        return(false);
      }
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