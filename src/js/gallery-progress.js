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
