# useful.gallery.js: Pinboard Gallery

This content gallery loads content progressively using AJAX and uses CSS3 transitions for animation and positioning. The optional web service providing the content is based on PHP, but the concept can be easily reproduced in other languages.

Try the <a href="http://www.woollymittens.nl/useful/default.php?url=gallery">gallery demo</a>.

## How to include the script

The stylesheet is best included in the header of the document.

```html
<link rel="stylesheet" href="./css/gallery.css"/>
```

This include can be added to the header or placed inline before the script is invoked.

```html
<script src="./js/gallery.min.js"></script>
```

To enable the use of HTML5 tags in Internet Explorer 8 and lower, include *html5.js*. To provide an alternative for *document.querySelectorAll* in Internet Explorer 8 and lower, include *jQuery*. To enable CSS3 transition animations in Internet Explorer 9 and lower, include *jQuery UI* as well.

```html
<!--[if lte IE 9]>
	<script src="//html5shiv.googlecode.com/svn/trunk/html5.js"></script>
	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
	<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/jquery-ui.min.js"></script>
<![endif]-->
```

The script can access new content from a web-service using JSON. As an example a dummy PHP webservice is provided as *./php/gallery.php*. The input elements allow the web-service to return specific contents.

```html
<form action="./php/gallery.php?foo=bar" class="gallery_filter gallery_filter_hide">
	<fieldset class="gallery_filter_groups">
		<legend>Types:</legend>
		<label><input name="grp" type="checkbox" checked="checked" value="0"/>Text Only</label>
		<label><input name="grp" type="checkbox" checked="checked" value="1"/>Text and Images</label>
		<label><input name="grp" type="checkbox" checked="checked" value="2"/>Images</label>
	</fieldset>
</form>
```

The form may be left out, if AJAX functionality is not required.

### Using vanilla JavaScript

This is the safest way of starting the script, but allows for only one target element at a time.

```javascript
var gallery = new useful.Gallery( document.getElementById('id'), {
	'aspectRatio' : 1,
	'carouselNames' : ['gallery_carousel_farleft', 'gallery_carousel_left', 'gallery_carousel_centre', 'gallery_carousel_right', 'gallery_carousel_farright'],
	'pinboardNames' : ['gallery_pinboard_left', 'gallery_pinboard_right', 'gallery_pinboard_loading'],
	'pagerLabels' : ['I', 'II', 'III', 'IV', 'V'],
	'rowOffset' : 18,
	'pinboardOffset' : 0,
	'fetchScrollBottom' : 100,
	'fetchTreshold' : 3,
	'fetchAmount' : 5,
	'limitSpeed' : true,
	'allowLoop' : false,
	'idleDelay' : 8000,
	'idleDirection' : 1,
	'toggleHint' : true,
	'togglePager' : true,
	'toggleFilter' : 'Filter',
	'togglePinboard' : 'View Pin Board',
	'toggleCarousel' : 'View Carousel',
	'toggleNext' : 'Next Slide',
	'togglePrev' : 'Previous Slide',
	'onMobile' : (navigator.userAgent.indexOf('Mobile')>-1)
});
gallery.start();
```

**id : {string}** - The ID attribute of an element somewhere in the document.

**aspectRatio : {float}** - Defines the aspect ratio of the gallery (4:3 would be 0.75).

**carouselNames : {array}** - The script will cycle through these classes, the number is not limited.

**pinboardNames : {array}** - The script alternates between these classes to divide the slides across columns.

**pagerLabels : {array}** - By default the page numbers are shown as integers, but these strings will be substituted if given.

**pinboardOffset : {integer}** - Tweak for positioning of the pin-board.

**rowOffset : {integer}** - Distance between rows of slides in pin-board mode.

**fetchScrollBottom : {integer}** - Distance from the bottom of the pin board where new slides will be loaded if AJAX is enabled.

**fetchTreshold : {integer}** - How far from the unloaded slides preloading should commence.

**fetchAmount : {integer}** - How many slides to get in one go.

**limitSpeed : {boolean}** - Don't accept new input until the animation finished.

**allowLoop : {boolean}** - Immediately cycle to the first slide after reaching the last.

**idleDelay : {integer}** - Wait this long until starting the automatic slideshow.

**idleDirection : {integer}** - Direction to show the slides in. +1 is left to right, -1 is right to left.

**toggleHint : {boolean}** - Shows or hides the hint icon.

**togglePager : {boolean}** - Shows or hides the page count.

**toggleFilter : {string / boolean}** - Shows or hides the category filter. A string will override the label text.

**togglePinboard : {string / boolean}** - Shows or hides the pin-board mode switch. A string will override the label text.

**toggleCarousel : {string / boolean}** - Shows or hides the carousel mode switch. A string will override the label text.

**toggleNext : {string / boolean}** - Shows or hides the next slide button. A string will override the label text.

**togglePrev : {string / boolean}** - Shows or hides the previous slide button. A string will override the label text.

**onMobile : {boolean}** - How mobile devices are identified to enable touch controls

## How to control the script

### Focus

```javascript
gallery.focus(index);
```

Highlights and centres a specific thumbnail.

**index : {integer}** - The index of the slide to show.

### Previous

```javascript
gallery.previous();
```

Shows the previous slide.

### Next

```javascript
gallery.next();
```

Shows the next slide

### Pause

```javascript
gallery.pause();
```

Stops the automatic slideshow.

### Play

```javascript
gallery.play();
```

Starts the automatic slideshow.

### Transform

```javascript
gallery.transform(mode);
```

Switches between slideshow and  pin-board.

**mode : {integer}** - The index of the mode.
+ 0 - Slideshow mode
+ 1 - Pin-board mode

## Prerequisites

To concatenate and minify the script yourself, the following prerequisites are required:
+ https://github.com/WoollyMittens/useful-requests
+ https://github.com/WoollyMittens/useful-transitions
+ https://github.com/WoollyMittens/useful-polyfills

## License
This work is licensed under a Creative Commons Attribution 3.0 Unported License. The latest version of this and other scripts by the same author can be found at http://www.woollymittens.nl/
