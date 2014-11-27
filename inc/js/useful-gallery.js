/*
	Source:
	van Creij, Maurice (2014). "useful.polyfills.js: A library of useful polyfills to ease working with HTML5 in legacy environments.", version 20141127, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/

// public object
var useful = useful || {};

(function(){

	// Invoke strict mode
	"use strict";

	// Create a private object for this library
	useful.polyfills = {

		// enabled the use of HTML5 elements in Internet Explorer
		html5 : function () {
			var a, b, elementsList;
			elementsList = ['section', 'nav', 'article', 'aside', 'hgroup', 'header', 'footer', 'dialog', 'mark', 'dfn', 'time', 'progress', 'meter', 'ruby', 'rt', 'rp', 'ins', 'del', 'figure', 'figcaption', 'video', 'audio', 'source', 'canvas', 'datalist', 'keygen', 'output', 'details', 'datagrid', 'command', 'bb', 'menu', 'legend'];
			if (navigator.userAgent.match(/msie/gi)) {
				for (a = 0 , b = elementsList.length; a < b; a += 1) {
					document.createElement(elementsList[a]);
				}
			}
		},

		// allow array.indexOf in older browsers
		arrayIndexOf : function () {
			if (!Array.prototype.indexOf) {
				Array.prototype.indexOf = function (obj, start) {
					for (var i = (start || 0), j = this.length; i < j; i += 1) {
						if (this[i] === obj) { return i; }
					}
					return -1;
				};
			}
		},

		// allow document.querySelectorAll (https://gist.github.com/connrs/2724353)
		querySelectorAll : function () {
			if (!document.querySelectorAll) {
				document.querySelectorAll = function (a) {
					var b = document, c = b.documentElement.firstChild, d = b.createElement("STYLE");
					return c.appendChild(d), b.__qsaels = [], d.styleSheet.cssText = a + "{x:expression(document.__qsaels.push(this))}", window.scrollBy(0, 0), b.__qsaels;
				};
			}
		},

		// allow addEventListener (https://gist.github.com/jonathantneal/3748027)
		addEventListener : function () {
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
		},

		// allow console.log
		consoleLog : function () {
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
		},

		// allows Object.create (https://gist.github.com/rxgx/1597825)
		objectCreate : function () {
			if (typeof Object.create !== "function") {
				Object.create = function (original) {
					function Clone() {}
					Clone.prototype = original;
					return new Clone();
				};
			}
		},

		// allows String.trim (https://gist.github.com/eliperelman/1035982)
		stringTrim : function () {
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
		},

		// allows localStorage support
		localStorage : function () {
			if (!window.localStorage) {
				if (/MSIE 8|MSIE 7|MSIE 6/i.test(navigator.userAgent)){
					window.localStorage = {
						getItem: function(sKey) {
							if (!sKey || !this.hasOwnProperty(sKey)) {
								return null;
							}
							return unescape(document.cookie.replace(new RegExp("(?:^|.*;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1"));
						},
						key: function(nKeyId) {
							return unescape(document.cookie.replace(/\s*\=(?:.(?!;))*$/, "").split(/\s*\=(?:[^;](?!;))*[^;]?;\s*/)[nKeyId]);
						},
						setItem: function(sKey, sValue) {
							if (!sKey) {
								return;
							}
							document.cookie = escape(sKey) + "=" + escape(sValue) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";
							this.length = document.cookie.match(/\=/g).length;
						},
						length: 0,
						removeItem: function(sKey) {
							if (!sKey || !this.hasOwnProperty(sKey)) {
								return;
							}
							document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
							this.length--;
						},
						hasOwnProperty: function(sKey) {
							return (new RegExp("(?:^|;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
						}
					};
					window.localStorage.length = (document.cookie.match(/\=/g) || window.localStorage).length;
				} else {
				    Object.defineProperty(window, "localStorage", new(function() {
				        var aKeys = [],
				            oStorage = {};
				        Object.defineProperty(oStorage, "getItem", {
				            value: function(sKey) {
				                return sKey ? this[sKey] : null;
				            },
				            writable: false,
				            configurable: false,
				            enumerable: false
				        });
				        Object.defineProperty(oStorage, "key", {
				            value: function(nKeyId) {
				                return aKeys[nKeyId];
				            },
				            writable: false,
				            configurable: false,
				            enumerable: false
				        });
				        Object.defineProperty(oStorage, "setItem", {
				            value: function(sKey, sValue) {
				                if (!sKey) {
				                    return;
				                }
				                document.cookie = escape(sKey) + "=" + escape(sValue) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";
				            },
				            writable: false,
				            configurable: false,
				            enumerable: false
				        });
				        Object.defineProperty(oStorage, "length", {
				            get: function() {
				                return aKeys.length;
				            },
				            configurable: false,
				            enumerable: false
				        });
				        Object.defineProperty(oStorage, "removeItem", {
				            value: function(sKey) {
				                if (!sKey) {
				                    return;
				                }
				                document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
				            },
				            writable: false,
				            configurable: false,
				            enumerable: false
				        });
				        this.get = function() {
				            var iThisIndx;
				            for (var sKey in oStorage) {
				                iThisIndx = aKeys.indexOf(sKey);
				                if (iThisIndx === -1) {
				                    oStorage.setItem(sKey, oStorage[sKey]);
				                } else {
				                    aKeys.splice(iThisIndx, 1);
				                }
				                delete oStorage[sKey];
				            }
				            for (aKeys; aKeys.length > 0; aKeys.splice(0, 1)) {
				                oStorage.removeItem(aKeys[0]);
				            }
				            for (var aCouple, iKey, nIdx = 0, aCouples = document.cookie.split(/\s*;\s*/); nIdx < aCouples.length; nIdx++) {
				                aCouple = aCouples[nIdx].split(/\s*=\s*/);
				                if (aCouple.length > 1) {
				                    oStorage[iKey = unescape(aCouple[0])] = unescape(aCouple[1]);
				                    aKeys.push(iKey);
				                }
				            }
				            return oStorage;
				        };
				        this.configurable = false;
				        this.enumerable = true;
				    })());
				}
			}
		}

	};

	// startup
	useful.polyfills.html5();
	useful.polyfills.arrayIndexOf();
	useful.polyfills.querySelectorAll();
	useful.polyfills.addEventListener();
	useful.polyfills.consoleLog();
	useful.polyfills.objectCreate();
	useful.polyfills.stringTrim();
	useful.polyfills.localStorage();

	// return as a require.js module
	if (typeof module !== 'undefined') {
		exports = module.exports = useful.polyfills;
	}

})();

