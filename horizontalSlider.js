(function($) {

  var pluginName = 'horizontalSlider';

  function HorizontalSlider(slides) {
    // These first three properties point to the slides, their immediate wrapper and the outer wrapper
    this.$slides = $(slides);
    this.$innerWrap = this.$slides.parent();
    this.$outerWrap = this.$innerWrap.parent();

    this.total = this.$slides.toArray().length; // Useful for keeping a log of position
    this.sWidth = this.$slides.width(); // Used to define length of each animation
    this.counter = 1; // Used to mark the first and last slide
    this.init(); // Fire it up!
  }

  HorizontalSlider.prototype = {
    // This is the object used to sets the parameters for the move() object
    // It is expanded during setActions() to reflect the current state at each click
    slideAction: {
      goHome: 0, // What to return to at end of slideshow
      resetCount: 1 // Reset the counter when ifMoreSlides() returns false
    },

    // Boolean that returns false if user tries to go 'back' past the first slide or 'forward' past the last
    // It does this by iterating the counter up and down with each button click
    ifMoreSlides: function(direction) {
      if (direction === 'forward') {
        this.counter += 1;
        return this.counter < this.total + 1;
      } else {
        this.counter -= 1;
        return this.counter > 0;
      }
    },

    // Here we expand the 'slideAction' object that tells move() 
    // how fast, far and in what direction to push the slider
    setActions: function(current, direction) {
      var slideAction = this.slideAction;

      // This statement utilizes ifMoreSlides() to set .animate() properties reflective 
      // of whether we're trying to go past the end of the slideshow or not
      if (this.ifMoreSlides(direction)) {
        slideAction.move = (direction === 'forward') ? current - this.sWidth : current + this.sWidth; // Moving forward or back?
        slideAction.rate = 1000;
        slideAction.leftPos = slideAction.move;
      } else {
        slideAction.rate = 200;
        slideAction.leftPos = slideAction.goHome;
        this.counter = slideAction.resetCount;
      }
      this.move(slideAction);
    },

    // This is the meat of the operation. It moves the slides back or forth via .animate()
    move: function(slideAction) {
      var that = this;

      this.$outerWrap.unbind(); // Make sure the event isn't fired during animation

      // This is the animation itself, hinging off the 'left' CSS property
      this.$innerWrap
        .animate({
          left: slideAction.leftPos
        }, slideAction.rate, function() {
          that.$outerWrap.bind('click', function(e) {
            that.click(e.target);
          });
        });
    },

    // Big 'ol conditional to check if a button was clicked and, if so, which one
    click: function(target) {
      var current = parseInt(this.$innerWrap.css('left'));

      if ($(target).is('.back')) {
        this.setActions(current, 'back');
      } else if ($(target).is('.forward')) {
        this.setActions(current, 'forward');
      } else {
        return(false);
      }
    },

    // Initial setup of the CSS necessary to align the slides and enable the animation
    setCss: function(index, node) {
      this.$innerWrap.css({
        position: 'relative',
        left: 0,
        width: this.sWidth * this.total + 'px'
      });

      this.$outerWrap.css({
        overflow: 'hidden',
        positon: 'relative',
        width: this.sWidth + 'px',
        height: this.$slides.height() + 'px',
      });

      this.$slides.css('float', 'left');
    },

    // Fires up setCss() and binds the event handler to the outer wrapper
    init: function() {
      var that = this;
      this.setCss();
      this.$outerWrap.click(function(e) {
        that.click(e.target);
      });
    }
  };

  $.fn[pluginName] = function() {
    return new HorizontalSlider(this);
  };

}(jQuery));