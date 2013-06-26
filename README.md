# useful.gallery.js: Pinboard Gallery

This content gallery loads content progressively using AJAX and uses CSS3 transitions for animation and positioning. The optional web service providing the content is based on PHP, but the concept can be easily reproduced in other languages.

## How to use the script

The stylesheet is best included in the header of the document.

```html
<link rel="stylesheet" href="./css/gallery.css"/>
```

This include can be added to the header or placed inline before the script is invoked.

```html
<script src="./js/useful.gallery.js"></script>
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
var parent = documentGetElementById('id');
useful.gallery.start(parent, {
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
```

**id : {string}** - The ID attribute of an element somewhere in the document.
**parent : {DOM node}** - The DOM element around which the functionality is centred.
**aspectRatio : {float}** - Defines the aspect ratio of the gallery (4:3 would be 0.75).
**carouselNames : {array}** - The script will cycle through these classes, the number is not limited.
**pinboardNames : {array}** - The script alternates between these classes to divide the slides across columns.
**pagerLabels : {array}** - By default the page numbers are shown as integers, but these strings will be substituted if given.

**rowOffset : {integer}**
**pinboardOffset : {integer}**
Distance between rows of slides in pin board mode

**fetchScrollBottom : {integer}** - Distance from the bottom of the pin board where new slides will be loaded if AJAX is enabled.
**fetchTreshold : {integer}** - How far from the unloaded slides preloading should commence.
**fetchAmount : {integer}** - How many slides to get in one go.
**limitSpeed : {boolean}** - Don't accept new input until the animation finished.
**allowLoop : {boolean}** - Immediately cycle to the first slide after reaching the last.
**idleDelay : {integer}** - Wait this long until starting the automatic slideshow.
**idleDirection : {integer}** - Direction to show the slides in. +1 is left to right, -1 is right to left.

**toggleHint : {boolean}**
**togglePager : {boolean}**
**toggleFilter : {string / boolean}**
**togglePinboard : {string / boolean}**
**toggleCarousel : {string / boolean}**
**toggleNext : {string / boolean}**
**togglePrev : {string / boolean}**
What interface elements to show. Using a string instead of a boolean will override the label text.

**onMobile : {boolean}** - How mobile devices are identified to enable touch controls

### Using document.querySelectorAll

This method allows CSS Rules to be used to apply the script to one or more nodes at the same time.

```javascript
useful.css.select({
	rule : '.gallery',
	handler : useful.gallery.start,
	data : {
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
	}
});
```

**rule : {string}** - The CSS Rule for the intended target(s) of the script.
**handler : {function}** - The public function that starts the script.
**data : {object}** - Name-value pairs with configuration data.

### Using jQuery

This method is similar to the previous one, but uses jQuery for processing the CSS rule.

```javascript
$('.gallery').each(function (index, element) {
	useful.gallery.start(element, {
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
});
```

## License
This work is licensed under a Creative Commons Attribution 3.0 Unported License. The latest version of this and other scripts by the same author can be found at http://www.woollymittens.nl/
