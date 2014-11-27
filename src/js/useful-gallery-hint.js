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
	this.cfg = parent.cfg;
	this.obj = parent.obj;
	// methods
	this.buildHint = function () {
		// if the hint is enabled
		if (this.cfg.toggleHint) {
			// create an element for the invitation
			this.cfg.hintElement = document.createElement('div');
			this.cfg.hintElement.className = 'gallery_hint';
			// add the element to the slideshow
			this.obj.appendChild(this.cfg.hintElement);
			// a a status class to the parent element
			this.obj.className += ' gallery_interface_hidden';
			// on the mobile version
			if (this.cfg.onMobile) {
				// set its event handler
				this.handleHintiOS();
			}
		}
	};
	this.handleHintiOS = function () {
		var _this = this;
		this.obj.addEventListener('touchend', function () {
			// show the interface
			_this.obj.className = _this.obj.className.replace(/gallery_interface_hidden/gi, 'gallery_interface_visible');
		}, false);
	};
};

// return as a require.js module
if (typeof module !== 'undefined') {
	exports = module.exports = useful.Gallery.Hint;
}
