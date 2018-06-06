;
function homeCtrl(user, auth, $window, $scope, GeneralService, ngDialog) {
    "ngInject";
    var self = this;
    var userInfo = auth.getUserDetails();
    var id = userInfo.id;
    var uname = userInfo.fName + ' ' + userInfo.lName;
    self.uid = userInfo.id;
    self.uname = uname;
    self.comment = [];
    self.isFocus = {
        submitted: []
    };
	self.localVars = {};
    self.isMobile = (function (a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) {
            return true;
        } else {
            return false;
        }
    })(navigator.userAgent || navigator.vendor || window.opera);
    if (self.isMobile) {
        self.showSecond = false;
        if (window.JSInterface) { 
            window.JSInterface.setToken(auth.getToken());
            window.JSInterface.checkUpdatedVersion(4,2);
        }
    } else {
        self.showSecond = true;
    }
    GeneralService.getLocation();
	
	// get Sport Tournaments
	self.getAllTournaments = function (sport) {
		if(sport != self.tournaments.sport){
			self.tournaments = {};
			self.tournaments.sport = sport;
			if(self.tournamentime == "running")
				self.listRunningTournaments();
			if(self.tournamentime == "coming")
				self.listComingTournaments();		
			if(self.tournamentime == "past")
				self.listPastTournaments();
		}
	};
	
	// List current/ongoing/running tournaments
	self.listRunningTournaments = function(){
		self.tournamentime = "running";
		if(angular.isUndefinedOrNull(self.tournaments.running)){
			self.tournaments.running = {}
			self.tournaments.running.page = 0;
			GeneralService.listRunningTournaments(self.tournaments.sport, self.tournaments.running.page).then(function success(response){
				var status = response.data ? response.data.success : null;
				if (status) {
					var temp = response.data.extras.data;
					var temp1 = [];
					for(var i = 0; i < temp.length; i++) {
						if(!angular.isUndefinedOrNull(temp[i].schedule)) {
							temp1.push(temp.splice(i, 1)[0]);
						}
					}
					temp1 = temp1.concat(temp);
					self.tournaments.running.data = temp1;
					self.tournaments.running.page = 1;
				}
			});
		}	
	};
	
	// List upcoming tournaments
	self.listComingTournaments = function(){
		self.tournamentime = "coming";	
		if(angular.isUndefinedOrNull(self.tournaments.coming)){
			self.tournaments.coming = {}
			self.tournaments.coming.page = 0;
			GeneralService.listComingTournaments(self.tournaments.sport, self.tournaments.coming.page).then(function success(response){
				var status = response.data ? response.data.success : null;
				if (status) {
					self.tournaments.coming.data = response.data.extras.data;
					self.tournaments.coming.page = 1;
				}
			});
		}	
	};
	
	// List past tournaments
	self.listPastTournaments = function(){
		self.tournamentime = "past";
		if(angular.isUndefinedOrNull(self.tournaments.past)){
			self.tournaments.past = {}
			self.tournaments.past.page = 0;
			GeneralService.listPastTournaments(self.tournaments.sport, self.tournaments.past.page).then(function success(response){
				var status = response.data ? response.data.success : null;
				if (status) {
					self.tournaments.past.data = response.data.extras.data;
					self.tournaments.past.page = 1;
				}
			});
		}	
	};
	
	// List sports
	self.tournaments = {
		running: {
			page: 0
		}
	};
	self.tournaments.sport = "Cricket";
	self.tournamentime = "running";
	
	GeneralService.listSports().then(function (response) {
		var status = response.data ? response.data.success : null;
		if (status) {
			var allsprts = response.data.extras.data;
			allsprts.sort(function(a, b){return (a < b) ? -1 : (a > b) ? 1 : 0;}); // sorting ascending
			allsprts.splice(allsprts.indexOf(self.tournaments.sport), 1); 
			GeneralService.listRunningTournaments(self.tournaments.sport, self.tournaments.running.page).then(function success(response1){
				var status1 = response1.data ? response1.data.success : null;
				if (status1) {
					// tournaments while page load
					var temp = response1.data.extras.data;
					var temp1 = [];
					for(var i = 0; i < temp.length; i++) {
						if(!angular.isUndefinedOrNull(temp[i].schedule)) {
							temp1.push(temp.splice(i, 1)[0]);
						}
					}
					temp1 = temp1.concat(temp);
					self.tournaments.running.data = temp1;					
					self.tournaments.running.page = 1;					
					
					// Sports
					var playingsprt = response1.data.extras.sports;
					playingsprt.sort(function(a, b){return (a < b) ? -1 : (a > b) ? 1 : 0;}); // sorting ascending
					playingsprt.splice(playingsprt.indexOf(self.tournaments.sport), 1);
					self.allsports = [];
					angular.forEach(allsprts, function(item, index){
						var isExist = false;
						angular.forEach(playingsprt, function(i, ind){
							if(item === i){
								isExist = true;
							}
						});
						if(isExist){
							self.allsports.splice(0, 0, {'name':item, 'isplayed':true});
						}else{
							self.allsports.push({'name':item});
						}	
					});
					self.allsports.splice(0, 0, {'name':self.tournaments.sport, 'isplayed':true});
				}
			});
		}	
	});
	
	self.autoPagination = function(){
		$(window).scroll(function(){
			if(self.localVars.isProcessing){
				return false;
			}
			
			if ($(window).scrollTop() >= ($(document).height() - $(window).height())*0.4){
				
				// Running tournament pagination
				if(self.tournamentime == 'running' && angular.isUndefinedOrNull(self.tournaments.running.nopage)){
					self.localVars.isProcessing = true;
					GeneralService.listRunningTournaments(self.tournaments.sport, self.tournaments.running.page).then(function success(response){
						var status = response.data ? response.data.success : null;
						if (status) {
							if(response.data.extras.data.length){
								var temp = response.data.extras.data;
								var temp1 = [];
								for(var i = 0; i < temp.length; i++) {
									if(!angular.isUndefinedOrNull(temp[i].schedule)) {
										temp1.push(temp.splice(i, 1)[0]);
									}
								}
								temp1 = temp1.concat(temp);
								self.tournaments.running.data = self.tournaments.running.data.concat(temp1);
								self.tournaments.running.page = self.tournaments.running.page + 1;
							}else{
								self.tournaments.running.nopage = true;
							}
							self.localVars.isProcessing = false;
						}
					});
				}
				
				// Coming tournament pagination
				if(self.tournamentime == 'coming' && angular.isUndefinedOrNull(self.tournaments.coming.nopage)){
					self.localVars.isProcessing = true;
					GeneralService.listComingTournaments(self.tournaments.sport, self.tournaments.coming.page).then(function success(response){
						var status = response.data ? response.data.success : null;
						if (status) {
							if(response.data.extras.data.length){
								self.tournaments.coming.data = self.tournaments.coming.data.concat(response.data.extras.data);
								self.tournaments.coming.page = self.tournaments.coming.page + 1;
							}else{
								self.tournaments.coming.nopage = true;
							}
							self.localVars.isProcessing = false;
						}
					});
				}
				
				// Past tournament pagination
				if(self.tournamentime == 'past' && angular.isUndefinedOrNull(self.tournaments.past.nopage)){
					self.localVars.isProcessing = true;
					GeneralService.listPastTournaments(self.tournaments.sport, self.tournaments.past.page).then(function success(response){
						var status = response.data ? response.data.success : null;
						if (status) {
							if(response.data.extras.data.length){
								self.tournaments.past.data = self.tournaments.past.data.concat(response.data.extras.data);
								self.tournaments.past.page = self.tournaments.past.page + 1;
							}else{
								self.tournaments.past.nopage = true;
							}
							self.localVars.isProcessing = false;
						}
					});
				}				
			}
		});
	}
	self.autoPagination();
	
    function handleData(result) {
        if (result.data.extras.data.prof.location < 1) {
            ngDialog.open({
                template: '/dialogs/set-location.html',
				closeByDocument: false,
				onOpenCallback: function(){
					if (!angular.isUndefinedOrNull(window.JSInterface)) {
						window.JSInterface.enableSwipeToRefresh();
					}
				},
				preCloseCallback: function(){
					if (!angular.isUndefinedOrNull(window.JSInterface)) {
						window.JSInterface.disableSwipeToRefresh();
					}
				}
            });
        } else {
            self.items = result.data.extras.data.items;
            self.friends = result.data.extras.data.friends;
            self.groups = result.data.extras.data.groups;
            GeneralService.myFriends = self.friends;
            GeneralService.myGroups = self.groups;
            self.profile = result.data.extras.data.prof;
            self.ipath = result.data.extras.data.fipath;
        }
    }

    $scope.$on('newItemAdded', function () {
        self.items.unshift(GeneralService.newItem);
        GeneralService.newItem = null;
    });
    $scope.$on('newCommentAdded', function () {
        angular.forEach(self.items, function (item, index) {
            if (item._id === GeneralService.newComment.dcid) {
                if (item.comCount) {
                    item.comCount = parseInt(item.comCount) + 1;
                } else {
                    item.comCount = 1;
                    item.comments = [];
                }
                item.comments.push(GeneralService.newComment);
            }
        });
        GeneralService.newComment = null;
    });
	$scope.$on('newEventAddedOnHomeFeed', function () {
		self.items.unshift(GeneralService.newEventOnHomeFeed);
		GeneralService.newEventOnHomeFeed = null;
	});
    self.loadHome = function () {
        user.loadHome()
                .then(handleData);
    };
    self.loadHome();

    self.createGroup = function () {
        ngDialog.open({
            template: '/dialogs/create-group.html',
			closeByDocument: false,
			onOpenCallback: function(){
				if (!angular.isUndefinedOrNull(window.JSInterface)) {
					window.JSInterface.enableSwipeToRefresh();
				}
			},
			preCloseCallback: function(){
				if (!angular.isUndefinedOrNull(window.JSInterface)) {
					window.JSInterface.disableSwipeToRefresh();
				}
			}
        });
    };
    self.homeCreateEvent = function (data) {
        //console.log(data);
        GeneralService.homeEventData = data;
        ngDialog.open({
            template: '/dialogs/create-home-event.html',
			closeByDocument: false,
			onOpenCallback: function(){
				if (!angular.isUndefinedOrNull(window.JSInterface)) {
					window.JSInterface.enableSwipeToRefresh();
				}
			},
			preCloseCallback: function(){
				if (!angular.isUndefinedOrNull(window.JSInterface)) {
					window.JSInterface.disableSwipeToRefresh();
				}
			}
        });
    };
    self.homeCreateDiscussion = function (data, type) {
        GeneralService.homeDiscussionData = data;
        GeneralService.homeDiscussionType = type;
        ngDialog.open({
            template: '/dialogs/create-discussion.html',
			closeByDocument: false,
			onOpenCallback: function(){
				if (!angular.isUndefinedOrNull(window.JSInterface)) {
					window.JSInterface.enableSwipeToRefresh();
				}
			},
			preCloseCallback: function(){
				if (!angular.isUndefinedOrNull(window.JSInterface)) {
					window.JSInterface.disableSwipeToRefresh();
				}
			}
        });
    };
    self.showDetailDiscussion = function (did, type) {
        GeneralService.discussionId = did;
        ngDialog.open({
            template: '/dialogs/detail-discussion.html',
			closeByDocument: false,
			onOpenCallback: function(){
				if (!angular.isUndefinedOrNull(window.JSInterface)) {
					window.JSInterface.enableSwipeToRefresh();
				}
			},
			preCloseCallback: function(){
				if (!angular.isUndefinedOrNull(window.JSInterface)) {
					window.JSInterface.disableSwipeToRefresh();
				}
			}
        });
    };
    self.showDetailArticle = function (aid, type, articletype) {
        GeneralService.articleId = aid;
        GeneralService.articleT = articletype;
        ngDialog.open({
            template: '/dialogs/detail-article.html',
			closeByDocument: false,
			onOpenCallback: function(){
				if (!angular.isUndefinedOrNull(window.JSInterface)) {
					window.JSInterface.enableSwipeToRefresh();
				}
			},
			preCloseCallback: function(){
				if (!angular.isUndefinedOrNull(window.JSInterface)) {
					window.JSInterface.disableSwipeToRefresh();
				}
			}
        });
    };
    self.createComment = function (did, index) {
        if (self.comment[index] == "" || self.comment[index] == undefined) {
            self.isFocus.submitted[index] = true;
            return;
        }
        self.isFocus.submitted[index] = false;
        var cmntText = '<p>' + self.linkify(self.comment[index]) + '</p>';
        var createCommentData = {
            did: did,
            uid: id,
            comment: cmntText
        };
        GeneralService.postComment(createCommentData).then(function (result) {
            if (result.data.success == true) {
                var newComment = {
                    'dcid': did,
                    'uid': id,
                    'name': uname,
                    'pic': userInfo.id + '.jpg',
                    'cmnt': cmntText,
                    'date': new Date()
                };
                console.log(newComment)
                if (self.items[index].comCount) {
                    self.items[index].comCount = parseInt(self.items[index].comCount) + 1;
                } else {
                    self.items[index].comCount = 1;
                    self.items[index].comments = [];
                }
                self.items[index].comments.push(newComment);
                self.comment[index] = '';
            } else {
                alert(result.data.extras.msg.message);
            }
        });
    };
    self.linkify = function (text) {
        //var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig; 
        var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
        return text.replace(urlRegex, function (url, b, c) {
            if ((url.indexOf(".jpg") > 0) || (url.indexOf(".png") > 0) || (url.indexOf(".gif") > 0)) {
                return '<img src="' + url + '">';
            } else {
                var url2 = (c == 'www.') ? 'http://' + url : url;
                return '<a href="' + url2 + '" target="_blank">' + url + '</a>';
            }
        });
    };

    self.likeThisItem = function (index, type) {
        var likeData = {
            uid: id,
            iid: self.items[index]._id,
            type: type,
            like: true
        };
        GeneralService.likeItems(likeData).then(function (result) {
            if (result.data.success == true) {
                if (self.items[index].likeCount) {
                    self.items[index].likeCount = parseInt(self.items[index].likeCount) + 1;
                } else {
                    self.items[index].likeCount = 1;
                }
                console.log('success');
            } else {
                //alert(result.data.extras.msg.message);
            }
            //self.subsCount = result.data.extras.data.items
            console.log(result);
        });
    };
    self.subscribeEvent = function (data, index) {
        var subscribeEventData = {
            uid: id,
            userName: uname,
            eid: data._id,
            evtName: data.evtName
        };
        GeneralService.eventSubscribe(subscribeEventData).then(function (result) {
            if (result.data.success == true) {
                if (self.items[index].subsCount) {
                    self.items[index].subsCount = parseInt(self.items[index].subsCount) + 1;
                } else {
                    self.items[index].subsCount = 1;
                }
                console.log('success');
            } else {
                alert(result.data.extras.msg.message);
            }
            //self.subsCount = result.data.extras.data.items
            console.log(result);
        });
    };
    self.subscribeFacility = function (data, index) {
        var subscribeFacilityData = {
            uid: id,
            facID: data._id,
            facName: data.name
        };
        GeneralService.facilitySubscribe(subscribeFacilityData).then(function (result) {
            if (result.data.success == true) {
                if (self.items[index].subsCount) {
                    self.items[index].subsCount = parseInt(self.items[index].subsCount) + 1;
                } else {
                    self.items[index].subsCount = 1;
                }
                console.log('success');
            } else {
                alert(result.data.extras.msg.message);
            }
        });
    };
}
;

