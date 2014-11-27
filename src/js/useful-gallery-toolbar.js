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
useful.Gallery.prototype.Toolbar = function (parent) {
	// properties
	"use strict";
	this.parent = parent;
	this.cfg = parent.cfg;
	this.obj = parent.obj;
	// methods
	this.buildToolbar = function () {
		var a, b, newButton;
		// create the toolbar container
		this.cfg.toolbarContainer = document.createElement('menu');
		// add the element's properties
		this.cfg.toolbarContainer.className = 'gallery_toolbar';
		// define the toolbar elements
		this.cfg.toolbarElements = [];
		if (this.cfg.togglePrev) { this.cfg.toolbarElements.push([this.cfg.togglePrev, 'gallery_tool_previous']); }
		if (this.cfg.toggleNext) { this.cfg.toolbarElements.push([this.cfg.toggleNext, 'gallery_tool_next']); }
		if (this.cfg.toggleCarousel) { this.cfg.toolbarElements.push([this.cfg.toggleCarousel, 'gallery_tool_carousel']); }
		if (this.cfg.togglePinboard) { this.cfg.toolbarElements.push([this.cfg.togglePinboard, 'gallery_tool_pinboard']); }
		if (this.cfg.toggleFilter) { this.cfg.toolbarElements.push([this.cfg.toggleFilter, 'gallery_tool_filter']); }
		// add the defined controls
		for (a = 0 , b = this.cfg.toolbarElements.length; a < b; a += 1) {
			// if the element is defined
			if (this.cfg.toolbarElements[a][0] !== null) {
				// create the next button
				newButton = document.createElement('button');
				// add its properties
				newButton.innerHTML = this.cfg.toolbarElements[a][0];
				newButton.className = this.cfg.toolbarElements[a][1] + ' gallery_tool_enabled';
				// add the button to the menu
				this.cfg.toolbarContainer.appendChild(newButton);
			}
		}
		// insert into the component
		this.obj.appendChild(this.cfg.toolbarContainer);
	};
	this.updateToolbar = function () {
		// if looping is turned off
		if (!this.cfg.allowLoop && this.cfg.previousButton && this.cfg.nextButton) {
			// if the first slide is active disable/enable the previous button
			this.cfg.previousButton.className = (this.cfg.activeSlide === 0) ? this.cfg.previousButton.className.replace(/gallery_tool_enabled/gi, 'gallery_tool_disabled') : this.cfg.previousButton.className.replace(/gallery_tool_disabled/gi, 'gallery_tool_enabled');
			// if the last slide is active
			this.cfg.nextButton.className = (this.cfg.activeSlide === this.cfg.slideNodes.length - 1) ? this.cfg.nextButton.className.replace(/gallery_tool_enabled/gi, 'gallery_tool_disabled') : this.cfg.nextButton.className.replace(/gallery_tool_disabled/gi, 'gallery_tool_enabled');
		}
	};
	this.toggleFilter = function (button) {
		// get the filter interface
		this.cfg.filterForm = this.cfg.filterForm || this.obj.getElementsByTagName('form');
		if (this.cfg.filterForm.length > 0) {
			// if the filter is invisible
			if (this.cfg.filterForm[0].className.indexOf('gallery_filter_hide') > -1) {
				// reveal it
				button.parentNode.className = button.parentNode.className.replace('Passive', 'Active');
				useful.transitions.byClass(this.cfg.filterForm[0], 'gallery_filter_hide', 'gallery_filter_show', null, null, null, null);
			// else
			} else {
				// hide it
				button.parentNode.className = button.parentNode.className.replace('Active', 'Passive');
				useful.transitions.byClass(this.cfg.filterForm[0], 'gallery_filter_show', 'gallery_filter_hide', null, null, null, null);
			}
		}
	};
	this.transformToPinboard = function () {
		var _this = this;
		var a, b, resetScroll, cols, rows, rowHeight;
		// if the node is not already in pinboard mode, remember to reset the scroll position
		resetScroll = (this.cfg.carouselMode) ? true : false;
		// hide the slides to avoid glitches
		if (this.cfg.slideNodes.length > 0) {
			clearTimeout(this.cfg.transformTimeout);
			this.cfg.slideNodes[0].parentNode.style.visibility = 'hidden';
			this.cfg.transformTimeout = setTimeout(function () {
				_this.cfg.slideNodes[0].parentNode.style.visibility = 'visible';
			}, 1000);
		}
		// switch the classname of the parent
		useful.transitions.byClass(this.obj, 'gallery_mode_carousel', 'gallery_mode_pinboard');
		// change to pinboard mode
		this.cfg.carouselMode = false;
		// store the assigned column positions
		cols = this.cfg.pinboardNames.length - 1;
		// for all slides
		for (a = 0 , b = this.cfg.slideNodes.length; a < b; a += 1) {
			// replace the carousel styles with pinboard one
			useful.transitions.byClass(
				this.cfg.slideNodes[a],
				this.cfg.carouselNames.join(' '),
				this.cfg.pinboardNames[a % cols]
			);
		}
		// update the vertical positions of the slides
		rows = [];
		for (a = 0 , b = this.cfg.slideNodes.length; a < b; a += 1) {
			// set the first values
			if (a < cols) {
				rows[a] = this.cfg.rowOffset + this.cfg.pinboardOffset;
			}
			// calculate the height to go with this slide
			rowHeight = this.cfg.slideNodes[a].offsetHeight + this.cfg.rowOffset;
			// set the proper vertical position for this mode
			this.cfg.slideNodes[a].style.top = rows[a % cols] + 'px';
			// update the total height
			rows[a % cols] += rowHeight;
		}
		// reset the scroll position
		if (resetScroll) {
			this.cfg.slideContainer.scrollTop = 0;
		}
		// get new slides to fill the scrollable section
		if (this.cfg.slideContainer.scrollHeight <= this.cfg.slideContainer.offsetHeight) {
			// ask for more slides
			this.parent.slides.loadSlides(this.cfg.slideNodes.length, this.cfg.fetchAmount);
		}
	};
	this.transformToCarousel = function () {
		var _this = this;
		var slideClassName;
		// reset the scroll position
		this.cfg.slideContainer.scrollTop = 0;
		// hide the slides to avoid glitches
		if (this.cfg.slideNodes.length > 0) {
			clearTimeout(this.cfg.transformTimeout);
			this.cfg.slideNodes[0].parentNode.style.visibility = 'hidden';
			this.cfg.transformTimeout = setTimeout(function () {
				_this.cfg.slideNodes[0].parentNode.style.visibility = 'visible';
			}, 1000);
		}
		// switch the classname op the parent
		useful.transitions.byClass(this.obj, 'gallery_mode_pinboard', 'gallery_mode_carousel');
		// change to carousel mode
		this.cfg.carouselMode = true;
		// for all slides
		for (var a = 0, b = this.cfg.slideNodes.length; a < b; a += 1) {
			// etermine the target class name
			slideClassName = (a + 2 < this.cfg.carouselNames.length) ? this.cfg.carouselNames[a + 2] : this.cfg.carouselNames[this.cfg.carouselNames.length - 1];
			// set the proper vertical position for this mode
			this.cfg.slideNodes[a].style.top = '50%';
			// replace the carousel styles with pinboard one
			useful.transitions.byClass(
				this.cfg.slideNodes[a],
				this.cfg.pinboardNames.join(' '),
				slideClassName
			);
		}
		// restart the carousel
		this.cfg.activeSlide = 0;
		this.parent.updateAll();
	};
	this.handleFilters = function () {
		var a, b, filterForms, filterGroups, changeEvent;
		// get all the filter groups
		filterForms = this.obj.getElementsByTagName('form');
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
		allButtons = this.cfg.toolbarContainer.getElementsByTagName('button');
		for (a = 0 , b = allButtons.length; a < b; a += 1) {
			this.handleClick(allButtons[a]);
		}
	};
	this.handleClick = function (button) {
		var _this = this;
		switch (button.className.split(' ')[0]) {
		case 'gallery_tool_previous' :
			// store the button
			this.cfg.previousButton = button;
			// add the event handler
			button.onclick = function () {
				if (!_this.cfg.animationInProgress) {
					_this.parent.slides.slideBy(-1);
				}
				// cancel the click event
				return false;
			};
			break;
		case 'gallery_tool_next' :
			// store the button
			this.cfg.nextButton = button;
			// add the event handler
			button.onclick = function () {
				if (!_this.cfg.animationInProgress) {
					_this.parent.slides.slideBy(1);
				}
				// cancel the click event
				return false;
			};
			break;
		case 'gallery_tool_pinboard' :
			// store the button
			this.cfg.pinboardButton = button;
			// add the event handler
			button.onclick = function () {
				_this.transformToPinboard();
				// cancel the click event
				return false;
			};
			break;
		case 'gallery_tool_carousel' :
			// store the button
			this.cfg.carouselButton = button;
			// add the event handler
			button.onclick = function () {
				_this.transformToCarousel();
				// cancel the click event
				return false;
			};
			break;
		case 'gallery_tool_filter' :
			// store the button
			this.cfg.filterButton = button;
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
		allButtons = this.cfg.toolbarContainer.getElementsByTagName('button');
		for (a = 0 , b = allButtons.length; a < b; a += 1) {
			this.handleClickiOS(allButtons[a]);
		}
	};
	this.handleClickiOS = function (button) {
		var _this = this;
		switch (button.className.split(' ')[0]) {
		case 'gallery_tool_previous' :
			// store the button
			this.cfg.previousButton = button;
			// add the event handler
			button.ontouchend = function (event) {
				if (!_this.cfg.animationInProgress) {
					_this.parent.slides.slideBy(-1);
				}
				// cancel the default browser behaviour
				event.preventDefault();
			};
			break;
		case 'gallery_tool_next' :
			// store the button
			this.cfg.nextButton = button;
			// add the event handler
			button.ontouchend = function (event) {
				if (!_this.cfg.animationInProgress) {
					_this.parent.slides.slideBy(1);
				}
				// cancel the default browser behaviour
				event.preventDefault();
			};
			break;
		case 'gallery_tool_pinboard' :
			// store the button
			this.cfg.pinboardButton = button;
			// add the event handler
			button.ontouchend = function (event) {
				_this.transformToPinboard();
				// cancel the default browser behaviour
				event.preventDefault();
			};
			break;
		case 'gallery_tool_carousel' :
			// store the button
			this.cfg.carouselButton = button;
			// add the event handler
			button.ontouchend = function (event) {
				_this.transformToCarousel();
				// cancel the default browser behaviour
				event.preventDefault();
			};
			break;
		case 'gallery_tool_filter' :
			// store the button
			this.cfg.filterButton = button;
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

// return as a require.js module
if (typeof module !== 'undefined') {
	exports = module.exports = useful.Gallery.Toolbar;
}
