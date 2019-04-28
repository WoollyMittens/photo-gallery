/*
	Source:
	van Creij, Maurice (2018). "photowall.js: Simple photo wall", http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/

// establish the class
var Gallery = function (config) {

	this.only = function (config) {
		// start an instance of the script
		return new this.Main(config, this);
	};

	this.each = function (config) {
		var _config, _context = this, instances = [];
		// for all element
		for (var a = 0, b = config.elements.length; a < b; a += 1) {
			// clone the configuration
			_config = Object.create(config);
			// insert the current element
			_config.element = config.elements[a];
			// start a new instance of the object
			instances[a] = new this.Main(_config, _context);
		}
		// return the instances
		return instances;
	};

	return (config.elements) ? this.each(config) : this.only(config);

};

// return as a require.js module
if (typeof define != 'undefined') define([], function () { return Gallery });
if (typeof module != 'undefined') module.exports = Gallery;

// extend the class
Gallery.prototype.Hint = function (parent) {

	// PROPERTIES

	this.parent = parent;
	this.config = parent.config;
	this.element = parent.element;

	// METHODS

	this.buildHint = function () {
		// if the hint is enabled
		if (this.config.toggleHint) {
			// create an element for the invitation
			this.config.hintElement = document.createElement('div');
			this.config.hintElement.className = 'gallery_hint';
			// add the element to the slideshow
			this.element.appendChild(this.config.hintElement);
			// a a status class to the parent element
			this.element.className += ' gallery_interface_hidden';
			// on the mobile version
			if (this.config.onMobile) {
				// set its event handler
				this.handleHintiOS();
			}
		}
	};

	this.handleHintiOS = function () {
		var _this = this;
		this.element.addEventListener('touchend', function () {
			// show the interface
			_this.element.className = _this.element.className.replace(/gallery_interface_hidden/gi, 'gallery_interface_visible');
		}, false);
	};
};

// extend the class
Gallery.prototype.Main = function (config, context) {

	// PROPERTIES

	this.config = config;
	this.context = context;
	this.element = config.element;

	// METHODS

	this.init = function () {
		// if the component is not already active
		if (!this.config.isActive) {
			// mark this node as active
			this.config.isActive = true;
			// set the default mode
			this.element.className += ' gallery_mode_carousel';
			// store the settings
			this.defaultSettings();
			// build the container for the slides
			this.slides.buildSlideContainer();
			// build the progress indicator
			this.progress.buildProgressIndicator();
			// build the toolbar
			this.toolbar.buildToolbar();
			// build the pager
			this.pager.buildPager();
			// build the interaction invitation
			this.hint.buildHint();
			// if this is the mobile website
			if (this.config.onMobile) {
				// add the click events
				this.toolbar.handleClicksiOS();
				// add the gesture events
				this.handleGesturesiOS();
			// otherwise
			} else {
				// add the click events
				this.toolbar.handleClicks();
				// add the gesture events
				this.handleGestures();
			}
			// add the mousewheel events
			this.handleMousewheel();
			// add the idle animation
			this.handleIdle();
			// add the filter handlers
			this.toolbar.handleFilters();
			// handle resizing of the browser
			this.handleResize();
			// if AJAX is used
			var _this = this;
			if (this.config.allowAjax) {
				// order the first batch of slides
				setTimeout(function () {
					// load the first batch
					_this.slides.loadSlides(_this.config.activeSlide, _this.config.fetchAmount);
					// load the pager
					_this.pager.loadPager();
				}, 200);
			}
			// build the pager based on the slides that are already there
			this.pager.fillPager({'responseText' : '[' + (this.config.slideNodes.length - 1) + ']'});
			// update the slides that are already there
			this.updateAll();
		}
		// return the object
		return this;
	};

	this.defaultSettings = function () {
		// EXTERNAL SETTINGS
		// defines the aspect ratio of the gallery - 4:3 would be 0.75
		this.config.aspectRatio = this.config.aspectRatio || 1;
		// the script will cycle through these classes, the number is not limited
		this.config.carouselNames = this.config.carouselNames || ['gallery_carousel_farleft', 'gallery_carousel_left', 'gallery_carousel_centre', 'gallery_carousel_right', 'gallery_carousel_farright'];
		// the script alternates between these classes to divide the slides across columns
		this.config.pinboardNames = this.config.pinboardNames || ['gallery_pinboard_left', 'gallery_pinboard_right', 'gallery_pinboard_loading'];
		// default behaviour is to show numbers
		this.config.pagerLabels = this.config.pagerLabels || ['Lorem', 'Ipsum', 'Dolor', 'Sit', 'Amet'];
		// distance between rows of slides in pin board mode
		this.config.rowOffset = this.config.rowOffset || 18;
		this.config.pinboardOffset = this.config.pinboardOffset || 0;
		// distance from the bottom of the pin board where new slides will be loaded if AJAX is enabled
		this.config.fetchScrollBottom = this.config.fetchScrollBottom || 100;
		// how far from the unloaded slides preloading should commence
		this.config.fetchTreshold = this.config.fetchTreshold || 3;
		// how many slides to get in one go
		this.config.fetchAmount = this.config.fetchAmount || 5;
		// don't accept new input until the animation finished
		this.config.limitSpeed = this.config.limitSpeed || true;
		// immediately cycle to the first slide after reaching the last
		this.config.allowLoop = this.config.allowLoop || false;
		// wait this long until starting the automatic slideshow
		this.config.idleDelay = this.config.idleDelay || 8000;
		// direction to show the slides in
		this.config.idleDirection = this.config.idleDirection || 1; // -1 | 1
		// what interface elements to show
		this.config.toggleHint = this.config.toggleHint || true; // true | false
		this.config.togglePager = this.config.togglePager || true; // true | false
		this.config.toggleFilter = this.config.toggleFilter || 'Filter'; // string | true | false
		this.config.togglePinboard = this.config.togglePinboard || 'View Pin Board'; // string | true | false
		this.config.toggleCarousel = this.config.toggleCarousel || 'View Carousel'; // string | true | false
		this.config.toggleNext = this.config.toggleNext || 'Next Slide'; // string | true | false
		this.config.togglePrev = this.config.togglePrev || 'Previous Slide'; // string | true | false
		// how mobile devices are identified to enable touch controls
		this.config.onMobile = this.config.onMobile || (navigator.userAgent.indexOf('Mobile') > -1);
		// INTERNAL SETTINGS
		// store the starting index
		this.config.activeSlide = 0;
		// set the initial keywords
		this.config.activeFilterGroup = [];
		// store the initial mode
		this.config.carouselMode = (this.element.className.indexOf('gallery_mode_carousel') > -1);
		this.config.allowAjax = this.config.allowAjax || (this.element.getElementsByTagName('form').length > 0);
		// report animations in progress
		this.config.animationInProgress = false;
		// report AJAX fetches in progress
		this.config.fetchInProgress = false;
		// report that slides have not run out yet
		this.config.noSlidesLeft = false;
		// indicator for interferance of gestures
		this.config.recentGesture = false;
	};

	this.updateAll = function () {
		// re-implement the aspect ratio
		this.element.style.height = parseInt(this.element.offsetWidth * this.config.aspectRatio, 10) + 'px';
		// update the components
		this.pager.updatePager();
		this.slides.updateSlides();
		this.toolbar.updateToolbar();
	};

	this.resetAll = function () {
		// restore the global parameters to the default situation
		this.config.activeSlide = 0;
		this.config.slideNodes = [];
		this.config.fetchInProgress = false;
		this.config.fetchInProgress = false;
		this.config.noSlidesLeft = false;
		// empty the current set of slides
		this.config.slideContainer.innerHTML = '';
		// get the slides that match the filter
		this.slides.loadSlides(0, 3);
	};

	// COMPONENTS

	this.toolbar = new this.context.Toolbar(this);
	this.slides = new this.context.Slides(this);
	this.progress = new this.context.Progress(this);
	this.pager = new this.context.Pager(this);
	this.hint = new this.context.Hint(this);

	// EVENTS

	this.handleResize = function () {
		var _this = this;
		window.addEventListener('resize', function () {
			_this.updateAll();
		}, false);
	};

	this.handleGestures = function () {
		var _this = this;
		this.config.startX = null;
		this.element.onmousedown = function (event) {
			event = event || window.event;
			if (_this.config.carouselMode) {
				_this.config.startX = (navigator.userAgent.indexOf('MSIE ') > -1) ? event.x : event.screenX;
				// cancel the click event
				return false;
			}
		};
		this.element.onmousemove = function (event) {
			event = event || window.event;
			if (_this.config.carouselMode) {
				if (_this.config.startX !== null) {
					var increment;
					// lock the click events
					_this.config.recentGesture = true;
					_this.config.endX = (navigator.userAgent.indexOf('MSIE ') > -1) ? event.x : event.screenX;
					// if the distance has been enough
					if (Math.abs(_this.config.endX - _this.config.startX) > _this.element.offsetWidth / 4) {
						// move one increment
						increment = (_this.config.endX - _this.config.startX < 0) ? 1 : -1;
						if (!_this.config.animationInProgress) {
							_this.slides.slideBy(increment);
						}
						// reset the positions
						_this.config.startX = _this.config.endX;
					}
					// cancel the click event
					return false;
				}
			}
		};
		this.element.onmouseup = function (event) {
			event = event || window.event;
			if (_this.config.carouselMode) {
				// cancel the gesture
				_this.config.endX = null;
				_this.config.startX = null;
				setTimeout(function () { _this.config.recentGesture = false; }, 100);
				// cancel the click event
				return false;
			}
		};
		this.element.addEventListener('mouseout', function (event) {
			event = event || window.event;
			if (_this.config.carouselMode) {
				// whipe the gesture if the mouse remains out of bounds
				_this.config.timeOut = setTimeout(function () {
					_this.config.endX = null;
					_this.config.startX = null;
				}, 100);
				// cancel the click event
				event.preventDefault();
			}
		}, false);
		this.element.addEventListener('mouseover', function (event) {
			event = event || window.event;
			if (_this.config.carouselMode) {
				// stop the gesture from resetting when the mouse goes back in bounds
				clearTimeout(_this.config.timeOut);
				// cancel the click event
				event.preventDefault();
			}
		}, false);
	};

	this.handleGesturesiOS = function () {
		var _this = this;
		this.config.touchStartX = null;
		this.config.touchStartY = null;
		this.element.addEventListener('touchstart', function (event) {
			if (_this.config.carouselMode) {
				_this.config.touchStartX = event.touches[0].pageX;
				_this.config.touchStartY = event.touches[0].pageY;
			}
		}, false);
		this.element.addEventListener('touchmove', function (event) {
			if (_this.config.carouselMode) {
				if (_this.config.touchStartX !== null) {
					// lock the click events
					_this.config.recentGesture = true;
					_this.config.touchEndX = event.touches[0].pageX;
					_this.config.touchEndY = event.touches[0].pageY;
					// if the distance has been enough
					if (Math.abs(_this.config.touchEndX - _this.config.touchStartX) > _this.element.offsetWidth / 4) {
						// move one increment
						var increment = (_this.config.touchEndX - _this.config.touchStartX < 0) ? 1 : -1;
						if (!_this.config.animationInProgress) {
							_this.slides.slideBy(increment);
						}
						// reset the positions
						_this.config.touchStartX = _this.config.touchEndX;
					}
					// cancel the default browser behaviour if there was horizontal motion
					if (Math.abs(_this.config.touchEndX - _this.config.touchStartX) > Math.abs(_this.config.touchEndY - _this.config.touchStartY)) {
						event.preventDefault();
					}
				}
			}
		}, false);
		this.element.eventListener('touchend', function () {
			if (_this.config.carouselMode) {
				// cancel the gesture
				_this.config.touchEndX = null;
				_this.config.touchStartX = null;
				_this.config.touchEndY = null;
				_this.config.touchStartY = null;
				setTimeout(function () { _this.config.recentGesture = false; }, 100);
			}
		}, false);
		this.element.addEventListener('touchcancel', function (event) {
			if (_this.config.carouselMode) {
				// cancel the gesture
				_this.config.touchEndX = null;
				_this.config.touchStartX = null;
				_this.config.touchEndY = null;
				_this.config.touchStartY = null;
				setTimeout(function () { _this.config.recentGesture = false; }, 100);
				// cancel the default browser behaviour
				event.preventDefault();
			}
		}, false);
	};

	this.handleMousewheel = function () {
		var _this = this;
		var onMoveSlides = function (event) {
			var distance, increment;
			// get the scroll distance
			distance = (window.event) ? window.event.wheelDelta / 120 : -event.detail / 3;
			increment = (distance < 0) ? 1 : -1;
			// if this is carousel mode
			if (_this.config.carouselMode) {
				// scroll the page
				if (!_this.config.animationInProgress) {
					_this.slides.slideBy(increment);
				}
				// cancel the click event
				event.preventDefault();
			}
		};
		var onLoadSlides = function () {
			// if the scroll position is close to the scroll height
			if (_this.config.slideContainer.scrollHeight - _this.config.slideContainer.offsetHeight - _this.config.slideContainer.scrollTop < _this.config.fetchScrollBottom) {
				// ask for more slides
				_this.slides.loadSlides(_this.config.slideNodes.length, _this.config.fetchAmount);
			}
		};
		this.element.addEventListener('mousewheel', onMoveSlides, false);
		this.element.addEventListener('DOMMouseScroll', onMoveSlides, false);
		this.config.slideContainer.addEventListener('scroll', onLoadSlides, false);
	};

	this.handleIdle = function () {
		var _this = this;
		// timer constant
		this.config.idleTimer = null;
		this.config.idleLoop = this.config.allowLoop;
		// events
		this.element.addEventListener('mouseout', function () {
			// allow looping
			_this.config.allowLoop = true;
			// a set the automatic gallery to start after while
			if (_this.config.idleDelay > -1) {
				clearInterval(_this.config.idleTimer);
				_this.config.idleTimer = setInterval(function () {
					if (_this.config.carouselMode) {
						_this.slides.slideBy(_this.config.idleDirection);
					}
				}, _this.config.idleDelay);
			}
		}, false);
		this.element.addEventListener('mouseover', function () {
			// restore looping setting
			_this.config.allowLoop = _this.config.idleLoop;
			// cancel the automatic gallery
			clearInterval(_this.config.idleTimer);
		}, false);
		// a set the automatic gallery to start after while
		if (this.config.idleDelay > -1) {
			clearInterval(this.config.idleTimer);
			this.config.idleTimer = setInterval(function () {
				if (_this.config.carouselMode) {
					_this.slides.slideBy(_this.config.idleDirection);
				}
			}, this.config.idleDelay);
		}
	};
	// external API
	this.focus = function (index) {
		this.slides.slideTo(index);
	};

	this.previous = function () {
		this.slides.slideBy(-1);
	};

	this.next = function () {
		this.slides.slideBy(1);
	};

	this.pause = function () {
		// restore looping setting
		this.config.allowLoop = this.config.idleLoop;
		// cancel the automatic gallery
		clearInterval(this.config.idleTimer);
	};

	this.play = function () {
		var _this = this;
		// allow looping
		this.config.allowLoop = true;
		// a set the automatic gallery to start after while
		if (this.config.idleDelay > -1) {
			clearInterval(this.config.idleTimer);
			this.config.idleTimer = setInterval(function () {
				if (_this.config.carouselMode) {
					_this.slides.slideBy(_this.config.idleDirection);
				}
			}, this.config.idleDelay);
		}
	};

	this.transform = function (mode) {
		switch (mode) {
		case 1 :
			this.toolbar.transformToPinboard(this);
			break;
		default :
			this.toolbar.transformToCarousel(this);
		}
	};

	this.init();
};

// extend the class
Gallery.prototype.Pager = function (parent) {

	// PROPERTIES

	this.parent = parent;
	this.config = parent.config;
	this.element = parent.element;

	// METHODS

	this.buildPager = function () {
		// build the page indicators
		this.config.pagerContainer = document.createElement('menu');
		this.config.pagerContainer.className = 'gallery_pager';
		this.element.appendChild(this.config.pagerContainer);
	};

	this.loadPager = function () {
		var _this = this;
		var fetchURL;
		// get the url for the ajax call
		fetchURL = this.element.getElementsByTagName('form')[0].getAttribute('action');
		fetchURL += '&inf=1&grp=' + this.config.activeFilterGroup.join(',');
		// formulate the ajax call
		requests.send({
			url : fetchURL,
			post : null,
			onProgress : function () {},
			onFailure : function () {},
			onSuccess : function (reply) { _this.fillPager(reply); }
		});
	};

	this.fillPager = function (reply) {
		var a, b, parent, fetchedPager, newPagerElement, newPagerLink;
		// shortcut pointers
		parent = reply.referer;
		fetchedPager = [];
		// decode the JSON string
		fetchedPager = requests.decode(reply.responseText);
		// empty the pager
		this.config.pagerContainer.innerHTML = '';
		// for all pages reported
		for (a = 0 , b = fetchedPager[fetchedPager.length - 1] + 1; a < b; a += 1) {
			// create a new pager element
			newPagerElement = document.createElement('li');
			// create a new pager link
			newPagerLink = document.createElement('a');
			// fill with a page number or a custom label
			newPagerLink.innerHTML = (this.config.pagerLabels !== null && a < this.config.pagerLabels.length) ? this.config.pagerLabels[a] : a + 1;
			// add the link to the pager element
			newPagerElement.appendChild(newPagerLink);
			// add the pager element to the pager container
			this.config.pagerContainer.appendChild(newPagerElement);
			// set the link target
			newPagerLink.setAttribute('href', '#gallery_slide_' + a);
			newPagerLink.setAttribute('id', 'gallery_page_' + a);
			// add the event handler
			if (this.config.onMobile) {
				this.handlePageriOS(a, newPagerLink);
			// else
			} else {
				this.handlePager(a, newPagerLink);
			}
		}
		// update the pager to the initial state
		this.updatePager();
	};

	this.updatePager = function () {
		var a, b, childNodes;
		// get the slides from the container
		childNodes = this.config.pagerContainer.getElementsByTagName('a');
		// for all pager elements in the container
		for (a = 0 , b = childNodes.length; a < b; a += 1) {
			// highlight or reset the element
			if (a < this.config.slideNodes.length) {
				childNodes[a].parentNode.className = (a === this.config.activeSlide) ? 'gallery_pager_active' : 'gallery_pager_link';
			} else {
				childNodes[a].parentNode.className = 'gallery_pager_passive';
			}
		}
		// hide the pager if it's not wanted
		if (!this.config.togglePager) {
			this.config.pagerContainer.style.visibility = 'hidden';
		}
	};

	this.handlePager = function (a, newPagerLink) {
		var _this = this;
		newPagerLink.onclick = function () {
			// handle the event
			if (!_this.config.animationInProgress && newPagerLink.parentNode.className.match(/gallery_pager_link/gi)) {
				_this.parent.slides.slideTo(a);
			}
			// cancel the click
			return false;
		};
	};

	this.handlePageriOS = function (a, newPagerLink) {
		var _this = this;
		newPagerLink.ontouchend = function () {
			// handle the event
			if (!_this.config.animationInProgress && newPagerLink.parentNode.className.match(/gallery_pager_link/gi)) {
				_this.parent.slides.slideTo(a);
			}
			// cancel the click
			return false;
		};
	};
};

// extend the class
Gallery.prototype.Progress = function (parent) {

	// PROPERTIES

	this.parent = parent;
	this.config = parent.config;
	this.element = parent.element;

	// METHODS

	this.buildProgressIndicator = function () {
		// create the indicator element
		this.config.progressIndicator = document.createElement('div');
		// add the element's properties
		this.config.progressIndicator.className = 'gallery_busy';
		// insert it into the component
		this.element.appendChild(this.config.progressIndicator);
	};
};

// extend the class
Gallery.prototype.Slides = function (parent) {

	// PROPERTIES

	this.parent = parent;
	this.config = parent.config;
	this.element = parent.element;

	// METHODS

	this.buildSlideContainer = function () {
		var a, b, movedSlide;
		// get all the slides
		this.config.slideNodes = transitions.select('figure, article', this.element);
		// create the slide container
		this.config.slideContainer = document.createElement('div');
		// add its properties
		this.config.slideContainer.className = 'gallery_slides';
		// for all childnodes
		for (a = 0 , b = this.config.slideNodes.length; a < b; a += 1) {
			// get the slide node
			movedSlide = this.element.removeChild(this.config.slideNodes[a]);
			// set its starting class name
			movedSlide.className += ' ' + this.config.carouselNames[this.config.carouselNames.length - 1];
			// move it to the container
			this.config.slideContainer.appendChild(movedSlide);
		}
		// add the container to the component
		this.element.appendChild(this.config.slideContainer);
	};

	this.loadSlides = function (overrideIndex, overrideAmount) {
		// if there's ajax functionality
		if (this.config.allowAjax) {
			var a, b, slideIndex, slideAmount, filterForm, filterInputs, fetchURL;
			// if no fetch request is in progress
			if (!this.config.fetchInProgress && !this.config.noSlidesLeft) {
				// normalise the values
				slideIndex = (overrideIndex) ? overrideIndex : this.config.activeSlide;
				slideAmount = (overrideAmount) ? overrideAmount : this.config.fetchAmount;
				// get the form element
				filterForm = this.element.getElementsByTagName('form')[0];
				// gather the filter group from the form
				filterInputs = filterForm.getElementsByTagName('input');
				this.config.activeFilterGroup = [];
				for (a = 0 , b = filterInputs.length; a < b; a += 1) {
					if (filterInputs[a].checked || !filterInputs[a].type.match(/checkbox|radio/gi)) {
						// store the active filter group
						this.config.activeFilterGroup[this.config.activeFilterGroup.length] = filterInputs[a].value;
					}
				}
				// get the url for the ajax call
				fetchURL = filterForm.getAttribute('action');
				fetchURL += '&idx=' + slideIndex + '&amt=' + slideAmount + '&grp=' + this.config.activeFilterGroup.join(',');
				// formulate the ajax call
				var _this = this;
				requests.send({
					url : fetchURL,
					post : null,
					onProgress : function (reply) { _this.progressSlides(reply); },
					onFailure : function () {},
					onSuccess : function (reply) { _this.insertSlides(reply); }
				});
				// show the progress meter
				this.config.progressTimeout = setTimeout(function () { this.config.progressIndicator.style.display = 'block'; }, 500);
				// prevent any further ajax calls from piling up
				this.config.fetchInProgress = true;
				// give up if it takes too long
				setTimeout(function () { _this.config.fetchInProgress = false; _this.config.progressIndicator.style.display = 'none'; }, 1000);
			}
		}
	};

	this.progressSlides = function (/*reply, this*/) {
		// show progress indicator
	};

	this.insertSlides = function (reply) {
		// shortcut pointers
		var a, b, newSlide, fetchedSlides, fetchedSlide;
		fetchedSlides = [];
		// if there's ajax functionality
		if (this.config.allowAjax) {
			// decode the JSON string
			fetchedSlides = requests.decode(reply.responseText);
			// for every new slide
			for (a = 0 , b = fetchedSlides.length - 1; a < b; a += 1) {
				fetchedSlide = fetchedSlides[a];
				// create the requested node
				newSlide = document.createElement(fetchedSlide.element);
				newSlide.id = fetchedSlide.id;
				newSlide.className = fetchedSlide['class'];
				// fill it
				newSlide.innerHTML = decodeURI(fetchedSlide.html);
				// check if the id already exists
				if (!document.getElementById(newSlide.id)) {
					// set the starting class name
					newSlide.className += (this.config.carouselMode) ? ' ' + this.config.carouselNames[this.config.carouselNames.length - 1] : ' ' + this.config.pinboardNames[this.config.pinboardNames.length - 1];
					// add it to the end of the line
					this.config.slideContainer.appendChild(newSlide);
					// center it in its column
					newSlide.style.marginLeft = '-' + Math.round(newSlide.offsetWidth / 2) + 'px';
					newSlide.style.marginTop = '-' + Math.round(newSlide.offsetHeight / 2) + 'px';
				}
			}
			// if no new slides were sent, stop asking for them
			if (fetchedSlides.length <= 1) {
				this.config.noSlidesLeft = true;
			}
			// unlock further ajax calls
			this.config.fetchInProgress = false;
			// hide the progress meter
			clearTimeout(this.config.progressTimeout);
			this.config.progressIndicator.style.display = 'none';
			// update the slides
			this.updateSlides();
			// update the pinboard
			if (!this.config.carouselMode) {
				this.parent.toolbar.transformToPinboard();
			}
			// update the pager
			this.parent.pager.fillPager(reply);
		}
	};

	this.updateSlides = function () {
		var b, c, slideWidth, slideHeight, slideClass, centerClass, resetProgressIndicator;
		// store the individual slides in an array
		this.config.slideNodes = transitions.select('figure, article', this.config.slideContainer);
		// get the centre class name from the array
		centerClass = Math.floor(this.config.carouselNames.length / 2);
		// create a function to reset the progress indicator
		var _this = this;
		resetProgressIndicator = function () { _this.config.animationInProgress = false; };
		// for all slides in the list
		for (b = 0 , c = this.config.slideNodes.length; b < c; b += 1) {
			// redo the slides event handler
			if (this.config.slideNodes[b].className.indexOf('slide_active') < 0) {
				if (this.config.onMobile) {
					this.handleSlideiOS(b);
				} else {
					this.handleSlide(b);
				}
				this.config.slideNodes[b].className = 'slide_active ' + this.config.slideNodes[b].className;
			}
			// if the slideshow is in carousel mode
			if (this.config.carouselMode) {
				// determine their new class name
				slideClass = b - this.config.activeSlide + centerClass;
				slideClass = (this.config.allowLoop && b - this.config.activeSlide - centerClass > 0) ? b - this.config.slideNodes.length - this.config.activeSlide + centerClass : slideClass;
				slideClass = (this.config.allowLoop && b - this.config.activeSlide + centerClass < 0) ? b + this.config.slideNodes.length - this.config.activeSlide + centerClass : slideClass;
				slideClass = (slideClass < 0) ? 0 : slideClass;
				slideClass = (slideClass >= this.config.carouselNames.length) ? this.config.carouselNames.length - 1 : slideClass;
				// if the slide doesn't have this class already
				if (this.config.slideNodes[b].className.indexOf(this.config.carouselNames[slideClass]) < 0) {
					// report than an animation is in progress
					if (this.config.limitSpeed) {
						this.config.animationInProgress = true;
					}
					// transition this class
					transitions.byClass(
						this.config.slideNodes[b],
						this.config.carouselNames.join(' '),
						this.config.carouselNames[slideClass],
						resetProgressIndicator
					);
				}
				// re-centre the slide
				slideWidth = this.config.slideNodes[b].offsetWidth;
				slideHeight = this.config.slideNodes[b].offsetHeight;
				this.config.slideNodes[b].style.marginLeft = parseInt(slideWidth / -2, 10) + 'px';
				this.config.slideNodes[b].style.marginTop = parseInt(slideHeight / -2, 10) + 'px';
			} else {
				// store the assigned column positions
				var cols = this.config.pinboardNames.length - 1;
				// replace the carousel styles with pinboard one
				transitions.byClass(
					this.config.slideNodes[b],
					this.config.pinboardNames.join(' '),
					this.config.pinboardNames[b % cols],
					resetProgressIndicator
				);
				// un-centre the slide
					// doesn't seem to be necessary for now
			}
		}
		// fix the positioning in pinboard mode
		if (!this.config.carouselMode) {
			this.parent.toolbar.transformToPinboard();
		}
	};

	this.slideBy = function (increment) {
		// update the index
		this.config.activeSlide = this.config.activeSlide + increment;
		// if the right limit is passed
		if (this.config.activeSlide > this.config.slideNodes.length - 1) {
			// reset to the right limit
			this.config.activeSlide = this.config.slideNodes.length - 1;
			// if the idle loop is active
			if (this.config.allowLoop) {
				// loop around
				this.config.activeSlide = 0;
			}
		}
		// if the left limit is passed
		if (this.config.activeSlide < 0) {
			// reset to the left limit
			this.config.activeSlide = 0;
			// if the idle loop is active
			if (this.config.allowLoop) {
				// loop around
				this.config.activeSlide = this.config.slideNodes.length - 1;
			}
		}
		// if the index is close to the max
		if (this.config.slideNodes.length - this.config.activeSlide < this.config.fetchTreshold) {
			// check if there's more using ajax
			this.loadSlides();
		}
		// update the slides
		this.parent.updateAll();
	};

	this.slideTo = function (index) {
		// update the index
		this.config.activeSlide = index;
		// if the index is close to the max
		if (this.config.slideNodes.length - this.config.activeSlide < this.config.fetchTreshold) {
			// check if there's more using ajax
			this.loadSlides();
		}
		// update the slides
		this.parent.updateAll();
	};

	this.handleSlide = function (index) {
		var _this = this;
		this.config.slideNodes[index].addEventListener('click', function (event) {
			if (_this.config.carouselMode) {
				// check if there wasn't a recent gesture
				if (!_this.config.recentGesture) {
					// if the event was triggered on the active slide
					if (index === _this.config.activeSlide) {
						// find the url in the slide and open it
						var slideLinks = _this.config.slideNodes[_this.config.activeSlide].getElementsByTagName('a');
						// if there is just one link in the slide
						if (slideLinks.length === 1) {
							// open the link
							document.location.href = slideLinks[0].href;
						}
					} else {
						// show the indicated
						_this.slideTo(index);
					}
				} else {
					// cancel the click
					event.preventDefault();
				}
			}
		}, false);
	};

	this.handleSlideiOS = function (index) {
		var _this = this;
		this.config.slideNodes[index].addEventListener('touchend', function (event) {
			if (_this.config.carouselMode) {
				// check if there wasn't a recent gesture
				if (!_this.config.recentGesture) {
					// if the event was triggered on the active slide
					if (index === _this.config.activeSlide) {
						// find the url in the slide and open it
						var slideLinks = _this.config.slideNodes[_this.config.activeSlide].getElementsByTagName('a');
						// if there is just one link in the slide
						if (slideLinks.length === 1) {
							// open the link
							document.location.href = slideLinks[0].href;
						}
					} else {
						// show the indicated
						_this.slideTo(index);
					}
				} else {
					// cancel the click
					event.preventDefault();
				}
			}
		}, false);
	};
};