function createHomeEventCtrl(auth, GeneralService, $http, API, ngDialog, $filter) {
    "ngInject";
    var self = this;
    var userInfo = auth.getUserDetails();
    var id = userInfo.id;
    var uname = userInfo.fName + userInfo.lName;
    self.picture = "img/upload_pic.jpg";
    self.isFocus = {
        submitted: false
    };

    // Datetime validation
    self.datetime = {};
    self.datetime.currDate = new Date();
    self.datetime.date = self.datetime.currDate.getFullYear() + "-" + (self.datetime.currDate.getMonth() + 1) + "-" + self.datetime.currDate.getDate();
    self.datetime.yesterday = new Date(new Date().setDate(self.datetime.currDate.getDate() - 1));
    self.datetime.currTime = new Date(new Date().setHours(self.datetime.currDate.getHours() + 1));
    self.datetime.currHour = self.datetime.currTime.getHours();
    self.datetime.currMinutes = self.datetime.currTime.getMinutes();

    var get_hours = function () {
        var hours = [];
        for (var i = 0; i <= 12; i++) {
            var hour = (i < 10) ? '0' + i : i;
            hours.push({'value': i, 'text': hour});
        }
        return hours;
    }
    var get_minutes = function () {
        var minutes = [];
        for (var i = 0; i <= 59; i += 15) {
            var min = (i < 15) ? "0" + i : i;
            minutes.push(min);
        }
        return minutes;
    }
    var get_meridiem = function (h) {
        var mer = "AM";
        if (h >= 12)
            mer = "PM";

        return mer;
    }
    var hours24to12 = function (h) {
        var hour = parseInt(h);
        if (hour > 12) {
            hour = hour % 12;
        }
        return hour;
    }
    var hours12to24 = function (h, m) {
        var hour = parseInt(h);
        if (m === "PM") {
            if (hour < 12)
                hour += 12;
        }
        return hour;
    }
    var valid_date = function (date) {
        var today = new Date();
        var day = (today.getDate() < 10) ? '0' + today.getDate() : today.getDate();
        var mon = ((today.getMonth() + 1) < 10) ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1);
        var hr = (today.getHours() < 10) ? '0' + today.getHours() : today.getHours();
        var mn = (today.getMinutes() < 10) ? '0' + today.getMinutes() : today.getMinutes();
        var str = today.getFullYear() + "-" + mon + "-" + day + " " + hr + ":" + mn + ":00";
        var date_today = new Date(str);
        if (new Date(date) < date_today) {
            self.datetime.invalidDate = true;
            return false;
        }
        self.datetime.invalidDate = false;
        return true;
    }

    self.datetime.hours = get_hours();
    self.datetime.selHour = self.datetime.hours[hours24to12(self.datetime.currHour)].value;
    self.datetime.minutes = get_minutes();
    self.datetime.selMinute = self.datetime.minutes[0];
    self.datetime.selMer = get_meridiem(self.datetime.currHour);
    // end

    self.createHomeEventSubmit = function () {
        var dt = $filter('date')(new Date(self.datetime.date), "yyyy-MM-dd");
        var hr = hours12to24(self.datetime.selHour, self.datetime.selMer);
        hr = (hr < 10) ? '0' + hr : hr;
        var dateString = dt + " " + hr + ":" + self.datetime.selMinute + ":00";
        if (valid_date(dateString))
            self.createHomeEvent();
    }

    self.createHomeEvent = function () {
        var hr = hours12to24(self.datetime.selHour, self.datetime.selMer);
        hr = (hr < 10) ? '0' + hr : hr;
        var eventHomeData = {
            evtName: self.eventName,
            city: [GeneralService.homeEventData.city],
            evtTime: hr + ":" + self.datetime.selMinute + ":00",
            evtDate: $filter('date')(new Date(self.datetime.date), "yyyy-MM-dd"),
            sports: [self.selSport],
            uid: id,
            uname: uname,
            //evtLoc: $scope.createEvt.evtLoc,
            details: self.details,
            facility: [GeneralService.homeEventData._id]
                    //pic: $scope.createEvt.pic,
        };
        //eventHomeData.facility = [GeneralService.homeEventData._id];

        if (self.selGroup) {
            var newArray = [];
            angular.forEach(self.selGroup, function (item, index) {
                newArray.push(item.gid);
            });
            eventHomeData.groups = newArray;
        }
        if (self.selectedFrds) {
            var newArray = [];
            angular.forEach(self.selectedFrds, function (item, index) {
                newArray.push(item.uid);
            });
            eventHomeData.frnd = newArray;
        }

        GeneralService.createEvt(eventHomeData).then(function (result) {
            if (result.data) {
                if (result.data.success === true) {
                    GeneralService.addToHome(result.data.extras.data.event);
                }
            } else {
                console.log("Warning: data not loaded");
            }
            ngDialog.close();
        });
    };

    self.cancel = function () {
        ngDialog.close();
    };

    self.sports = GeneralService.homeEventData.tags;
    self.selSport = self.sports[0];
    self.facilityName = GeneralService.homeEventData.name;
    self.city = GeneralService.homeEventData.city;

    GeneralService.loadGeneral(id, function (resp) {
        if (resp === true) {
            self.myFriends = GeneralService.myFriends;
            self.myGroups = GeneralService.myGroups;
        } else {
            console.log("Error occured while loading mini profile");
        }
    });
}
;

