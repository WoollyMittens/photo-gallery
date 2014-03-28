/*
	Source:
	van Creij, Maurice (2012). "useful.polyfills.js: A library of useful polyfills to ease working with HTML5 in legacy environments.", version 20121126, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/

(function (useful) {

	// Invoke strict mode
	"use strict";

	// private functions
	var polyfills = polyfills || {};

	// enabled the use of HTML5 elements in Internet Explorer
	polyfills.html5 = function () {
		var a, b, elementsList;
		elementsList = ['section', 'nav', 'article', 'aside', 'hgroup', 'header', 'footer', 'dialog', 'mark', 'dfn', 'time', 'progress', 'meter', 'ruby', 'rt', 'rp', 'ins', 'del', 'figure', 'figcaption', 'video', 'audio', 'source', 'canvas', 'datalist', 'keygen', 'output', 'details', 'datagrid', 'command', 'bb', 'menu', 'legend'];
		if (navigator.userAgent.match(/msie/gi)) {
			for (a = 0 , b = elementsList.length; a < b; a += 1) {
				document.createElement(elementsList[a]);
			}
		}
	};

	// allow array.indexOf in older browsers
	polyfills.arrayIndexOf = function () {
		if (!Array.prototype.indexOf) {
			Array.prototype.indexOf = function (obj, start) {
				for (var i = (start || 0), j = this.length; i < j; i += 1) {
					if (this[i] === obj) { return i; }
				}
				return -1;
			};
		}
	};

	// allow document.querySelectorAll (https://gist.github.com/connrs/2724353)
	polyfills.querySelectorAll = function () {
		if (!document.querySelectorAll) {
			document.querySelectorAll = function (a) {
				var b = document, c = b.documentElement.firstChild, d = b.createElement("STYLE");
				return c.appendChild(d), b.__qsaels = [], d.styleSheet.cssText = a + "{x:expression(document.__qsaels.push(this))}", window.scrollBy(0, 0), b.__qsaels;
			};
		}
	};

	// allow addEventListener (https://gist.github.com/jonathantneal/3748027)
	polyfills.addEventListener = function () {
		!window.addEventListener && (function (WindowPrototype, DocumentPrototype, ElementPrototype, addEventListener, removeEventListener, dispatchEvent, registry) {
			WindowPrototype[addEventListener] = DocumentPrototype[addEventListener] = ElementPrototype[addEventListener] = function (type, listener) {
				var target = this;
				registry.unshift([target, type, listener, function (event) {
					event.currentTarget = target;
					event.preventDefault = function () { event.returnValue = false; };
					event.stopPropagation = function () { event.cancelBubble = true; };
					event.target = event.srcElement || target;
					listener.call(target, event);
				}]);
				this.attachEvent("on" + type, registry[0][3]);
			};
			WindowPrototype[removeEventListener] = DocumentPrototype[removeEventListener] = ElementPrototype[removeEventListener] = function (type, listener) {
				for (var index = 0, register; register = registry[index]; ++index) {
					if (register[0] == this && register[1] == type && register[2] == listener) {
						return this.detachEvent("on" + type, registry.splice(index, 1)[0][3]);
					}
				}
			};
			WindowPrototype[dispatchEvent] = DocumentPrototype[dispatchEvent] = ElementPrototype[dispatchEvent] = function (eventObject) {
				return this.fireEvent("on" + eventObject.type, eventObject);
			};
		})(Window.prototype, HTMLDocument.prototype, Element.prototype, "addEventListener", "removeEventListener", "dispatchEvent", []);
	};

	// allow console.log
	polyfills.consoleLog = function () {
		var overrideTest = new RegExp('console-log', 'i');
		if (!window.console || overrideTest.test(document.querySelectorAll('html')[0].className)) {
			window.console = {};
			window.console.log = function () {
				// if the reporting panel doesn't exist
				var a, b, messages = '', reportPanel = document.getElementById('reportPanel');
				if (!reportPanel) {
					// create the panel
					reportPanel = document.createElement('DIV');
					reportPanel.id = 'reportPanel';
					reportPanel.style.background = '#fff none';
					reportPanel.style.border = 'solid 1px #000';
					reportPanel.style.color = '#000';
					reportPanel.style.fontSize = '12px';
					reportPanel.style.padding = '10px';
					reportPanel.style.position = (navigator.userAgent.indexOf('MSIE 6') > -1) ? 'absolute' : 'fixed';
					reportPanel.style.right = '10px';
					reportPanel.style.bottom = '10px';
					reportPanel.style.width = '180px';
					reportPanel.style.height = '320px';
					reportPanel.style.overflow = 'auto';
					reportPanel.style.zIndex = '100000';
					reportPanel.innerHTML = '&nbsp;';
					// store a copy of this node in the move buffer
					document.body.appendChild(reportPanel);
				}
				// truncate the queue
				var reportString = (reportPanel.innerHTML.length < 1000) ? reportPanel.innerHTML : reportPanel.innerHTML.substring(0, 800);
				// process the arguments
				for (a = 0, b = arguments.length; a < b; a += 1) {
					messages += arguments[a] + '<br/>';
				}
				// add a break after the message
				messages += '<hr/>';
				// output the queue to the panel
				reportPanel.innerHTML = messages + reportString;
			};
		}
	};

	// allows Object.create (https://gist.github.com/rxgx/1597825)
	polyfills.objectCreate = function () {
		if (typeof Object.create !== "function") {
			Object.create = function (original) {
				function Clone() {}
				Clone.prototype = original;
				return new Clone();
			};
		}
	};

	// allows String.trim (https://gist.github.com/eliperelman/1035982)
	polyfills.stringTrim = function () {
		if (!String.prototype.trim) {
			String.prototype.trim = function () { return this.replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, ''); };
		}
		if (!String.prototype.ltrim) {
			String.prototype.ltrim = function () { return this.replace(/^\s+/, ''); };
		}
		if (!String.prototype.rtrim) {
			String.prototype.rtrim = function () { return this.replace(/\s+$/, ''); };
		}
		if (!String.prototype.fulltrim) {
			String.prototype.fulltrim = function () { return this.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, '').replace(/\s+/g, ' '); };
		}
	};

	// for immediate use
	polyfills.html5();
	polyfills.arrayIndexOf();
	polyfills.querySelectorAll();
	polyfills.addEventListener();
	polyfills.consoleLog();
	polyfills.objectCreate();
	polyfills.stringTrim();

}(window.useful = window.useful || {}));

/*
	Source:
	van Creij, Maurice (2012). "useful.requests.js: A library of useful functions to ease working with AJAX and JSON.", version 20121126, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.

	Fallbacks:
	<!--[if IE]>
		<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
	<![endif]-->
*/

