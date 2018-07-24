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
