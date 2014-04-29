(function($) {

  var pluginName = 'horizontalSlider',
      defaultButtons = '<div class="back" href="#"></div><div class="forward" href="#"></div>',
      defaults = {
        rate: 1000, // Set the rate of the slide action
        counter: 1, // Set the initial slide to be shown
        buttons: $('<div class="slider-btns"></div>').append(defaultButtons),
        btnsInside: true
      };

  function HorizontalSlider(element, options) {
    this.$wrap = $(element); // The slides' wrapper
    this.$slides = this.$wrap.children(); // These will be the slides

    this.options = $.extend({}, defaults, options);

    this.total = this.$slides.toArray().length; // Useful for keeping a log of position
    this.sWidth = this.$slides.width(); // Used to define the distance covered with each animation
    this.init();
  }

  HorizontalSlider.prototype = {
    // After this.move() pushes the margins around, this function resets the slides' position
    reset: function() {
      this.$slides.css('margin-left', 0)
                  .not('[data-index="' + this.options.counter + '"]')
                  .hide();
    },

    // This is where the animation takes place
    move: function(current, y, z) {
      var $current = $('[data-index="'+current+'"]'),
          $next = $('[data-index="'+this.options.counter+'"]'),
          that = this;

      this.options.buttons.unbind(); // Make sure the event isn't fired during animation

      $next.css({ // Prep the next slide
        marginLeft: this.sWidth * z,
        display: 'block'
      });

      // Animate the current and next slide
      $current.animate({ marginLeft: this.sWidth * y }, this.options.rate);
      $next.animate({
        marginLeft: 0
      }, {
        duration: this.options.rate,
        complete: function() { // Reset the CSS and rebind the click event
          that.reset();
          that.options.buttons.click(function(e) {
            that.click(e.target);
          });
        }
      });
    },

    // Big ol' conditional hinging on which, if any, button was clicked.
    // Important to notice that 'current' is set to this.options.counter.
    // this.options.counter is then iterated and used by '$next' in this.move()
    click: function(target) {
      var current = this.options.counter,
          a = 1, b = -1;

      if ($(target).is('.back')) {
        this.options.counter = (current === 1) ? this.total : current - 1;
        this.move(current, a, b);
      } else if ($(target).is('.forward')) {
        this.options.counter = (current === this.total) ? 1 : current + 1;
        this.move(current, b, a);
      } else {
        return(false);
      }
    },

    // This method is called once by init and then never again
    setUpCss: function() {
      this.$wrap.css({
        position: 'relative',
        left: 0,
        overflow: 'hidden',
        width: this.sWidth,
        height: this.$slides.height()
      });

      this.$slides.each(function(i,e) {
        $(e).attr('data-index', i + 1) // data-index attribute keeps track of the slides numerically
            .css({
              position: 'absolute',
              left: 0
            });
      });

      this.$slides.not('[data-index="' + this.options.counter + '"]').hide();

      // Add the buttons to the bottom of (or just below) this.$wrap. They can be further controled via CSS.
      if (this.options.btnsInside) $(this.options.buttons).appendTo(this.$wrap);
      else $(this.options.buttons).insertAfter(this.$wrap);

      this.$wrap.show(); // If the the wrapper is hidden by default, show it.
    },

    init: function() {
      var that = this;
      this.setUpCss();
      this.options.buttons.click(function(e) {
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