function setLocationCtrl(GeneralService, $http, API, auth, user, ngDialog) {
    "ngInject";
    var self = this;
    var userInfo = auth.getUserDetails();
    var id = userInfo.id;
    self.selCities = [];
    GeneralService.listAllCities().then(function (result) {
        self.allcities = result.data.extras.data.cities;
    });

    self.openDropdown = function (city) {
        self.open = !self.open;
        if (city !== undefined && city !== null && city !== "")
            self.open = true;
    };
    self.toggleSelectItem = function (option, add) {
        self.open = false;
        self.query = "";
        if (add) {
            if (self.selCities) {
                self.selCities.push(option.City);
            } else {
                self.selCities = [option.City];
            }
        } else {
            self.selCities = self.selCities.filter(function (val) {
                if (val === option) {
                    return true;
                } else {
                    return false;
                }
            });
        }
        self.saveLocation(id, self.selCities);
    };
    self.getClassName = function (option) {
        var varClassName = 'glyphicon glyphicon-remove-circle';
        angular.forEach(self.SelectedCountries, function (item, index) {
            if (item.City === option.City) {
                varClassName = 'glyphicon glyphicon-ok-circle';
            }
        });
        return (varClassName);
    };
    self.saveLocation = function (id, cities) {
        var editProfileData = {
            uid: id,
            location: cities
        };
        return $http.post(API + '/userapi/setProfile', editProfileData)
                .then(function success(response) {
                    console.log(response);
                }, function error(response) {
                    console.log(response);
                });
    };
    self.cancel = function () {
        console.log(self.selCities);
        window.location.href = '/';
        ngDialog.close();
    };
}
;

function saveLocation($http, API, auth) {
    "ngInject";
    var self = this;
    var userInfo = auth.getUserDetails();
    var id = userInfo.id;
    var editProfileData = {
        uid: id,
        location: self.location
    };
    return $http.post(API + '/userapi/setProfile', editProfileData)
            .then(function success(response) {
                console.log(response);
            }, function error(response) {
                console.log(response);
            });
}
;

angular.module('sem')
        .controller('createHomeEvent', createHomeEventCtrl)
        .controller('SetLocation', setLocationCtrl)
        .controller('Home', homeCtrl);

//function createGroupController(user, $window, GeneralService, $scope) {
//    var self = this;
//}
