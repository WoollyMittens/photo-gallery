/*
	Source:
	van Creij, Maurice (2014). "useful.this.js: An scrolling content this.", version 20141127, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/

// create the constructor if needed
var useful = useful || {};
useful.Gallery = useful.Gallery || function () {};

// extend the constructor
useful.Gallery.prototype.Main = function (config, context) {
	// properties
	"use strict";
	this.config = config;
	this.context = context;
	this.element = config.element;
	// methods
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
	// components
	this.toolbar = new this.context.Toolbar(this);
	this.slides = new this.context.Slides(this);
	this.progress = new this.context.Progress(this);
	this.pager = new this.context.Pager(this);
	this.hint = new this.context.Hint(this);
	// events
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
		// events to cancel the timer
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
};

// return as a require.js module
if (typeof module !== 'undefined') {
	exports = module.exports = useful.Gallery.Main;
}