// extend the class
Gallery.prototype.Toolbar = function (parent) {

	// PROPERTIES

	this.parent = parent;
	this.config = parent.config;
	this.element = parent.element;

	// METHODS

	this.buildToolbar = function () {
		var a, b, newButton;
		// create the toolbar container
		this.config.toolbarContainer = document.createElement('menu');
		// add the element's properties
		this.config.toolbarContainer.className = 'gallery_toolbar';
		// define the toolbar elements
		this.config.toolbarElements = [];
		if (this.config.togglePrev) { this.config.toolbarElements.push([this.config.togglePrev, 'gallery_tool_previous']); }
		if (this.config.toggleNext) { this.config.toolbarElements.push([this.config.toggleNext, 'gallery_tool_next']); }
		if (this.config.toggleCarousel) { this.config.toolbarElements.push([this.config.toggleCarousel, 'gallery_tool_carousel']); }
		if (this.config.togglePinboard) { this.config.toolbarElements.push([this.config.togglePinboard, 'gallery_tool_pinboard']); }
		if (this.config.toggleFilter) { this.config.toolbarElements.push([this.config.toggleFilter, 'gallery_tool_filter']); }
		// add the defined controls
		for (a = 0 , b = this.config.toolbarElements.length; a < b; a += 1) {
			// if the element is defined
			if (this.config.toolbarElements[a][0] !== null) {
				// create the next button
				newButton = document.createElement('button');
				// add its properties
				newButton.innerHTML = this.config.toolbarElements[a][0];
				newButton.className = this.config.toolbarElements[a][1] + ' gallery_tool_enabled';
				// add the button to the menu
				this.config.toolbarContainer.appendChild(newButton);
			}
		}
		// insert into the component
		this.element.appendChild(this.config.toolbarContainer);
	};

	this.updateToolbar = function () {
		// if looping is turned off
		if (!this.config.allowLoop && this.config.previousButton && this.config.nextButton) {
			// if the first slide is active disable/enable the previous button
			this.config.previousButton.className = (this.config.activeSlide === 0) ? this.config.previousButton.className.replace(/gallery_tool_enabled/gi, 'gallery_tool_disabled') : this.config.previousButton.className.replace(/gallery_tool_disabled/gi, 'gallery_tool_enabled');
			// if the last slide is active
			this.config.nextButton.className = (this.config.activeSlide === this.config.slideNodes.length - 1) ? this.config.nextButton.className.replace(/gallery_tool_enabled/gi, 'gallery_tool_disabled') : this.config.nextButton.className.replace(/gallery_tool_disabled/gi, 'gallery_tool_enabled');
		}
	};

	this.toggleFilter = function (button) {
		// get the filter interface
		this.config.filterForm = this.config.filterForm || this.element.getElementsByTagName('form');
		if (this.config.filterForm.length > 0) {
			// if the filter is invisible
			if (this.config.filterForm[0].className.indexOf('gallery_filter_hide') > -1) {
				// reveal it
				button.parentNode.className = button.parentNode.className.replace('Passive', 'Active');
				transitions.byClass(this.config.filterForm[0], 'gallery_filter_hide', 'gallery_filter_show', null, null, null, null);
			// else
			} else {
				// hide it
				button.parentNode.className = button.parentNode.className.replace('Active', 'Passive');
				transitions.byClass(this.config.filterForm[0], 'gallery_filter_show', 'gallery_filter_hide', null, null, null, null);
			}
		}
	};

	this.transformToPinboard = function () {
		var _this = this;
		var a, b, resetScroll, cols, rows, rowHeight;
		// if the node is not already in pinboard mode, remember to reset the scroll position
		resetScroll = (this.config.carouselMode) ? true : false;
		// hide the slides to avoid glitches
		if (this.config.slideNodes.length > 0) {
			clearTimeout(this.config.transformTimeout);
			this.config.slideNodes[0].parentNode.style.visibility = 'hidden';
			this.config.transformTimeout = setTimeout(function () {
				_this.config.slideNodes[0].parentNode.style.visibility = 'visible';
			}, 1000);
		}
		// switch the classname of the parent
		transitions.byClass(this.element, 'gallery_mode_carousel', 'gallery_mode_pinboard');
		// change to pinboard mode
		this.config.carouselMode = false;
		// store the assigned column positions
		cols = this.config.pinboardNames.length - 1;
		// for all slides
		for (a = 0 , b = this.config.slideNodes.length; a < b; a += 1) {
			// replace the carousel styles with pinboard one
			transitions.byClass(
				this.config.slideNodes[a],
				this.config.carouselNames.join(' '),
				this.config.pinboardNames[a % cols]
			);
		}
		// update the vertical positions of the slides
		rows = [];
		for (a = 0 , b = this.config.slideNodes.length; a < b; a += 1) {
			// set the first values
			if (a < cols) {
				rows[a] = this.config.rowOffset + this.config.pinboardOffset;
			}
			// calculate the height to go with this slide
			rowHeight = this.config.slideNodes[a].offsetHeight + this.config.rowOffset;
			// set the proper vertical position for this mode
			this.config.slideNodes[a].style.top = rows[a % cols] + 'px';
			// update the total height
			rows[a % cols] += rowHeight;
		}
		// reset the scroll position
		if (resetScroll) {
			this.config.slideContainer.scrollTop = 0;
		}
		// get new slides to fill the scrollable section
		if (this.config.slideContainer.scrollHeight <= this.config.slideContainer.offsetHeight) {
			// ask for more slides
			this.parent.slides.loadSlides(this.config.slideNodes.length, this.config.fetchAmount);
		}
	};

	this.transformToCarousel = function () {
		var _this = this;
		var slideClassName;
		// reset the scroll position
		this.config.slideContainer.scrollTop = 0;
		// hide the slides to avoid glitches
		if (this.config.slideNodes.length > 0) {
			clearTimeout(this.config.transformTimeout);
			this.config.slideNodes[0].parentNode.style.visibility = 'hidden';
			this.config.transformTimeout = setTimeout(function () {
				_this.config.slideNodes[0].parentNode.style.visibility = 'visible';
			}, 1000);
		}
		// switch the classname op the parent
		transitions.byClass(this.element, 'gallery_mode_pinboard', 'gallery_mode_carousel');
		// change to carousel mode
		this.config.carouselMode = true;
		// for all slides
		for (var a = 0, b = this.config.slideNodes.length; a < b; a += 1) {
			// etermine the target class name
			slideClassName = (a + 2 < this.config.carouselNames.length) ? this.config.carouselNames[a + 2] : this.config.carouselNames[this.config.carouselNames.length - 1];
			// set the proper vertical position for this mode
			this.config.slideNodes[a].style.top = '50%';
			// replace the carousel styles with pinboard one
			transitions.byClass(
				this.config.slideNodes[a],
				this.config.pinboardNames.join(' '),
				slideClassName
			);
		}
		// restart the carousel
		this.config.activeSlide = 0;
		this.parent.updateAll();
	};

	this.handleFilters = function () {
		var a, b, filterForms, filterGroups, changeEvent;
		// get all the filter groups
		filterForms = this.element.getElementsByTagName('form');
		if (filterForms.length > 0) {
			// for the filter groups
			filterGroups = filterForms[0].getElementsByTagName('input');
			changeEvent = (navigator.userAgent.match(/msie/gi)) ? 'click' : 'change';
			for (a = 0 , b = filterGroups.length; a < b; a += 1) {
				// check the box by default
				filterGroups[a].checked = true;
				// add click event to all labels
				this.handleFilter(filterGroups[a], changeEvent);
			}
		}
	};

	this.handleFilter = function (filterGroup, changeEvent) {
		var _this = this;
		filterGroup['on' + changeEvent] = function () {
			_this.parent.resetAll();
		};
	};

	this.handleClicks = function () {
		var a, b, allButtons;
		// set the event handlers of the controls
		allButtons = this.config.toolbarContainer.getElementsByTagName('button');
		for (a = 0 , b = allButtons.length; a < b; a += 1) {
			this.handleClick(allButtons[a]);
		}
	};

	this.handleClick = function (button) {
		var _this = this;
		switch (button.className.split(' ')[0]) {
		case 'gallery_tool_previous' :
			// store the button
			this.config.previousButton = button;
			// add the event handler
			button.onclick = function () {
				if (!_this.config.animationInProgress) {
					_this.parent.slides.slideBy(-1);
				}
				// cancel the click event
				return false;
			};
			break;
		case 'gallery_tool_next' :
			// store the button
			this.config.nextButton = button;
			// add the event handler
			button.onclick = function () {
				if (!_this.config.animationInProgress) {
					_this.parent.slides.slideBy(1);
				}
				// cancel the click event
				return false;
			};
			break;
		case 'gallery_tool_pinboard' :
			// store the button
			this.config.pinboardButton = button;
			// add the event handler
			button.onclick = function () {
				_this.transformToPinboard();
				// cancel the click event
				return false;
			};
			break;
		case 'gallery_tool_carousel' :
			// store the button
			this.config.carouselButton = button;
			// add the event handler
			button.onclick = function () {
				_this.transformToCarousel();
				// cancel the click event
				return false;
			};
			break;
		case 'gallery_tool_filter' :
			// store the button
			this.config.filterButton = button;
			// add the event handler
			button.onclick = function () {
				// handle the event
				_this.toggleFilter(button);
				// cancel the click event
				return false;
			};
			break;
		}
	};

	this.handleClicksiOS = function () {
		var a, b, allButtons;
		// set the event handlers of the controls
		allButtons = this.config.toolbarContainer.getElementsByTagName('button');
		for (a = 0 , b = allButtons.length; a < b; a += 1) {
			this.handleClickiOS(allButtons[a]);
		}
	};

	this.handleClickiOS = function (button) {
		var _this = this;
		switch (button.className.split(' ')[0]) {
		case 'gallery_tool_previous' :
			// store the button
			this.config.previousButton = button;
			// add the event handler
			button.ontouchend = function (event) {
				if (!_this.config.animationInProgress) {
					_this.parent.slides.slideBy(-1);
				}
				// cancel the default browser behaviour
				event.preventDefault();
			};
			break;
		case 'gallery_tool_next' :
			// store the button
			this.config.nextButton = button;
			// add the event handler
			button.ontouchend = function (event) {
				if (!_this.config.animationInProgress) {
					_this.parent.slides.slideBy(1);
				}
				// cancel the default browser behaviour
				event.preventDefault();
			};
			break;
		case 'gallery_tool_pinboard' :
			// store the button
			this.config.pinboardButton = button;
			// add the event handler
			button.ontouchend = function (event) {
				_this.transformToPinboard();
				// cancel the default browser behaviour
				event.preventDefault();
			};
			break;
		case 'gallery_tool_carousel' :
			// store the button
			this.config.carouselButton = button;
			// add the event handler
			button.ontouchend = function (event) {
				_this.transformToCarousel();
				// cancel the default browser behaviour
				event.preventDefault();
			};
			break;
		case 'gallery_tool_filter' :
			// store the button
			this.config.filterButton = button;
			// add the event handler
			button.ontouchend = function (event) {
				// handle the event
				_this.toggleFilter(button);
				// cancel the click event
				event.preventDefault();
			};
			break;
		}
	};
};
