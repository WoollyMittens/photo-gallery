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
useful.Gallery.prototype.Progress = function (parent) {
	// properties
	"use strict";
	this.parent = parent;
	this.config = parent.config;
	this.element = parent.element;
	// methods
	this.buildProgressIndicator = function () {
		// create the indicator element
		this.config.progressIndicator = document.createElement('div');
		// add the element's properties
		this.config.progressIndicator.className = 'gallery_busy';
		// insert it into the component
		this.element.appendChild(this.config.progressIndicator);
	};
};

// return as a require.js module
if (typeof module !== 'undefined') {
	exports = module.exports = useful.Gallery.Progress;
}
