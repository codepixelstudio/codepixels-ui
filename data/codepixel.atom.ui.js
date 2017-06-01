define([

	'require',
	'jquery',
	'velocity',
	'velocityUI',
	'easing',
	'whatInput',
	'foundation',
	'accordion',
	'lazyload',
	'slick',
	'slimScroll',
	'socialmix'

], function( require ) {

	(function ( $ ) {
	"use strict";

		// priority script(s)

			// setup Velocity JS
				window.jQuery = window.$ = require('jquery');
				require('velocity');
				require('velocityUI');

			// ui load fx
				$('.component-reveal').velocity( 'fadeIn', {

					visibility  : 'visible',
					opacity     : 1

				}, {

					delay    : 0,
					duration : 3200,
					queue    : false,
					loop     : false,
					easing   : 'linear'

				});

				$('#pageLoadFX').fadeOut( 3600, function() {

					$(this).remove();

					console.log( '%csite UI loaded', ui_state );

					console.log( 'ready...' );

				});

			// page load fx
				$('.content-reveal').velocity( 'fadeIn', {

					delay    : 1200,
					duration : 3600

				});

			// initialize foundation
			$(document).foundation();

		// set global off-canvas menu variables
			var siteToolbarMenu       = $('#site-toolbar-menu');
			var degreeProgramsMenu    = $('#degree-programs-menu');
			var newsDrawerMenu        = $('#news-drawer-menu');
			var departmentContentMenu = $('#department-content-menu');

			// site toolbar menu variables
				var toolbarControl     = $('.toolbar-control');
				var siteToolbar        = $('#site-toolbar');
				var closeMenuToolbar   = $('#close-menu-toolbar-button');
				var siteMenuPanels     = $('#site-menu-panels');
				var toolbarMenuTabs    = $('#toolbar-controls');
				var toolbarMenuContent = $('#site-menu-panels .panel-interior');

				// main menu panel
					var mainMenuLink = $('#main-menu-panel .menu a, #university-footer .footer-logo-link, .tabs-panel a.toggle-focus');

				// search panel
					var searchTop 	  = $('#live-search-form');
					var searchStatus  = $('#search-status');
					var searchNow  	  = $('#live-search');
					var resultBox  	  = $('#search-results');
					var searchResults = $('#search-result-count');
					var resultCounter = $('#result-count');
					var searchBase    = $(searchNow).data('base');
					var signalCue     = $('#loading-results');
					var handleSearch  = searchBase + '/wp-content/themes/hhs/assets/functions/live-search.php';

				// social panel
					var socialStreamLoadMask  = $('#social-stream-load-mask');
					var socialStreamLoaderUI  = $('#social-stream-loader');
					var socialStreamContainer = $('#social-stream-container');
					var socialStreamContent   = $('#social-stream');

			// degree programs menu variables
				var programsMenuButton  = $('#degree-programs-button');
				var programsMenuContent = $('#degree-programs-menu-content');
				var programsMenuFocusEl = $('#accordion-panels');
				var programsPanelLabel  = $('#degree-programs-menu-content .panel-label');
				var programsPanelBlock	= $('#degree-programs-menu-content .panel-content-box');
				var closeDegreePrograms = $('#close-degree-programs-button');

			// news drawer menu variables
				var newsDrawerMenuButton  = $('#news-drawer-button');
				var newsDrawerMenuContent = $('#source-feed');
				var newsDrawerClearanceFx = $('.clear-for-news-drawer');
				var closeNewsDrawerButton = $('#close-news-drawer-button');
				var footerBrandTagline	  = $('#brand_tagline');
				var footerCampaignButton  = $('#campaign-button');
				var newsDrawerContent 	  = $('#the-news');
				var newsFeedReturnError   = $('#news-feed-error-message');
				var newsFeedErrorMessage  = $('#news-feed-error-message > .error-message-container');

			// department content menu variables
				var departmentMenuControl = $('#department-content-menu .toggle-content');
				var departmentMenuTabs    = $('#department-content-controls');
				var departmentProgramsTab = $('#department-programs-button');
				var closeDepartmentMenu   = $('#close-department-menu-button');
				var departmentMenuPanels  = $('#department-content-panels');
				var spotlightVideoBlock   = $('#spotlight-video-source');

		// misc. jQuery utility variables
			var scrollfix   	 = $('.scroll-fix');
			var currentSiteType  = $('body').data('site-type');
			var currentPageType  = $('body').data('page');
			var activeMediaQuery = Foundation.MediaQuery.current;
			var sidebarDropdown  = $('#page-sidebar');
			var siteUtilityBase  = $('body').data('utility-base');
			var skipToContent    = $('#skip-to-content');

		// console.log visual debug
			var ui_state   = 'color: rgba(144, 187, 34, 1.00)';
			var callback   = 'color: rgba(85, 168, 182, 0.80)';
			var callback_m = 'color: rgba(85, 168, 182, 0.47)';
			var initiated  = 'color: rgba(237, 251, 196, 1.00)';
			var brackets   = 'color: rgba(255, 255, 255, 0.35)';
			var activated  = 'color: rgba(243, 133, 72, 0.70)';
			var reset      = 'color: rgba(243, 133, 72, 0.47)';
			var asset_load = 'color: rgba(188, 197, 60, 0.60)';
			var display    = 'color: rgba(169, 74, 148, 0.85)';
			var failure    = 'color: rgba(255, 45, 45, 0.85)';

		// track focused element (disable in production)
			$( 'body' ).delegate( '*', 'focus blur', function() {

				var elem = $( this );

				setTimeout(function() {

					elem.toggleClass( 'find-me', elem.is( ':focus' ) );

					var focusedElementCue  = $('.find-me');

					var elementHasFocusTag = focusedElementCue.text();
					var cleanElementOutput = elementHasFocusTag.toLowerCase();
					var stringFocusElement = String(cleanElementOutput);
					var elementHasFocus    = $.trim(stringFocusElement);

					console.log(elementHasFocus);

				}, 0 );

			});

		// configure pre-load states for all menus

			// site toolbar menu
			function configureSiteToolbarMenu() {

				// variables

					// remove link element from faux menu label
					var submenuLabelElement = $('#main-menu-panel .menu .is-submenu-parent-item a');
					// setup tooltip on hover/focus
					var activeToolbarControl = $('.tabs-control a');

				// handle panel change events
					toolbarMenuTabs.on('change.zf.tabs', function() {

						var toolbarPanelActiveID = siteMenuPanels.find('.tabs-panel.is-active').attr('id');

						// fire social stream handler once
						if ( toolbarPanelActiveID === 'social-media-panel' ) {

							// social stream
							loadSocialStream();

							// un-bind handler
							$(this).off('change.zf.tabs');

						}

						// auto-focus on search input field
						else if ( toolbarPanelActiveID === 'search-panel' ) {

							searchNow.focus();

							searchTop.addClass('ready-to-search');

							searchNow.on('focusout', function() {

								$(this).parent().removeClass('ready-to-search');

							});

							searchNow.on('focusin', function() {

								$(this).parent().addClass('ready-to-search');

							});

						}

					});

				// replace menu labels with accessibility-friendly element
					submenuLabelElement.replaceWith(function() {

						return $('<span />', {

							'class'      : 'menu-label',
							'aria-label' : this.innerHTML

						}).append($(this).contents());

					});

				// enable TAB/SHIFT + TAB off first/last top-level menu items
					$('#main-menu-panel .menu:eq(0) > li:first').addClass('first-item');
					$('#main-menu-panel .menu:eq(0) > li:last').addClass('last-item');

				// modify DOM + tabindex + aria states
					$('#university-footer').appendTo('#main-menu-panel .is-drilldown');
					siteToolbarMenu.removeAttr('aria-hidden');
					mainMenuLink.attr('tabindex', '-1');

				// keyboard mapping

					// enable ENTER keydown trigger on toolbar
					siteToolbar.on('keydown', function( key ) {

						if ( key.which === 13 ) {

							siteToolbarMenu.foundation('open');

						}

					});

					// enable ENTER keydown trigger on menu buttons
					toolbarControl.on('keydown', function( key ) {

						if ( key.which === 13 ) {

							siteToolbarMenu.foundation('open');

						}

					});

				// toggle toolbar control tooltip
					activeToolbarControl.on('focusin', function() {

						$(this).addClass('toggle-tooltip');

					}).on('focusout', function() {

						$(this).removeClass('toggle-tooltip');

					});

				// prevent search default
					searchTop.on('submit', function() {

						searchResults.focus();

						return false;

				    });

				// live search
					function liveSearch( querystr ) {

						$.ajax({

							dataType: 'json',

							url    : handleSearch,

							type   : 'POST',

							data   : {

								search : querystr

							},

							error : function ( jqXHR, exception ) {

								console.log( '%c' + jqXHR.responseText, initiated );

								var emptyResults = '';
								var errorNote = '';
								var signal = null;

								if ( jqXHR.status === 0 ) {

									errorNote = 'error';

								} else if ( jqXHR.status === 404 ) {

									errorNote = 'Resource not found [404]';

								} else if ( jqXHR.status === 500 ) {

									errorNote = 'Internal Server Error [505]';

								} else if ( exception === 'parserror' ) {

									errorNote = 'JSON parse failed';

								} else if ( exception === 'timeout' ) {

									errorNote = 'request timed out';

								} else if ( exception === 'abort' ) {

									errorNote = 'search connection aborted';

								} else {

									errorNote = 'configuration error';

								}

								emptyResults += '<span class="error-notice">' + errorNote + '</span>';

								$(resultBox).fadeOut(360, 'easeInOutExpo', function(){

									signal = setTimeout(

										function() {

											$(signalCue).toggleClass('loading');
											$(searchStatus).html( emptyResults ).fadeIn(720, 'easeInOutExpo');

										}, 2400

									);

								});

								$(resultCounter).html( 'null' );

							},

							success : function( result ) {

								var resultsNum = result.length;
								var emptyResults = '';

								var signal = null;

								if ( result.length === 0 ) {

									emptyResults += '<span class="error-notice">nothing found</span>';

									$(resultBox).fadeOut(360, 'easeInOutExpo', function(){

										signal = setTimeout(

											function() {

												$(signalCue).toggleClass('loading');
												$(searchStatus).html( emptyResults ).fadeIn(720, 'easeInOutExpo');

											}, 2400

										);

									});

									$(resultCounter).html( resultsNum );

								} else if ( result.length >= 1 ) {

									var searchResult = '';

									$.each(result, function(index) {

										if ( index > 30 ) {

					                        return false;

					                    }

					                    // list item
					                    searchResult += '<li class="search-result">';

					                    	// result link
					                    	searchResult += '<a href="' + result[index].url + '">';

					                    		// result header
					                    		searchResult += '<div class="result-header">';

					                    			// result title
						                    		searchResult += '<span class="result-title">';

						                    			searchResult += result[index].title;

						                    		// END result title
						                    		searchResult += '</span>';

						                    		// result type
						                    		searchResult += '<span class="result-type">';

						                    			// var file_type = result[index].file;

						                    			if ( result[index].type === 'attachment' ) {

						                    				if ( result[index].file === 'image/jpeg' ) {

						                    					searchResult += 'image';

						                    				} else if ( result[index].file === 'application/pdf' ) {

						                    					searchResult += 'pdf';

						                    				} else {

						                    					searchResult += 'document';

						                    				}

						                    			} else {

						                    				searchResult += result[index].type;

						                    			}

						                    			// searchResult += 'page';

						                    		// END result title
						                    		searchResult += '</span>';

						                    	// END result header
						                    	searchResult += '</div>';

						                    	if ( result[index].text ) {

						                    		// result excerpt
						                    		searchResult += '<span class="result-text">';

						                    			searchResult += result[index].text;

						                    		// END result excerpt
						                    		searchResult += '</span>';

						                    	}

					                    	// END result link
					                    	searchResult += '</a>';

					                    // END list item
					                    searchResult += '</li>';

					                });

									$(searchStatus).fadeOut(360, 'easeInOutExpo', function(){

										signal = setTimeout(

											function() {

												$(signalCue).toggleClass('loading');
												$(resultBox).html( searchResult ).fadeIn(720, 'easeInOutExpo');

											}, 2400

										);

									});

									$(resultCounter).html( resultsNum );

								}

							}

						});

					}

					var thread = null;

					$(searchNow).on('keyup', function() {

						$(this).attr('autocomplete', 'off');
						var querystr   = $(this).val();

						if ( querystr.length <= 3 ) {

							$(resultBox).fadeOut(720, 'easeInOutExpo').empty();
							$(resultCounter).html( '0' );

						} else if ( querystr.length === 0 || querystr.length > 3 ) {

							$(searchStatus).fadeOut(720, 'easeInOutExpo').empty();

							clearTimeout(thread);

							thread = setTimeout(

								function() {

									$(signalCue).toggleClass('loading');
									liveSearch( querystr );

								},
								800

							);

						}

					});

				// done

					// check-in
					console.log( '%cconfigured site toolbar menu', callback_m );

			}

			// degree programs menu
			function configureDegreeProgramsMenu() {

				closeDegreePrograms.attr('tabindex', '0');

				console.log( '%cconfigured degree programs menu', callback_m );

			}

			// news drawer menu
			function configureNewsDrawerMenu() {

				// add elements to tabindex
				newsDrawerMenuContent.attr('tabindex', '0');
				closeNewsDrawerButton.attr('tabindex', '0');

				newsDrawerMenu.on( 'news', function() {

					var newsLoadStatus = newsDrawerMenu.attr('data-news');

					if ( newsLoadStatus === 'null' ) {

						collectNews();

						$(this).off( 'news' );

					}

				});

				console.log( '%cconfigured news drawer menu', callback_m );

			}

			// department content menu
			function configureDepartmentContentMenu() {

				// execute mobile-ready configuration function
					if ( ( activeMediaQuery === 'medium' ) || ( activeMediaQuery === 'small' ) ) {

						// relocate menu close button
						closeDepartmentMenu.appendTo('#site-header');

					}

				// focus on active tab panel
					$(departmentContentMenu).on('change.zf.tabs', function() {

						var activePanelTab  = $('.tabs > .is-active a');
						var activeMenuPanel = $('.tabs-content > .is-active');
						var activePanelEl   = $('.tabs-content > .is-active .panel-landmark');

						activePanelEl.focus();

						// force focus back to toolbar control button on panel exit
						activeMenuPanel.on('keydown', function( key ) {

							if ( key.which === 9 && key.shiftKey ) {

								activePanelTab.focus();
								console.log(key);

							}

						});

					});

				// enable ENTER key toggle
					departmentMenuControl.on('keydown', function( key ) {

						if ( key.which === 13 ) {

							departmentContentMenu.foundation('open');

						}

					});

				// format iframe string
					var spotlightVideoSource = function() {

						var spotlightVideoData = spotlightVideoBlock.data('video-src');

						if ( spotlightVideoData ) {

							return spotlightVideoData.slice(2, -2);

						}

					};

				// lazyload spotlight video iframe
					departmentMenuTabs.on('change.zf.tabs', function() {

						var activeDepartmentPanel = departmentMenuPanels.find('.is-active').attr('id');

						if ( activeDepartmentPanel === 'department-spotlight-panel' ) {

							spotlightVideoBlock.html( spotlightVideoSource );

							var spotlightVideoEmbed = spotlightVideoBlock.find('iframe');

							spotlightVideoEmbed.velocity( 'fadeIn', {

								begin    : function() {

									console.log( '%cloading video', callback_m );

								},
								delay    : 720,
								duration : 1200,
								// easing   : 'easeOutCirc',
								complete : function() {

									console.log( '%cvideo loaded', asset_load );

									departmentMenuTabs.off('change.zf.tabs');

								}

							});

						}

					});

				// remove default foundation state
				departmentContentMenu.removeAttr('aria-hidden');

				// done

					// check-in
					console.log( '%cconfigured department content menu', callback_m );

			}

		// set global on/off-canvas utility variables
			var fadeOnMenuOpen 			   = $('.fade-on-menu-open');
			var currentPageContent 		   = $('.current-page-content');
			var currentPageContentTargets  = $('.content-target-shift');
			var currentPageContentWidth    = $(currentPageContent).width();
			var horizontalViewportConstant = $('#site-content').width();
			var setHorizontalViewportGap   = horizontalViewportConstant - currentPageContentWidth;

		// menu open functions
			function menuOpenAction() {

				// menu selection varaibles
				var menuToggleOpen = $('.off-canvas.is-open');
				var menuOpenCue    = $(menuToggleOpen).attr('id');

				// action class
				menuToggleOpen.addClass('open-menu-target');

				if ( menuOpenCue === 'site-toolbar-menu' ) {

					// open menu
					openSiteToolbarMenu();

					// signoff
					console.log( '%c[ %copened site toolbar menu %c]', brackets, ui_state, brackets );

					// trap focus
					Foundation.Keyboard.trapFocus( $(siteToolbarMenu) );

				} else if ( menuOpenCue === 'degree-programs-menu' ) {

					// configure menu
					configureDegreeProgramsMenu();

					// open menu
					openDegreeProgramsMenu();

					// trap focus
					Foundation.Keyboard.trapFocus( $(degreeProgramsMenu) );

					// signoff
					console.log( '%c[ %copened degree programs menu %c]', brackets, ui_state, brackets );

				} else if ( menuOpenCue === 'news-drawer-menu' ) {

					// configure menu
					configureNewsDrawerMenu();

					// open menu
					openNewsDrawerMenu();

					// trap focus
					Foundation.Keyboard.trapFocus( $(newsDrawerMenu) );

					// signoff
					console.log( '%c[ %copened news drawer menu %c]', brackets, ui_state, brackets );

				} else if ( menuOpenCue === 'department-content-menu' ) {

					// open menu
					openDepartmentContentMenu();

					// trap focus
					Foundation.Keyboard.trapFocus( $(departmentContentMenu) );

					// signoff
					console.log( '%c[ %copened department content menu %c]', brackets, ui_state, brackets );

				}

			}

		// menu close functions
			function menuCloseAction() {

				// menu selection varaibles
				var menuToggleClose = $('.off-canvas.open-menu-target');
				var menuCloseCue    = $(menuToggleClose).attr('id');

				if ( menuCloseCue === 'site-toolbar-menu' ) {

					// close menu
					closeSiteToolbarMenu();

					// release focus
					Foundation.Keyboard.releaseFocus( $(siteToolbarMenu) );

					// signoff
					console.log( '%c[ %cclosed site toolbar menu %c]', brackets, ui_state, brackets );

				} else if ( menuCloseCue === 'degree-programs-menu' ) {

					// close menu
					closeDegreeProgramsMenu();

					// release focus
					// Foundation.Keyboard.releaseFocus( $(degreeProgramsMenu) );

					// signoff
					console.log( '%c[ %cclosed degree programs menu %c]', brackets, ui_state, brackets );

				} else if ( menuCloseCue === 'news-drawer-menu' ) {

					// close menu
					closeNewsDrawerMenu();

					// release focus
					Foundation.Keyboard.releaseFocus( $(newsDrawerMenuContent) );

					// signoff
					console.log( '%c[ %cclosed news drawer menu %c]', brackets, ui_state, brackets );

				} else if ( menuCloseCue === 'department-content-menu' ) {

					// close menu
					closeDepartmentContentMenu();

					// release focus
					Foundation.Keyboard.releaseFocus( $(departmentContentMenu) );

					// signoff
					console.log( '%c[ %cclosed department content menu %c]', brackets, ui_state, brackets );

				}

				// cleanup class
				menuToggleClose.removeClass('open-menu-target');

			}

		// menu configurations + event listeners/DOM stuff

			$(document).ready(function() {

				// high-level body attributes/queries

					// set high-level hook/function reference
					$('body').attr('data-breakpoint', activeMediaQuery );

					// select homepage billboard function
					if ( currentSiteType === 'college-site' ) {

						collegeHomepageBillboard();

					} else if ( currentSiteType === 'department-site' && currentPageType === 'homepage' ) {

						departmentHomepageBillboard();

					}

					// execute mobile-ready configuration function
					if ( ( activeMediaQuery === 'medium' ) || ( activeMediaQuery === 'small' ) ) {

						sidebarDropdown.removeClass('large-4 small-12 columns', function() {

							$(this).addClass('dropdown-pane');

						});

						$(sidebarDropdown).find('.widget:first-child ul > .accordion-navigation .submenu').addClass('is-active').css('display', 'block');

					}

				// jQuery plugins

					// set cross-browser scrollbars
					scrollfix.slimScroll({

						width  : '100%',
						height : '100%'

					});

				// menu configurations

					// prep. site toolbar menu for launch
					configureSiteToolbarMenu();

					// prep. department content menu for launch
					if ( currentSiteType === 'department-site' && currentPageType === 'homepage' ) {

						configureDepartmentContentMenu();

					}

				// visual composer

					// variables
					var accordionPanelContent = $('.vc_tta-panel .vc_tta-panel-body');
					var accessibleFAQelement  = $('.vc_toggle');

					// set attributes
					accordionPanelContent.attr('tabindex', '0');
					accessibleFAQelement.attr('tabindex', '0');

					// enable ENTER keydown trigger on FAQ title
					accessibleFAQelement.on('keydown click', function( key ) {

						if ( ( key.type === 'click' ) || ( key.which === 13 ) ) {

							var title = jQuery(this),
				                element = title.closest(".vc_toggle");

				            element.toggleClass('vc_toggle_active');

						}

					});

				// unordered lists

					// variables
					var contentList = $('#site-content article.page ul');

					contentList.attr('role', 'list');

				// done

					// check-in
					console.log( '%capplication initialized', display );

			});

			// off-canvas menu open
				$(document).on('opened.zf.offcanvas', function() {

					menuOpenAction();

				}).on('closed.zf.offcanvas', function() {

					menuCloseAction();

				});

		// site toolbar menu functions

			// activation + reset variables
				var toolbarMenuHeader   = $('#site-menu-panels .panel-heading');
				var mainMenuNestedLink  = $('#menu-main-menu .submenu a');

			// menu activation
			function activateSiteToolbarMenu() {

				// find focusable external content
				var restrictFocusAccess = Foundation.Keyboard.findFocusable($('#site-interface'));

				// remove focusable content from tabindex
				restrictFocusAccess.addClass('focusable').attr('tabindex', '-1');

				// streamline
				toolbarMenuHeader.attr('tabindex', '0');

				mainMenuLink.attr('tabindex', '0');

				mainMenuNestedLink.attr('tabindex', '0');

				// expose menu panel content
				toolbarMenuContent.attr({

					'tabindex'    : '-1',
					'aria-hidden' : 'false'

				});

				// manage input states for tab controls and tab panels in site toolbar menu
				$(siteToolbarMenu).on('change.zf.tabs', function() {

					var activeTabControl     = $('.tabs > .is-active a');
					var activeTabPanelHeader = $('.tabs-content > .is-active .panel-heading');
					var activeTabMenuPanel   = $('.tabs-content > .is-active').attr('id');

					// force focus to active panel header on panel change
					if ( activeTabMenuPanel !== 'search-panel' ) {

						activeTabPanelHeader.focus();

					}

					// force focus back to toolbar control button on panel exit
					activeTabPanelHeader.on('keydown', function( key ) {

						if ( key.which === 9 && key.shiftKey ) {

							activeTabControl.focus();
							console.log(key);

						}

					});

				});

				// check-in
				console.log( '%cactivated site toolbar menu', activated );

			}

			// menu open function
			function openSiteToolbarMenu() {

				activateSiteToolbarMenu();

				console.log('opening...');

				fadeOnMenuOpen.fadeOut(0).toggleClass('fade-state');

				var siteToolbarMenuUI = [

					{

						e : $( currentPageContent ),

						p : {

							translateX 	: [currentPageContentWidth + setHorizontalViewportGap, 0]

						},

						o : {

							queue 		  : false,
							duration 	  : 450,
							delay 		  : 0,
							easing 		  : [0.19, 1, 0.22, 1],
							sequenceQueue : false,
							complete 	  : function() {

								// the emptiness

							}

						}

					}, {

						e : $( siteToolbarMenu ),

						p : {

							translateX 	: [0, '-100%']

						},

						o : {

							queue 		  : false,
							duration 	  : 450,
							delay 		  : 0,
							easing 		  : [0.19, 1, 0.22, 1],
							sequenceQueue : false,
							complete 	  : function() {

								// the emptiness

							}

						}

					}

				];

				var siteToolbarMenuMobileUI = [

					{

						e : $( currentPageContentTargets ),

						p : {

							translateX 	: [currentPageContentWidth + setHorizontalViewportGap, 0]

						},

						o : {

							begin 		  : function() {

								console.log('foo');

							},
							queue 		  : false,
							duration 	  : 450,
							delay 		  : 0,
							easing 		  : [0.19, 1, 0.22, 1],
							sequenceQueue : false,
							complete 	  : function() {

								// the emptiness

							}

						}

					}, {

						e : $( siteToolbarMenu ),

						p : {

							// translateX 	: [0, '-100%']
							translateX 	: [0, -(siteToolbarMenu.width() - siteToolbar.width()), 0]

						},

						o : {

							queue 		  : false,
							duration 	  : 450,
							delay 		  : 0,
							easing 		  : [0.19, 1, 0.22, 1],
							sequenceQueue : false,
							complete 	  : function() {

								// the emptiness

							}

						}

					}

				];

				if ( (activeMediaQuery === 'medium') || (activeMediaQuery === 'small') ) {

					$.Velocity.RunSequence( siteToolbarMenuMobileUI );

				} else {

					$.Velocity.RunSequence( siteToolbarMenuUI );

				}

			}

			// menu close function
			function closeSiteToolbarMenu() {

				resetSiteToolbarMenu();

				console.log('closing...');

				var siteToolbarMenuUI = [

					{

						e : $( siteToolbarMenu ),

						p : {

							translateX 	: [-(siteToolbarMenu.width() - siteToolbar.width()), 0]

						},

						o : {

							queue 		  : false,
							duration 	  : 360,
							delay 		  : 0,
							easing 		  : [0.19, 1, 0.22, 1],
							sequenceQueue : false,
							complete 	  : function() {

								fadeOnMenuOpen.fadeIn(30, 'easeOutExpo').toggleClass('fade-state');

							}

						}

					},  {

						e : $( currentPageContent ),

						p : {

							translateX 	: [0, currentPageContentWidth + setHorizontalViewportGap]

						},

						o : {

							queue 		  : false,
							duration 	  : 360,
							delay 		  : 0,
							easing 		  : [0.19, 1, 0.22, 1],
							sequenceQueue : false,
							complete 	  : function() {

								// the emptiness

							}

						}

					}

				];

				var siteToolbarMenuMobileUI = [

					{

						e : $( siteToolbarMenu ),

						p : {

							translateX 	: [-(siteToolbarMenu.width() - siteToolbar.width()), 0]

						},

						o : {

							queue 		  : false,
							duration 	  : 360,
							delay 		  : 0,
							easing 		  : [0.19, 1, 0.22, 1],
							sequenceQueue : false,
							complete 	  : function() {

								fadeOnMenuOpen.fadeIn(30, 'easeOutExpo').toggleClass('fade-state');

							}

						}

					},  {

						e : $( currentPageContentTargets ),

						p : {

							translateX 	: [0, currentPageContentWidth + setHorizontalViewportGap]

						},

						o : {

							queue 		  : false,
							duration 	  : 360,
							delay 		  : 0,
							easing 		  : [0.19, 1, 0.22, 1],
							sequenceQueue : false,
							complete 	  : function() {

								// the emptiness

							}

						}

					}

				];

				if ( (activeMediaQuery === 'medium') || (activeMediaQuery === 'small') ) {

					$.Velocity.RunSequence( siteToolbarMenuMobileUI );

				} else {

					$.Velocity.RunSequence( siteToolbarMenuUI );

				}

			}

			// reset menu accessibility
			function resetSiteToolbarMenu() {

				// find focusable external content
				var restoreFocusAccess = $('#site-interface .focusable');

				// restore focusable content to tabindex
				restoreFocusAccess.removeClass('focusable').attr('tabindex', '0');

				// streamline
				mainMenuLink.attr('tabindex', '-1');

				mainMenuNestedLink.attr('tabindex', '-1');

				toolbarMenuHeader.attr('tabindex', '-1');

				toolbarMenuContent.attr({

					'tabindex'    : '-1',
					'aria-hidden' : 'true'

				});

				$('#main-menu-panel .menu').attr('aria-hidden', 'true');

				// prevent default foundation state
				siteToolbarMenu.removeAttr('aria-hidden');

				// signoff
				console.log( '%creset site toolbar menu', reset );

				// assign focus
				siteToolbar.focus();

			}

			// load social media stream
			function loadSocialStream() {

				console.log( '%cinitialized social media stream', callback );

				socialStreamLoadMask.velocity({

					opacity  : [1, 0]

				}, {

					begin    : function() {

						socialStreamLoaderUI.addClass('baller');

					},
					duration : 1200,
					delay 	 : 120,
					easing   : [0.19, 1, 0.22, 1],
					complete : function() {

						configureSocialStream();

					}

				});

				$(document).on( 'smFeedsLoaded', function() {

			        console.log( '%cstream data rendered', callback_m );

			    }).on( 'smMediaLoaded', function(  ) {

			        console.log( '%cstream media loaded', asset_load );

			        socialStreamContainer.velocity({

			        	opacity  : [1, 0]

			        }, {

			        	begin    : function() {

			        		console.log( '%cinitiating content display', display );

			        		socialStreamLoadMask.fadeOut(1600, 'easeInOutExpo', function() {

			        			socialStreamLoaderUI.removeClass('baller');

			        		});

			        	},
			        	duration : 800,
			        	delay    : 0,
			        	easing   : [0.19, 1, 0.22, 1],
			        	complete : function() {

			        		var socialStreamItemCards = $('.sm-card');

							socialStreamItemCards.velocity(

								'transition.fadeIn', {

									stagger  : 220,
									drag     : true

							});

			        	}

			        });

			    });

			}

			// configure social media stream
			function configureSocialStream() {

				// set data variable
				var socialStreams = $('#social-panel-viewport').data();

				function setLocalStreams() {

					var localStreams = $.makeArray( socialStreams );
					var feed = localStreams[0].feeds;

					var feeds = [];

					$.each( feed, function( index ) {

						var stream = {

							type: feed[index].type,
							id: feed[index].id,
							target: feed[index].target

						};

						feeds.push( stream );

					});

					console.log( '%cretrieved social media stream data', asset_load );
					return feeds;

				}

				// configure social media stream
				var options = {

					facebookAppId : '259636647831037',

					basePath : siteUtilityBase + '/wp-content/themes/hhs/assets/functions/socialmix/',
					proxy 	 : siteUtilityBase + '/wp-content/themes/hhs/assets/functions/socialmix/get_data.php',

					fixOneColumnMode  : true,
			        oneColumnTimeline : true,

			        hideAllFilters    : true,
			        hideTagsFilters   : true,
			        hideDateFilters   : true,
			        hideGoToFilter    : true,
			        hideSourceFilter  : true,

			        cardTemplate 	  : 'templates/item.html',
			        containerTemplate : 'templates/stream.html',

			        maxCardNumber     : 20,

					feeds    : setLocalStreams()

				};

				socialStreamContent.socialmix(options);

				console.log( '%cset social media stream configuration', callback_m );

			}

			// misc. site toolbar functionality tweaks

				// force site toolbar menu open on toolbar control click
				toolbarControl.click(function() {

					siteToolbarMenu.foundation('open');

				});

				// force site toolbar menu close on toolbar control click
				closeMenuToolbar.click(function() {

					siteToolbarMenu.foundation('close');

				});

		// degree programs menu functions

			// activation + reset variables
				var accordionContent = $('#degree-programs-menu-content');
				var closedPanelLabel = $('.panel-label.closed');

			// menu activation
			function activateDegreeProgramsMenu() {

				// find focusable external content
				var restrictFocusAccess = Foundation.Keyboard.findFocusable($('#site-interface'));

				// remove focusable content from tabindex
				restrictFocusAccess.addClass('focusable').attr('tabindex', '-1');

				// restore panel labels to tabindex + set focus
				closedPanelLabel.attr('tabindex', '0');
				programsMenuFocusEl.focus();

				// custom focus UI state
				programsPanelLabel.on({

					focusin: function() {

						$(this).prev().addClass('focus-state');

					},

					focusout: function() {

						$(this).prev().removeClass('focus-state');

					}

				});

				// check-in
				console.log( '%cactivated degree programs menu', activated );

			}

			// menu open function
			function openDegreeProgramsMenu() {

				activateDegreeProgramsMenu();

				// add elements to tabindex
				closeDegreePrograms.attr('tabindex', '0');

				var programsMask    = $('#programs-content-loader');
				var programsLoader  = $('#programs-content-loading');
				var panelBack 		= $('.panel-background');
				var slideBack 		= $('.slider-background');

				console.log('opening...');

				fadeOnMenuOpen.fadeOut(0).toggleClass('fade-state');

				programsLoader.addClass('baller');

				console.log( '%cloading animation initialized', callback_m );

				var degreeProgramsMenuUI = [

					{

						e : $( programsMenuButton ),

						p : {

							translateX 	: [-64, 0]

						},

						o : {

							queue 		  : false,
							duration 	  : 750,
							delay 		  : 0,
							easing 		  : [0.19, 1, 0.22, 1],
							sequenceQueue : false,
							complete 	  : function() {

								// the emptiness

							}

						}

					}, {

						e : $( degreeProgramsMenu ),

						p : {

							translateX 	: [0, '100%']

						},

						o : {

							queue 		  : false,
							duration 	  : 750,
							delay 		  : 0,
							easing 		  : [0.19, 1, 0.22, 1],
							sequenceQueue : false,
							complete 	  : function() {

								programsMenuContent.fadeIn(3600, 'easeInOutExpo');

								loadCollegeDegreePrograms();

								panelBack.lazyload();
								slideBack.lazyload();

								// programsMenuFocusEl.focus();

							}

						}

					}, {

						e : $( currentPageContent ),

						p : {

							translateX 	: [-(currentPageContentWidth + setHorizontalViewportGap), 0]

						},

						o : {

							queue 		  : false,
							duration 	  : 450,
							delay 		  : 0,
							easing 		  : [0.19, 1, 0.22, 1],
							sequenceQueue : false,
							complete 	  : function() {

								// the emptiness

							}

						}

					}, {

						e : $( programsMask ),

						p : {

							opacity  	  : [0, 1]

						},

						o : {

							queue 		  : false,
							loop 		  : false,
							easing 		  : 'linear',
							duration 	  : 2400,
							delay 		  : 0,
							sequenceQueue : true,
							complete 	  : function() {

								$( programsMask ).fadeOut(200, 'easeInOutExpo').remove();

							}

						}

					}

				];

				$.Velocity.RunSequence( degreeProgramsMenuUI );

			}

			// menu close function
			function closeDegreeProgramsMenu() {

				resetDegreeProgramsMenu();

				console.log('closing...');

				var degreeProgramsMenuUI = [

					{

						e : $( programsMenuButton ),

						p : {

							translateX 	: [0, -64]

						},

						o : {

							queue 		  : false,
							duration 	  : 750,
							delay 		  : 0,
							easing 		  : [0.19, 1, 0.22, 1],
							sequenceQueue : false,
							complete 	  : function() {

								// the emptiness

							}

						}

					}, {

						e : $( degreeProgramsMenu ),

						p : {

							translateX 	: ['100%', 0]

						},

						o : {

							queue 		  : false,
							duration 	  : 450,
							delay 		  : 0,
							easing 		  : [0.19, 1, 0.22, 1],
							sequenceQueue : false,
							complete 	  : function() {

								fadeOnMenuOpen.fadeIn(30, 'easeOutExpo').toggleClass('fade-state');

							}

						}

					}, {

						e : $( currentPageContent ),

						p : {

							translateX 	: [0, -(currentPageContentWidth + setHorizontalViewportGap)]

						},

						o : {

							queue 		  : false,
							duration 	  : 450,
							delay 		  : 0,
							easing 		  : [0.19, 1, 0.22, 1],
							sequenceQueue : false,
							complete 	  : function() {

								// the emptiness

							}

						}

					}

				];

				$.Velocity.RunSequence( degreeProgramsMenuUI );

			}

			// reset menu accessibility
			function resetDegreeProgramsMenu() {

				// find focusable external content
				var restoreFocusAccess = $('#site-interface .focusable');

				// restore focusable content to tabindex
				restoreFocusAccess.removeClass('focusable').attr('tabindex', '0');

				// remove elements from tabindex
				closeDegreePrograms.attr('tabindex', '-1');
				$('.label-background.focus-state').removeClass('focus-state');

				// release focus
				Foundation.Keyboard.releaseFocus( $(degreeProgramsMenu) );

				// signoff
				console.log( '%creset degree programs menu', reset );

				// assign focus
				programsMenuButton.focus();

			}

			// explore degree programs accordion
			function loadCollegeDegreePrograms() {

			    // configure accordion
			    accordionContent.accordionSlider({

			    	width 					: '100%',
			    	height 					: '100%',

			    	responsiveMode  		: 'auto',
		            autoplay 				: false,
		            mouseWheel 				: false,
		            keyboardOnlyOnFocus     : true,

		            openPanelDuration		: 200,
		            openedPanelSize 		: '100%',
		            openPanelOn 			: 'click',
		            maxOpenedPanelSize 		: '100%',

		            closePanelDuration 		: 200,
		            closePanelsOnMouseOut	: false,

			    	visiblePanels 			: 8,

			    	touchSwipe 				: false,

			    	breakpoints 			: {

			    		640 : {

			    			orientation   		: 'vertical',

			    			openedPanelSize 	: '100%',
			    			maxOpenedPanelSize 	: '100%',

			    			visiblePanels 		: 8

			    		}

			    	}

			    });

			    // manipulate accordion via public methods
			    var accordionData = $('#degree-programs-menu-content').data('accordionSlider');

			    // open accordion panel on ENTER
			    programsPanelLabel.each(function( index ) {

			    	// retrieve panel index
					$(this).attr('data-panel-reference', index).on('keydown', function( key ) {

						// capture key
						if ( key.which === 13 ) {

							// only open if closed
							if ( $(this).is('.as-closed') ) {

								// open panel
								accordionData.openPanel(index);

							}

						}

					});

				});

				// close panels on ENTER (if open)
				programsPanelBlock.on('keydown', function( key ) {

					// capture key
					if ( ( key.which === 13 ) && ( programsMenuContent.is('.as-opened') ) ) {

						accordionData.closePanels();

					}

				});

				// inital panel open event
			    accordionData.on('panelOpen', function() {

		    		// event-based variables
				    var openedPanelLabel = $('.as-panel.as-opened .panel-label');

				    // toggle content box tabindex
		    		$('.as-panel.as-opened .panel-content-box').attr('tabindex', '0');

		    		// classify open panel label
		    		openedPanelLabel.removeClass('closed');

		    		// remove closed panel labels from tabindex
		    		closedPanelLabel.attr('tabindex', '-1');

			    });

			    // panel open callback
			    accordionData.on('panelOpenComplete', function() {

			    	// event-based variables
		    		var openPanelFocus   = $('.as-panels > .as-panel.as-opened');
		    		var openedPanelLabel = $('.as-panel.as-opened .panel-label');
		    		var programsDescription = $('.as-panel.as-opened .description-text');

		    		// add description text to tabindex
		    		programsDescription.attr('tabindex', '0');

		    		// classify open panel label
		    		openedPanelLabel.addClass('opened');

		    		// trap focus in open panel
		    		Foundation.Keyboard.trapFocus( $(openPanelFocus) );

			    	// set focus element on panel open
			    	programsPanelBlock.focus();

			    });

			    // initial panel close event
			    accordionData.on('panelsClose', function() {

			    	// event-based variables
			    	var openPanelFocus   = $('.as-panels > .as-panel.as-opened');
			    	var openedPanelLabel = $('.panel-label.opened');

			    	// release focus to accordion panels (deliberate redundancy)
				    Foundation.Keyboard.releaseFocus( $(openPanelFocus) );

			    	// classify open panel label
			    	openedPanelLabel.removeClass('opened').addClass('closed');

			    	// restore closed panel labels to tabindex
			    	closedPanelLabel.attr('tabindex', '0');

			    });

				// panel close callback
				accordionData.on('panelsCloseComplete', function( event ) {

		    		// event-based variables
		    		var openPanelFocus = $('.as-panels > .as-panel.as-opened');

			    	// release focus to accordion panels (deliberate redundancy)
				    Foundation.Keyboard.releaseFocus( $(openPanelFocus) );

			    	if ( degreeProgramsMenu.is('.is-open') ) {

			    		// select closed panel from index
				    	var closedProgramPanel = event.previousIndex;

				    	// return closed panel data
				    	var closedPanelDataSet = accordionData.getPanelAt(closedProgramPanel);

				    	// refine object
				    	var closedPanelDataKey = $.map(closedPanelDataSet, function( data ) {

				    		return data.context;

				    	});

				    	if ( 'id' in closedPanelDataKey[0] ) {

				    		// retrieve ID value + construct target element selector
					    	var closedPanelFocusID = closedPanelDataKey[0].id;
					    	var setPanelCloseFocus = $('#' + closedPanelFocusID + '-control');

					    	// set focus element on panel close
				    		setPanelCloseFocus.focus();

				    	}

				    }

			    });

			    // close accordion on menu close
			    degreeProgramsMenu.on('closed.zf.offcanvas', function() {

					accordionData.closePanels();

					// remove accordion panel labels from tabindex
					closedPanelLabel.attr('tabindex', '-1');

				});

			}

		// news drawer menu functions

			// activation + reset variables

			// manage initial activation states
			function activateNewsDrawerMenu() {

				// news article variable
				var newsDrawerArticleLink = $('#the-news .article-link');

				// add news articles to tabindex
				newsDrawerArticleLink.attr('tabindex', '0');

				// find focusable external content
				var restrictFocusAccess = Foundation.Keyboard.findFocusable($('#site-interface'));

				// remove focusable content from tabindex
				restrictFocusAccess.addClass('focusable').attr('tabindex', '-1');

				// check-in
				console.log( '%cactivated news drawer menu', activated );

			}

			// menu open function
			function openNewsDrawerMenu() {

				activateNewsDrawerMenu();

				// local variables
				var newsCurtain	= $('#gradient-reveal');
				var newsLoader 	= $('#page-loader');

				console.log('opening...');

				console.log( '%cloading animation initialized', callback_m );

				var newsDrawerMenuUI = [

					{

						e : $( fadeOnMenuOpen ),

						p : {

							opacity 	: [0, 1]

						},

						o : {

							begin 		  : function() {

								newsLoader.addClass('baller');

							},
							queue 		  : false,
							duration 	  : 30,
							delay 		  : 0,
							easing 		  : [0.19, 1, 0.22, 1],
							sequenceQueue : true,
							complete 	  : function() {

								// the emptiness

							}

						}

					}, {

						e : $( footerBrandTagline ),

						p : {

							// translateX 	: ['100%', 0]
							opacity  	: [0, 1]

						},

						o : {

							begin 		  : function() {

								currentPageContent.velocity('transition.fadeOut', 360);

							},
							queue 		  : false,
							// duration 	  : 450,
							duration 	  : 60,
							delay 		  : 0,
							easing 		  : [0.19, 1, 0.22, 1],
							sequenceQueue : false,
							complete 	  : function() {

								newsLoader.fadeIn(720, 'easeInOutExpo');

							}

						}

					}, {

						e : $( newsDrawerClearanceFx ),

						p : {

							translateX 	: ['100%', 0]

						},

						o : {

							queue 		  : false,
							duration 	  : 360,
							delay 		  : 0,
							easing 		  : [0.19, 1, 0.22, 1],
							sequenceQueue : false,
							complete 	  : function() {

								// the emptiness

							}

						}

					}, {

						e : $( newsDrawerMenu ),

						p : {

							translateY 	: [0, '100%']

						},

						o : {

							begin         : function() {

								// the emptiness

							},
							queue 		  : false,
							duration 	  : 720,
							delay 		  : 120,
							easing 		  : [0.19, 1, 0.22, 1],
							sequenceQueue : false,
							complete 	  : function() {

								// collectNews();
								$(this).trigger( 'news' );

							}

						}

					}, {

						e : $( footerCampaignButton ),

						p : {

							translateX 	: [0, '100%']

						},

						o : {

							queue 		  : false,
							duration 	  : 360,
							delay 		  : 490,
							easing 		  : [0.19, 1, 0.22, 1],
							sequenceQueue : false,
							complete 	  : function() {

								// the emptiness

							}

						}

					}, {

						e : $( newsCurtain ),

						p : {

							opacity 	: [0, 1]

						},

						o : {

							duration 	  : 2800,
							delay 		  : 720,
							easing 		  : [0.75,0.82,0.165,1],
							sequenceQueue : true,
							complete 	  : function() {

								var newsArticle = $('.article-link');

								newsArticle.attr('tabindex', '0');

								$.Velocity.RegisterUI( 'articleRender.card', {

									defaultDuration : 360,
									calls : [

										[{

											opacity : 1.000

										}]

									]

								});

								newsArticle.velocity(

									'articleRender.card', {

										stagger  : 160,
										drag     : true

								});

								newsArticle.first().focus();

								$(this).remove();

								newsLoader.velocity({

									opacity : [0, 1]

								}, {

									duration : 2400,
									delay    : 0,
									easing   : [0.75,0.82,0.165,1],
									complete : function() {

										$(this).remove();

									}

								});

							}

						}

					}, {

						e : $( newsDrawerContent ),

						p : {

							opacity 	: [1, 0]

						},

						o : {

							duration 	  : 1600,
							delay 		  : 800,
							easing 		  : [0.75,0.82,0.165,1],
							sequenceQueue : false,
							complete 	  : function() {

								Foundation.Keyboard.trapFocus( $(newsDrawerMenuContent) );

							}

						}

					}

				];

				$.Velocity.RunSequence( newsDrawerMenuUI );

			}

			// menu close function
			function closeNewsDrawerMenu() {

				resetNewsDrawerMenu();

				console.log('closing...');

				var newsDrawerMenuUI = [

					{

						e : $( newsDrawerClearanceFx ),

							p : {

								translateX 	: [0, '100%']

							},

							o : {

								queue 		  : false,
								duration 	  : 450,
								delay 		  : 0,
								easing 		  : [0.19, 1, 0.22, 1],
								sequenceQueue : false,
								complete 	  : function() {

									var newsArticle = $('.article-link');

									newsArticle.attr('tabindex', '-1');

								}

							}

					}, {

						e : $( newsDrawerMenu ),

							p : {

								translateY 	: ['100%', 0]

							},

							o : {

								begin 		  : function() {

									// the emptiness

								},
								queue 		  : false,
								duration 	  : 450,
								delay 		  : 0,
								easing 		  : [0.19, 1, 0.22, 1],
								sequenceQueue : false,
								complete 	  : function() {

									currentPageContent.velocity('transition.fadeIn', 360);

								}

							}

					}, {

						e : $( footerCampaignButton ),

							p : {

								translateX 	: ['100%', 0]

							},

							o : {

								queue 		  : false,
								duration 	  : 450,
								delay 		  : 0,
								easing 		  : [0.19, 1, 0.22, 1],
								sequenceQueue : false,
								complete 	  : function() {

									// the emptiness

								}

							}

					}, {

						e : $( footerBrandTagline ),

							p : {

								translateX 	: [0, '100%']

							},

							o : {

								queue 		  : false,
								duration 	  : 450,
								delay 		  : 220,
								easing 		  : [0.19, 1, 0.22, 1],
								sequenceQueue : false,
								complete 	  : function() {

									// the emptiness

								}

							}

					}, {

						e : $( fadeOnMenuOpen ),

							p : {

								opacity 	: [1, 0]

							},

							o : {

								queue 		  : false,
								duration 	  : 420,
								delay 		  : 280,
								easing 		  : [0.19, 1, 0.22, 1],
								sequenceQueue : false,
								complete 	  : function() {

									// the emptiness

								}

							}

					}

				];

				$.Velocity.RunSequence( newsDrawerMenuUI );

			}

			// reset news drawer menu for continued accessibility
			function resetNewsDrawerMenu() {

				// find focusable external content
				var restoreFocusAccess = $('#site-interface .focusable');

				// restore focusable content to tabindex
				restoreFocusAccess.removeClass('focusable').attr('tabindex', '0');

				// remove menu content elements from tabindex
				newsDrawerMenuContent.attr('tabindex', '-1');
				closeNewsDrawerButton.attr('tabindex', '-1');

				// signoff
				console.log( '%creset news drawer menu', reset );

				// assign focus
				newsDrawerMenuButton.focus();

			}

			// retrieve colllege SOURCE feed
			function collectNews() {

		        $.ajax({

		            dataType: 'json',

		        	// default call: returns 10 items, change [tag] or [category_name] as needed
		            // url: 'https://source.colostate.edu/wp-json/wp/v2/posts/?filter[tag]=college-of-health-and-human-sciences&_embed',

		            // custom call: returns appended # of items
		            url: 'https://source.colostate.edu/wp-json/wp/v2/posts/?filter[tag]=college-of-health-and-human-sciences&per_page=20',

		            type: 'GET',

		            error : function ( jqXHR, exception ) {

						console.log(jqXHR.responseText);

						var emptyNews = '';
						var newsError = '';
						var signal = null;

						if ( jqXHR.status === 0 ) {

							newsError = 'There was a problem loading news content.';

						} else if ( jqXHR.status === 404 ) {

							newsError = 'Resource not found [404]';

						} else if ( jqXHR.status === 500 ) {

							newsError = 'Internal Server Error [505]';

						} else if ( exception === 'parserror' ) {

							newsError = 'JSON parse failed';

						} else if ( exception === 'timeout' ) {

							newsError = 'Request timed out.';

						} else if ( exception === 'abort' ) {

							newsError = 'Search connection aborted.';

						} else {

							newsError = 'Configuration error.';

						}

						emptyNews += '<span class="message">' + newsError + '<br /><em>please try again later</em></span>';

						$(newsFeedReturnError).fadeIn(2400, 'easeInOutExpo', function() {

							signal = setTimeout(

								function() {

									$(newsFeedErrorMessage).html( emptyNews );

								}, 2400

							);

						});

					},

		            success: function(response) {

		            	console.log( '%csuccessfully connected to SOURCE', callback_m );

		            	// build article html
		                var storyContent = '';

		                $.each(response, function(index) {

		                	// remove HTTPS from article link
		                	var articleLink = response[index].link;
		                    var articleHTTP = articleLink.replace(/^https:\/\//i, 'http://');

			                // article link
			            	storyContent += "<a class='article-link menu-content' href='" + articleHTTP + "' target='_blank' tabindex='-1'>";

			                	// header w/ image and title + meta
			                    storyContent += "<header class='article-header'>";

			                    	// image
			                        if (response[index].featured_image) {

			                        	storyContent += "<span class='article-image' style='background-image:url(" + response[index].featured_image.source_url + ");'></span>";

			                        } else {

			                        	storyContent += "<span class='article-image' style='background-image:url(assets/img/billboards/billboard_00_HHS.jpg);'></span>";

			                        }

			                    	// meta
			                        storyContent += "<span class='article-meta'>";

									$.each(response[index].categories,function(catindex,value){

										storyContent += "<span class='post-category category-" + response[index].categories[0] + "'>" + getCategory(value) + "</span>";

									});

			                        var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
			                        var date = new Date(response[index].date);
			                        var formatDate = (monthNames[date.getMonth()]) + ' ' + date.getDate() + ', ' +  date.getFullYear();

			                        storyContent += "<span class='date'>" + formatDate + "</span>";

			                        storyContent += "</span>";

			                    storyContent += "</header>";

			                	// article content
			                    storyContent += "<section class='article-content'>";

			                    	// title
			                        storyContent += "<h2 class='article-title'>" + response[index].title.rendered + "</h2>";

			                    	// content
			                        storyContent += "<p>" + response[index].excerpt.rendered + "</p>";

			                    storyContent += "</section>";

			                storyContent += "</a>";

		                });

		            	// insert automagically created divs into existing html container
		                $('.source-feed-articles').append(storyContent);

		            }

		        });

		        function getCategory(categoryID) {

		            var catName;

		           	$.ajax({

		        		dataType: 'json',

						async: false,

						url: 'https://source.colostate.edu/wp-json/wp/v2/categories/' + categoryID,

						type: 'GET',

		               	success: function(response) {

		                	catName = response.name;

		                }

		        	});

		            return catName;

		        }

		        newsDrawerMenu.attr('data-news', 'loaded');

		    }

		    // misc. news drawer functionality tweaks

		// department content menu functions

			// activation + reset variables
				var scrubLaunchOverlay   = $('.custom-off-canvas-overlay');
				var departmentMenuButton = $('#department-menu-button');
				var activeMenuPanelTab   = $('#department-content-controls .tabs-title.is-active');
				var focusableInSiteMenus = Foundation.Keyboard.findFocusable($('#site-menus'));
				var departmentUpdateLink = $('#department-updates .article-link');

			// calculate UI frame offset
				function frameUI() {

					if ( activeMediaQuery === 'small' ) {

						return 48;

					} else if ( activeMediaQuery === 'medium' ) {

						return 64;

					}

				}

				var setSiteFrameUI = frameUI();

			// menu activation
			function activateDepartmentContentMenu() {

				// execute mobile-ready configuration function
					if ( ( activeMediaQuery === 'medium' ) || ( activeMediaQuery === 'small' ) ) {

						// the emptiness

					}

				// promote menu close overlay in z-index
				siteToolbarMenu.toggleClass('adjust-stack');

				// insert department update posts into tabindex
				departmentUpdateLink.attr('tabindex', '0');

				// find focusable external content
				var restrictFocusAccess = Foundation.Keyboard.findFocusable($('#site-header, #department-billboard-content, #site-menus'));

				// remove focusable content from tabindex
				restrictFocusAccess.addClass('focusable').attr('tabindex', '-1');

				// remove inactive off-canvas menus from tabindex
				focusableInSiteMenus.addClass('focusable').attr('tabindex', '-1');

				// presentation class + inherited UI state(s)
				departmentMenuTabs.toggleClass('content-menu-closed').toggleClass('content-menu-open');

				// configure custom menu close overlay
				scrubLaunchOverlay.attr('data-close', 'department-content-menu').toggleClass('mobile-menu-active');

				// check-in
				console.log( '%cactivated department homepage content menu', activated );

			}

			// menu open function
			function openDepartmentContentMenu() {

				activateDepartmentContentMenu();

				console.log('opening...');

				var panelOpenedBlurFx 	= $('.page-blur-fx.opened');
				var panelClosedBlurFx 	= $('.page-blur-fx.closed');
				var panelContainer  	= $('#department-billboard-content-container');
				var panelContentBox 	= $('#department-billboard-content');
				var panelContentColor 	= $('#department-color-container');

				// source feed load UI
				var sourceLoadMask  = $('#source-content-loader');
				var sourceLoading   = $('#source-content-loading');

				// set menu height variable
				var setPanelHeight  = $('#department-billboard').height();
				var calcSiteFrameUI = setPanelHeight - setSiteFrameUI;

				// standard animation sequence
				var menuContentUI = [

					{

						e : $( fadeOnMenuOpen ),

						p : {

							opacity 	  : [0, 1]

						},

						o : {

							queue 		  : false,
							duration 	  : 0,
							delay 		  : 10,
							easing 		  : [0.75,0.82,0.165,1],
							sequenceQueue : false,
							complete 	  : function() {

								// the emptiness

							}

						}

					}, {

						e : $( panelClosedBlurFx ),

						p : {

							opacity 	  : [0, 1]

						},

						o : {

							queue 		  : false,
							duration 	  : 0,
							delay 		  : 10,
							easing 		  : [0.75,0.82,0.165,1],
							sequenceQueue : false,
							complete 	  : function() {

								// the emptiness

							}

						}

					}, {

						e : $( panelContainer ),

						p : {

							height 		  : [setPanelHeight - 192, 384]

						},

						o : {

							queue 		  : false,
							duration 	  : 360,
							delay 		  : 0,
							easing 		  : [0.75,0.82,0.165,1],
							sequenceQueue : false,
							complete 	  : function() {

								deliverNews();

								$(departmentProgramsTab).toggleClass('active-content');

							}

						}

					}, {

						e : $( panelContentColor ),

						p : {

							height  	  		 : ['100%', 0],
							backgroundColor 	 : '#021F23',
							backgroundColorAlpha : 0.615

						},

						o : {

							queue 		  : false,
							duration 	  : 120,
							delay 		  : 0,
							easing 		  : [0.75,0.82,0.165,1],
							sequenceQueue : false,
							complete 	  : function() {

								// the emptiness

							}

						}

					}, {

						e : $( panelContentBox ),

						p : {

							opacity 	: [0, 1],
							translateY  : [0, '-100%']

						},

						o : {

							queue 		  : false,
							duration 	  : 360,
							delay 		  : 0,
							easing 		  : [0.75,0.82,0.165,1],
							sequenceQueue : false,
							complete 	  : function() {

								sourceLoading.addClass('baller');
								$(this).toggleClass('menu-open');

							}

						}

					}, {

						e : $( departmentMenuPanels ),

						p : {

							translateX  : [0, '100%'],
							opacity 	: [1, 0]

						},

						o : {

							queue 		  : false,
							duration 	  : 360,
							delay 		  : 0,
							easing 		  : [0.75,0.82,0.165,1],
							sequenceQueue : true,
							complete 	  : function() {

								$('#the-feed').delay(1200).fadeIn(1200, 'easeInOutExpo');

							}

						}

					}, {

						e : $( panelOpenedBlurFx ),

						p : {

							opacity 	  : [1, 0],

						},

						o : {

							queue 		  : false,
							duration 	  : 120,
							delay 		  : 0,
							easing 		  : [0.75,0.82,0.165,1],
							sequenceQueue : true,
							complete 	  : function() {

								$('.tabs-panel.is-active .panel-landmark').focus();

							}

						}

					}, {

						e : $( sourceLoadMask ),

						p : {

							opacity 	: [0, 1]

						},

						o : {

							queue 		  : false,
							duration 	  : 2400,
							delay 		  : 1200,
							easing 		  : [0.75,0.82,0.165,1],
							sequenceQueue : false,
							complete 	  : function() {

								$(sourceLoadMask).delay(1200).fadeOut(1200, 'easeInOutExpo').remove();

							}

						}

					}

				];

				// mobile animation sequence
				var menuContentMobileUI = [

					{

						e : $( fadeOnMenuOpen ),

						p : {

							opacity 	  : [0, 1]

						},

						o : {

							queue 		  : false,
							duration 	  : 0,
							delay 		  : 10,
							easing 		  : [0.75,0.82,0.165,1],
							sequenceQueue : false,
							complete 	  : function() {

								// the emptiness
								console.log( '%cexecuted mobile menu operation', callback );

							}

						}

					}, {

						e : $( panelClosedBlurFx ),

						p : {

							opacity 	  : [0, 1]

						},

						o : {

							queue 		  : false,
							duration 	  : 0,
							delay 		  : 10,
							easing 		  : [0.75,0.82,0.165,1],
							sequenceQueue : false,
							complete 	  : function() {

								// the emptiness
								deliverNews();

								$(departmentProgramsTab).toggleClass('active-content');

							}

						}

					}, {

						e : $( departmentContentMenu ),

						p : {

							height 		  : [calcSiteFrameUI, setSiteFrameUI]

						},

						o : {

							queue 		  : false,
							duration 	  : 360,
							delay 		  : 0,
							easing 		  : [0.75,0.82,0.165,1],
							sequenceQueue : false,
							complete 	  : function() {

								deliverNews();

								$(departmentProgramsTab).toggleClass('active-content');

							}

						}

					}, {

						e : $( panelContentColor ),

						p : {

							height  	  		 : ['100%', 0],
							backgroundColor 	 : '#021F23',
							backgroundColorAlpha : 0.615

						},

						o : {

							queue 		  : false,
							duration 	  : 120,
							delay 		  : 0,
							easing 		  : [0.75,0.82,0.165,1],
							sequenceQueue : false,
							complete 	  : function() {

								// the emptiness

							}

						}

					}, {

						e : $( panelContentBox ),

						p : {

							translateY  : [0, '-100%']

						},

						o : {

							queue 		  : false,
							duration 	  : 360,
							delay 		  : 0,
							easing 		  : [0.75,0.82,0.165,1],
							sequenceQueue : false,
							complete 	  : function() {

								sourceLoading.addClass('baller');
								$(this).toggleClass('menu-open');

							}

						}

					}, {

						e : $( departmentMenuPanels ),

						p : {

							translateX  : [0, '100%']

						},

						o : {

							queue 		  : false,
							duration 	  : 360,
							delay 		  : 0,
							easing 		  : [0.75,0.82,0.165,1],
							sequenceQueue : true,
							complete 	  : function() {

								$('#the-feed').delay(1200).fadeIn(1200, 'easeInOutExpo');

							}

						}

					}, {

						e : $( closeDepartmentMenu ),

						p : {

							translateX  : [0, '100%']

						},

						o : {

							queue 		  : false,
							duration 	  : 120,
							delay 		  : 0,
							easing 		  : [0.75,0.82,0.165,1],
							sequenceQueue : true,
							complete 	  : function() {

								// the emptiness

							}

						}

					}, {

						e : $( panelOpenedBlurFx ),

						p : {

							opacity 	  : [1, 0],

						},

						o : {

							queue 		  : false,
							duration 	  : 120,
							delay 		  : 0,
							easing 		  : [0.75,0.82,0.165,1],
							sequenceQueue : true,
							complete 	  : function() {

								$('.tabs-panel.is-active .panel-landmark').focus();

							}

						}

					}, {

						e : $( sourceLoadMask ),

						p : {

							opacity 	: [0, 1]

						},

						o : {

							queue 		  : false,
							duration 	  : 2400,
							delay 		  : 1200,
							easing 		  : [0.75,0.82,0.165,1],
							sequenceQueue : false,
							complete 	  : function() {

								$(sourceLoadMask).delay(1200).fadeOut(1200, 'easeInOutExpo').remove();

							}

						}

					}

				];

				if ( (activeMediaQuery === 'medium') || (activeMediaQuery === 'small') ) {

					$.Velocity.RunSequence( menuContentMobileUI );

				} else {

					$.Velocity.RunSequence( menuContentUI );

				}

			}

			// menu close function
			function closeDepartmentContentMenu() {

				resetDepartmentContentMenu();

				console.log('closing...');

				// content panel targets
				var panelOpenedBlurFx 	= $('.page-blur-fx.opened');
				var panelClosedBlurFx 	= $('.page-blur-fx.closed');
				var panelContainer  	= $('#department-billboard-content-container');
				var panelContentBox 	= $('#department-billboard-content');
				var panelContentColor 	= $('#department-color-container');

				// set menu height variable
				var setPanelHeight  = $('#department-billboard').height();
				var calcSiteFrameUI = setPanelHeight - setSiteFrameUI;

				// standard animation sequence
				var menuContentUI = [

					{

						e : $( panelOpenedBlurFx ),

						p : {

							opacity 	  : [0, 1]

						},

						o : {

							queue 		  : false,
							duration 	  : 0,
							delay 		  : 0,
							easing 		  : [0.75,0.82,0.165,1],
							sequenceQueue : false,
							complete 	  : function() {

								// the emptiness

							}

						}

					}, {

						e : $( departmentMenuPanels ),

						p : {

							translateX  : ['100%', 0],
							opacity 	: [0, 1]

						},

						o : {

							queue 		  : false,
							duration 	  : 360,
							delay 		  : 0,
							easing 		  : [0.75,0.82,0.165,1],
							sequenceQueue : false,
							complete 	  : function() {

								// the emptiness

							}

						}

					}, {

						e : $( panelContainer ),

						p : {

							height 		  : [384, setPanelHeight - 192]

						},

						o : {

							queue 		  : false,
							duration 	  : 240,
							delay 		  : 0,
							easing 		  : [0.75,0.82,0.165,1],
							sequenceQueue : true,
							complete 	  : function() {

								// the emptiness

							}

						}

					}, {

						e : $( panelContentColor ),

						p : {

							height  	  		 : [0, '100%'],
							backgroundColor 	 : '#021F23',
							backgroundColorAlpha : 0

						},

						o : {

							queue 		  : false,
							duration 	  : 240,
							delay 		  : 0,
							easing 		  : [0.75,0.82,0.165,1],
							sequenceQueue : false,
							complete 	  : function() {

								// the emptiness

							}

						}

					}, {

						e : $( panelContentBox ),

						p : {

							opacity 	: [1, 0],
							translateY  : ['-100%', 0]

						},

						o : {

							queue 		  : false,
							duration 	  : 240,
							delay 		  : 0,
							easing 		  : [0.75,0.82,0.165,1],
							sequenceQueue : false,
							complete 	  : function() {

								// the emptiness

							}

						}

					}, {

						e : $( panelClosedBlurFx ),

						p : {

							opacity 	  : [1, 0],

						},

						o : {

							queue 		  : false,
							duration 	  : 220,
							delay 		  : 240,
							easing 		  : 'linear',
							sequenceQueue : false,
							complete 	  : function() {

								// the emptiness

							}

						}

					}, {

						e : $( fadeOnMenuOpen ),

						p : {

							opacity 	  : [1, 0],

						},

						o : {

							queue 		  : false,
							duration 	  : 220,
							delay 		  : 240,
							easing 		  : 'linear',
							sequenceQueue : false,
							complete 	  : function() {

								// the emptiness

							}

						}

					}

				];

				var menuContentMobileUI = [

					{

						e : $( panelOpenedBlurFx ),

						p : {

							opacity 	  : [0, 1]

						},

						o : {

							queue 		  : false,
							duration 	  : 0,
							delay 		  : 0,
							easing 		  : [0.75,0.82,0.165,1],
							sequenceQueue : false,
							complete 	  : function() {

								// the emptiness

							}

						}

					}, {

						e : $( departmentMenuPanels ),

						p : {

							translateX  : ['100%', 0]

						},

						o : {

							queue 		  : false,
							duration 	  : 360,
							delay 		  : 0,
							easing 		  : [0.75,0.82,0.165,1],
							sequenceQueue : false,
							complete 	  : function() {

								// the emptiness

							}

						}

					}, {

						e : $( closeDepartmentMenu ),

						p : {

							translateX  : ['100%', 0]

						},

						o : {

							queue 		  : false,
							duration 	  : 120,
							delay 		  : 0,
							easing 		  : [0.75,0.82,0.165,1],
							sequenceQueue : true,
							complete 	  : function() {

								// the emptiness

							}

						}

					}, {

						e : $( departmentContentMenu ),

						p : {

							height 		  : [setSiteFrameUI, calcSiteFrameUI]

						},

						o : {

							queue 		  : false,
							duration 	  : 240,
							delay 		  : 0,
							easing 		  : [0.75,0.82,0.165,1],
							sequenceQueue : true,
							complete 	  : function() {

								// the emptiness

							}

						}

					}, {

						e : $( panelContentColor ),

						p : {

							height  	  		 : [0, '100%'],
							backgroundColor 	 : '#021F23',
							backgroundColorAlpha : 0

						},

						o : {

							queue 		  : false,
							duration 	  : 240,
							delay 		  : 0,
							easing 		  : [0.75,0.82,0.165,1],
							sequenceQueue : false,
							complete 	  : function() {

								// the emptiness

							}

						}

					}, {

						e : $( panelContentBox ),

						p : {

							translateY  : [-setPanelHeight + setSiteFrameUI, 0]

						},

						o : {

							queue 		  : false,
							duration 	  : 240,
							delay 		  : 0,
							easing 		  : [0.75,0.82,0.165,1],
							sequenceQueue : false,
							complete 	  : function() {

								// the emptiness

							}

						}

					}, {

						e : $( panelClosedBlurFx ),

						p : {

							opacity 	  : [1, 0],

						},

						o : {

							queue 		  : false,
							duration 	  : 220,
							delay 		  : 240,
							easing 		  : 'linear',
							sequenceQueue : false,
							complete 	  : function() {

								// the emptiness

							}

						}

					}, {

						e : $( fadeOnMenuOpen ),

						p : {

							opacity 	  : [1, 0],

						},

						o : {

							queue 		  : false,
							duration 	  : 220,
							delay 		  : 240,
							easing 		  : 'linear',
							sequenceQueue : false,
							complete 	  : function() {

								// the emptiness

							}

						}

					}

				];

				if ( (activeMediaQuery === 'medium') || (activeMediaQuery === 'small') ) {

					$.Velocity.RunSequence( menuContentMobileUI );

				} else {

					$.Velocity.RunSequence( menuContentUI );

				}

			}

			// reset menu accessibility
			function resetDepartmentContentMenu() {

				// execute mobile-ready configuration function
					if ( (activeMediaQuery === 'medium') || (activeMediaQuery === 'small') ) {

						// the emptiness

					}

				// promote menu close overlay in z-index
				siteToolbarMenu.toggleClass('adjust-stack');

				// remove department update posts from tabindex
				departmentUpdateLink.attr('tabindex', '-1');

				$('#department-billboard-content').toggleClass('menu-open');

				// find focusable external content
				var restoreFocusAccess = Foundation.Keyboard.findFocusable($('#site-header, #department-billboard-content, #site-menus'));

				// restore focusable content to tabindex
				restoreFocusAccess.removeClass('focusable').attr('tabindex', '0');

				// restore inactive off-canvas menus to tabindex
				focusableInSiteMenus.removeClass('focusable').attr('tabindex', '0');

				// presentation class + inherited UI state(s)
				departmentMenuTabs.toggleClass('content-menu-closed').toggleClass('content-menu-open');

				// configure custom menu close overlay
				scrubLaunchOverlay.removeAttr('data-close').toggleClass('mobile-menu-active');

				// review ==========
				activeMenuPanelTab.removeClass('is-active');

				// signoff
				console.log( '%creset department homepage content menu', reset );

				// assign focus
				departmentMenuButton.focus();

			}

			// department SOURCE feed
			function deliverNews() {

		        var newsFeed    	= $('#the-feed').attr('data-news');
		        var newsFeedSource  = 'https://source.colostate.edu/wp-json/wp/v2/posts/?filter[tag]=' + newsFeed + '&_embed';

		        $.ajax({

		            dataType: 'json',

		           	url: newsFeedSource,

		            type: 'GET',

		            success: function( response ) {

		                var storyContent = '';

		                $.each(response, function( index ) {

		                    if (index > 11) {

		                        return false;

		                    }

		                    // remove HTTPS from article link
		                    var articleLink = response[index].link;
		                    var articleHTTP = articleLink.replace(/^https:\/\//i, 'http://');

		                // article wrapper
		                    storyContent += "<div class='article-wrapper'>";

		                    // link
		                    	storyContent += "<a class='article-link' href='" + articleHTTP + "' target='_blank' tabindex='0' title='" + response[index].title.rendered + "'>";

			                    // header
			                    	storyContent += "<div class='article-header'>";

				                    // title
				                        storyContent += "<span class='article-title'>" + response[index].title.rendered + "</span>";

				                // END header
				                	storyContent += "</div>";

				                // content container
				                	storyContent += "<div class='article-content-container'>";

				                    // image
				                        if (response[index].featured_image) {

				                        	storyContent += "<div class='article-image' style='background-image:url(" + response[index].featured_image.source_url + ");'></div>";

				                        } else {

				                        	storyContent += "<div class='article-image' style='background-image:url(assets/img/billboards/billboard_00_HHS.jpg);'></div>";

				                        }

				                    // content
				                        storyContent += "<span class='article-content'>" + response[index].excerpt.rendered + "</span>";

				                // END content container
				                	storyContent += "</div>";

		                    // link
		                    	storyContent += "</a>";

		                // END article wrapper
		                	storyContent += "</div>";

		                });

		                $('#the-feed').html( storyContent);

		            }

		        });

		    }

			// misc. department content functionality tweaks

				// force department content menu open on toolbar control click
				departmentMenuControl.click(function() {

					departmentContentMenu.foundation('open');

				});

		// homepage billboard functions

			// department homepage billboard
			function departmentHomepageBillboard() {

				var departmentBillboard  = $('#department-billboard-slides');
				var departmentContentBox = $('#department-content-box');
				var departmentLazyLoaded = $('#department-billboard-slides .lazy');

				departmentBillboard.on('init', function(){

					var activeContentBox = $('.slick-active').find('.department-billboard-content-box');
					activeContentBox.attr({

						'tabindex' : '0',
						'id' 	   : 'main-content'

					});

					$( departmentLazyLoaded ).lazyload();

					$('.billboard-dots').attr({

						'aria-hidden': 'true',
						'tabindex': '-1'

					});

				});

				// slick content box
				departmentContentBox.slick({

					asNavFor 		: '#department-billboard-slides',

					dots 			: true,
					appendDots 		: $('#department-billboard-dots'),
					customPaging   	: function() {

		                    		  	  return $(' ').text(' ');

		                			  },

					prevArrow 		: $('#prev-arrow-control'),
					nextArrow 		: $('#next-arrow-control'),

					infinite 		: false,
					slidesToShow 	: 1,
					slidesToScroll  : 1,

					speed 			: 720,
					cssEase			: 'cubic-bezier(0.075,0.82,0.165,1)',
					fade 			: true,
					waitForAnimate  : true,

					responsive : [{

						breakpoint : 768,
						settings : {

							dots      		: false,
							autoplay  		: true,
							autoplaySpeed   : 10000,
							infinite 		: true

						}

					}]

				});

				// slick billboard
				departmentBillboard.slick({

					asNavFor 		: '#department-content-box',

					dots 			: false,
					arrows 			: false,

					adaptiveHeight  : true,
					infinite 		: true,
					slidesToShow 	: 1,
					slidesToScroll  : 1,
					touchThreshold  : 2,

					speed 			: 720,
					cssEase			: 'cubic-bezier(0.075,0.82,0.165,1)',
					waitForAnimate  : true,

					responsive : [{

						breakpoint : 768,
						settings : {

							dots      		: false,
							autoplay  		: true,
							autoplaySpeed   : 10000,
							infinite		: true

						}

					}]

				});

				departmentBillboard.on('beforeChange', function(){

					$( departmentLazyLoaded ).lazyload({

						threshold 	: 100

					});

				});

				// skip to content button

					// force focus on click
					skipToContent.on('click', function() {

						setTimeout( function() {

							$('#main-content').focus();

						}, 100 );

						$('#main-content').toggleClass('foo');

					});

			}

			// college homepage billboard
			function collegeHomepageBillboard() {

				var collegeBillboard     = $('#college-billboard-slides');
				var collegeContentBox    = $('#content-box');

				collegeBillboard.on('init', function(){

					var activeContentBox = $('.slick-active').find('.billboard-content-box');
					activeContentBox.attr({

						'tabindex' : '0',
						'id' 	   : 'main-content'

					});

					$('.lazy').lazyload();

					$('.billboard-dots').attr({

						'aria-hidden': 'true',
						'tabindex': '-1'

					});

				});

				collegeContentBox.slick({

					asNavFor 		: '#college-billboard-slides',

					dots 			: true,
					dotsClass		: 'billboard-dots',
					appendDots 		: $('.billboard-dots-container'),
					customPaging   	: function() {

		                    		  	  return $(' ').text(' ');

		                			  },

					prevArrow 		: $('#prev-arrow-control'),
					nextArrow 		: $('#next-arrow-control'),

					infinite 		: true,
					slidesToShow 	: 1,
					slidesToScroll  : 1,

					speed 			: 720,
					cssEase 		: 'linear',
					fade 			: true,
					waitForAnimate  : false,

					responsive : [{

						breakpoint : 768,
						settings : {

							dots      		: false,
							autoplay  		: true,
							autoplaySpeed   : 10000,
							infinite		: true

						}

					}]

				});

				collegeBillboard.slick({

					asNavFor 		: '#content-box',

					dots 			: false,
					arrows 			: false,

					adaptiveHeight  : true,
					infinite 		: true,
					slidesToShow 	: 1,
					slidesToScroll  : 1,
					touchThreshold  : 2,

					speed 			: 720,
					cssEase 		: 'cubic-bezier(0.075,0.82,0.165,1)',
					waitForAnimate  : false,

					responsive : [{

						breakpoint : 768,
						settings : {

							dots      		: false,
							// autoplay  		: true,
							autoplay 		: false,
							autoplaySpeed   : 10000,
							infinite		: true

						}

					}]

				});

				collegeBillboard.on('beforeChange', function() {

					$('.lazy').lazyload({

						threshold 	: 100

					});

				});

				// skip to content button

					// force focus on click
					skipToContent.on('click', function() {

						setTimeout( function() {

							$('#main-content').focus();

						}, 100 );

						$('#main-content').toggleClass('foo');

					});

				// destroy on mobile device rotation

					// event handler
					collegeBillboard.on('destroy.landscape', function() {

						console.log( '%cdestroyed', failure );

					});

			}

	}( jQuery ));

});
