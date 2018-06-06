var pimg = "default.jpg";

//homeapp.constant('aurl', 'http://localhost:8081');
function facImgPathFilter() {
    return function (input) {
        if (angular.isUndefinedOrNull(input)) {
            return null;
        } else {
            var path = input.substr(0, 1) + "/" + input.substr(1, 2) + "/" + input;
            return path;
        }
    };
}
;
function imgSizeFilter() {
    return function (input, size) {
        if (input) {
            var src = input;
            var ext = src.substring(src.lastIndexOf("."));
            if (ext === ".jpg" || ext === ".png" || ext === ".jpeg")
                src = input.substr(0, input.lastIndexOf("."));

            var path = src.substr(0, 1) + "/" + src.substr(1, 2) + "/" + src.substr(3, 1) + "/" + src;
            var sz = "";
            if (size === 40) {
                sz = "-40x40.jpg";
            }
            if (size === 108) {
                sz = "-108x108.jpg";
            }
            if (size === 206) {
                sz = "-206x206.jpg";
            }
            if (size === 660) {
                sz = "-660x495.jpg";
            }
            if (sz != "")
                return path + sz;
            else if (ext === ".jpg" || ext === ".png" || ext === ".jpeg")
                return path + ext;
        } else {
            return "default.jpg";
        }
    };
}
;
function AdsImgSizeFilter() {
    return function (input) {
        if (input) {
            var path = input.substr(0, 1) + "/" + input;
            return path;
        } else {
            return "default.jpg";
        }
    };
}
;
function logofilter() {
    return function (input) {
        if (input) {
            return input.substr(0, 1) + "/" + input + "-60x60.jpg";
        } else {
            return "default.jpg";
        }
    };
}
; 
function zerofilter() {
    return function (input) {
        if (input) {
			var tmp = input;
			if(input.length > 1 && input[0] == '0')
				tmp = input.replace(/^0+/, '');
            return tmp;
        } else {
            return null;
        }
    };
}
; 
function imagefilter() {
    return function (input, size) {
        if (input) {
			input = input.split(".")[0];
            if (size === 40) {
                sz = "-40x40.jpg";
            }
            if (size === 60) {
                sz = "-60x60.jpg";
            }
            if (size === 80) {
                sz = "-80x80.jpg";
            }
            if (size === 108) {
                sz = "-108x108.jpg";
            }
            if (size === 206) {
                sz = "-206x206.jpg";
            }
            if (size === 660) {
                sz = "-660x495.jpg";
            }
            if (size === 850) {
                sz = "-270x850.jpg";
            }
            if (size === 404) {
                sz = "-165x404.jpg";
            }
            return input.substr(0, 1) + "/" +  input.substr(1, 1)+ "/" + input + sz;

        } else {
            return "default.jpg";
        }
    };
}
;
function nullImgFilter() {
    return function (obj) {
        if (!angular.isDefined(obj) || obj === null) {
            return pimg;
        } else {
            return obj;
        }
    };
}
;
function makeHyphen() {
    return function (obj) {
        if (typeof obj === "string") {
            str = obj.replace(/\s+/g, '-').toLowerCase();
            return str;
        } else {
            return obj;
        }
    };
}
;
function playerFirstName() {
    return function (obj) {
        str = (obj.split(" ")[0] !== null) ? obj.split(" ")[0] : obj;
        return str;
    };
}
function initialFilter(){
	return function(obj){
		if(obj !== undefined){
			fname = obj.split(" ")[0];
			lname = ' ';
			if(obj.split(" ")[1] !== null)
				lname = obj.split(" ")[1];
			return fname.charAt(0) + "" + lname.charAt(0);
		}		
	}
}
;
angular.isUndefinedOrNull = function (val) {
    return angular.isUndefined(val) || val === null;
};

