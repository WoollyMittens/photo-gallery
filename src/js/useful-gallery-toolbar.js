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

	// PROPERTIES
	
	"use strict";
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
				useful.transitions.byClass(this.config.filterForm[0], 'gallery_filter_hide', 'gallery_filter_show', null, null, null, null);
			// else
			} else {
				// hide it
				button.parentNode.className = button.parentNode.className.replace('Active', 'Passive');
				useful.transitions.byClass(this.config.filterForm[0], 'gallery_filter_show', 'gallery_filter_hide', null, null, null, null);
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
		useful.transitions.byClass(this.element, 'gallery_mode_carousel', 'gallery_mode_pinboard');
		// change to pinboard mode
		this.config.carouselMode = false;
		// store the assigned column positions
		cols = this.config.pinboardNames.length - 1;
		// for all slides
		for (a = 0 , b = this.config.slideNodes.length; a < b; a += 1) {
			// replace the carousel styles with pinboard one
			useful.transitions.byClass(
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
		useful.transitions.byClass(this.element, 'gallery_mode_pinboard', 'gallery_mode_carousel');
		// change to carousel mode
		this.config.carouselMode = true;
		// for all slides
		for (var a = 0, b = this.config.slideNodes.length; a < b; a += 1) {
			// etermine the target class name
			slideClassName = (a + 2 < this.config.carouselNames.length) ? this.config.carouselNames[a + 2] : this.config.carouselNames[this.config.carouselNames.length - 1];
			// set the proper vertical position for this mode
			this.config.slideNodes[a].style.top = '50%';
			// replace the carousel styles with pinboard one
			useful.transitions.byClass(
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

// return as a require.js module
if (typeof module !== 'undefined') {
	exports = module.exports = useful.Gallery.Toolbar;
}
