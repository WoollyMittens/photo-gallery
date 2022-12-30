# gallery.js: Pinboard Gallery

This content gallery loads content progressively using AJAX and uses CSS3 transitions for animation and positioning. The optional web service providing the content is based on PHP, but the concept can be easily reproduced in other languages.

## How to include the script

The stylesheet is best included in the header of the document.

```html
<link rel="stylesheet" href="css/gallery.css"/>
```

This include can be added to the header or placed inline before the script is invoked.

```html
<script src="lib/requests.js"></script>
<script src="lib/transitions.js"></script>
<script src="js/gallery.js"></script>
```

Or use [Require.js](https://requirejs.org/).

```js
requirejs([
	'lib/requests.js',
	'lib/transitions.js',
	'js/gallery.js'
], function(requests, transitions, Gallery) {
	...
});
```

Or import into an MVC framework.

```js
var requests = require('lib/requests.js');
var transitions = require('lib/transitions.js');
var Gallery = require('js/gallery.js');
```

### Using vanilla JavaScript

```javascript
var gallery = new Gallery( document.getElementById('id'), {
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

## How to build the script

This project uses node.js from http://nodejs.org/

This project uses gulp.js from http://gulpjs.com/

The following commands are available for development:
+ `npm install` - Installs the prerequisites.
+ `gulp import` - Re-imports libraries from supporting projects to `./src/libs/` if available under the same folder tree.
+ `gulp dev` - Builds the project for development purposes.
+ `gulp dist` - Builds the project for deployment purposes.
+ `gulp watch` - Continuously recompiles updated files during development sessions.
+ `gulp serve` - Serves the project on a temporary web server at http://localhost:8500/.
+ `gulp php` - Serves the project on a temporary php server at http://localhost:8500/.

## License

This work is licensed under a [MIT License](https://opensource.org/licenses/MIT). The latest version of this and other scripts by the same author can be found on [Github](https://github.com/WoollyMittens) and at [WoollyMittens.nl](https://www.woollymittens.nl/).