/*
	Source:
	van Creij, Maurice (2014). "useful.requests.js: A library of useful functions to ease working with AJAX and JSON.", version 20141127, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/

// public object
var useful = useful || {};

(function(){

	// Invoke strict mode
	"use strict";

	// Create a private object for this library
	useful.request = {

		// adds a random argument to the AJAX URL to bust the cache
		randomise : function (url) {
			return url.replace('?', '?time=' + new Date().getTime() + '&');
		},

		// create a request that is compatible with the browser
		create : function (properties) {
			var serverRequest,
				_this = this;
			// create a microsoft only xdomain request
			if (window.XDomainRequest && properties.xdomain) {
				// create the request object
				serverRequest = new XDomainRequest();
				// add the event handler(s)
				serverRequest.onload = function () { properties.onSuccess(serverRequest, properties); };
				serverRequest.onerror = function () { properties.onFailure(serverRequest, properties); };
				serverRequest.ontimeout = function () { properties.onTimeout(serverRequest, properties); };
				serverRequest.onprogress = function () { properties.onProgress(serverRequest, properties); };
			}
			// or create a standard HTTP request
			else if (window.XMLHttpRequest) {
				// create the request object
				serverRequest = new XMLHttpRequest();
				// set the optional timeout if available
				if (serverRequest.timeout) { serverRequest.timeout = properties.timeout || 0; }
				// add the event handler(s)
				serverRequest.ontimeout = function () { properties.onTimeout(serverRequest, properties); };
				serverRequest.onreadystatechange = function () { _this.update(serverRequest, properties); };
			}
			// or use the fall back
			else {
				// create the request object
				serverRequest = new ActiveXObject("Microsoft.XMLHTTP");
				// add the event handler(s)
				serverRequest.onreadystatechange = function () { _this.update(serverRequest, properties); };
			}
			// return the request object
			return serverRequest;
		},

		// perform and handle an AJAX request
		send : function (properties) {
			// add any event handlers that weren't provided
			properties.onSuccess = properties.onSuccess || function () {};
			properties.onFailure = properties.onFailure || function () {};
			properties.onTimeout = properties.onTimeout || function () {};
			properties.onProgress = properties.onProgress || function () {};
			// create the request object
			var serverRequest = this.create(properties);
			// if the request is a POST
			if (properties.post) {
				try {
					// open the request
					serverRequest.open('POST', properties.url, true);
					// set its header
					serverRequest.setRequestHeader("Content-type", properties.contentType || "application/x-www-form-urlencoded");
					// send the request, or fail gracefully
					serverRequest.send(properties.post);
				}
				catch (errorMessage) { properties.onFailure({ readyState : -1, status : -1, statusText : errorMessage }); }
			// else treat it as a GET
			} else {
				try {
					// open the request
					serverRequest.open('GET', this.randomise(properties.url), true);
					// send the request
					serverRequest.send();
				}
				catch (errorMessage) { properties.onFailure({ readyState : -1, status : -1, statusText : errorMessage }); }
			}
		},

		// regularly updates the status of the request
		update : function (serverRequest, properties) {
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
		},

		// turns a string back into a DOM object
		deserialize : function (text) {
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
		},

		// turns a json string into a JavaScript object
		decode : function (text) {
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
			// return the object
			return object;
		}

	};

	// return as a require.js module
	if (typeof module !== 'undefined') {
		exports = module.exports = useful.request;
	}

})();

/*
	Source:
	van Creij, Maurice (2014). "useful.transitions.js: A library of useful functions to ease working with CSS3 transitions.", version 20141127, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/

// public object
var useful = useful || {};

(function(){

	// Invoke strict mode
	"use strict";

	// Create a private object for this library
	useful.transitions = {

		// applies functionality to node that conform to a given CSS rule, or returns them
		select : function (input, parent) {
			var a, b, elements;
			// validate the input
			parent = parent || document;
			input = (typeof input === 'string') ? {'rule' : input, 'parent' : parent} : input;
			input.parent = input.parent || document;
			input.data = input.data || {};
			// use querySelectorAll to select elements, or defer to jQuery
			elements = (typeof(document.querySelectorAll) !== 'undefined') ?
				input.parent.querySelectorAll(input.rule) :
				(typeof(jQuery) !== 'undefined') ? jQuery(input.parent).find(input.rule).get() : [];
			// if there was a handler
			if (typeof(input.handler) !== 'undefined') {
				// for each element
				for (a = 0, b = elements.length; a < b; a += 1) {
					// run the handler and pass a unique copy of the data (in case it's a model)
					input.handler(elements[a], input.data.create());
				}
			// else assume the function was called for a list of elements
			} else {
				// return the selected elements
				return elements;
			}
		},

		// checks the compatibility of CSS3 transitions for this browser
		compatibility : function () {
			var eventName, newDiv, empty;
			// create a test div
			newDiv = document.createElement('div');
			// use various tests for transition support
			if (typeof(newDiv.style.MozTransition) !== 'undefined') { eventName = 'transitionend'; }
			try { document.createEvent('OTransitionEvent'); eventName = 'oTransitionEnd'; } catch (e) { empty = null; }
			try { document.createEvent('WebKitTransitionEvent'); eventName = 'webkitTransitionEnd'; } catch (e) { empty = null; }
			try { document.createEvent('transitionEvent'); eventName = 'transitionend'; } catch (e) { empty = null; }
			// remove the test div
			newDiv = empty;
			// pass back working event name
			return eventName;
		},

		// performs a transition between two classnames
		byClass : function (element, removedClass, addedClass, endEventHandler, jQueryDuration, jQueryEasing) {
			var replaceThis, replaceWith, endEventName, endEventFunction;
			// validate the input
			endEventHandler = endEventHandler || function () {};
			endEventName = this.compatibility();
			// turn the classnames into regular expressions
			replaceThis = new RegExp(removedClass.trim().replace(/ {2,}/g, ' ').split(' ').join('|'), 'g');
			replaceWith = new RegExp(addedClass, 'g');
			// if CSS3 transitions are available
			if (typeof endEventName !== 'undefined') {
				// set the onComplete handler and immediately remove it afterwards
				element.addEventListener(endEventName, endEventFunction = function () {
					endEventHandler();
					element.removeEventListener(endEventName, endEventFunction, true);
				}, true);
				// replace the class name
				element.className = (element.className.replace(replaceThis, '') + ' ' + addedClass).replace(/ {2,}/g, ' ').trim();
			// else if jQuery UI is available
			} else if (typeof jQuery !== 'undefined' && typeof jQuery.ui !== 'undefined') {
				// retrieve any extra information for jQuery
				jQueryDuration = jQueryDuration || 500;
				jQueryEasing = jQueryEasing || 'swing';
				// use switchClass from jQuery UI to approximate CSS3 transitions
				jQuery(element).switchClass(removedClass.replace(replaceWith, ''), addedClass, jQueryDuration, jQueryEasing, endEventHandler);
			// if all else fails
			} else {
				// just replace the class name
				element.className = (element.className.replace(replaceThis, '') + ' ' + addedClass).replace(/ {2,}/g, ' ').trim();
				// and call the onComplete handler
				endEventHandler();
			}
		},

		// adds the relevant browser prefix to a style property
		prefix : function (property) {
			// pick the prefix that goes with the browser
			return (navigator.userAgent.match(/webkit/gi)) ? 'webkit' + property.substr(0, 1).toUpperCase() + property.substr(1):
				(navigator.userAgent.match(/firefox/gi)) ? 'Moz' + property.substr(0, 1).toUpperCase() + property.substr(1):
				(navigator.userAgent.match(/microsoft/gi)) ? 'ms' + property.substr(0, 1).toUpperCase() + property.substr(1):
				(navigator.userAgent.match(/opera/gi)) ? 'O' + property.substr(0, 1).toUpperCase() + property.substr(1):
				property;
		},

		// applies a list of rules
		byRules : function (element, rules, endEventHandler) {
			var rule, endEventName, endEventFunction;
			// validate the input
			rules.transitionProperty = rules.transitionProperty || 'all';
			rules.transitionDuration = rules.transitionDuration || '300ms';
			rules.transitionTimingFunction = rules.transitionTimingFunction || 'ease';
			endEventHandler = endEventHandler || function () {};
			endEventName = this.compatibility();
			// if CSS3 transitions are available
			if (typeof endEventName !== 'undefined') {
				// set the onComplete handler and immediately remove it afterwards
				element.addEventListener(endEventName, endEventFunction = function () {
					endEventHandler();
					element.removeEventListener(endEventName, endEventFunction, true);
				}, true);
				// for all rules
				for (rule in rules) {
					if (rules.hasOwnProperty(rule)) {
						// implement the prefixed value
						element.style[this.compatibility(rule)] = rules[rule];
						// implement the value
						element.style[rule] = rules[rule];
					}
				}
			// else if jQuery is available
			} else if (typeof jQuery !== 'undefined') {
				var jQueryEasing, jQueryDuration;
				// pick the equivalent jQuery animation function
				jQueryEasing = (rules.transitionTimingFunction.match(/ease/gi)) ? 'swing' : 'linear';
				jQueryDuration = parseInt(rules.transitionDuration.replace(/s/g, '000').replace(/ms/g, ''), 10);
				// remove rules that will make Internet Explorer complain
				delete rules.transitionProperty;
				delete rules.transitionDuration;
				delete rules.transitionTimingFunction;
				// use animate from jQuery
				jQuery(element).animate(
					rules,
					jQueryDuration,
					jQueryEasing,
					endEventHandler
				);
			// else
			} else {
				// for all rules
				for (rule in rules) {
					if (rules.hasOwnProperty(rule)) {
						// implement the prefixed value
						element.style[this.compatibility(rule)] = rules[rule];
						// implement the value
						element.style[rule] = rules[rule];
					}
				}
				// call the onComplete handler
				endEventHandler();
			}
		}

	};

	// return as a require.js module
	if (typeof module !== 'undefined') {
		exports = module.exports = useful.transitions;
	}

})();

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
useful.Gallery.prototype.Pager = function (parent) {
	// properties
	"use strict";
	this.parent = parent;
	this.cfg = parent.cfg;
	this.obj = parent.obj;
	// methods
	this.buildPager = function () {
		// build the page indicators
		this.cfg.pagerContainer = document.createElement('menu');
		this.cfg.pagerContainer.className = 'gallery_pager';
		this.obj.appendChild(this.cfg.pagerContainer);
	};
	this.loadPager = function () {
		var _this = this;
		var fetchURL;
		// get the url for the ajax call
		fetchURL = this.obj.getElementsByTagName('form')[0].getAttribute('action');
		fetchURL += '&inf=1&grp=' + this.cfg.activeFilterGroup.join(',');
		// formulate the ajax call
		useful.request.send({
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
		fetchedPager = useful.request.decode(reply.responseText);
		// empty the pager
		this.cfg.pagerContainer.innerHTML = '';
		// for all pages reported
		for (a = 0 , b = fetchedPager[fetchedPager.length - 1] + 1; a < b; a += 1) {
			// create a new pager element
			newPagerElement = document.createElement('li');
			// create a new pager link
			newPagerLink = document.createElement('a');
			// fill with a page number or a custom label
			newPagerLink.innerHTML = (this.cfg.pagerLabels !== null && a < this.cfg.pagerLabels.length) ? this.cfg.pagerLabels[a] : a + 1;
			// add the link to the pager element
			newPagerElement.appendChild(newPagerLink);
			// add the pager element to the pager container
			this.cfg.pagerContainer.appendChild(newPagerElement);
			// set the link target
			newPagerLink.setAttribute('href', '#gallery_slide_' + a);
			newPagerLink.setAttribute('id', 'gallery_page_' + a);
			// add the event handler
			if (this.cfg.onMobile) {
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
		childNodes = this.cfg.pagerContainer.getElementsByTagName('a');
		// for all pager elements in the container
		for (a = 0 , b = childNodes.length; a < b; a += 1) {
			// highlight or reset the element
			if (a < this.cfg.slideNodes.length) {
				childNodes[a].parentNode.className = (a === this.cfg.activeSlide) ? 'gallery_pager_active' : 'gallery_pager_link';
			} else {
				childNodes[a].parentNode.className = 'gallery_pager_passive';
			}
		}
		// hide the pager if it's not wanted
		if (!this.cfg.togglePager) {
			this.cfg.pagerContainer.style.visibility = 'hidden';
		}
	};
	this.handlePager = function (a, newPagerLink) {
		var _this = this;
		newPagerLink.onclick = function () {
			// handle the event
			if (!_this.cfg.animationInProgress && newPagerLink.parentNode.className.match(/gallery_pager_link/gi)) {
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
			if (!_this.cfg.animationInProgress && newPagerLink.parentNode.className.match(/gallery_pager_link/gi)) {
				_this.parent.slides.slideTo(a);
			}
			// cancel the click
			return false;
		};
	};
};

// return as a require.js module
if (typeof module !== 'undefined') {
	exports = module.exports = useful.Gallery.Pager;
}

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
	this.cfg = parent.cfg;
	this.obj = parent.obj;
	// methods
	this.buildProgressIndicator = function () {
		// create the indicator element
		this.cfg.progressIndicator = document.createElement('div');
		// add the element's properties
		this.cfg.progressIndicator.className = 'gallery_busy';
		// insert it into the component
		this.obj.appendChild(this.cfg.progressIndicator);
	};
};

// return as a require.js module
if (typeof module !== 'undefined') {
	exports = module.exports = useful.Gallery.Progress;
}

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
	// properties
	"use strict";
	this.parent = parent;
	this.cfg = parent.cfg;
	this.obj = parent.obj;
	// methods
	this.buildSlideContainer = function () {
		var a, b, movedSlide;
		// get all the slides
		this.cfg.slideNodes = useful.transitions.select('figure, article', this.obj);
		// create the slide container
		this.cfg.slideContainer = document.createElement('div');
		// add its properties
		this.cfg.slideContainer.className = 'gallery_slides';
		// for all childnodes
		for (a = 0 , b = this.cfg.slideNodes.length; a < b; a += 1) {
			// get the slide node
			movedSlide = this.obj.removeChild(this.cfg.slideNodes[a]);
			// set its starting class name
			movedSlide.className += ' ' + this.cfg.carouselNames[this.cfg.carouselNames.length - 1];
			// move it to the container
			this.cfg.slideContainer.appendChild(movedSlide);
		}
		// add the container to the component
		this.obj.appendChild(this.cfg.slideContainer);
	};
	this.loadSlides = function (overrideIndex, overrideAmount) {
		// if there's ajax functionality
		if (this.cfg.allowAjax) {
			var a, b, slideIndex, slideAmount, filterForm, filterInputs, fetchURL;
			// if no fetch request is in progress
			if (!this.cfg.fetchInProgress && !this.cfg.noSlidesLeft) {
				// normalise the values
				slideIndex = (overrideIndex) ? overrideIndex : this.cfg.activeSlide;
				slideAmount = (overrideAmount) ? overrideAmount : this.cfg.fetchAmount;
				// get the form element
				filterForm = this.obj.getElementsByTagName('form')[0];
				// gather the filter group from the form
				filterInputs = filterForm.getElementsByTagName('input');
				this.cfg.activeFilterGroup = [];
				for (a = 0 , b = filterInputs.length; a < b; a += 1) {
					if (filterInputs[a].checked || !filterInputs[a].type.match(/checkbox|radio/gi)) {
						// store the active filter group
						this.cfg.activeFilterGroup[this.cfg.activeFilterGroup.length] = filterInputs[a].value;
					}
				}
				// get the url for the ajax call
				fetchURL = filterForm.getAttribute('action');
				fetchURL += '&idx=' + slideIndex + '&amt=' + slideAmount + '&grp=' + this.cfg.activeFilterGroup.join(',');
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
				this.cfg.progressTimeout = setTimeout(function () { this.cfg.progressIndicator.style.display = 'block'; }, 500);
				// prevent any further ajax calls from piling up
				this.cfg.fetchInProgress = true;
				// give up if it takes too long
				setTimeout(function () { _this.cfg.fetchInProgress = false; _this.cfg.progressIndicator.style.display = 'none'; }, 1000);
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
		if (this.cfg.allowAjax) {
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
					newSlide.className += (this.cfg.carouselMode) ? ' ' + this.cfg.carouselNames[this.cfg.carouselNames.length - 1] : ' ' + this.cfg.pinboardNames[this.cfg.pinboardNames.length - 1];
					// add it to the end of the line
					this.cfg.slideContainer.appendChild(newSlide);
					// center it in its column
					newSlide.style.marginLeft = '-' + Math.round(newSlide.offsetWidth / 2) + 'px';
					newSlide.style.marginTop = '-' + Math.round(newSlide.offsetHeight / 2) + 'px';
				}
			}
			// if no new slides were sent, stop asking for them
			if (fetchedSlides.length <= 1) {
				this.cfg.noSlidesLeft = true;
			}
			// unlock further ajax calls
			this.cfg.fetchInProgress = false;
			// hide the progress meter
			clearTimeout(this.cfg.progressTimeout);
			this.cfg.progressIndicator.style.display = 'none';
			// update the slides
			this.updateSlides();
			// update the pinboard
			if (!this.cfg.carouselMode) {
				this.parent.toolbar.transformToPinboard();
			}
			// update the pager
			this.parent.pager.fillPager(reply);
		}
	};
	this.updateSlides = function () {
		var b, c, slideWidth, slideHeight, slideClass, centerClass, resetProgressIndicator;
		// store the individual slides in an array
		this.cfg.slideNodes = useful.transitions.select('figure, article', this.cfg.slideContainer);
		// get the centre class name from the array
		centerClass = Math.floor(this.cfg.carouselNames.length / 2);
		// create a function to reset the progress indicator
		var _this = this;
		resetProgressIndicator = function () { _this.cfg.animationInProgress = false; };
		// for all slides in the list
		for (b = 0 , c = this.cfg.slideNodes.length; b < c; b += 1) {
			// redo the slides event handler
			if (this.cfg.slideNodes[b].className.indexOf('slide_active') < 0) {
				if (this.cfg.onMobile) {
					this.handleSlideiOS(b);
				} else {
					this.handleSlide(b);
				}
				this.cfg.slideNodes[b].className = 'slide_active ' + this.cfg.slideNodes[b].className;
			}
			// if the slideshow is in carousel mode
			if (this.cfg.carouselMode) {
				// determine their new class name
				slideClass = b - this.cfg.activeSlide + centerClass;
				slideClass = (this.cfg.allowLoop && b - this.cfg.activeSlide - centerClass > 0) ? b - this.cfg.slideNodes.length - this.cfg.activeSlide + centerClass : slideClass;
				slideClass = (this.cfg.allowLoop && b - this.cfg.activeSlide + centerClass < 0) ? b + this.cfg.slideNodes.length - this.cfg.activeSlide + centerClass : slideClass;
				slideClass = (slideClass < 0) ? 0 : slideClass;
				slideClass = (slideClass >= this.cfg.carouselNames.length) ? this.cfg.carouselNames.length - 1 : slideClass;
				// if the slide doesn't have this class already
				if (this.cfg.slideNodes[b].className.indexOf(this.cfg.carouselNames[slideClass]) < 0) {
					// report than an animation is in progress
					if (this.cfg.limitSpeed) {
						this.cfg.animationInProgress = true;
					}
					// transition this class
					useful.transitions.byClass(
						this.cfg.slideNodes[b],
						this.cfg.carouselNames.join(' '),
						this.cfg.carouselNames[slideClass],
						resetProgressIndicator
					);
				}
				// re-centre the slide
				slideWidth = this.cfg.slideNodes[b].offsetWidth;
				slideHeight = this.cfg.slideNodes[b].offsetHeight;
				this.cfg.slideNodes[b].style.marginLeft = parseInt(slideWidth / -2, 10) + 'px';
				this.cfg.slideNodes[b].style.marginTop = parseInt(slideHeight / -2, 10) + 'px';
			} else {
				// store the assigned column positions
				var cols = this.cfg.pinboardNames.length - 1;
				// replace the carousel styles with pinboard one
				useful.transitions.byClass(
					this.cfg.slideNodes[b],
					this.cfg.pinboardNames.join(' '),
					this.cfg.pinboardNames[b % cols],
					resetProgressIndicator
				);
				// un-centre the slide
					// doesn't seem to be necessary for now
			}
		}
		// fix the positioning in pinboard mode
		if (!this.cfg.carouselMode) {
			this.parent.toolbar.transformToPinboard();
		}
	};
	this.slideBy = function (increment) {
		// update the index
		this.cfg.activeSlide = this.cfg.activeSlide + increment;
		// if the right limit is passed
		if (this.cfg.activeSlide > this.cfg.slideNodes.length - 1) {
			// reset to the right limit
			this.cfg.activeSlide = this.cfg.slideNodes.length - 1;
			// if the idle loop is active
			if (this.cfg.allowLoop) {
				// loop around
				this.cfg.activeSlide = 0;
			}
		}
		// if the left limit is passed
		if (this.cfg.activeSlide < 0) {
			// reset to the left limit
			this.cfg.activeSlide = 0;
			// if the idle loop is active
			if (this.cfg.allowLoop) {
				// loop around
				this.cfg.activeSlide = this.cfg.slideNodes.length - 1;
			}
		}
		// if the index is close to the max
		if (this.cfg.slideNodes.length - this.cfg.activeSlide < this.cfg.fetchTreshold) {
			// check if there's more using ajax
			this.loadSlides();
		}
		// update the slides
		this.parent.updateAll();
	};
	this.slideTo = function (index) {
		// update the index
		this.cfg.activeSlide = index;
		// if the index is close to the max
		if (this.cfg.slideNodes.length - this.cfg.activeSlide < this.cfg.fetchTreshold) {
			// check if there's more using ajax
			this.loadSlides();
		}
		// update the slides
		this.parent.updateAll();
	};
	this.handleSlide = function (index) {
		var _this = this;
		this.cfg.slideNodes[index].addEventListener('click', function (event) {
			if (_this.cfg.carouselMode) {
				// check if there wasn't a recent gesture
				if (!_this.cfg.recentGesture) {
					// if the event was triggered on the active slide
					if (index === _this.cfg.activeSlide) {
						// find the url in the slide and open it
						var slideLinks = _this.cfg.slideNodes[_this.cfg.activeSlide].getElementsByTagName('a');
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
		this.cfg.slideNodes[index].addEventListener('touchend', function (event) {
			if (_this.cfg.carouselMode) {
				// check if there wasn't a recent gesture
				if (!_this.cfg.recentGesture) {
					// if the event was triggered on the active slide
					if (index === _this.cfg.activeSlide) {
						// find the url in the slide and open it
						var slideLinks = _this.cfg.slideNodes[_this.cfg.activeSlide].getElementsByTagName('a');
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
useful.Gallery.prototype.init = function (cfg) {
	// properties
	"use strict";
	this.cfg = cfg;
	this.obj = cfg.element;
	// methods
	this.start = function () {
		// if the component is not already active
		if (!this.cfg.isActive) {
			// mark this node as active
			this.cfg.isActive = true;
			// set the default mode
			this.obj.className += ' gallery_mode_carousel';
			// store the settings
			this.defaultSettings();
			// build the container for the slides
			this.slides.buildSlideContainer();
			// build the progress indicator
			this.progress.buildProgressIndicator();
			// build the toolbar
			this.toolbar.buildToolbar();
			// build the pager
			this.pager.buildPager();
			// build the interaction invitation
			this.hint.buildHint();
			// if this is the mobile website
			if (this.cfg.onMobile) {
				// add the click events
				this.toolbar.handleClicksiOS();
				// add the gesture events
				this.handleGesturesiOS();
			// otherwise
			} else {
				// add the click events
				this.toolbar.handleClicks();
				// add the gesture events
				this.handleGestures();
			}
			// add the mousewheel events
			this.handleMousewheel();
			// add the idle animation
			this.handleIdle();
			// add the filter handlers
			this.toolbar.handleFilters();
			// handle resizing of the browser
			this.handleResize();
			// if AJAX is used
			var _this = this;
			if (this.cfg.allowAjax) {
				// order the first batch of slides
				setTimeout(function () {
					// load the first batch
					_this.slides.loadSlides(_this.cfg.activeSlide, _this.cfg.fetchAmount);
					// load the pager
					_this.pager.loadPager();
				}, 200);
			}
			// build the pager based on the slides that are already there
			this.pager.fillPager({'responseText' : '[' + (this.cfg.slideNodes.length - 1) + ']'});
			// update the slides that are already there
			this.updateAll();
		}
		// disable the start function so it can't be started twice
		this.start = function () {};
	};
	this.defaultSettings = function () {
		// EXTERNAL SETTINGS
		// defines the aspect ratio of the gallery - 4:3 would be 0.75
		this.cfg.aspectRatio = this.cfg.aspectRatio || 1;
		// the script will cycle through these classes, the number is not limited
		this.cfg.carouselNames = this.cfg.carouselNames || ['gallery_carousel_farleft', 'gallery_carousel_left', 'gallery_carousel_centre', 'gallery_carousel_right', 'gallery_carousel_farright'];
		// the script alternates between these classes to divide the slides across columns
		this.cfg.pinboardNames = this.cfg.pinboardNames || ['gallery_pinboard_left', 'gallery_pinboard_right', 'gallery_pinboard_loading'];
		// default behaviour is to show numbers
		this.cfg.pagerLabels = this.cfg.pagerLabels || ['Lorem', 'Ipsum', 'Dolor', 'Sit', 'Amet'];
		// distance between rows of slides in pin board mode
		this.cfg.rowOffset = this.cfg.rowOffset || 18;
		this.cfg.pinboardOffset = this.cfg.pinboardOffset || 0;
		// distance from the bottom of the pin board where new slides will be loaded if AJAX is enabled
		this.cfg.fetchScrollBottom = this.cfg.fetchScrollBottom || 100;
		// how far from the unloaded slides preloading should commence
		this.cfg.fetchTreshold = this.cfg.fetchTreshold || 3;
		// how many slides to get in one go
		this.cfg.fetchAmount = this.cfg.fetchAmount || 5;
		// don't accept new input until the animation finished
		this.cfg.limitSpeed = this.cfg.limitSpeed || true;
		// immediately cycle to the first slide after reaching the last
		this.cfg.allowLoop = this.cfg.allowLoop || false;
		// wait this long until starting the automatic slideshow
		this.cfg.idleDelay = this.cfg.idleDelay || 8000;
		// direction to show the slides in
		this.cfg.idleDirection = this.cfg.idleDirection || 1; // -1 | 1
		// what interface elements to show
		this.cfg.toggleHint = this.cfg.toggleHint || true; // true | false
		this.cfg.togglePager = this.cfg.togglePager || true; // true | false
		this.cfg.toggleFilter = this.cfg.toggleFilter || 'Filter'; // string | true | false
		this.cfg.togglePinboard = this.cfg.togglePinboard || 'View Pin Board'; // string | true | false
		this.cfg.toggleCarousel = this.cfg.toggleCarousel || 'View Carousel'; // string | true | false
		this.cfg.toggleNext = this.cfg.toggleNext || 'Next Slide'; // string | true | false
		this.cfg.togglePrev = this.cfg.togglePrev || 'Previous Slide'; // string | true | false
		// how mobile devices are identified to enable touch controls
		this.cfg.onMobile = this.cfg.onMobile || (navigator.userAgent.indexOf('Mobile') > -1);
		// INTERNAL SETTINGS
		// store the starting index
		this.cfg.activeSlide = 0;
		// set the initial keywords
		this.cfg.activeFilterGroup = [];
		// store the initial mode
		this.cfg.carouselMode = (this.obj.className.indexOf('gallery_mode_carousel') > -1);
		this.cfg.allowAjax = this.cfg.allowAjax || (this.obj.getElementsByTagName('form').length > 0);
		// report animations in progress
		this.cfg.animationInProgress = false;
		// report AJAX fetches in progress
		this.cfg.fetchInProgress = false;
		// report that slides have not run out yet
		this.cfg.noSlidesLeft = false;
		// indicator for interferance of gestures
		this.cfg.recentGesture = false;
	};
	this.updateAll = function () {
		// re-implement the aspect ratio
		this.obj.style.height = parseInt(this.obj.offsetWidth * this.cfg.aspectRatio, 10) + 'px';
		// update the components
		this.pager.updatePager();
		this.slides.updateSlides();
		this.toolbar.updateToolbar();
	};
	this.resetAll = function () {
		// restore the global parameters to the default situation
		this.cfg.activeSlide = 0;
		this.cfg.slideNodes = [];
		this.cfg.fetchInProgress = false;
		this.cfg.fetchInProgress = false;
		this.cfg.noSlidesLeft = false;
		// empty the current set of slides
		this.cfg.slideContainer.innerHTML = '';
		// get the slides that match the filter
		this.slides.loadSlides(0, 3);
	};
	// components
	this.toolbar = new this.Toolbar(this);
	this.slides = new this.Slides(this);
	this.progress = new this.Progress(this);
	this.pager = new this.Pager(this);
	this.hint = new this.Hint(this);
	// events
	this.handleResize = function () {
		var _this = this;
		window.addEventListener('resize', function () {
			_this.updateAll();
		}, false);
	};
	this.handleGestures = function () {
		var _this = this;
		this.cfg.startX = null;
		this.obj.onmousedown = function (event) {
			event = event || window.event;
			if (_this.cfg.carouselMode) {
				_this.cfg.startX = (navigator.userAgent.indexOf('MSIE ') > -1) ? event.x : event.screenX;
				// cancel the click event
				return false;
			}
		};
		this.obj.onmousemove = function (event) {
			event = event || window.event;
			if (_this.cfg.carouselMode) {
				if (_this.cfg.startX !== null) {
					var increment;
					// lock the click events
					_this.cfg.recentGesture = true;
					_this.cfg.endX = (navigator.userAgent.indexOf('MSIE ') > -1) ? event.x : event.screenX;
					// if the distance has been enough
					if (Math.abs(_this.cfg.endX - _this.cfg.startX) > _this.obj.offsetWidth / 4) {
						// move one increment
						increment = (_this.cfg.endX - _this.cfg.startX < 0) ? 1 : -1;
						if (!_this.cfg.animationInProgress) {
							_this.slides.slideBy(increment);
						}
						// reset the positions
						_this.cfg.startX = _this.cfg.endX;
					}
					// cancel the click event
					return false;
				}
			}
		};
		this.obj.onmouseup = function (event) {
			event = event || window.event;
			if (_this.cfg.carouselMode) {
				// cancel the gesture
				_this.cfg.endX = null;
				_this.cfg.startX = null;
				setTimeout(function () { _this.cfg.recentGesture = false; }, 100);
				// cancel the click event
				return false;
			}
		};
		this.obj.addEventListener('mouseout', function (event) {
			event = event || window.event;
			if (_this.cfg.carouselMode) {
				// whipe the gesture if the mouse remains out of bounds
				_this.cfg.timeOut = setTimeout(function () {
					_this.cfg.endX = null;
					_this.cfg.startX = null;
				}, 100);
				// cancel the click event
				event.preventDefault();
			}
		}, false);
		this.obj.addEventListener('mouseover', function (event) {
			event = event || window.event;
			if (_this.cfg.carouselMode) {
				// stop the gesture from resetting when the mouse goes back in bounds
				clearTimeout(_this.cfg.timeOut);
				// cancel the click event
				event.preventDefault();
			}
		}, false);
	};
	this.handleGesturesiOS = function () {
		var _this = this;
		this.cfg.touchStartX = null;
		this.cfg.touchStartY = null;
		this.obj.addEventListener('touchstart', function (event) {
			if (_this.cfg.carouselMode) {
				_this.cfg.touchStartX = event.touches[0].pageX;
				_this.cfg.touchStartY = event.touches[0].pageY;
			}
		}, false);
		this.obj.addEventListener('touchmove', function (event) {
			if (_this.cfg.carouselMode) {
				if (_this.cfg.touchStartX !== null) {
					// lock the click events
					_this.cfg.recentGesture = true;
					_this.cfg.touchEndX = event.touches[0].pageX;
					_this.cfg.touchEndY = event.touches[0].pageY;
					// if the distance has been enough
					if (Math.abs(_this.cfg.touchEndX - _this.cfg.touchStartX) > _this.obj.offsetWidth / 4) {
						// move one increment
						var increment = (_this.cfg.touchEndX - _this.cfg.touchStartX < 0) ? 1 : -1;
						if (!_this.cfg.animationInProgress) {
							_this.slides.slideBy(increment);
						}
						// reset the positions
						_this.cfg.touchStartX = _this.cfg.touchEndX;
					}
					// cancel the default browser behaviour if there was horizontal motion
					if (Math.abs(_this.cfg.touchEndX - _this.cfg.touchStartX) > Math.abs(_this.cfg.touchEndY - _this.cfg.touchStartY)) {
						event.preventDefault();
					}
				}
			}
		}, false);
		this.obj.eventListener('touchend', function () {
			if (_this.cfg.carouselMode) {
				// cancel the gesture
				_this.cfg.touchEndX = null;
				_this.cfg.touchStartX = null;
				_this.cfg.touchEndY = null;
				_this.cfg.touchStartY = null;
				setTimeout(function () { _this.cfg.recentGesture = false; }, 100);
			}
		}, false);
		this.obj.addEventListener('touchcancel', function (event) {
			if (_this.cfg.carouselMode) {
				// cancel the gesture
				_this.cfg.touchEndX = null;
				_this.cfg.touchStartX = null;
				_this.cfg.touchEndY = null;
				_this.cfg.touchStartY = null;
				setTimeout(function () { _this.cfg.recentGesture = false; }, 100);
				// cancel the default browser behaviour
				event.preventDefault();
			}
		}, false);
	};
	this.handleMousewheel = function () {
		var _this = this;
		var onMoveSlides = function (event) {
			var distance, increment;
			// get the scroll distance
			distance = (window.event) ? window.event.wheelDelta / 120 : -event.detail / 3;
			increment = (distance < 0) ? 1 : -1;
			// if this is carousel mode
			if (_this.cfg.carouselMode) {
				// scroll the page
				if (!_this.cfg.animationInProgress) {
					_this.slides.slideBy(increment);
				}
				// cancel the click event
				event.preventDefault();
			}
		};
		var onLoadSlides = function () {
			// if the scroll position is close to the scroll height
			if (_this.cfg.slideContainer.scrollHeight - _this.cfg.slideContainer.offsetHeight - _this.cfg.slideContainer.scrollTop < _this.cfg.fetchScrollBottom) {
				// ask for more slides
				_this.slides.loadSlides(_this.cfg.slideNodes.length, _this.cfg.fetchAmount);
			}
		};
		this.obj.addEventListener('mousewheel', onMoveSlides, false);
		this.obj.addEventListener('DOMMouseScroll', onMoveSlides, false);
		this.cfg.slideContainer.addEventListener('scroll', onLoadSlides, false);
	};
	this.handleIdle = function () {
		var _this = this;
		// timer constant
		this.cfg.idleTimer = null;
		this.cfg.idleLoop = this.cfg.allowLoop;
		// events to cancel the timer
		this.obj.addEventListener('mouseout', function () {
			// allow looping
			_this.cfg.allowLoop = true;
			// a set the automatic gallery to start after while
			if (_this.cfg.idleDelay > -1) {
				clearInterval(_this.cfg.idleTimer);
				_this.cfg.idleTimer = setInterval(function () {
					if (_this.cfg.carouselMode) {
						_this.slides.slideBy(_this.cfg.idleDirection);
					}
				}, _this.cfg.idleDelay);
			}
		}, false);
		this.obj.addEventListener('mouseover', function () {
			// restore looping setting
			_this.cfg.allowLoop = _this.cfg.idleLoop;
			// cancel the automatic gallery
			clearInterval(_this.cfg.idleTimer);
		}, false);
		// a set the automatic gallery to start after while
		if (this.cfg.idleDelay > -1) {
			clearInterval(this.cfg.idleTimer);
			this.cfg.idleTimer = setInterval(function () {
				if (_this.cfg.carouselMode) {
					_this.slides.slideBy(_this.cfg.idleDirection);
				}
			}, this.cfg.idleDelay);
		}
	};
	// external API
	this.focus = function (index) {
		this.slides.slideTo(index);
	};
	this.previous = function () {
		this.slides.slideBy(-1);
	};
	this.next = function () {
		this.slides.slideBy(1);
	};
	this.pause = function () {
		// restore looping setting
		this.cfg.allowLoop = this.cfg.idleLoop;
		// cancel the automatic gallery
		clearInterval(this.cfg.idleTimer);
	};
	this.play = function () {
		var _this = this;
		// allow looping
		this.cfg.allowLoop = true;
		// a set the automatic gallery to start after while
		if (this.cfg.idleDelay > -1) {
			clearInterval(this.cfg.idleTimer);
			this.cfg.idleTimer = setInterval(function () {
				if (_this.cfg.carouselMode) {
					_this.slides.slideBy(_this.cfg.idleDirection);
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

// return as a require.js module
if (typeof module !== 'undefined') {
	exports = module.exports = useful.Gallery;
}