angular.module('sem', ['sharedServices', 'ngDialog', 'xeditable', '720kb.datepicker', 'ui.select', 'ngSanitize', 'textAngular', 'youtube-embed'])
        //.factory('authInterceptor', authInterceptor)
        //.service('user', userService)
        // .service('auth', authService)
        //.service('util', utilService)
        //.service('detailsService', detailsService)
        // .constant('API', 'http://52.220.30.79:8081')
        /*.config(function ($httpProvider) {
         $httpProvider.interceptors.push('authInterceptor');
         })
         .controller('Login', loginCtrl)*/
        //.controller('Home', homeCtrl)
        // .controller('Details', detailsCtrl)
		
        .config(['$compileProvider', function ($compileProvider) {
             $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|whatsapp):/);
        }])
        .filter('nullimg', nullImgFilter)
        .filter('makeHyphen', makeHyphen)
        .filter('playerFirstName', playerFirstName)
        .filter('facimgpath', facImgPathFilter)
        .filter('imagefilter',imagefilter)
        .filter('imgsize', imgSizeFilter)
        .filter('adsimgsize', AdsImgSizeFilter)
        .filter('logofilter', logofilter)
        .filter('zerofilter', zerofilter)
		.filter('initials', initialFilter)
        .directive('errSrc', [function () {
                return {
                    link: function (scope, element, attr) {
                        element.bind('error', function () {
                            if (attr.src != attr.errSrc) {
                                attr.$set('src', attr.errSrc);
                            }
                        });
                    }
                }
            }])
		.directive('profileErrSrc', [function () {
                return {
                    link: function (scope, element, attr) {
                        element.bind('error', function () {
                            $(element[0]).hide();
                        });
						scope.$watch(function(){return attr['ngSrc']}, function (newValue, oldValue) {
							if(newValue !== oldValue){
								$(element[0]).show();
								element.bind('error', function () {
									$(element[0]).hide();
								});
							}						
						});						
                    }
                }
            }])	
        .directive('autoFocus', ['$timeout', function ($timeout) {
                return {
                    restrict: 'A',
                    link: function (scope, element, attr) {
                        $timeout(function () {
                            element[0].focus();
                        });
                    }
                }
            }])
        .directive('setFocus', ['$timeout', function ($timeout) {
                return {
                    restrict: 'A',
                    link: function (scope, element, attr) {
                        $(element).click(function () {
                            $timeout(function () {
                                $('#' + attr.setFocus).focus();
                            }, 100);
                        });
                    }
                }
            }])
        .directive("compareTo", [function () {
                return {
                    require: "ngModel",
                    scope: {
                        otherModelValue: "=compareTo"
                    },
                    link: function (scope, element, attributes, ngModel) {
                        ngModel.$validators.compareTo = function (modelValue) {
                            return modelValue == scope.otherModelValue;
                        };
                        scope.$watch("otherModelValue", function () {
                            ngModel.$validate();
                        });
                    }
                }
            }])
        .directive('autoHidePopup', ['$document', function ($document) {
                return {
                    restrict: 'A',
                    scope: {
                        flag: "="
                    },
                    link: function (scope, element, attr, controller) {
                        scope.flag = false;
                        $document.bind('click', function (event) {
                            var isClickedElementChildOfPopup = $(element).find($(event.target)).length > 0;
                            if (isClickedElementChildOfPopup)
                                return;

                            scope.flag = false;
                            scope.$apply();
                        });
                    }
                }
            }])
        .directive('lightgallery', [function () {
                var isCreated = false;
                return {
                    restrict: 'A',
                    link: function (scope, element, attr, controller) {
                        if (scope.$last) {
                            element.parent().lightGallery();
                            isCreated = true;
                        }
                        if (isCreated) {
                            element.parent().data('lightGallery').destroy(true);
                            element.parent().lightGallery();
                        }
                    }
                }
            }])
        .directive('customtip', function () {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    // Tooltip code
                    var target = false, tooltip = false, title = false;
                    jQuery(element).bind('mouseenter', function ()
                    {
                        target = jQuery(this);
                        tip = target.attr('title');
                        tooltip = jQuery('<div id="tooltip"></div>');

                        if (!tip || tip == '')
                            return false;

                        target.removeAttr('title');
                        tooltip.css('opacity', 0)
                                .html(tip)
                                .appendTo('body');

                        var init_tooltip = function ()
                        {
                            if (jQuery(window).width() < tooltip.outerWidth() * 1.5)
                                tooltip.css('max-width', jQuery(window).width() / 2);
                            else
                                tooltip.css('max-width', 340);

                            var pos_left = target.offset().left + (target.outerWidth() / 2) - (tooltip.outerWidth() / 2),
                                    pos_top = target.offset().top - tooltip.outerHeight() - 20;

                            if (pos_left < 0)
                            {
                                pos_left = target.offset().left + target.outerWidth() / 2 - 20;
                                tooltip.addClass('left');
                            } else
                                tooltip.removeClass('left');

                            if (pos_left + tooltip.outerWidth() > jQuery(window).width())
                            {
                                pos_left = target.offset().left - tooltip.outerWidth() + target.outerWidth() / 2 + 20;
                                tooltip.addClass('right');
                            } else
                                tooltip.removeClass('right');

                            if (pos_top < 0)
                            {
                                var pos_top = target.offset().top + target.outerHeight();
                                tooltip.addClass('top');
                            } else
                                tooltip.removeClass('top');

                            tooltip.css({left: pos_left, top: pos_top + 16, opacity: 1});
                            //.animate( { top: '+=18', opacity: 1 }, 50 );
                        };

                        init_tooltip();
                        jQuery(window).resize(init_tooltip);

                        var remove_tooltip = function ()
                        {
                            tooltip.animate({top: '-=10', opacity: 0}, 50, function ()
                            {
                                jQuery(this).remove();
                            });

                            target.attr('title', tip);
                        };

                        target.bind('mouseleave', remove_tooltip);
                        tooltip.bind('click', remove_tooltip);
                    });
                    // End tooltip code
                }
            };
        })
        .directive('gmap', [function () {
                return {
                    restrict: 'EA',
                    replace: true,
                    scope: {
                        markers: "="
                    },
                    template: '<div id="map"></div>',
                    link: function (scope, element, attr) {
                        element.css({
                            width: attr.mwidth,
                            height: attr.mheight
                        });
                        var map = new google.maps.Map(document.getElementById('map'), {
                            zoom: 6,
                            center: scope.markers[0],
                            mapTypeId: google.maps.MapTypeId.ROADMAP
                        });

                        var markers = [];
                        var bounds = new google.maps.LatLngBounds();
                        var infowindow = new google.maps.InfoWindow();
                        var marker;
                        for (i = 0; i < scope.markers.length; i++) {
                            marker = new google.maps.Marker({
                                position: new google.maps.LatLng(scope.markers[i].lat, scope.markers[i].lng),
                                title: scope.markers[i].title,
                                map: map
                            });
                            bounds.extend(marker.getPosition());
                            marker.addListener('click', function () {
                                infowindow.setContent(this.title);
                                infowindow.open(map, this);
                            });
                            markers.push(marker);
                        }
                        if (scope.markers.length > 1) {
                            map.fitBounds(bounds);
                        } else {
                            map.fitBounds(bounds);
                            map.setZoom(6);
                        }

                        // Update markers
                        scope.$watch(function () {
                            return scope.markers;
                        }, function (newValue, oldValue) {
                            if (map != undefined && newValue != oldValue) {
                                for (var i = 0; i < markers.length; i++) {
                                    markers[i].setMap(null);
                                }
                                markers = [];
                                bounds = new google.maps.LatLngBounds();
                                for (var i = 0; i < scope.markers.length; i++) {
                                    marker = new google.maps.Marker({
                                        position: new google.maps.LatLng(scope.markers[i].lat, scope.markers[i].lng),
                                        title: scope.markers[i].title,
                                        map: map
                                    });
                                    bounds.extend(marker.getPosition());
                                    marker.addListener('click', function () {
                                        infowindow.setContent(this.title);
                                        infowindow.open(map, this);
                                    });
                                    markers.push(marker);
                                }
                                if (scope.markers.length > 1) {
                                    map.fitBounds(bounds);
                                } else {
                                    map.fitBounds(bounds);
                                    map.setZoom(6);
                                }
                            }
                        }, true);
                    }
                }
        }])
		.directive('tabScroller', ['$window', '$timeout', function($window, $timeout){
			return {
				scope: {
                    api: "=?",
                    preventTabChange: "@"
                },
				link: function(scope, elem, attrs){
					var _activeTab = 0;
					var _tabs;
                    var _isHidden = false;
                    
                    scope.api = {
                        doRecalculate:function(){
                            $timeout(function(){scope.onResize(true);})
                        }
                    };

					scope.onResize = function(){
						if(jQuery(elem).parents('.tabItem').css('display') == 'none'){
							_isHidden = true;
							jQuery(elem).parents('.tabItem').css({visibility:'hidden'});
							jQuery(elem).parents('.tabItem').addClass('current');
						}
						
						var _width = 0;						
						_tabs = elem.querySelectorAll('.scrolltab');
						angular.forEach(_tabs, function(el){
							_width += jQuery(el).outerWidth(true) + 1;
						});

						jQuery(elem).find('.scrolltabContainer').css('width', _width);
						if(_isHidden){
							_isHidden = false;
							jQuery(elem).parents('.tabItem').css({visibility:''});
							jQuery(elem).parents('.tabItem').removeClass('current');
                        }
                        
                        if(!scope.preventTabChange){
                            scope.changeTab(_activeTab);
                        }
                    };
                    
                    if(!scope.preventTabChange){
                        // Tab click event
                        jQuery(elem).find('.scrolltabContainer').on('click', '.scrolltab', function(event){
                            var _index = jQuery(elem).find('.scrolltab').index(this);
                            if(_activeTab !== _index){
                                _activeTab = _index;
                                scope.changeTab(_activeTab);
                            }
                        });
                    }
					
					// Tab swipe event
					/* jQuery('.scrolltabData').swipe({
						swipe: function (event, direction, distance, duration, fingerCount, fingerData) {
							if(scope.isMobile === 'true'){
								if (direction == 'left') {
									if(_activeTab < _tabs.length-1){
										_activeTab += 1;
										scope.changeTab(_activeTab);
									}								 
								} else if (direction == 'right') {
									if(_activeTab > 0){
										_activeTab -= 1;
										scope.changeTab(_activeTab);
									}
								}
							}
						},
						threshold: 0
					}); */
					// Tab change function
					scope.changeTab = function(index){
						jQuery(elem).find('.scrolltab').removeClass('active');
						jQuery(elem).find('.scrolltab:eq('+index+')').addClass('active');
						jQuery(elem).find('.scrolltabData').removeClass('active').css('display','none');
						jQuery(elem).find('.scrolltabData:eq('+index+')').addClass('active').css('display','block');
						/* var _howFar = jQuery(elem).find('.active').position().left + 7;
						var _width  = jQuery(elem).find('.active').outerWidth();
						jQuery(elem).find('.subtabslider').css({
							left: _howFar + 'px',
							width: _width + 'px'
						}); */
					}					
					
					angular.element($window).bind('resize', function() {
						scope.onResize();
                    });
                    
					$timeout(function(){
						scope.onResize();						
					},2000);
				}
			}
		}])
		.directive('customDialog', [function(){
			return {
				restrict: 'E',
				scope: {
					dialogMsg: "@",
					dialogShow: "=",
					handler: "&"					
				},
				template: "<div class='cDialogBoxContainer' ng-show='dialogShow'><div class='cDialogBoxContent'><p>{{dialogMsg}}</p><div class='cDialogBoxOkBtn stdBtn' ng-click='handler()'>OK</div></div></div>",
				link : function(scope, elem, attrs){
					/* scope.$watch("dialogShow", function (newValue, oldValue) {
						if(newValue !== oldValue){
							scope.$apply();
							console.log("changes")
						}						
					}); */						
				}	
			}
		}])		
//DO NOT ADD SEMICOLON AT THE END

.constant('API', 'http://stage.sportsextramile.com/api');