(function (useful) {

	// Invoke strict mode
	"use strict";

	// private functions
	var request = request || {};

	// adds a random argument to the AJAX URL to bust the cache
	request.randomise = function (url) {
		return url.replace('?', '?time=' + new Date().getTime() + '&');
	};

	// perform and handle an AJAX request
	request.send = function (properties) {
		var serverRequest;
		// create an HTTP request
		serverRequest = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
		// add the onchange handler
		serverRequest.onreadystatechange = function () {
			request.update(serverRequest, properties);
		};
		// if the request is a POST
		if (properties.post) {
			// open the request
			serverRequest.open('POST', properties.url, true);
			// set its header
			serverRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			serverRequest.setRequestHeader("Content-length", properties.post.length);
			serverRequest.setRequestHeader("Connection", "close");
			// send the request, or fail gracefully
			try { serverRequest.send(properties.post); }
			catch (errorMessage) { properties.onFailure({readyState : -1, status : -1, statusText : errorMessage}); }
		// else treat it as a GET
		} else {
			// open the request
			serverRequest.open('GET', request.randomise(properties.url), true);
			// send the request
			try { serverRequest.send(); }
			catch (errorMessage) { properties.onFailure({readyState : -1, status : -1, statusText : errorMessage}); }
		}
	};

	// regularly updates the status of the request
	request.update = function (serverRequest, properties) {
		// react to the status of the request
		if (serverRequest.readyState === 4) {
			switch (serverRequest.status) {
			case 200 :
				properties.onSuccess(serverRequest, properties);
				break;
			case 304 :
				properties.onSuccess(serverRequest, properties);
				break;
			default :
				properties.onFailure(serverRequest, properties);
			}
		} else {
			properties.onProgress(serverRequest, properties);
		}
	};

	// turns a string back into a DOM object
	request.deserialize = function (text) {
		var parser, xmlDoc;
		// if the DOMParser exists
		if (window.DOMParser) {
			// parse the text as an XML DOM
			parser = new DOMParser();
			xmlDoc = parser.parseFromString(text, "text/xml");
		// else assume this is Microsoft doing things differently again
		} else {
			// parse the text as an XML DOM
			xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
			xmlDoc.async = "false";
			xmlDoc.loadXML(text);
		}
		// return the XML DOM object
		return xmlDoc;
	};

	// turns a json string into a JavaScript object
	request.decode = function (text) {
		var object;
		object = {};
		// if JSON.parse is available
		if (typeof JSON !== 'undefined' && typeof JSON.parse !== 'undefined') {
			// use it
			object = JSON.parse(text);
		// if jQuery is available
		} else if (typeof jQuery !== 'undefined') {
			// use it
			object = jQuery.parseJSON(text);
		}
/*
		else {
			// do something desperate
			eval('object = ' + text);
		}
*/
		// return the object
		return object;
	};

	// public functions
	useful.request = useful.request || {};
	useful.request.send = request.send;
	useful.request.decode = request.decode;

}(window.useful = window.useful || {}));

/*
	Source:
	van Creij, Maurice (2012). "useful.context.js: An scrolling content context.", version 20120606, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.

	Prerequisites:
	<!--[if IE]>
		<script src="./js/html5.js"></script>
		<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
		<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/jquery-ui.min.js"></script>
	<![endif]-->
*/

