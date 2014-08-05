Lightweight Horizontal Slider
===================

This is a lightweight (2kb) and customizable horizontal slider plugin written in jQuery.

In order to use, wrap all of your slides in a parent DIV. Eg.:
````
<div class="imgWrap">
  <img src="img/puppy-1.jpg" />
  <img src="img/puppy-2.jpg" />
  <img src="img/puppy-3.jpg" />
  <img src="img/puppy-4.jpg" />
</div>
````

And then instantiate the plugin like this:
````
$('.imgWrap').horizontalSlider();
````

The plugin can be passed an object literal of options. This allows you to customize the slider buttons and where they appear, the rate the slides move at and which slide gets shown first. The object could look something like this:
````
var btnHtml = '<span class="back">Back</span> | <span class="forward">Foward</span>', 
    firstImg = Math.floor(Math.random() * $('.imgWrap img').length + 1), // Get a random slide
    sliderOptions = { // This is the object containing all the options
      rate: 500, // sliding speed (default: 1000)
      btnsInside: false, // Should the buttons go inside the slider wrapper (default: true)
      buttons: btnHtml, // A string that overrides default button HTML (default: '<div class="back" href="#"></div><div class="forward" href="#"></div>')
      btnWrap: 'buttons', // A classname for the DIV the will be wrapped around the buttons (default: 'slider-btns')
      counter: firstImg // Number that declares which slide should be shown first
    };
````

A working example can be seen here: http://lukeallanwhyte.com/tightrope/slider/example.html