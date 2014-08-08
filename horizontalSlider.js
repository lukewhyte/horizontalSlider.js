(function($) {

  var pluginName = 'horizontalSlider',
      defaults = {
        rate: 1000, // Set the rate of the slide action
        counter: 1, // Set the initial slide to be shown
        buttons: '<div class="back" href="#"></div><div class="forward" href="#"></div>',
        btnWrap: 'slider-btns',
        btnsInside: true,
        auto: 0
      };

  function HorizontalSlider(element, options) {
    this.$wrap = $(element); // The slides' wrapper
    this.$slides = this.$wrap.children(); // These will be the slides

    this.options = $.extend({}, defaults, options);

    this.setUniqueBtns(); // Make sure the btnWrap selector is unique

    this.buttons = '<div class="'+this.options.btnWrap+'">'+this.options.buttons+'</div>';
    this.total = Array.prototype.slice.apply(this.$slides).length; // Useful for keeping a log of position
    this.sWidth = this.$slides.width(); // Used to define the distance covered with each animation
    this.init();
  }

  HorizontalSlider.prototype = {
    inMotion: false,

    setUniqueBtns: function() {
      var total = $('.'+this.options.btnWrap).length;
      if (total) {
        this.options.btnWrap = this.options.btnWrap + '-' + total;
      }
    },

    // After this.move() pushes the margins around, this function resets the slides' position
    reset: function() {
      this.$slides.css('margin-left', 0)
                  .not('[data-index="' + this.options.counter + '"]')
                  .hide();
    },

    // This is where the animation takes place
    // int1 & int2 flip values (switching btw 1 or -1) depending on direction of travel
    move: function(current, int1, int2) {
      var $current = this.$wrap.find('[data-index="'+current+'"]'),
          $next = this.$wrap.find('[data-index="'+this.options.counter+'"]'),
          $btnSelector = $('.'+this.options.btnWrap),
          that = this;

      this.inMotion = true;
      $btnSelector.unbind(); // Make sure the event isn't fired during animation

      $next.css({ // Prep the next slide
        marginLeft: this.sWidth * int2,
        display: 'block'
      });

      // Animate the current and next slide
      $current.animate({ marginLeft: this.sWidth * int1 }, this.options.rate);
      $next.animate({
        marginLeft: 0
      }, {
        duration: this.options.rate,
        complete: function() { // Reset the CSS and rebind the click event
          that.reset();
          $btnSelector.click(function(e) {
            that.click(e.target);
          });
          that.inMotion = false;
        }
      });
    },

    // Big ol' conditional hinging on which, if any, button was clicked.
    click: function(target) {
      var current = this.options.counter, // Grab counter's current value
          pos = 1, neg = -1; // these will be passed as int1 and int2 to this.move()

      if ($(target).is('.back')) {
        // Iterate counter so we can use it to target the incoming slide in this.move()
        this.options.counter = (current === 1) ? this.total : current - 1;
        this.move(current, pos, neg);
      } else if ($(target).is('.forward')) {
        this.options.counter = (current === this.total) ? 1 : current + 1;
        this.move(current, neg, pos);
      } else {
        return(false);
      }
    },

    autoSlide: function () {
      var that = this;
      window.setInterval(function() {
        if (that.inMotion === false) {
          that.click('.forward');
        }
      }, that.options.auto);
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
      if (this.options.btnsInside) $(this.buttons).appendTo(this.$wrap);
      else $(this.buttons).insertAfter(this.$wrap);

      this.$wrap.css({ // If the the wrapper is hidden by default, show it.
        display: 'block',
        visibility: 'visible'
      }); 
    },

    init: function() {
      var that = this;
      this.setUpCss();
      $('.'+this.options.btnWrap).click(function(e) {
        that.click(e.target);
      });
      if (this.options.auto) this.autoSlide();
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