(function (useful) {

	// invoke strict mode
	"use strict";

	// private functions
	useful.Gallery = function (obj, cfg) {
		// properties
		this.obj = obj;
		this.cfg = cfg;
		this.name = 'gallery';
		// methods
		this.start = function () {
			var context = this;
			// if the component is not already active
			if (!context.cfg.isActive) {
				// mark this node as active
				context.cfg.isActive = true;
				// set the default mode
				context.obj.className += ' gallery_mode_carousel';
				// store the settings
				context.defaultSettings(context);
				// build the container for the slides
				context.slides.buildSlideContainer(context);
				// build the progress indicator
				context.progress.buildProgressIndicator(context);
				// build the toolbar
				context.toolbar.buildToolbar(context);
				// build the pager
				context.pager.buildPager(context);
				// build the interaction invitation
				context.hint.buildHint(context);
				// if this is the mobile website
				if (context.cfg.onMobile) {
					// add the click events
					context.toolbar.events.handleClicksiOS(context);
					// add the gesture events
					context.events.handleGesturesiOS(context);
				// otherwise
				} else {
					// add the click events
					context.toolbar.events.handleClicks(context);
					// add the gesture events
					context.events.handleGestures(context);
				}
				// add the mousewheel events
				context.events.handleMousewheel(context);
				// add the idle animation
				context.events.handleIdle(context);
				// add the filter handlers
				context.toolbar.events.handleFilters(context);
				// handle resizing of the browser
				context.events.handleResize(context);
				// if AJAX is used
				if (context.cfg.allowAjax) {
					// order the first batch of slides
					setTimeout(function () {
						// load the first batch
						context.slides.loadSlides(context, context.cfg.activeSlide, context.cfg.fetchAmount);
						// load the pager
						context.pager.loadPager(context);
					}, 200);
				}
				// build the pager based on the slides that are already there
				context.pager.fillPager({'responseText' : '[' + (context.cfg.slideNodes.length - 1) + ']'}, context);
				// update the slides that are already there
				context.updateAll(context);
			}
			// disable the start function so it can't be started twice
			this.start = function () {};
		};
		this.defaultSettings = function (context) {
			// EXTERNAL SETTINGS
			// defines the aspect ratio of the gallery - 4:3 would be 0.75
			context.cfg.aspectRatio = context.cfg.aspectRatio || 1;
			// the script will cycle through these classes, the number is not limited
			context.cfg.carouselNames = context.cfg.carouselNames || ['gallery_carousel_farleft', 'gallery_carousel_left', 'gallery_carousel_centre', 'gallery_carousel_right', 'gallery_carousel_farright'];
			// the script alternates between these classes to divide the slides across columns
			context.cfg.pinboardNames = context.cfg.pinboardNames || ['gallery_pinboard_left', 'gallery_pinboard_right', 'gallery_pinboard_loading'];
			// default behaviour is to show numbers
			context.cfg.pagerLabels = context.cfg.pagerLabels || ['Lorem', 'Ipsum', 'Dolor', 'Sit', 'Amet'];
			// distance between rows of slides in pin board mode
			context.cfg.rowOffset = context.cfg.rowOffset || 18;
			context.cfg.pinboardOffset = context.cfg.pinboardOffset || 0;
			// distance from the bottom of the pin board where new slides will be loaded if AJAX is enabled
			context.cfg.fetchScrollBottom = context.cfg.fetchScrollBottom || 100;
			// how far from the unloaded slides preloading should commence
			context.cfg.fetchTreshold = context.cfg.fetchTreshold || 3;
			// how many slides to get in one go
			context.cfg.fetchAmount = context.cfg.fetchAmount || 5;
			// don't accept new input until the animation finished
			context.cfg.limitSpeed = context.cfg.limitSpeed || true;
			// immediately cycle to the first slide after reaching the last
			context.cfg.allowLoop = context.cfg.allowLoop || false;
			// wait this long until starting the automatic slideshow
			context.cfg.idleDelay = context.cfg.idleDelay || 8000;
			// direction to show the slides in
			context.cfg.idleDirection = context.cfg.idleDirection || 1; // -1 | 1
			// what interface elements to show
			context.cfg.toggleHint = context.cfg.toggleHint || true; // true | false
			context.cfg.togglePager = context.cfg.togglePager || true; // true | false
			context.cfg.toggleFilter = context.cfg.toggleFilter || 'Filter'; // string | true | false
			context.cfg.togglePinboard = context.cfg.togglePinboard || 'View Pin Board'; // string | true | false
			context.cfg.toggleCarousel = context.cfg.toggleCarousel || 'View Carousel'; // string | true | false
			context.cfg.toggleNext = context.cfg.toggleNext || 'Next Slide'; // string | true | false
			context.cfg.togglePrev = context.cfg.togglePrev || 'Previous Slide'; // string | true | false
			// how mobile devices are identified to enable touch controls
			context.cfg.onMobile = context.cfg.onMobile || (navigator.userAgent.indexOf('Mobile') > -1);
			// INTERNAL SETTINGS
			// store the starting index
			context.cfg.activeSlide = 0;
			// set the initial keywords
			context.cfg.activeFilterGroup = [];
			// store the initial mode
			context.cfg.carouselMode = (context.obj.className.indexOf('gallery_mode_carousel') > -1);
			context.cfg.allowAjax = context.cfg.allowAjax || (context.obj.getElementsByTagName('form').length > 0);
			// report animations in progress
			context.cfg.animationInProgress = false;
			// report AJAX fetches in progress
			context.cfg.fetchInProgress = false;
			// report that slides have not run out yet
			context.cfg.noSlidesLeft = false;
			// indicator for interferance of gestures
			context.cfg.recentGesture = false;
		};
		this.updateAll = function (context) {
			// re-implement the aspect ratio
			context.obj.style.height = parseInt(context.obj.offsetWidth * context.cfg.aspectRatio, 10) + 'px';
			// update the components
			context.pager.updatePager(context);
			context.slides.updateSlides(context);
			context.toolbar.updateToolbar(context);
		};
		this.resetAll = function (context) {
			// restore the global parameters to the default situation
			context.cfg.activeSlide = 0;
			context.cfg.slideNodes = [];
			context.cfg.fetchInProgress = false;
			context.cfg.fetchInProgress = false;
			context.cfg.noSlidesLeft = false;
			// empty the current set of slides
			context.cfg.slideContainer.innerHTML = '';
			// get the slides that match the filter
			context.slides.loadSlides(context, 0, 3);
		};
		this.slides = {};
		this.slides.buildSlideContainer = function (context) {
			var a, b, movedSlide;
			// get all the slides
			context.cfg.slideNodes = useful.transitions.select('figure, article', context.obj);
			// create the slide container
			context.cfg.slideContainer = document.createElement('div');
			// add its properties
			context.cfg.slideContainer.className = 'gallery_slides';
			// for all childnodes
			for (a = 0 , b = context.cfg.slideNodes.length; a < b; a += 1) {
				// get the slide node
				movedSlide = context.obj.removeChild(context.cfg.slideNodes[a]);
				// set its starting class name
				movedSlide.className += ' ' + context.cfg.carouselNames[context.cfg.carouselNames.length - 1];
				// move it to the container
				context.cfg.slideContainer.appendChild(movedSlide);
			}
			// add the container to the component
			context.obj.appendChild(context.cfg.slideContainer);
		};
		this.slides.loadSlides = function (context, overrideIndex, overrideAmount) {
			// if there's ajax functionality
			if (context.cfg.allowAjax) {
				var a, b, slideIndex, slideAmount, filterForm, filterInputs, fetchURL;
				// if no fetch request is in progress
				if (!context.cfg.fetchInProgress && !context.cfg.noSlidesLeft) {
					// normalise the values
					slideIndex = (overrideIndex) ? overrideIndex : context.cfg.activeSlide;
					slideAmount = (overrideAmount) ? overrideAmount : context.cfg.fetchAmount;
					// get the form element
					filterForm = context.obj.getElementsByTagName('form')[0];
					// gather the filter group from the form
					filterInputs = filterForm.getElementsByTagName('input');
					context.cfg.activeFilterGroup = [];
					for (a = 0 , b = filterInputs.length; a < b; a += 1) {
						if (filterInputs[a].checked || !filterInputs[a].type.match(/checkbox|radio/gi)) {
							// store the active filter group
							context.cfg.activeFilterGroup[context.cfg.activeFilterGroup.length] = filterInputs[a].value;
						}
					}
					// get the url for the ajax call
					fetchURL = filterForm.getAttribute('action');
					fetchURL += '&idx=' + slideIndex + '&amt=' + slideAmount + '&grp=' + context.cfg.activeFilterGroup.join(',');
					// formulate the ajax call
					useful.request.send({
						url : fetchURL,
						post : null,
						onProgress : function (reply) { context.slides.progressSlides(reply, context); },
						onFailure : function () {},
						onSuccess : function (reply) { context.slides.insertSlides(reply, context); }
					});
					// show the progress meter
					context.cfg.progressTimeout = setTimeout(function () { context.cfg.progressIndicator.style.display = 'block'; }, 500);
					// prevent any further ajax calls from piling up
					context.cfg.fetchInProgress = true;
					// give up if it takes too long
					setTimeout(function () { context.cfg.fetchInProgress = false; context.cfg.progressIndicator.style.display = 'none'; }, 1000);
				}
			}
		};
		this.slides.progressSlides = function (/*reply, context*/) {
			// show progress indicator
		};
		this.slides.insertSlides = function (reply, context) {
			// shortcut pointers
			var a, b, newSlide, fetchedSlides, fetchedSlide;
			fetchedSlides = [];
			// if there's ajax functionality
			if (context.cfg.allowAjax) {
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
						newSlide.className += (context.cfg.carouselMode) ? ' ' + context.cfg.carouselNames[context.cfg.carouselNames.length - 1] : ' ' + context.cfg.pinboardNames[context.cfg.pinboardNames.length - 1];
						// add it to the end of the line
						context.cfg.slideContainer.appendChild(newSlide);
						// center it in its column
						newSlide.style.marginLeft = '-' + Math.round(newSlide.offsetWidth / 2) + 'px';
						newSlide.style.marginTop = '-' + Math.round(newSlide.offsetHeight / 2) + 'px';
					}
				}
				// if no new slides were sent, stop asking for them
				if (fetchedSlides.length <= 1) {
					context.cfg.noSlidesLeft = true;
				}
				// unlock further ajax calls
				context.cfg.fetchInProgress = false;
				// hide the progress meter
				clearTimeout(context.cfg.progressTimeout);
				context.cfg.progressIndicator.style.display = 'none';
				// update the slides
				context.slides.updateSlides(context);
				// update the pinboard
				if (!context.cfg.carouselMode) {
					context.toolbar.transformToPinboard(context);
				}
				// update the pager
				context.pager.fillPager(reply, context);
			}
		};
		this.slides.updateSlides = function (context) {
			var b, c, slideWidth, slideHeight, slideClass, centerClass, resetProgressIndicator;
			// store the individual slides in an array
			context.cfg.slideNodes = useful.transitions.select('figure, article', context.cfg.slideContainer);
			// get the centre class name from the array
			centerClass = Math.floor(context.cfg.carouselNames.length / 2);
			// create a function to reset the progress indicator
			resetProgressIndicator = function () { context.cfg.animationInProgress = false; };
			// for all slides in the list
			for (b = 0 , c = context.cfg.slideNodes.length; b < c; b += 1) {
				// redo the slides event handler
				if (context.cfg.slideNodes[b].className.indexOf('slide_active') < 0) {
					if (context.cfg.onMobile) {
						context.slides.events.handleSlideiOS(b, context);
					} else {
						context.slides.events.handleSlide(b, context);
					}
					context.cfg.slideNodes[b].className = 'slide_active ' + context.cfg.slideNodes[b].className;
				}
				// if the slideshow is in carousel mode
				if (context.cfg.carouselMode) {
					// determine their new class name
					slideClass = b - context.cfg.activeSlide + centerClass;
					slideClass = (context.cfg.allowLoop && b - context.cfg.activeSlide - centerClass > 0) ? b - context.cfg.slideNodes.length - context.cfg.activeSlide + centerClass : slideClass;
					slideClass = (context.cfg.allowLoop && b - context.cfg.activeSlide + centerClass < 0) ? b + context.cfg.slideNodes.length - context.cfg.activeSlide + centerClass : slideClass;
					slideClass = (slideClass < 0) ? 0 : slideClass;
					slideClass = (slideClass >= context.cfg.carouselNames.length) ? context.cfg.carouselNames.length - 1 : slideClass;
					// if the slide doesn't have this class already
					if (context.cfg.slideNodes[b].className.indexOf(context.cfg.carouselNames[slideClass]) < 0) {
						// report than an animation is in progress
						if (context.cfg.limitSpeed) {
							context.cfg.animationInProgress = true;
						}
						// transition this class
						useful.transitions.byClass(
							context.cfg.slideNodes[b],
							context.cfg.carouselNames.join(' '),
							context.cfg.carouselNames[slideClass],
							resetProgressIndicator
						);
					}
					// re-centre the slide
					slideWidth = context.cfg.slideNodes[b].offsetWidth;
					slideHeight = context.cfg.slideNodes[b].offsetHeight;
					context.cfg.slideNodes[b].style.marginLeft = parseInt(slideWidth / -2, 10) + 'px';
					context.cfg.slideNodes[b].style.marginTop = parseInt(slideHeight / -2, 10) + 'px';
				} else {
					// store the assigned column positions
					var cols = context.cfg.pinboardNames.length - 1;
					// replace the carousel styles with pinboard one
					useful.transitions.byClass(
						context.cfg.slideNodes[b],
						context.cfg.pinboardNames.join(' '),
						context.cfg.pinboardNames[b % cols],
						resetProgressIndicator
					);
					// un-centre the slide
						// doesn't seem to be necessary for now
				}
			}
			// fix the positioning in pinboard mode
			if (!context.cfg.carouselMode) {
				context.toolbar.transformToPinboard(context);
			}
		};
		this.slides.slideBy = function (context, increment) {
			// update the index
			context.cfg.activeSlide = context.cfg.activeSlide + increment;
			// if the right limit is passed
			if (context.cfg.activeSlide > context.cfg.slideNodes.length - 1) {
				// reset to the right limit
				context.cfg.activeSlide = context.cfg.slideNodes.length - 1;
				// if the idle loop is active
				if (context.cfg.allowLoop) {
					// loop around
					context.cfg.activeSlide = 0;
				}
			}
			// if the left limit is passed
			if (context.cfg.activeSlide < 0) {
				// reset to the left limit
				context.cfg.activeSlide = 0;
				// if the idle loop is active
				if (context.cfg.allowLoop) {
					// loop around
					context.cfg.activeSlide = context.cfg.slideNodes.length - 1;
				}
			}
			// if the index is close to the max
			if (context.cfg.slideNodes.length - context.cfg.activeSlide < context.cfg.fetchTreshold) {
				// check if there's more using ajax
				context.slides.loadSlides(context);
			}
			// update the slides
			context.updateAll(context);
		};
		this.slides.slideTo = function (context, index) {
			// update the index
			context.cfg.activeSlide = index;
			// if the index is close to the max
			if (context.cfg.slideNodes.length - context.cfg.activeSlide < context.cfg.fetchTreshold) {
				// check if there's more using ajax
				context.slides.loadSlides(context);
			}
			// update the slides
			context.updateAll(context);
		};
		this.slides.events = {};
		this.slides.events.handleSlide = function (index, context) {
			context.cfg.slideNodes[index].addEventListener('click', function (event) {
				if (context.cfg.carouselMode) {
					// check if there wasn't a recent gesture
					if (!context.cfg.recentGesture) {
						// if the event was triggered on the active slide
						if (index === context.cfg.activeSlide) {
							// find the url in the slide and open it
							var slideLinks = context.cfg.slideNodes[context.cfg.activeSlide].getElementsByTagName('a');
							// if there is just one link in the slide
							if (slideLinks.length === 1) {
								// open the link
								document.location.href = slideLinks[0].href;
							}
						} else {
							// show the indicated
							context.slides.slideTo(context, index);
						}
					} else {
						// cancel the click
						event.preventDefault();
					}
				}
			}, false);
		};
		this.slides.events.handleSlideiOS = function (index, context) {
			context.cfg.slideNodes[index].addEventListener('touchend', function (event) {
				if (context.cfg.carouselMode) {
					// check if there wasn't a recent gesture
					if (!context.cfg.recentGesture) {
						// if the event was triggered on the active slide
						if (index === context.cfg.activeSlide) {
							// find the url in the slide and open it
							var slideLinks = context.cfg.slideNodes[context.cfg.activeSlide].getElementsByTagName('a');
							// if there is just one link in the slide
							if (slideLinks.length === 1) {
								// open the link
								document.location.href = slideLinks[0].href;
							}
						} else {
							// show the indicated
							context.slides.slideTo(context, index);
						}
					} else {
						// cancel the click
						event.preventDefault();
					}
				}
			}, false);
		};
		this.progress = {};
		this.progress.buildProgressIndicator = function (context) {
			// create the indicator element
			context.cfg.progressIndicator = document.createElement('div');
			// add the element's properties
			context.cfg.progressIndicator.className = 'gallery_busy';
			// insert it into the component
			context.obj.appendChild(context.cfg.progressIndicator);
		};
		this.toolbar = {};
		this.toolbar.buildToolbar = function (context) {
			var a, b, newButton;
			// create the toolbar container
			context.cfg.toolbarContainer = document.createElement('menu');
			// add the element's properties
			context.cfg.toolbarContainer.className = 'gallery_toolbar';
			// define the toolbar elements
			context.cfg.toolbarElements = [];
			if (context.cfg.togglePrev) { context.cfg.toolbarElements.push([context.cfg.togglePrev, 'gallery_tool_previous']); }
			if (context.cfg.toggleNext) { context.cfg.toolbarElements.push([context.cfg.toggleNext, 'gallery_tool_next']); }
			if (context.cfg.toggleCarousel) { context.cfg.toolbarElements.push([context.cfg.toggleCarousel, 'gallery_tool_carousel']); }
			if (context.cfg.togglePinboard) { context.cfg.toolbarElements.push([context.cfg.togglePinboard, 'gallery_tool_pinboard']); }
			if (context.cfg.toggleFilter) { context.cfg.toolbarElements.push([context.cfg.toggleFilter, 'gallery_tool_filter']); }
			// add the defined controls
			for (a = 0 , b = context.cfg.toolbarElements.length; a < b; a += 1) {
				// if the element is defined
				if (context.cfg.toolbarElements[a][0] !== null) {
					// create the next button
					newButton = document.createElement('button');
					// add its properties
					newButton.innerHTML = context.cfg.toolbarElements[a][0];
					newButton.className = context.cfg.toolbarElements[a][1] + ' gallery_tool_enabled';
					// add the button to the menu
					context.cfg.toolbarContainer.appendChild(newButton);
				}
			}
			// insert into the component
			context.obj.appendChild(context.cfg.toolbarContainer);
		};
		this.toolbar.updateToolbar = function (context) {
			// if looping is turned off
			if (!context.cfg.allowLoop && context.cfg.previousButton && context.cfg.nextButton) {
				// if the first slide is active disable/enable the previous button
				context.cfg.previousButton.className = (context.cfg.activeSlide === 0) ? context.cfg.previousButton.className.replace(/gallery_tool_enabled/gi, 'gallery_tool_disabled') : context.cfg.previousButton.className.replace(/gallery_tool_disabled/gi, 'gallery_tool_enabled');
				// if the last slide is active
				context.cfg.nextButton.className = (context.cfg.activeSlide === context.cfg.slideNodes.length - 1) ? context.cfg.nextButton.className.replace(/gallery_tool_enabled/gi, 'gallery_tool_disabled') : context.cfg.nextButton.className.replace(/gallery_tool_disabled/gi, 'gallery_tool_enabled');
			}
		};
		this.toolbar.toggleFilter = function (button, context) {
			// get the filter interface
			context.cfg.filterForm = context.cfg.filterForm || context.obj.getElementsByTagName('form');
			if (context.cfg.filterForm.length > 0) {
				// if the filter is invisible
				if (context.cfg.filterForm[0].className.indexOf('gallery_filter_hide') > -1) {
					// reveal it
					button.parentNode.className = button.parentNode.className.replace('Passive', 'Active');
					useful.transitions.byClass(context.cfg.filterForm[0], 'gallery_filter_hide', 'gallery_filter_show', null, null, null, null);
				// else
				} else {
					// hide it
					button.parentNode.className = button.parentNode.className.replace('Active', 'Passive');
					useful.transitions.byClass(context.cfg.filterForm[0], 'gallery_filter_show', 'gallery_filter_hide', null, null, null, null);
				}
			}
		};
		this.toolbar.transformToPinboard = function (context) {
			var a, b, resetScroll, cols, rows, rowHeight;
			// if the node is not already in pinboard mode, remember to reset the scroll position
			resetScroll = (context.cfg.carouselMode) ? true : false;
			// hide the slides to avoid glitches
			if (context.cfg.slideNodes.length > 0) {
				clearTimeout(context.cfg.transformTimeout);
				context.cfg.slideNodes[0].parentNode.style.visibility = 'hidden';
				context.cfg.transformTimeout = setTimeout(function () {
					context.cfg.slideNodes[0].parentNode.style.visibility = 'visible';
				}, 1000);
			}
			// switch the classname of the parent
			useful.transitions.byClass(context.obj, 'gallery_mode_carousel', 'gallery_mode_pinboard');
			// change to pinboard mode
			context.cfg.carouselMode = false;
			// store the assigned column positions
			cols = context.cfg.pinboardNames.length - 1;
			// for all slides
			for (a = 0 , b = context.cfg.slideNodes.length; a < b; a += 1) {
				// replace the carousel styles with pinboard one
				useful.transitions.byClass(
					context.cfg.slideNodes[a],
					context.cfg.carouselNames.join(' '),
					context.cfg.pinboardNames[a % cols]
				);
			}
			// update the vertical positions of the slides
			rows = [];
			for (a = 0 , b = context.cfg.slideNodes.length; a < b; a += 1) {
				// set the first values
				if (a < cols) {
					rows[a] = context.cfg.rowOffset + context.cfg.pinboardOffset;
				}
				// calculate the height to go with this slide
				rowHeight = context.cfg.slideNodes[a].offsetHeight + context.cfg.rowOffset;
				// set the proper vertical position for this mode
				context.cfg.slideNodes[a].style.top = rows[a % cols] + 'px';
				// update the total height
				rows[a % cols] += rowHeight;
			}
			// reset the scroll position
			if (resetScroll) {
				context.cfg.slideContainer.scrollTop = 0;
			}
			// get new slides to fill the scrollable section
			if (context.cfg.slideContainer.scrollHeight <= context.cfg.slideContainer.offsetHeight) {
				// ask for more slides
				context.slides.loadSlides(context, context.cfg.slideNodes.length, context.cfg.fetchAmount);
			}
		};
		this.toolbar.transformToCarousel = function (context) {
			var slideClassName;
			// reset the scroll position
			context.cfg.slideContainer.scrollTop = 0;
			// hide the slides to avoid glitches
			if (context.cfg.slideNodes.length > 0) {
				clearTimeout(context.cfg.transformTimeout);
				context.cfg.slideNodes[0].parentNode.style.visibility = 'hidden';
				context.cfg.transformTimeout = setTimeout(function () {
					context.cfg.slideNodes[0].parentNode.style.visibility = 'visible';
				}, 1000);
			}
			// switch the classname op the parent
			useful.transitions.byClass(context.obj, 'gallery_mode_pinboard', 'gallery_mode_carousel');
			// change to carousel mode
			context.cfg.carouselMode = true;
			// for all slides
			for (var a = 0, b = context.cfg.slideNodes.length; a < b; a += 1) {
				// etermine the target class name
				slideClassName = (a + 2 < context.cfg.carouselNames.length) ? context.cfg.carouselNames[a + 2] : context.cfg.carouselNames[context.cfg.carouselNames.length - 1];
				// set the proper vertical position for this mode
				context.cfg.slideNodes[a].style.top = '50%';
				// replace the carousel styles with pinboard one
				useful.transitions.byClass(
					context.cfg.slideNodes[a],
					context.cfg.pinboardNames.join(' '),
					slideClassName
				);
			}
			// restart the carousel
			context.cfg.activeSlide = 0;
			context.updateAll(context);
		};
		this.toolbar.events = {};
		this.toolbar.events.handleFilters = function (context) {
			var a, b, filterForms, filterGroups, changeEvent;
			// get all the filter groups
			filterForms = context.obj.getElementsByTagName('form');
			if (filterForms.length > 0) {
				// for the filter groups
				filterGroups = filterForms[0].getElementsByTagName('input');
				changeEvent = (navigator.userAgent.match(/msie/gi)) ? 'click' : 'change';
				for (a = 0 , b = filterGroups.length; a < b; a += 1) {
					// check the box by default
					filterGroups[a].checked = true;
					// add click event to all labels
					context.toolbar.events.handleFilter(filterGroups[a], changeEvent, context);
				}
			}
		};
		this.toolbar.events.handleFilter = function (filterGroup, changeEvent, context) {
			filterGroup['on' + changeEvent] = function () {
				context.resetAll(context);
			};
		};
		this.toolbar.events.handleClicks = function (context) {
			var a, b, allButtons;
			// set the event handlers of the controls
			allButtons = context.cfg.toolbarContainer.getElementsByTagName('button');
			for (a = 0 , b = allButtons.length; a < b; a += 1) {
				context.toolbar.events.handleClick(allButtons[a], context);
			}
		};
		this.toolbar.events.handleClick = function (button, context) {
			switch (button.className.split(' ')[0]) {
			case 'gallery_tool_previous' :
				// store the button
				context.cfg.previousButton = button;
				// add the event handler
				button.onclick = function () {
					if (!context.cfg.animationInProgress) {
						context.slides.slideBy(context, -1);
					}
					// cancel the click event
					return false;
				};
				break;
			case 'gallery_tool_next' :
				// store the button
				context.cfg.nextButton = button;
				// add the event handler
				button.onclick = function () {
					if (!context.cfg.animationInProgress) {
						context.slides.slideBy(context, 1);
					}
					// cancel the click event
					return false;
				};
				break;
			case 'gallery_tool_pinboard' :
				// store the button
				context.cfg.pinboardButton = button;
				// add the event handler
				button.onclick = function () {
					context.toolbar.transformToPinboard(context);
					// cancel the click event
					return false;
				};
				break;
			case 'gallery_tool_carousel' :
				// store the button
				context.cfg.carouselButton = button;
				// add the event handler
				button.onclick = function () {
					context.toolbar.transformToCarousel(context);
					// cancel the click event
					return false;
				};
				break;
			case 'gallery_tool_filter' :
				// store the button
				context.cfg.filterButton = button;
				// add the event handler
				button.onclick = function () {
					// handle the event
					context.toolbar.toggleFilter(button, context);
					// cancel the click event
					return false;
				};
				break;
			}
		};
		this.toolbar.events.handleClicksiOS = function (context) {
			var a, b, allButtons;
			// set the event handlers of the controls
			allButtons = context.cfg.toolbarContainer.getElementsByTagName('button');
			for (a = 0 , b = allButtons.length; a < b; a += 1) {
				context.toolbar.events.handleClickiOS(allButtons[a], context);
			}
		};
		this.toolbar.events.handleClickiOS = function (button, context) {
			switch (button.className.split(' ')[0]) {
			case 'gallery_tool_previous' :
				// store the button
				context.cfg.previousButton = button;
				// add the event handler
				button.ontouchend = function (event) {
					if (!context.cfg.animationInProgress) {
						context.slides.slideBy(context, -1);
					}
					// cancel the default browser behaviour
					event.preventDefault();
				};
				break;
			case 'gallery_tool_next' :
				// store the button
				context.cfg.nextButton = button;
				// add the event handler
				button.ontouchend = function (event) {
					if (!context.cfg.animationInProgress) {
						context.slides.slideBy(context, 1);
					}
					// cancel the default browser behaviour
					event.preventDefault();
				};
				break;
			case 'gallery_tool_pinboard' :
				// store the button
				context.cfg.pinboardButton = button;
				// add the event handler
				button.ontouchend = function (event) {
					context.toolbar.transformToPinboard(context);
					// cancel the default browser behaviour
					event.preventDefault();
				};
				break;
			case 'gallery_tool_carousel' :
				// store the button
				context.cfg.carouselButton = button;
				// add the event handler
				button.ontouchend = function (event) {
					context.toolbar.transformToCarousel(context);
					// cancel the default browser behaviour
					event.preventDefault();
				};
				break;
			case 'gallery_tool_filter' :
				// store the button
				context.cfg.filterButton = button;
				// add the event handler
				button.ontouchend = function (event) {
					// handle the event
					context.toolbar.toggleFilter(button, context);
					// cancel the click event
					event.preventDefault();
				};
				break;
			}
		};
		this.pager = {};
		this.pager.buildPager = function (context) {
			// build the page indicators
			context.cfg.pagerContainer = document.createElement('menu');
			context.cfg.pagerContainer.className = 'gallery_pager';
			context.obj.appendChild(context.cfg.pagerContainer);
		};
		this.pager.loadPager = function (context) {
			var fetchURL;
			// get the url for the ajax call
			fetchURL = context.obj.getElementsByTagName('form')[0].getAttribute('action');
			fetchURL += '&inf=1&grp=' + context.cfg.activeFilterGroup.join(',');
			// formulate the ajax call
			useful.request.send({
				url : fetchURL,
				post : null,
				onProgress : function () {},
				onFailure : function () {},
				onSuccess : function (reply) { context.pager.fillPager(reply, context); }
			});
		};
		this.pager.fillPager = function (reply, context) {
			var a, b, parent, fetchedPager, newPagerElement, newPagerLink;
			// shortcut pointers
			parent = reply.referer;
			fetchedPager = [];
			// decode the JSON string
			fetchedPager = useful.request.decode(reply.responseText);
			// empty the pager
			context.cfg.pagerContainer.innerHTML = '';
			// for all pages reported
			for (a = 0 , b = fetchedPager[fetchedPager.length - 1] + 1; a < b; a += 1) {
				// create a new pager element
				newPagerElement = document.createElement('li');
				// create a new pager link
				newPagerLink = document.createElement('a');
				// fill with a page number or a custom label
				newPagerLink.innerHTML = (context.cfg.pagerLabels !== null && a < context.cfg.pagerLabels.length) ? context.cfg.pagerLabels[a] : a + 1;
				// add the link to the pager element
				newPagerElement.appendChild(newPagerLink);
				// add the pager element to the pager container
				context.cfg.pagerContainer.appendChild(newPagerElement);
				// set the link target
				newPagerLink.setAttribute('href', '#gallery_slide_' + a);
				newPagerLink.setAttribute('id', 'gallery_page_' + a);
				// add the event handler
				if (context.cfg.onMobile) {
					context.pager.events.handlePageriOS(a, newPagerLink, context);
				// else
				} else {
					context.pager.events.handlePager(a, newPagerLink, context);
				}
			}
			// update the pager to the initial state
			context.pager.updatePager(context);
		};
		this.pager.updatePager = function (context) {
			var a, b, childNodes;
			// get the slides from the container
			childNodes = context.cfg.pagerContainer.getElementsByTagName('a');
			// for all pager elements in the container
			for (a = 0 , b = childNodes.length; a < b; a += 1) {
				// highlight or reset the element
				if (a < context.cfg.slideNodes.length) {
					childNodes[a].parentNode.className = (a === context.cfg.activeSlide) ? 'gallery_pager_active' : 'gallery_pager_link';
				} else {
					childNodes[a].parentNode.className = 'gallery_pager_passive';
				}
			}
			// hide the pager if it's not wanted
			if (!context.cfg.togglePager) {
				context.cfg.pagerContainer.style.visibility = 'hidden';
			}
		};
		this.pager.events = {};
		this.pager.events.handlePager = function (a, newPagerLink, context) {
			newPagerLink.onclick = function () {
				// handle the event
				if (!context.cfg.animationInProgress && newPagerLink.parentNode.className.match(/gallery_pager_link/gi)) {
					context.slides.slideTo(context, a);
				}
				// cancel the click
				return false;
			};
		};
		this.pager.events.handlePageriOS = function (a, newPagerLink, context) {
			newPagerLink.ontouchend = function () {
				// handle the event
				if (!context.cfg.animationInProgress && newPagerLink.parentNode.className.match(/gallery_pager_link/gi)) {
					context.slides.slideTo(context, a);
				}
				// cancel the click
				return false;
			};
		};
		this.hint = {};
		this.hint.buildHint = function (context) {
			// if the hint is enabled
			if (context.cfg.toggleHint) {
				// create an element for the invitation
				context.cfg.hintElement = document.createElement('div');
				context.cfg.hintElement.className = 'gallery_hint';
				// add the element to the slideshow
				context.obj.appendChild(context.cfg.hintElement);
				// a a status class to the parent element
				context.obj.className += ' gallery_interface_hidden';
				// on the mobile version
				if (context.cfg.onMobile) {
					// set its event handler
					context.hint.events.handleHintiOS(context);
				}
			}
		};
		this.hint.events = {};
		this.hint.events.handleHintiOS = function (context) {
			context.obj.addEventListener('touchend', function () {
				// show the interface
				context.obj.className = context.obj.className.replace(/gallery_interface_hidden/gi, 'gallery_interface_visible');
			}, false);
		};
		// events
		this.events = {};
		this.events.handleResize = function (context) {
			window.addEventListener('resize', function () {
				context.updateAll(context);
			}, false);
		};
		this.events.handleGestures = function (context) {
			context.cfg.startX = null;
			context.obj.onmousedown = function (event) {
				event = event || window.event;
				if (context.cfg.carouselMode) {
					context.cfg.startX = (navigator.userAgent.indexOf('MSIE ') > -1) ? event.x : event.screenX;
					// cancel the click event
					return false;
				}
			};
			context.obj.onmousemove = function (event) {
				event = event || window.event;
				if (context.cfg.carouselMode) {
					if (context.cfg.startX !== null) {
						var increment;
						// lock the click events
						context.cfg.recentGesture = true;
						context.cfg.endX = (navigator.userAgent.indexOf('MSIE ') > -1) ? event.x : event.screenX;
						// if the distance has been enough
						if (Math.abs(context.cfg.endX - context.cfg.startX) > context.obj.offsetWidth / 4) {
							// move one increment
							increment = (context.cfg.endX - context.cfg.startX < 0) ? 1 : -1;
							if (!context.cfg.animationInProgress) {
								context.slides.slideBy(context, increment);
							}
							// reset the positions
							context.cfg.startX = context.cfg.endX;
						}
						// cancel the click event
						return false;
					}
				}
			};
			context.obj.onmouseup = function (event) {
				event = event || window.event;
				if (context.cfg.carouselMode) {
					// cancel the gesture
					context.cfg.endX = null;
					context.cfg.startX = null;
					setTimeout(function () { context.cfg.recentGesture = false; }, 100);
					// cancel the click event
					return false;
				}
			};
			context.obj.addEventListener('mouseout', function (event) {
				event = event || window.event;
				if (context.cfg.carouselMode) {
					// whipe the gesture if the mouse remains out of bounds
					context.cfg.timeOut = setTimeout(function () {
						context.cfg.endX = null;
						context.cfg.startX = null;
					}, 100);
					// cancel the click event
					event.preventDefault();
				}
			}, false);
			context.obj.addEventListener('mouseover', function (event) {
				event = event || window.event;
				if (context.cfg.carouselMode) {
					// stop the gesture from resetting when the mouse goes back in bounds
					clearTimeout(context.cfg.timeOut);
					// cancel the click event
					event.preventDefault();
				}
			}, false);
		};
		this.events.handleGesturesiOS = function (context) {
			context.cfg.touchStartX = null;
			context.cfg.touchStartY = null;
			context.obj.addEventListener('touchstart', function (event) {
				if (context.cfg.carouselMode) {
					context.cfg.touchStartX = event.touches[0].pageX;
					context.cfg.touchStartY = event.touches[0].pageY;
				}
			}, false);
			context.obj.addEventListener('touchmove', function (event) {
				if (context.cfg.carouselMode) {
					if (context.cfg.touchStartX !== null) {
						// lock the click events
						context.cfg.recentGesture = true;
						context.cfg.touchEndX = event.touches[0].pageX;
						context.cfg.touchEndY = event.touches[0].pageY;
						// if the distance has been enough
						if (Math.abs(context.cfg.touchEndX - context.cfg.touchStartX) > context.obj.offsetWidth / 4) {
							// move one increment
							var increment = (context.cfg.touchEndX - context.cfg.touchStartX < 0) ? 1 : -1;
							if (!context.cfg.animationInProgress) {
								context.slides.slideBy(context, increment);
							}
							// reset the positions
							context.cfg.touchStartX = context.cfg.touchEndX;
						}
						// cancel the default browser behaviour if there was horizontal motion
						if (Math.abs(context.cfg.touchEndX - context.cfg.touchStartX) > Math.abs(context.cfg.touchEndY - context.cfg.touchStartY)) {
							event.preventDefault();
						}
					}
				}
			}, false);
			context.obj.eventListener('touchend', function () {
				if (context.cfg.carouselMode) {
					// cancel the gesture
					context.cfg.touchEndX = null;
					context.cfg.touchStartX = null;
					context.cfg.touchEndY = null;
					context.cfg.touchStartY = null;
					setTimeout(function () { context.cfg.recentGesture = false; }, 100);
				}
			}, false);
			context.obj.addEventListener('touchcancel', function (event) {
				if (context.cfg.carouselMode) {
					// cancel the gesture
					context.cfg.touchEndX = null;
					context.cfg.touchStartX = null;
					context.cfg.touchEndY = null;
					context.cfg.touchStartY = null;
					setTimeout(function () { context.cfg.recentGesture = false; }, 100);
					// cancel the default browser behaviour
					event.preventDefault();
				}
			}, false);
		};
		this.events.handleMousewheel = function (context) {
			var onMoveSlides = function (event) {
				var distance, increment;
				// get the scroll distance
				distance = (window.event) ? window.event.wheelDelta / 120 : -event.detail / 3;
				increment = (distance < 0) ? 1 : -1;
				// if this is carousel mode
				if (context.cfg.carouselMode) {
					// scroll the page
					if (!context.cfg.animationInProgress) {
						context.slides.slideBy(context, increment);
					}
					// cancel the click event
					event.preventDefault();
				}
			};
			var onLoadSlides = function () {
				// if the scroll position is close to the scroll height
				if (context.cfg.slideContainer.scrollHeight - context.cfg.slideContainer.offsetHeight - context.cfg.slideContainer.scrollTop < context.cfg.fetchScrollBottom) {
					// ask for more slides
					context.slides.loadSlides(context, context.cfg.slideNodes.length, context.cfg.fetchAmount);
				}
			};
			context.obj.addEventListener('mousewheel', onMoveSlides, false);
			context.obj.addEventListener('DOMMouseScroll', onMoveSlides, false);
			context.cfg.slideContainer.addEventListener('scroll', onLoadSlides, false);
		};
		this.events.handleIdle = function (context) {
			// timer constant
			context.cfg.idleTimer = null;
			context.cfg.idleLoop = context.cfg.allowLoop;
			// events to cancel the timer
			context.obj.addEventListener('mouseout', function () {
				// allow looping
				context.cfg.allowLoop = true;
				// a set the automatic gallery to start after while
				if (context.cfg.idleDelay > -1) {
					clearInterval(context.cfg.idleTimer);
					context.cfg.idleTimer = setInterval(function () {
						if (context.cfg.carouselMode) {
							context.slides.slideBy(context, context.cfg.idleDirection);
						}
					}, context.cfg.idleDelay);
				}
			}, false);
			context.obj.addEventListener('mouseover', function () {
				// restore looping setting
				context.cfg.allowLoop = context.cfg.idleLoop;
				// cancel the automatic gallery
				clearInterval(context.cfg.idleTimer);
			}, false);
			// a set the automatic gallery to start after while
			if (context.cfg.idleDelay > -1) {
				clearInterval(context.cfg.idleTimer);
				context.cfg.idleTimer = setInterval(function () {
					if (context.cfg.carouselMode) {
						context.slides.slideBy(context, context.cfg.idleDirection);
					}
				}, context.cfg.idleDelay);
			}
		};
		// external API
		this.focus = function (index) {
			this.slides.slideTo(this, index);
		};
		this.previous = function () {
			this.slides.slideBy(this, -1);
		};
		this.next = function () {
			this.slides.slideBy(this, 1);
		};
		this.pause = function () {
			// restore looping setting
			this.cfg.allowLoop = this.cfg.idleLoop;
			// cancel the automatic gallery
			clearInterval(this.cfg.idleTimer);
		};
		this.play = function () {
			// allow looping
			this.cfg.allowLoop = true;
			// a set the automatic gallery to start after while
			if (this.cfg.idleDelay > -1) {
				clearInterval(this.cfg.idleTimer);
				this.cfg.idleTimer = setInterval(function () {
					if (this.cfg.carouselMode) {
						this.slides.slideBy(this, this.cfg.idleDirection);
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

}(window.useful = window.useful || {}));
