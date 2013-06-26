/*
	Source:
	van Creij, Maurice (2012). "useful.gallery.js: An scrolling content gallery.", version 20120606, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.

	Prerequisites:
	<script src="./js/useful.js"></script>
	<!--[if IE]>
		<script src="./js/html5.js"></script>
		<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
		<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/jquery-ui.min.js"></script>
	<![endif]-->
*/

// TODO: switch to more recent touch controls (useful.interaction.touch)
// TODO: make the idle timer independent of the mouse, so it may work on touch devices

(function (useful) {

	// invoke strict mode
	"use strict";

	// private functions
	var gallery = {};
	gallery = {
		// properties
		name : 'gallery',
		// methods
		start : function (node, cfg) {
			// if the component is not already active
			if (!cfg.isActive) {
				// mark this node as active
				cfg.isActive = true;
				// set the default mode
				node.className += ' gallery_mode_carousel';
				// store the settings
				gallery.defaultSettings(node, cfg);
				// build the container for the slides
				gallery.slides.buildSlideContainer(cfg);
				// build the progress indicator
				gallery.progress.buildProgressIndicator(cfg);
				// build the toolbar
				gallery.toolbar.buildToolbar(cfg);
				// build the pager
				gallery.pager.buildPager(cfg);
				// build the interaction invitation
				gallery.hint.buildHint(cfg);
				// if this is the mobile website
				if (cfg.onMobile) {
					// add the click events
					gallery.toolbar.events.handleClicksiOS(cfg);
					// add the gesture events
					gallery.events.handleGesturesiOS(cfg);
				// otherwise
				} else {
					// add the click events
					gallery.toolbar.events.handleClicks(cfg);
					// add the gesture events
					gallery.events.handleGestures(cfg);
				}
				// add the mousewheel events
				gallery.events.handleMousewheel(cfg);
				// add the idle animation
				gallery.events.handleIdle(cfg);
				// add the filter handlers
				gallery.toolbar.events.handleFilters(cfg);
				// handle resizing of the browser
				gallery.events.handleResize(cfg);
				// if AJAX is used
				if (cfg.allowAjax) {
					// order the first batch of slides
					setTimeout(function () {
						// load the first batch
						gallery.slides.loadSlides(cfg, cfg.activeSlide, cfg.fetchAmount);
						// load the pager
						gallery.pager.loadPager(cfg);
					}, 200);
				}
				// build the pager based on the slides that are already there
				gallery.pager.fillPager({'responseText' : '[' + (cfg.slideNodes.length - 1) + ']'}, cfg);
				// update the slides that are already there
				gallery.updateAll(cfg);
			}
		},
		defaultSettings : function (node, cfg) {
			// EXTERNAL SETTINGS
			// defines the aspect ratio of the gallery - 4:3 would be 0.75
			cfg.aspectRatio = cfg.aspectRatio || 1;
			// the script will cycle through these classes, the number is not limited
			cfg.carouselNames = cfg.carouselNames || ['gallery_carousel_farleft', 'gallery_carousel_left', 'gallery_carousel_centre', 'gallery_carousel_right', 'gallery_carousel_farright'];
			// the script alternates between these classes to divide the slides across columns
			cfg.pinboardNames = cfg.pinboardNames || ['gallery_pinboard_left', 'gallery_pinboard_right', 'gallery_pinboard_loading'];
			// default behaviour is to show numbers
			cfg.pagerLabels = cfg.pagerLabels || ['Lorem', 'Ipsum', 'Dolor', 'Sit', 'Amet'];
			// distance between rows of slides in pin board mode
			cfg.rowOffset = cfg.rowOffset || 18;
			cfg.pinboardOffset = cfg.pinboardOffset || 0;
			// distance from the bottom of the pin board where new slides will be loaded if AJAX is enabled
			cfg.fetchScrollBottom = cfg.fetchScrollBottom || 100;
			// how far from the unloaded slides preloading should commence
			cfg.fetchTreshold = cfg.fetchTreshold || 3;
			// how many slides to get in one go
			cfg.fetchAmount = cfg.fetchAmount || 5;
			// don't accept new input until the animation finished
			cfg.limitSpeed = cfg.limitSpeed || true;
			// immediately cycle to the first slide after reaching the last
			cfg.allowLoop = cfg.allowLoop || false;
			// wait this long until starting the automatic slideshow
			cfg.idleDelay = cfg.idleDelay || 8000;
			// direction to show the slides in
			cfg.idleDirection = cfg.idleDirection || 1; // -1 | 1
			// what interface elements to show
			cfg.toggleHint = cfg.toggleHint || true; // true | false
			cfg.togglePager = cfg.togglePager || true; // true | false
			cfg.toggleFilter = cfg.toggleFilter || 'Filter'; // string | true | false
			cfg.togglePinboard = cfg.togglePinboard || 'View Pin Board'; // string | true | false
			cfg.toggleCarousel = cfg.toggleCarousel || 'View Carousel'; // string | true | false
			cfg.toggleNext = cfg.toggleNext || 'Next Slide'; // string | true | false
			cfg.togglePrev = cfg.togglePrev || 'Previous Slide'; // string | true | false
			// how mobile devices are identified to enable touch controls
			cfg.onMobile = cfg.onMobile || (navigator.userAgent.indexOf('Mobile') > -1);
			// INTERNAL SETTINGS
			// store the parent node
			cfg.parent = node;
			// store the starting index
			cfg.activeSlide = 0;
			// set the initial keywords
			cfg.activeFilterGroup = [];
			// store the initial mode
			cfg.carouselMode = (node.className.indexOf('gallery_mode_carousel') > -1);
			cfg.allowAjax = cfg.allowAjax || (node.getElementsByTagName('form').length > 0);
			// report animations in progress
			cfg.animationInProgress = false;
			// report AJAX fetches in progress
			cfg.fetchInProgress = false;
			// report that slides have not run out yet
			cfg.noSlidesLeft = false;
			// indicator for interferance of gestures
			cfg.recentGesture = false;
		},
		updateAll : function (cfg) {
			// re-implement the aspect ratio
			cfg.parent.style.height = parseInt(cfg.parent.offsetWidth * cfg.aspectRatio, 10) + 'px';
			// update the components
			gallery.pager.updatePager(cfg);
			gallery.slides.updateSlides(cfg);
			gallery.toolbar.updateToolbar(cfg);
		},
		resetAll : function (cfg) {
			// restore the global parameters to the default situation
			cfg.activeSlide = 0;
			cfg.slideNodes = [];
			cfg.fetchInProgress = false;
			cfg.fetchInProgress = false;
			cfg.noSlidesLeft = false;
			// empty the current set of slides
			cfg.slideContainer.innerHTML = '';
			// get the slides that match the filter
			gallery.slides.loadSlides(cfg, 0, 3);
		},
		slides : {
			buildSlideContainer : function (cfg) {
				var a, b, movedSlide;
				// get all the slides
				cfg.slideNodes = useful.css.select('figure, article', cfg.parent);
				// create the slide container
				cfg.slideContainer = document.createElement('div');
				// add its properties
				cfg.slideContainer.className = 'gallery_slides';
				// for all childnodes
				for (a = 0 , b = cfg.slideNodes.length; a < b; a += 1) {
					// get the slide node
					movedSlide = cfg.parent.removeChild(cfg.slideNodes[a]);
					// set its starting class name
					movedSlide.className += ' ' + cfg.carouselNames[cfg.carouselNames.length - 1];
					// move it to the container
					cfg.slideContainer.appendChild(movedSlide);
				}
				// add the container to the component
				cfg.parent.appendChild(cfg.slideContainer);
			},
			loadSlides: function (cfg, overrideIndex, overrideAmount) {
				// if there's ajax functionality
				if (cfg.allowAjax) {
					var a, b, slideIndex, slideAmount, filterForm, filterInputs, fetchURL;
					// if no fetch request is in progress
					if (!cfg.fetchInProgress && !cfg.noSlidesLeft) {
						// normalise the values
						slideIndex = (overrideIndex) ? overrideIndex : cfg.activeSlide;
						slideAmount = (overrideAmount) ? overrideAmount : cfg.fetchAmount;
						// get the form element
						filterForm = cfg.parent.getElementsByTagName('form')[0];
						// gather the filter group from the form
						filterInputs = filterForm.getElementsByTagName('input');
						cfg.activeFilterGroup = [];
						for (a = 0 , b = filterInputs.length; a < b; a += 1) {
							if (filterInputs[a].checked || !filterInputs[a].type.match(/checkbox|radio/gi)) {
								// store the active filter group
								cfg.activeFilterGroup[cfg.activeFilterGroup.length] = filterInputs[a].value;
							}
						}
						// get the url for the ajax call
						fetchURL = filterForm.getAttribute('action');
						fetchURL += '&idx=' + slideIndex + '&amt=' + slideAmount + '&grp=' + cfg.activeFilterGroup.join(',');
						// formulate the ajax call
						useful.request.send({
							url : fetchURL,
							post : null,
							onProgress : function (reply) { gallery.slides.progressSlides(reply, cfg); },
							onFailure : function () {},
							onSuccess : function (reply) { gallery.slides.insertSlides(reply, cfg); }
						});
						// show the progress meter
						cfg.progressTimeout = setTimeout(function () { cfg.progressIndicator.style.display = 'block'; }, 500);
						// prevent any further ajax calls from piling up
						cfg.fetchInProgress = true;
						// give up if it takes too long
						setTimeout(function () { cfg.fetchInProgress = false; cfg.progressIndicator.style.display = 'none'; }, 1000);
					}
				}
			},
			progressSlides: function (/*reply, cfg*/) {
				// show progress indicator
			},
			insertSlides: function (reply, cfg) {
				// shortcut pointers
				var a, b, newSlide, fetchedSlides, fetchedSlide;
				fetchedSlides = [];
				// if there's ajax functionality
				if (cfg.allowAjax) {
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
							newSlide.className += (cfg.carouselMode) ? ' ' + cfg.carouselNames[cfg.carouselNames.length - 1] : ' ' + cfg.pinboardNames[cfg.pinboardNames.length - 1];
							// add it to the end of the line
							cfg.slideContainer.appendChild(newSlide);
							// center it in its column
							newSlide.style.marginLeft = '-' + Math.round(newSlide.offsetWidth / 2) + 'px';
							newSlide.style.marginTop = '-' + Math.round(newSlide.offsetHeight / 2) + 'px';
						}
					}
					// if no new slides were sent, stop asking for them
					if (fetchedSlides.length <= 1) {
						cfg.noSlidesLeft = true;
					}
					// unlock further ajax calls
					cfg.fetchInProgress = false;
					// hide the progress meter
					clearTimeout(cfg.progressTimeout);
					cfg.progressIndicator.style.display = 'none';
					// update the slides
					gallery.slides.updateSlides(cfg);
					// update the pinboard
					if (!cfg.carouselMode) {
						gallery.toolbar.transformToPinboard(cfg);
					}
					// update the pager
					gallery.pager.fillPager(reply, cfg);
				}
			},
			updateSlides : function (cfg) {
				var b, c, slideWidth, slideHeight, slideClass, centerClass, resetProgressIndicator;
				// store the individual slides in an array
				cfg.slideNodes = useful.css.select('figure, article', cfg.slideContainer);
				// get the centre class name from the array
				centerClass = Math.floor(cfg.carouselNames.length / 2);
				// create a function to reset the progress indicator
				resetProgressIndicator = function () { cfg.animationInProgress = false; };
				// for all slides in the list
				for (b = 0 , c = cfg.slideNodes.length; b < c; b += 1) {
					// redo the slides event handler
					if (cfg.slideNodes[b].className.indexOf('slide_active') < 0) {
						if (cfg.onMobile) {
							gallery.slides.events.handleSlideiOS(b, cfg);
						} else {
							gallery.slides.events.handleSlide(b, cfg);
						}
						cfg.slideNodes[b].className = 'slide_active ' + cfg.slideNodes[b].className;
					}
					// if the slideshow is in carousel mode
					if (cfg.carouselMode) {
						// determine their new class name
						slideClass = b - cfg.activeSlide + centerClass;
						slideClass = (cfg.allowLoop && b - cfg.activeSlide - centerClass > 0) ? b - cfg.slideNodes.length - cfg.activeSlide + centerClass : slideClass;
						slideClass = (cfg.allowLoop && b - cfg.activeSlide + centerClass < 0) ? b + cfg.slideNodes.length - cfg.activeSlide + centerClass : slideClass;
						slideClass = (slideClass < 0) ? 0 : slideClass;
						slideClass = (slideClass >= cfg.carouselNames.length) ? cfg.carouselNames.length - 1 : slideClass;
						// if the slide doesn't have this class already
						if (cfg.slideNodes[b].className.indexOf(cfg.carouselNames[slideClass]) < 0) {
							// report than an animation is in progress
							if (cfg.limitSpeed) {
								cfg.animationInProgress = true;
							}
							// transition this class
							useful.css.setClass(
								cfg.slideNodes[b],
								cfg.carouselNames.join(' '),
								cfg.carouselNames[slideClass],
								resetProgressIndicator
							);
						}
						// re-centre the slide
						slideWidth = cfg.slideNodes[b].offsetWidth;
						slideHeight = cfg.slideNodes[b].offsetHeight;
						cfg.slideNodes[b].style.marginLeft = parseInt(slideWidth / -2, 10) + 'px';
						cfg.slideNodes[b].style.marginTop = parseInt(slideHeight / -2, 10) + 'px';
					} else {
						// store the assigned column positions
						var cols = cfg.pinboardNames.length - 1;
						// replace the carousel styles with pinboard one
						useful.css.setClass(
							cfg.slideNodes[b],
							cfg.pinboardNames.join(' '),
							cfg.pinboardNames[b % cols],
							resetProgressIndicator
						);
						// un-centre the slide
							// doesn't seem to be necessary for now
					}
				}
				// fix the positioning in pinboard mode
				if (!cfg.carouselMode) {
					gallery.toolbar.transformToPinboard(cfg);
				}
			},
			slideBy: function (cfg, increment) {
				// update the index
				cfg.activeSlide = cfg.activeSlide + increment;
				// if the right limit is passed
				if (cfg.activeSlide > cfg.slideNodes.length - 1) {
					// reset to the right limit
					cfg.activeSlide = cfg.slideNodes.length - 1;
					// if the idle loop is active
					if (cfg.allowLoop) {
						// loop around
						cfg.activeSlide = 0;
					}
				}
				// if the left limit is passed
				if (cfg.activeSlide < 0) {
					// reset to the left limit
					cfg.activeSlide = 0;
					// if the idle loop is active
					if (cfg.allowLoop) {
						// loop around
						cfg.activeSlide = cfg.slideNodes.length - 1;
					}
				}
				// if the index is close to the max
				if (cfg.slideNodes.length - cfg.activeSlide < cfg.fetchTreshold) {
					// check if there's more using ajax
					gallery.slides.loadSlides(cfg);
				}
				// update the slides
				gallery.updateAll(cfg);
			},
			slideTo: function (cfg, index) {
				// update the index
				cfg.activeSlide = index;
				// if the index is close to the max
				if (cfg.slideNodes.length - cfg.activeSlide < cfg.fetchTreshold) {
					// check if there's more using ajax
					gallery.slides.loadSlides(cfg);
				}
				// update the slides
				gallery.updateAll(cfg);
			},
			events : {
				handleSlide: function (index, cfg) {
					useful.events.add(cfg.slideNodes[index], 'click', function (event) {
						if (cfg.carouselMode) {
							// check if there wasn't a recent gesture
							if (!cfg.recentGesture) {
								// if the event was triggered on the active slide
								if (index === cfg.activeSlide) {
									// find the url in the slide and open it
									var slideLinks = cfg.slideNodes[cfg.activeSlide].getElementsByTagName('a');
									// if there is just one link in the slide
									if (slideLinks.length === 1) {
										// open the link
										document.location.href = slideLinks[0].href;
									}
								} else {
									// show the indicated
									gallery.slides.slideTo(cfg, index);
								}
							} else {
								// cancel the click
								useful.events.cancel(event);
							}
						}
					});
				},
				handleSlideiOS: function (index, cfg) {
					useful.events.add(cfg.slideNodes[index], 'touchend', function (event) {
						if (cfg.carouselMode) {
							// check if there wasn't a recent gesture
							if (!cfg.recentGesture) {
								// if the event was triggered on the active slide
								if (index === cfg.activeSlide) {
									// find the url in the slide and open it
									var slideLinks = cfg.slideNodes[cfg.activeSlide].getElementsByTagName('a');
									// if there is just one link in the slide
									if (slideLinks.length === 1) {
										// open the link
										document.location.href = slideLinks[0].href;
									}
								} else {
									// show the indicated
									gallery.slides.slideTo(cfg, index);
								}
							} else {
								// cancel the click
								event.preventDefault();
							}
						}
					});
				}
			}
		},
		progress : {
			buildProgressIndicator : function (cfg) {
				// create the indicator element
				cfg.progressIndicator = document.createElement('div');
				// add the element's properties
				cfg.progressIndicator.className = 'gallery_busy';
				// insert it into the component
				cfg.parent.appendChild(cfg.progressIndicator);
			}
		},
		toolbar : {
			buildToolbar : function (cfg) {
				var a, b, newButton;
				// create the toolbar container
				cfg.toolbarContainer = document.createElement('menu');
				// add the element's properties
				cfg.toolbarContainer.className = 'gallery_toolbar';
				// define the toolbar elements
				cfg.toolbarElements = [];
				if (cfg.togglePrev) { cfg.toolbarElements.push([cfg.togglePrev, 'gallery_tool_previous']); }
				if (cfg.toggleNext) { cfg.toolbarElements.push([cfg.toggleNext, 'gallery_tool_next']); }
				if (cfg.toggleCarousel) { cfg.toolbarElements.push([cfg.toggleCarousel, 'gallery_tool_carousel']); }
				if (cfg.togglePinboard) { cfg.toolbarElements.push([cfg.togglePinboard, 'gallery_tool_pinboard']); }
				if (cfg.toggleFilter) { cfg.toolbarElements.push([cfg.toggleFilter, 'gallery_tool_filter']); }
				// add the defined controls
				for (a = 0 , b = cfg.toolbarElements.length; a < b; a += 1) {
					// if the element is defined
					if (cfg.toolbarElements[a][0] !== null) {
						// create the next button
						newButton = document.createElement('button');
						// add its properties
						newButton.innerHTML = cfg.toolbarElements[a][0];
						newButton.className = cfg.toolbarElements[a][1] + ' gallery_tool_enabled';
						// add the button to the menu
						cfg.toolbarContainer.appendChild(newButton);
					}
				}
				// insert into the component
				cfg.parent.appendChild(cfg.toolbarContainer);
			},
			updateToolbar : function (cfg) {
				// if looping is turned off
				if (!cfg.allowLoop && cfg.previousButton && cfg.nextButton) {
					// if the first slide is active disable/enable the previous button
					cfg.previousButton.className = (cfg.activeSlide === 0) ? cfg.previousButton.className.replace(/gallery_tool_enabled/gi, 'gallery_tool_disabled') : cfg.previousButton.className.replace(/gallery_tool_disabled/gi, 'gallery_tool_enabled');
					// if the last slide is active
					cfg.nextButton.className = (cfg.activeSlide === cfg.slideNodes.length - 1) ? cfg.nextButton.className.replace(/gallery_tool_enabled/gi, 'gallery_tool_disabled') : cfg.nextButton.className.replace(/gallery_tool_disabled/gi, 'gallery_tool_enabled');
				}
			},
			toggleFilter: function (button, cfg) {
				// get the filter interface
				cfg.filterForm = cfg.filterForm || cfg.parent.getElementsByTagName('form');
				if (cfg.filterForm.length > 0) {
					// if the filter is invisible
					if (cfg.filterForm[0].className.indexOf('gallery_filter_hide') > -1) {
						// reveal it
						button.parentNode.className = button.parentNode.className.replace('Passive', 'Active');
						useful.css.setClass(cfg.filterForm[0], 'gallery_filter_hide', 'gallery_filter_show', null, null, null, null);
					// else
					} else {
						// hide it
						button.parentNode.className = button.parentNode.className.replace('Active', 'Passive');
						useful.css.setClass(cfg.filterForm[0], 'gallery_filter_show', 'gallery_filter_hide', null, null, null, null);
					}
				}
			},
			transformToPinboard: function (cfg) {
				var a, b, resetScroll, cols, rows, rowHeight;
				// if the node is not already in pinboard mode, remember to reset the scroll position
				resetScroll = (cfg.carouselMode) ? true : false;
				// hide the slides to avoid glitches
				if (cfg.slideNodes.length > 0) {
					clearTimeout(cfg.transformTimeout);
					cfg.slideNodes[0].parentNode.style.visibility = 'hidden';
					cfg.transformTimeout = setTimeout(function () {
						cfg.slideNodes[0].parentNode.style.visibility = 'visible';
					}, 1000);
				}
				// switch the classname of the parent
				useful.css.setClass(cfg.parent, 'gallery_mode_carousel', 'gallery_mode_pinboard');
				// change to pinboard mode
				cfg.carouselMode = false;
				// store the assigned column positions
				cols = cfg.pinboardNames.length - 1;
				// for all slides
				for (a = 0 , b = cfg.slideNodes.length; a < b; a += 1) {
					// replace the carousel styles with pinboard one
					useful.css.setClass(
						cfg.slideNodes[a],
						cfg.carouselNames.join(' '),
						cfg.pinboardNames[a % cols]
					);
				}
				// update the vertical positions of the slides
				rows = [];
				for (a = 0 , b = cfg.slideNodes.length; a < b; a += 1) {
					// set the first values
					if (a < cols) {
						rows[a] = cfg.rowOffset + cfg.pinboardOffset;
					}
					// calculate the height to go with this slide
					rowHeight = cfg.slideNodes[a].offsetHeight + cfg.rowOffset;
					// set the proper vertical position for this mode
					cfg.slideNodes[a].style.top = rows[a % cols] + 'px';
					// update the total height
					rows[a % cols] += rowHeight;
				}
				// reset the scroll position
				if (resetScroll) {
					cfg.slideContainer.scrollTop = 0;
				}
				// get new slides to fill the scrollable section
				if (cfg.slideContainer.scrollHeight <= cfg.slideContainer.offsetHeight) {
					// ask for more slides
					gallery.slides.loadSlides(cfg, cfg.slideNodes.length, cfg.fetchAmount);
				}
			},
			transformToCarousel: function (cfg) {
				var slideClassName;
				// reset the scroll position
				cfg.slideContainer.scrollTop = 0;
				// hide the slides to avoid glitches
				if (cfg.slideNodes.length > 0) {
					clearTimeout(cfg.transformTimeout);
					cfg.slideNodes[0].parentNode.style.visibility = 'hidden';
					cfg.transformTimeout = setTimeout(function () {
						cfg.slideNodes[0].parentNode.style.visibility = 'visible';
					}, 1000);
				}
				// switch the classname op the parent
				useful.css.setClass(cfg.parent, 'gallery_mode_pinboard', 'gallery_mode_carousel');
				// change to carousel mode
				cfg.carouselMode = true;
				// for all slides
				for (var a = 0, b = cfg.slideNodes.length; a < b; a += 1) {
					// etermine the target class name
					slideClassName = (a + 2 < cfg.carouselNames.length) ? cfg.carouselNames[a + 2] : cfg.carouselNames[cfg.carouselNames.length - 1];
					// set the proper vertical position for this mode
					cfg.slideNodes[a].style.top = '50%';
					// replace the carousel styles with pinboard one
					useful.css.setClass(
						cfg.slideNodes[a],
						cfg.pinboardNames.join(' '),
						slideClassName
					);
				}
				// restart the carousel
				cfg.activeSlide = 0;
				gallery.updateAll(cfg);
			},
			events : {
				handleFilters: function (cfg) {
					var a, b, filterForms, filterGroups, changeEvent;
					// get all the filter groups
					filterForms = cfg.parent.getElementsByTagName('form');
					if (filterForms.length > 0) {
						// for the filter groups
						filterGroups = filterForms[0].getElementsByTagName('input');
						changeEvent = (navigator.userAgent.match(/msie/gi)) ? 'click' : 'change';
						for (a = 0 , b = filterGroups.length; a < b; a += 1) {
							// check the box by default
							filterGroups[a].checked = true;
							// add click event to all labels
							gallery.toolbar.events.handleFilter(filterGroups[a], changeEvent, cfg);
						}
					}
				},
				handleFilter: function (filterGroup, changeEvent, cfg) {
					useful.events.set(filterGroup, changeEvent, function () {
						gallery.resetAll(cfg);
					});
				},
				handleClicks: function (cfg) {
					var a, b, allButtons;
					// set the event handlers of the controls
					allButtons = cfg.toolbarContainer.getElementsByTagName('button');
					for (a = 0 , b = allButtons.length; a < b; a += 1) {
						gallery.toolbar.events.handleClick(allButtons[a], cfg);
					}
				},
				handleClick : function (button, cfg) {
					switch (button.className.split(' ')[0]) {
					case 'gallery_tool_previous' :
						// store the button
						cfg.previousButton = button;
						// add the event handler
						useful.events.set(button, 'click', function (event) {
							if (!cfg.animationInProgress) {
								gallery.slides.slideBy(cfg, -1);
							}
							// cancel the click event
							useful.events.cancel(event);
						});
						break;
					case 'gallery_tool_next' :
						// store the button
						cfg.nextButton = button;
						// add the event handler
						useful.events.set(button, 'click', function (event) {
							if (!cfg.animationInProgress) {
								gallery.slides.slideBy(cfg, 1);
							}
							// cancel the click event
							useful.events.cancel(event);
						});
						break;
					case 'gallery_tool_pinboard' :
						// store the button
						cfg.pinboardButton = button;
						// add the event handler
						useful.events.set(button, 'click', function (event) {
							gallery.toolbar.transformToPinboard(cfg);
							// cancel the click event
							useful.events.cancel(event);
						});
						break;
					case 'gallery_tool_carousel' :
						// store the button
						cfg.carouselButton = button;
						// add the event handler
						useful.events.set(button, 'click', function (event) {
							gallery.toolbar.transformToCarousel(cfg);
							// cancel the click event
							useful.events.cancel(event);
						});
						break;
					case 'gallery_tool_filter' :
						// store the button
						cfg.filterButton = button;
						// add the event handler
						useful.events.set(button, 'click', function (event) {
							// handle the event
							gallery.toolbar.toggleFilter(button, cfg);
							// cancel the click event
							useful.events.cancel(event);
						});
						break;
					}
				},
				handleClicksiOS: function (cfg) {
					var a, b, allButtons;
					// set the event handlers of the controls
					allButtons = cfg.toolbarContainer.getElementsByTagName('button');
					for (a = 0 , b = allButtons.length; a < b; a += 1) {
						gallery.toolbar.events.handleClickiOS(allButtons[a], cfg);
					}
				},
				handleClickiOS: function (button, cfg) {
					switch (button.className.split(' ')[0]) {
					case 'gallery_tool_previous' :
						// store the button
						cfg.previousButton = button;
						// add the event handler
						useful.events.set(button, 'touchend', function (event) {
							if (!cfg.animationInProgress) {
								gallery.slides.slideBy(cfg, -1);
							}
							// cancel the default browser behaviour
							event.preventDefault();
						}, false);
						break;
					case 'gallery_tool_next' :
						// store the button
						cfg.nextButton = button;
						// add the event handler
						useful.events.set(button, 'touchend', function (event) {
							if (!cfg.animationInProgress) {
								gallery.slides.slideBy(cfg, 1);
							}
							// cancel the default browser behaviour
							event.preventDefault();
						}, false);
						break;
					case 'gallery_tool_pinboard' :
						// store the button
						cfg.pinboardButton = button;
						// add the event handler
						useful.events.set(button, 'touchend', function (event) {
							gallery.toolbar.transformToPinboard(cfg);
							// cancel the default browser behaviour
							event.preventDefault();
						}, false);
						break;
					case 'gallery_tool_carousel' :
						// store the button
						cfg.carouselButton = button;
						// add the event handler
						useful.events.set(button, 'touchend', function (event) {
							gallery.toolbar.transformToCarousel(cfg);
							// cancel the default browser behaviour
							event.preventDefault();
						}, false);
						break;
					case 'gallery_tool_filter' :
						// store the button
						cfg.filterButton = button;
						// add the event handler
						useful.events.set(button, 'touchend', function (event) {
							// handle the event
							gallery.toolbar.toggleFilter(button, cfg);
							// cancel the click event
							event.preventDefault();
						});
						break;
					}
				}
			}
		},
		pager : {
			buildPager : function (cfg) {
				// build the page indicators
				cfg.pagerContainer = document.createElement('menu');
				cfg.pagerContainer.className = 'gallery_pager';
				cfg.parent.appendChild(cfg.pagerContainer);
			},
			loadPager : function (cfg) {
				var fetchURL;
				// get the url for the ajax call
				fetchURL = cfg.parent.getElementsByTagName('form')[0].getAttribute('action');
				fetchURL += '&inf=1&grp=' + cfg.activeFilterGroup.join(',');
				// formulate the ajax call
				useful.request.send({
					url : fetchURL,
					post : null,
					onProgress : function () {},
					onFailure : function () {},
					onSuccess : function (reply) { gallery.pager.fillPager(reply, cfg); }
				});
			},
			fillPager : function (reply, cfg) {
				var a, b, parent, fetchedPager, newPagerElement, newPagerLink;
				// shortcut pointers
				parent = reply.referer;
				fetchedPager = [];
				// decode the JSON string
				fetchedPager = useful.request.decode(reply.responseText);
				// empty the pager
				cfg.pagerContainer.innerHTML = '';
				// for all pages reported
				for (a = 0 , b = fetchedPager[fetchedPager.length - 1] + 1; a < b; a += 1) {
					// create a new pager element
					newPagerElement = document.createElement('li');
					// create a new pager link
					newPagerLink = document.createElement('a');
					// fill with a page number or a custom label
					newPagerLink.innerHTML = (cfg.pagerLabels !== null && a < cfg.pagerLabels.length) ? cfg.pagerLabels[a] : a + 1;
					// add the link to the pager element
					newPagerElement.appendChild(newPagerLink);
					// add the pager element to the pager container
					cfg.pagerContainer.appendChild(newPagerElement);
					// set the link target
					newPagerLink.setAttribute('href', '#gallery_slide_' + a);
					newPagerLink.setAttribute('id', 'gallery_page_' + a);
					// add the event handler
					if (cfg.onMobile) {
						gallery.pager.events.handlePageriOS(a, newPagerLink, cfg);
					// else
					} else {
						gallery.pager.events.handlePager(a, newPagerLink, cfg);
					}
				}
				// update the pager to the initial state
				gallery.pager.updatePager(cfg);
			},
			updatePager : function (cfg) {
				var a, b, childNodes;
				// get the slides from the container
				childNodes = cfg.pagerContainer.getElementsByTagName('a');
				// for all pager elements in the container
				for (a = 0 , b = childNodes.length; a < b; a += 1) {
					// highlight or reset the element
					if (a < cfg.slideNodes.length) {
						childNodes[a].parentNode.className = (a === cfg.activeSlide) ? 'gallery_pager_active' : 'gallery_pager_link';
					} else {
						childNodes[a].parentNode.className = 'gallery_pager_passive';
					}
				}
				// hide the pager if it's not wanted
				if (!cfg.togglePager) {
					cfg.pagerContainer.style.visibility = 'hidden';
				}
			},
			events : {
				handlePager: function (a, newPagerLink, cfg) {
					useful.events.set(newPagerLink, 'click', function (event) {
						// handle the event
						if (!cfg.animationInProgress && newPagerLink.parentNode.className.match(/gallery_pager_link/gi)) {
							gallery.slides.slideTo(cfg, a);
						}
						// cancel the click
						useful.events.cancel(event);
					});
				},
				handlePageriOS: function (a, newPagerLink, cfg) {
					useful.events.set(newPagerLink, 'touchend', function (event) {
						// handle the event
						if (!cfg.animationInProgress && newPagerLink.parentNode.className.match(/gallery_pager_link/gi)) {
							gallery.slides.slideTo(cfg, a);
						}
						// cancel the click
						useful.events.cancel(event);
					});
				}
			}
		},
		hint : {
			buildHint : function (cfg) {
				// if the hint is enabled
				if (cfg.toggleHint) {
					// create an element for the invitation
					cfg.hintElement = document.createElement('div');
					cfg.hintElement.className = 'gallery_hint';
					// add the element to the slideshow
					cfg.parent.appendChild(cfg.hintElement);
					// a a status class to the parent element
					cfg.parent.className += ' gallery_interface_hidden';
					// on the mobile version
					if (cfg.onMobile) {
						// set its event handler
						gallery.hint.events.handleHintiOS(cfg);
					}
				}
			},
			events : {
				handleHintiOS : function (cfg) {
					useful.events.add(cfg.parent, 'touchend', function () {
						// show the interface
						cfg.parent.className = cfg.parent.className.replace(/gallery_interface_hidden/gi, 'gallery_interface_visible');
					});
				}
			}
		},
		// events
		events : {
			handleResize : function (cfg) {
				useful.events.add(window, 'resize', function () {
					gallery.updateAll(cfg);
				});
			},
			handleGestures: function (cfg) {
				cfg.startX = null;
				useful.events.set(cfg.parent, 'mousedown', function (event) {
					event = event || window.event;
					if (cfg.carouselMode) {
						cfg.startX = (navigator.userAgent.indexOf('MSIE ') > -1) ? event.x : event.screenX;
						// cancel the click event
						useful.events.cancel(event);
					}
				});
				useful.events.set(cfg.parent, 'mousemove', function (event) {
					event = event || window.event;
					if (cfg.carouselMode) {
						if (cfg.startX !== null) {
							var increment;
							// lock the click events
							cfg.recentGesture = true;
							cfg.endX = (navigator.userAgent.indexOf('MSIE ') > -1) ? event.x : event.screenX;
							// if the distance has been enough
							if (Math.abs(cfg.endX - cfg.startX) > cfg.parent.offsetWidth / 4) {
								// move one increment
								increment = (cfg.endX - cfg.startX < 0) ? 1 : -1;
								if (!cfg.animationInProgress) {
									gallery.slides.slideBy(cfg, increment);
								}
								// reset the positions
								cfg.startX = cfg.endX;
							}
							// cancel the click event
							useful.events.cancel(event);
						}
					}
				});
				useful.events.set(cfg.parent, 'mouseup', function (event) {
					event = event || window.event;
					if (cfg.carouselMode) {
						// cancel the gesture
						cfg.endX = null;
						cfg.startX = null;
						setTimeout(function () { cfg.recentGesture = false; }, 100);
						// cancel the click event
						useful.events.cancel(event);
					}
				});
				useful.events.add(cfg.parent, 'mouseout', function (event) {
					event = event || window.event;
					if (cfg.carouselMode) {
						// whipe the gesture if the mouse remains out of bounds
						cfg.timeOut = setTimeout(function () {
							cfg.endX = null;
							cfg.startX = null;
						}, 100);
						// cancel the click event
						useful.events.cancel(event);
					}
				});
				useful.events.add(cfg.parent, 'mouseover', function (event) {
					event = event || window.event;
					if (cfg.carouselMode) {
						// stop the gesture from resetting when the mouse goes back in bounds
						clearTimeout(cfg.timeOut);
						// cancel the click event
						useful.events.cancel(event);
					}
				});
			},
			handleGesturesiOS: function (cfg) {
				cfg.touchStartX = null;
				cfg.touchStartY = null;
				useful.events.add(cfg.parent, 'touchstart', function (event) {
					if (cfg.carouselMode) {
						cfg.touchStartX = event.touches[0].pageX;
						cfg.touchStartY = event.touches[0].pageY;
					}
				}, false);
				useful.events.add(cfg.parent, 'touchmove', function (event) {
					if (cfg.carouselMode) {
						if (cfg.touchStartX !== null) {
							// lock the click events
							cfg.recentGesture = true;
							cfg.touchEndX = event.touches[0].pageX;
							cfg.touchEndY = event.touches[0].pageY;
							// if the distance has been enough
							if (Math.abs(cfg.touchEndX - cfg.touchStartX) > cfg.parent.offsetWidth / 4) {
								// move one increment
								var increment = (cfg.touchEndX - cfg.touchStartX < 0) ? 1 : -1;
								if (!cfg.animationInProgress) {
									gallery.slides.slideBy(cfg, increment);
								}
								// reset the positions
								cfg.touchStartX = cfg.touchEndX;
							}
							// cancel the default browser behaviour if there was horizontal motion
							if (Math.abs(cfg.touchEndX - cfg.touchStartX) > Math.abs(cfg.touchEndY - cfg.touchStartY)) {
								event.preventDefault();
							}
						}
					}
				}, false);
				useful.events.add(cfg.parent, 'touchend', function () {
					if (cfg.carouselMode) {
						// cancel the gesture
						cfg.touchEndX = null;
						cfg.touchStartX = null;
						cfg.touchEndY = null;
						cfg.touchStartY = null;
						setTimeout(function () { cfg.recentGesture = false; }, 100);
					}
				}, false);
				useful.events.add(cfg.parent, 'touchcancel', function (event) {
					if (cfg.carouselMode) {
						// cancel the gesture
						cfg.touchEndX = null;
						cfg.touchStartX = null;
						cfg.touchEndY = null;
						cfg.touchStartY = null;
						setTimeout(function () { cfg.recentGesture = false; }, 100);
						// cancel the default browser behaviour
						event.preventDefault();
					}
				}, false);
			},
			handleMousewheel: function (cfg) {
				useful.events.set(cfg.parent, 'mousewheel', function (event) {
					var distance, increment;
					// get the scroll distance
					distance = (window.event) ? window.event.wheelDelta / 120 : -event.detail / 3;
					increment = (distance < 0) ? 1 : -1;
					// if this is carousel mode
					if (cfg.carouselMode) {
						// scroll the page
						if (!cfg.animationInProgress) {
							gallery.slides.slideBy(cfg, increment);
						}
						// cancel the click event
						useful.events.cancel(event);
					}
				});
				useful.events.set(cfg.slideContainer, 'scroll', function () {
					// if the scroll position is close to the scroll height
					if (cfg.slideContainer.scrollHeight - cfg.slideContainer.offsetHeight - cfg.slideContainer.scrollTop < cfg.fetchScrollBottom) {
						// ask for more slides
						gallery.slides.loadSlides(cfg, cfg.slideNodes.length, cfg.fetchAmount);
					}
				});
			},
			handleIdle: function (cfg) {
				// timer constant
				cfg.idleTimer = null;
				cfg.idleLoop = cfg.allowLoop;
				// events to cancel the timer
				useful.events.add(cfg.parent, 'mouseout', function () {
					// allow looping
					cfg.allowLoop = true;
					// a set the automatic gallery to start after while
					if (cfg.idleDelay > -1) {
						clearInterval(cfg.idleTimer);
						cfg.idleTimer = setInterval(function () {
							if (cfg.carouselMode) {
								gallery.slides.slideBy(cfg, cfg.idleDirection);
							}
						}, cfg.idleDelay);
					}
				});
				useful.events.add(cfg.parent, 'mouseover', function () {
					// restore looping setting
					cfg.allowLoop = cfg.idleLoop;
					// cancel the automatic gallery
					clearInterval(cfg.idleTimer);
				});
				// a set the automatic gallery to start after while
				if (cfg.idleDelay > -1) {
					clearInterval(cfg.idleTimer);
					cfg.idleTimer = setInterval(function () {
						if (cfg.carouselMode) {
							gallery.slides.slideBy(cfg, cfg.idleDirection);
						}
					}, cfg.idleDelay);
				}
			}
		}
	};

	// public functions
	useful.events = useful.events || {};
	useful.events.add = function (element, eventName, eventHandler) {
		// exceptions in event names
		eventName = (navigator.userAgent.match(/Firefox/i) && eventName.match(/mousewheel/i)) ? 'DOMMouseScroll' : eventName;
		// prefered method
		if ('addEventListener' in element) {
			element.addEventListener(eventName, eventHandler, false);
		}
		// alternative method
		else if ('attachEvent' in element) {
			element.attachEvent('on' + eventName, function (event) { eventHandler(event); });
		}
		// desperate method
		else {
			element['on' + eventName] = eventHandler;
		}
	};
	useful.events.set = function (element, eventName, eventHandler) {
		// remove any existing instance of the event handler
		useful.events.remove(element, eventName, eventHandler);
		// add the event handler again
		useful.events.add(element, eventName, eventHandler);
	};
	useful.events.remove = function (element, eventName, eventHandler) {
		// exceptions
		eventName = (navigator.userAgent.match(/Firefox/i) && eventName.match(/mousewheel/i)) ? 'DOMMouseScroll' : eventName;
		// prefered method
		if (element.removeEventListener) {
			element.removeEventListener(eventName, eventHandler, false);
		}
		// alternative method
		else if (element.detachEvent) {
			element.detachEvent('on' + eventName, eventHandler);
		}
		// desperate method
		else {
			element['on' + eventName] = null;
		}
	};
	useful.events.cancel = function (event) {
		if (event) {
			if (event.preventDefault) { event.preventDefault(); }
			else if (event.preventManipulation) { event.preventManipulation(); }
			else { event.returnValue = false; }
		}
	};

	useful.request = useful.request || {};
	useful.request.send = function (properties) {
		var serverRequest;
		// create an HTTP request
		serverRequest = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
		// add the onchange handler
		serverRequest.onreadystatechange = function () {
			useful.request.update(serverRequest, properties);
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
			serverRequest.open('GET', properties.url, true);
			// send the request
			try { serverRequest.send(); }
			catch (errorMessage) { properties.onFailure({readyState : -1, status : -1, statusText : errorMessage}); }
		}
	};
	useful.request.update = function (serverRequest, properties) {
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
	useful.request.decode = function (text) {
		var object;
		object = {};
		// if jQuery is available
		if (typeof jQuery !== 'undefined') {
			// use it
			object = jQuery.parseJSON(text);
		// if JSON.parse is available
		} else if (typeof JSON !== 'undefined' && typeof JSON.parse !== 'undefined') {
			// use it
			object = JSON.parse(text);
		// if jsonParse is available
		} else if (typeof jsonParse !== 'undefined') {
			// use it
			object = jsonParse(text);
		// else
		} else {
			// do something desperate
			eval('object = ' + text);
		}
		// return the object
		return object;
	};

	useful.models = useful.models || {};
	useful.models.clone = function (model) {
		var clonedModel, ClonedModel;
		// if the method exists
		if (typeof(Object.create) !== 'undefined') {
			clonedModel = Object.create(model);
		}
		// else use a fall back
		else {
			ClonedModel = function () {};
			ClonedModel.prototype = model;
			clonedModel = new ClonedModel();
		}
		// return the clone
		return clonedModel;
	};
	useful.models.trim = function (string) {
		return string.replace(/^\s+|\s+$/g, '');
	};

	useful.css = useful.css || {};
	useful.css.select = function (input, parent) {
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
			for (a = 0 , b = elements.length; a < b; a += 1) {
				// run the handler and pass a unique copy of the data (in case it's a model)
				input.handler(elements[a], useful.models.clone(input.data));
			}
		// else assume the function was called for a list of elements
		} else {
			// return the selected elements
			return elements;
		}
	};
	useful.css.prefix = function (property) {
		// pick the prefix that goes with the browser
		return (navigator.userAgent.match(/webkit/gi)) ? 'webkit' + property.substr(0, 1).toUpperCase() + property.substr(1):
			(navigator.userAgent.match(/firefox/gi)) ? 'Moz' + property.substr(0, 1).toUpperCase() + property.substr(1):
			(navigator.userAgent.match(/microsoft/gi)) ? 'ms' + property.substr(0, 1).toUpperCase() + property.substr(1):
			(navigator.userAgent.match(/opera/gi)) ? 'O' + property.substr(0, 1).toUpperCase() + property.substr(1):
			property;
	};
	useful.css.compatibility = function () {
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
	};
	useful.css.setClass = function (element, removedClass, addedClass, endEventHandler, jQueryDuration, jQueryEasing) {
		var replaceThis, replaceWith, endEventName, endEventFunction;
		// validate the input
		endEventHandler = endEventHandler || function () {};
		endEventName = useful.css.compatibility();
		// turn the classnames into regular expressions
		replaceThis = new RegExp(useful.models.trim(removedClass).replace(/ {2,}/g, ' ').split(' ').join('|'), 'g');
		replaceWith = new RegExp(addedClass, 'g');
		// if CSS3 transitions are available
		if (typeof endEventName !== 'undefined') {
			// set the onComplete handler and immediately remove it afterwards
			element.addEventListener(endEventName, endEventFunction = function () {
				endEventHandler();
				element.removeEventListener(endEventName, endEventFunction, true);
			}, true);
			// replace the class name
			element.className = useful.models.trim(element.className.replace(replaceThis, '') + ' ' + addedClass).replace(/ {2,}/g, ' ');
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
			element.className = useful.models.trim(element.className.replace(replaceThis, '') + ' ' + addedClass).replace(/ {2,}/g, ' ');
			// and call the onComplete handler
			endEventHandler();
		}
	};

	useful.gallery = {};
	useful.gallery.start = gallery.start;

}(window.useful = window.useful || {}));
