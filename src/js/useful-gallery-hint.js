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
useful.Gallery.prototype.Hint = function (parent) {
	// properties
	"use strict";
	this.parent = parent;
	this.config = parent.config;
	this.element = parent.element;
	// methods
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

// return as a require.js module
if (typeof module !== 'undefined') {
	exports = module.exports = useful.Gallery.Hint;
}
