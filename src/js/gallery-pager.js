// extend the class
Gallery.prototype.Pager = function (parent) {

	// PROPERTIES

	this.parent = parent;
	this.config = parent.config;
	this.element = parent.element;

	// METHODS

	this.buildPager = function () {
		// build the page indicators
		this.config.pagerContainer = document.createElement('menu');
		this.config.pagerContainer.className = 'gallery_pager';
		this.element.appendChild(this.config.pagerContainer);
	};

	this.loadPager = function () {
		var _this = this;
		var fetchURL;
		// get the url for the ajax call
		fetchURL = this.element.getElementsByTagName('form')[0].getAttribute('action');
		fetchURL += '&inf=1&grp=' + this.config.activeFilterGroup.join(',');
		// formulate the ajax call
		requests.send({
			url : fetchURL,
			post : null,
			onProgress : function () {},
			onFailure : function () {},
			onSuccess : function (reply) { _this.fillPager(reply); }
		});
	};

	this.fillPager = function (reply) {
		var a, b, parent, fetchedPager, newPagerElement, newPagerLink;
		// shortcut pointers
		parent = reply.referer;
		fetchedPager = [];
		// decode the JSON string
		fetchedPager = requests.decode(reply.responseText);
		// empty the pager
		this.config.pagerContainer.innerHTML = '';
		// for all pages reported
		for (a = 0 , b = fetchedPager[fetchedPager.length - 1] + 1; a < b; a += 1) {
			// create a new pager element
			newPagerElement = document.createElement('li');
			// create a new pager link
			newPagerLink = document.createElement('a');
			// fill with a page number or a custom label
			newPagerLink.innerHTML = (this.config.pagerLabels !== null && a < this.config.pagerLabels.length) ? this.config.pagerLabels[a] : a + 1;
			// add the link to the pager element
			newPagerElement.appendChild(newPagerLink);
			// add the pager element to the pager container
			this.config.pagerContainer.appendChild(newPagerElement);
			// set the link target
			newPagerLink.setAttribute('href', '#gallery_slide_' + a);
			newPagerLink.setAttribute('id', 'gallery_page_' + a);
			// add the event handler
			if (this.config.onMobile) {
				this.handlePageriOS(a, newPagerLink);
			// else
			} else {
				this.handlePager(a, newPagerLink);
			}
		}
		// update the pager to the initial state
		this.updatePager();
	};

	this.updatePager = function () {
		var a, b, childNodes;
		// get the slides from the container
		childNodes = this.config.pagerContainer.getElementsByTagName('a');
		// for all pager elements in the container
		for (a = 0 , b = childNodes.length; a < b; a += 1) {
			// highlight or reset the element
			if (a < this.config.slideNodes.length) {
				childNodes[a].parentNode.className = (a === this.config.activeSlide) ? 'gallery_pager_active' : 'gallery_pager_link';
			} else {
				childNodes[a].parentNode.className = 'gallery_pager_passive';
			}
		}
		// hide the pager if it's not wanted
		if (!this.config.togglePager) {
			this.config.pagerContainer.style.visibility = 'hidden';
		}
	};

	this.handlePager = function (a, newPagerLink) {
		var _this = this;
		newPagerLink.onclick = function () {
			// handle the event
			if (!_this.config.animationInProgress && newPagerLink.parentNode.className.match(/gallery_pager_link/gi)) {
				_this.parent.slides.slideTo(a);
			}
			// cancel the click
			return false;
		};
	};

	this.handlePageriOS = function (a, newPagerLink) {
		var _this = this;
		newPagerLink.ontouchend = function () {
			// handle the event
			if (!_this.config.animationInProgress && newPagerLink.parentNode.className.match(/gallery_pager_link/gi)) {
				_this.parent.slides.slideTo(a);
			}
			// cancel the click
			return false;
		};
	};
};
