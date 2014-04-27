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
    activeSlides: {
      pre: {},
      active: {},
      post: {}
    },

    click: function(target) {
      if ($(target).is('.back')) {
        this.checkPosition('back');
      } else if ($(target).is('.forward')) {
        this.checkPosition('forward');
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