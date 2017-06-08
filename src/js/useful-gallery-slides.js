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
useful.Gallery.prototype.Slides = function (parent) {

	// PROPERTIES

	"use strict";
	this.parent = parent;
	this.config = parent.config;
	this.element = parent.element;

	// METHODS

	this.buildSlideContainer = function () {
		var a, b, movedSlide;
		// get all the slides
		this.config.slideNodes = useful.transitions.select('figure, article', this.element);
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
				useful.request.send({
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
			fetchedSlides = useful.request.decode(reply.responseText);
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
		this.config.slideNodes = useful.transitions.select('figure, article', this.config.slideContainer);
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
					useful.transitions.byClass(
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
				useful.transitions.byClass(
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

// return as a require.js module
if (typeof module !== 'undefined') {
	exports = module.exports = useful.Gallery.Slides;
}
