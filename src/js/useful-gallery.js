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
useful.Gallery.prototype.init = function (cfg) {
	// properties
	"use strict";
	this.cfg = cfg;
	this.obj = cfg.element;
	// methods
	this.start = function () {
		// if the component is not already active
		if (!this.cfg.isActive) {
			// mark this node as active
			this.cfg.isActive = true;
			// set the default mode
			this.obj.className += ' gallery_mode_carousel';
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
			if (this.cfg.onMobile) {
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
			if (this.cfg.allowAjax) {
				// order the first batch of slides
				setTimeout(function () {
					// load the first batch
					_this.slides.loadSlides(_this.cfg.activeSlide, _this.cfg.fetchAmount);
					// load the pager
					_this.pager.loadPager();
				}, 200);
			}
			// build the pager based on the slides that are already there
			this.pager.fillPager({'responseText' : '[' + (this.cfg.slideNodes.length - 1) + ']'});
			// update the slides that are already there
			this.updateAll();
		}
		// disable the start function so it can't be started twice
		this.start = function () {};
	};
	this.defaultSettings = function () {
		// EXTERNAL SETTINGS
		// defines the aspect ratio of the gallery - 4:3 would be 0.75
		this.cfg.aspectRatio = this.cfg.aspectRatio || 1;
		// the script will cycle through these classes, the number is not limited
		this.cfg.carouselNames = this.cfg.carouselNames || ['gallery_carousel_farleft', 'gallery_carousel_left', 'gallery_carousel_centre', 'gallery_carousel_right', 'gallery_carousel_farright'];
		// the script alternates between these classes to divide the slides across columns
		this.cfg.pinboardNames = this.cfg.pinboardNames || ['gallery_pinboard_left', 'gallery_pinboard_right', 'gallery_pinboard_loading'];
		// default behaviour is to show numbers
		this.cfg.pagerLabels = this.cfg.pagerLabels || ['Lorem', 'Ipsum', 'Dolor', 'Sit', 'Amet'];
		// distance between rows of slides in pin board mode
		this.cfg.rowOffset = this.cfg.rowOffset || 18;
		this.cfg.pinboardOffset = this.cfg.pinboardOffset || 0;
		// distance from the bottom of the pin board where new slides will be loaded if AJAX is enabled
		this.cfg.fetchScrollBottom = this.cfg.fetchScrollBottom || 100;
		// how far from the unloaded slides preloading should commence
		this.cfg.fetchTreshold = this.cfg.fetchTreshold || 3;
		// how many slides to get in one go
		this.cfg.fetchAmount = this.cfg.fetchAmount || 5;
		// don't accept new input until the animation finished
		this.cfg.limitSpeed = this.cfg.limitSpeed || true;
		// immediately cycle to the first slide after reaching the last
		this.cfg.allowLoop = this.cfg.allowLoop || false;
		// wait this long until starting the automatic slideshow
		this.cfg.idleDelay = this.cfg.idleDelay || 8000;
		// direction to show the slides in
		this.cfg.idleDirection = this.cfg.idleDirection || 1; // -1 | 1
		// what interface elements to show
		this.cfg.toggleHint = this.cfg.toggleHint || true; // true | false
		this.cfg.togglePager = this.cfg.togglePager || true; // true | false
		this.cfg.toggleFilter = this.cfg.toggleFilter || 'Filter'; // string | true | false
		this.cfg.togglePinboard = this.cfg.togglePinboard || 'View Pin Board'; // string | true | false
		this.cfg.toggleCarousel = this.cfg.toggleCarousel || 'View Carousel'; // string | true | false
		this.cfg.toggleNext = this.cfg.toggleNext || 'Next Slide'; // string | true | false
		this.cfg.togglePrev = this.cfg.togglePrev || 'Previous Slide'; // string | true | false
		// how mobile devices are identified to enable touch controls
		this.cfg.onMobile = this.cfg.onMobile || (navigator.userAgent.indexOf('Mobile') > -1);
		// INTERNAL SETTINGS
		// store the starting index
		this.cfg.activeSlide = 0;
		// set the initial keywords
		this.cfg.activeFilterGroup = [];
		// store the initial mode
		this.cfg.carouselMode = (this.obj.className.indexOf('gallery_mode_carousel') > -1);
		this.cfg.allowAjax = this.cfg.allowAjax || (this.obj.getElementsByTagName('form').length > 0);
		// report animations in progress
		this.cfg.animationInProgress = false;
		// report AJAX fetches in progress
		this.cfg.fetchInProgress = false;
		// report that slides have not run out yet
		this.cfg.noSlidesLeft = false;
		// indicator for interferance of gestures
		this.cfg.recentGesture = false;
	};
	this.updateAll = function () {
		// re-implement the aspect ratio
		this.obj.style.height = parseInt(this.obj.offsetWidth * this.cfg.aspectRatio, 10) + 'px';
		// update the components
		this.pager.updatePager();
		this.slides.updateSlides();
		this.toolbar.updateToolbar();
	};
	this.resetAll = function () {
		// restore the global parameters to the default situation
		this.cfg.activeSlide = 0;
		this.cfg.slideNodes = [];
		this.cfg.fetchInProgress = false;
		this.cfg.fetchInProgress = false;
		this.cfg.noSlidesLeft = false;
		// empty the current set of slides
		this.cfg.slideContainer.innerHTML = '';
		// get the slides that match the filter
		this.slides.loadSlides(0, 3);
	};
	// components
	this.toolbar = new this.Toolbar(this);
	this.slides = new this.Slides(this);
	this.progress = new this.Progress(this);
	this.pager = new this.Pager(this);
	this.hint = new this.Hint(this);
	// events
	this.handleResize = function () {
		var _this = this;
		window.addEventListener('resize', function () {
			_this.updateAll();
		}, false);
	};
	this.handleGestures = function () {
		var _this = this;
		this.cfg.startX = null;
		this.obj.onmousedown = function (event) {
			event = event || window.event;
			if (_this.cfg.carouselMode) {
				_this.cfg.startX = (navigator.userAgent.indexOf('MSIE ') > -1) ? event.x : event.screenX;
				// cancel the click event
				return false;
			}
		};
		this.obj.onmousemove = function (event) {
			event = event || window.event;
			if (_this.cfg.carouselMode) {
				if (_this.cfg.startX !== null) {
					var increment;
					// lock the click events
					_this.cfg.recentGesture = true;
					_this.cfg.endX = (navigator.userAgent.indexOf('MSIE ') > -1) ? event.x : event.screenX;
					// if the distance has been enough
					if (Math.abs(_this.cfg.endX - _this.cfg.startX) > _this.obj.offsetWidth / 4) {
						// move one increment
						increment = (_this.cfg.endX - _this.cfg.startX < 0) ? 1 : -1;
						if (!_this.cfg.animationInProgress) {
							_this.slides.slideBy(increment);
						}
						// reset the positions
						_this.cfg.startX = _this.cfg.endX;
					}
					// cancel the click event
					return false;
				}
			}
		};
		this.obj.onmouseup = function (event) {
			event = event || window.event;
			if (_this.cfg.carouselMode) {
				// cancel the gesture
				_this.cfg.endX = null;
				_this.cfg.startX = null;
				setTimeout(function () { _this.cfg.recentGesture = false; }, 100);
				// cancel the click event
				return false;
			}
		};
		this.obj.addEventListener('mouseout', function (event) {
			event = event || window.event;
			if (_this.cfg.carouselMode) {
				// whipe the gesture if the mouse remains out of bounds
				_this.cfg.timeOut = setTimeout(function () {
					_this.cfg.endX = null;
					_this.cfg.startX = null;
				}, 100);
				// cancel the click event
				event.preventDefault();
			}
		}, false);
		this.obj.addEventListener('mouseover', function (event) {
			event = event || window.event;
			if (_this.cfg.carouselMode) {
				// stop the gesture from resetting when the mouse goes back in bounds
				clearTimeout(_this.cfg.timeOut);
				// cancel the click event
				event.preventDefault();
			}
		}, false);
	};
	this.handleGesturesiOS = function () {
		var _this = this;
		this.cfg.touchStartX = null;
		this.cfg.touchStartY = null;
		this.obj.addEventListener('touchstart', function (event) {
			if (_this.cfg.carouselMode) {
				_this.cfg.touchStartX = event.touches[0].pageX;
				_this.cfg.touchStartY = event.touches[0].pageY;
			}
		}, false);
		this.obj.addEventListener('touchmove', function (event) {
			if (_this.cfg.carouselMode) {
				if (_this.cfg.touchStartX !== null) {
					// lock the click events
					_this.cfg.recentGesture = true;
					_this.cfg.touchEndX = event.touches[0].pageX;
					_this.cfg.touchEndY = event.touches[0].pageY;
					// if the distance has been enough
					if (Math.abs(_this.cfg.touchEndX - _this.cfg.touchStartX) > _this.obj.offsetWidth / 4) {
						// move one increment
						var increment = (_this.cfg.touchEndX - _this.cfg.touchStartX < 0) ? 1 : -1;
						if (!_this.cfg.animationInProgress) {
							_this.slides.slideBy(increment);
						}
						// reset the positions
						_this.cfg.touchStartX = _this.cfg.touchEndX;
					}
					// cancel the default browser behaviour if there was horizontal motion
					if (Math.abs(_this.cfg.touchEndX - _this.cfg.touchStartX) > Math.abs(_this.cfg.touchEndY - _this.cfg.touchStartY)) {
						event.preventDefault();
					}
				}
			}
		}, false);
		this.obj.eventListener('touchend', function () {
			if (_this.cfg.carouselMode) {
				// cancel the gesture
				_this.cfg.touchEndX = null;
				_this.cfg.touchStartX = null;
				_this.cfg.touchEndY = null;
				_this.cfg.touchStartY = null;
				setTimeout(function () { _this.cfg.recentGesture = false; }, 100);
			}
		}, false);
		this.obj.addEventListener('touchcancel', function (event) {
			if (_this.cfg.carouselMode) {
				// cancel the gesture
				_this.cfg.touchEndX = null;
				_this.cfg.touchStartX = null;
				_this.cfg.touchEndY = null;
				_this.cfg.touchStartY = null;
				setTimeout(function () { _this.cfg.recentGesture = false; }, 100);
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
			if (_this.cfg.carouselMode) {
				// scroll the page
				if (!_this.cfg.animationInProgress) {
					_this.slides.slideBy(increment);
				}
				// cancel the click event
				event.preventDefault();
			}
		};
		var onLoadSlides = function () {
			// if the scroll position is close to the scroll height
			if (_this.cfg.slideContainer.scrollHeight - _this.cfg.slideContainer.offsetHeight - _this.cfg.slideContainer.scrollTop < _this.cfg.fetchScrollBottom) {
				// ask for more slides
				_this.slides.loadSlides(_this.cfg.slideNodes.length, _this.cfg.fetchAmount);
			}
		};
		this.obj.addEventListener('mousewheel', onMoveSlides, false);
		this.obj.addEventListener('DOMMouseScroll', onMoveSlides, false);
		this.cfg.slideContainer.addEventListener('scroll', onLoadSlides, false);
	};
	this.handleIdle = function () {
		var _this = this;
		// timer constant
		this.cfg.idleTimer = null;
		this.cfg.idleLoop = this.cfg.allowLoop;
		// events to cancel the timer
		this.obj.addEventListener('mouseout', function () {
			// allow looping
			_this.cfg.allowLoop = true;
			// a set the automatic gallery to start after while
			if (_this.cfg.idleDelay > -1) {
				clearInterval(_this.cfg.idleTimer);
				_this.cfg.idleTimer = setInterval(function () {
					if (_this.cfg.carouselMode) {
						_this.slides.slideBy(_this.cfg.idleDirection);
					}
				}, _this.cfg.idleDelay);
			}
		}, false);
		this.obj.addEventListener('mouseover', function () {
			// restore looping setting
			_this.cfg.allowLoop = _this.cfg.idleLoop;
			// cancel the automatic gallery
			clearInterval(_this.cfg.idleTimer);
		}, false);
		// a set the automatic gallery to start after while
		if (this.cfg.idleDelay > -1) {
			clearInterval(this.cfg.idleTimer);
			this.cfg.idleTimer = setInterval(function () {
				if (_this.cfg.carouselMode) {
					_this.slides.slideBy(_this.cfg.idleDirection);
				}
			}, this.cfg.idleDelay);
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
		this.cfg.allowLoop = this.cfg.idleLoop;
		// cancel the automatic gallery
		clearInterval(this.cfg.idleTimer);
	};
	this.play = function () {
		var _this = this;
		// allow looping
		this.cfg.allowLoop = true;
		// a set the automatic gallery to start after while
		if (this.cfg.idleDelay > -1) {
			clearInterval(this.cfg.idleTimer);
			this.cfg.idleTimer = setInterval(function () {
				if (_this.cfg.carouselMode) {
					_this.slides.slideBy(_this.cfg.idleDirection);
				}
			}, this.cfg.idleDelay);
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
	// go
	this.start();
};

// return as a require.js module
if (typeof module !== 'undefined') {
	exports = module.exports = useful.Gallery;
}
