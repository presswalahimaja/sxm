;
function frndGrpCtrl(user, auth, $scope, GeneralService, ngDialog) {
    var self = this;
	self.isAuthed = (auth.isAuthed) ? auth.isAuthed() : false;
	if(!self.isAuthed)
		return;
    var userInfo = auth.getUserDetails();
    var id = userInfo.id;
    var name = userInfo.fName + ' ' + userInfo.lName;

    /************************* will call frinds list twice on home page, to be rectified *************************/
    GeneralService.loadGeneral(id, function (resp) {
        if (resp === true) {
            self.myFriends = GeneralService.myFriends;
            self.myFriendsCount = self.myFriends.length;
            self.myGroups = GeneralService.myGroups;
            if (GeneralService.myGroupsPending != undefined) {
                self.myGroupsPendingIds = GeneralService.myGroupsPending.map(function (obj) {
                    return obj.gid
                });
            } else {
                self.myGroupsPendingIds = [];
            }
            if (self.myGroups != undefined) {
                self.myGroupsCount = self.myGroups.length;
                self.myGroupsIds = self.myGroups.map(function (obj) {
                    return obj.gid
                });
            } else {
                self.myGroupsCount = 0;
                self.myGroupsIds = [];
            }
        } else {
            // self.myGroupsCount = 0;
            //self.myFriendsCount = 0;
            console.log("Error occured while loading mini profile");
        }
    });
    $scope.$on('newGroupAdded', function () {
        if (angular.isUndefinedOrNull(self.myGroups)) {
            self.myGroups = [];
        }
        self.myGroups.unshift(GeneralService.newGroup);
        GeneralService.newGroup = null;
    });
    self.quickMatch = function (fid) {
        GeneralService.friendID = fid;
        ngDialog.open({
            template: '/dialogs/quick-match.html',
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
    self.inviteFriend = function () {
        GeneralService.uid = id;
        ngDialog.open({
            template: '/dialogs/invite-friends.html',
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
    self.showPeople = function () {
        GeneralService.uid = id;
        ngDialog.open({
            template: '/dialogs/people.html',
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
    self.groupDetails = function (gid) {
        GeneralService.groupID = gid;
        GeneralService.userid = id;
        ngDialog.open({
            template: '/dialogs/group-details.html',
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

    // Group search
    self.searchGroups = function () {
        self.gsFlag = true;
        GeneralService.searchGroups(id, self.gsearchquery).then(function (res) {
            var status = res.data ? res.data.success : null;
            if (status) {
                self.allgroups = [];
                self.allgroups = res.data.extras.data.map(function (obj) {
                    var newObj = {};
                    newObj.pid = obj._id;
                    newObj.type = 'G';
                    newObj.name = obj.grpName;
                    newObj.admin = obj.users[0].userName;
                    if (!angular.isUndefinedOrNull(obj.city))
                        newObj.city = obj.city;
                    if (!angular.isUndefinedOrNull(obj.sports))
                        newObj.sport = obj.sports;
                    if (self.myGroupsIds.indexOf(obj._id) >= 0)
                        newObj.isSubscribed = true
                    else
                        newObj.isSubscribed = false
                    if (self.myGroupsPendingIds.indexOf(obj._id) >= 0)
                        newObj.reqSent = true
                    else
                        newObj.reqSent = false
                    return newObj;
                });
            }
        });
    };
    self.subscribeGroup = function (grp) {
        var group = {'uid': id, 'userName': name, 'gid': grp.pid, 'grpName': grp.name};
        console.log(group)
        GeneralService.subscribeForGroup(group).then(function (res) {
            var status = res.data ? res.data.success : null;
            if (status) {
                grp.reqSent = true;
            }
        });
    };
    self.togglePopup = function () {
        self.gsFlag = !self.gsFlag
    }

//    self.searchFriends = function () {
//        if (self.searchKeyword.length > 2) {
//            self.searchedFriends = null;
//            self.noData = false;
//            if (angular.isUndefinedOrNull(GeneralService.myLocations)) {
//                GeneralService.getMiniProfile(id).then(function (data) {
//                    GeneralService.myLocations = data.data.extras.data.prof.location;
//                    self.mylocations = data.data.extras.data.prof.location;
//                    GeneralService.getSearchedResults(id, self.searchKeyword, self.mylocations).then(function (data) {
//                        if (data && data.data) {
//                            if (data.data.success) {
//                                self.searchedFriends = data.data.extras.data;
//                            } else {
//                                self.noData = true;
//                            }
//                        }
//                    });
//                });
//            } else {
//                self.mylocations = GeneralService.myLocations;
//                GeneralService.getSearchedResults(id, self.searchKeyword, self.mylocations).then(function (data) {
//                    if (data && data.data) {
//                        if (data.data.success) {
//                            self.searchedFriends = data.data.extras.data;
//                        } else {
//                            self.noData = true;
//                        }
//                    }
//                });
//            }
//
//            $('#Friends .friends-search-results').removeClass('hidden');
//        } else {
//            $('#Friends .friends-search-results').addClass('hidden');
//        }
//
//    };
//    self.addAsFriend = function (fid) {
//        var data = {
//            uid: id,
//            fid: fid
//        };
//        GeneralService.addAsAFriend(data).then(function (result) {
//            $('#add-' + fid).hide();
//            console.log('success');
//        });
//    };
}
;
function headCtrl(user, auth, GeneralService, ngDialog, $http, API, $window) {
    var self = this;
    var id = auth.getID();
    self.id = id;
	self.isMobileDevice = (function (a) {
		if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) {
			return true;
		} else {
			return false;
		}
	})(navigator.userAgent || navigator.vendor || window.opera);
    var todayDate = new Date();
    self.todayDate = todayDate;
    self.logout = function () {
        auth.logout && auth.logout();
    };
    self.isAuthed = (auth.isAuthed) ? auth.isAuthed() : false;
    self.createEvent = function () {
        ngDialog.open({
            template: '/dialogs/create-event.html',
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
    self.createDiscussion = function () {
        GeneralService.homeDiscussionType = "";
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
	self.createTournament = function () {
        ngDialog.open({
            template: '/dialogs/create-tournament.html',
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
	self.createIndividualMatch = function () {
        ngDialog.open({
            template: '/dialogs/create-individual-match.html',
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
	self.myTournaments = function () {
        ngDialog.open({
            template: '/dialogs/my-tournaments.html',
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
	
	// Login form
	self.loginForm = function () {
		ngDialog.open({
            template: '/dialogs/login-form.html',
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
	
	// Register form
	self.registerForm = function () {
		ngDialog.open({
            template: '/dialogs/register-form.html',
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
	
	// Contact us form
	self.contactus = function () {
        ngDialog.open({
            template: '/dialogs/contact-us.html',
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
	
    self.groupDetails = function (gid) {
        GeneralService.groupID = gid;
        GeneralService.userid = id;
        ngDialog.open({
            template: '/dialogs/group-details.html',
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
    self.showNotification = function (iid, type) {
        self.readMark(iid, type);
        if (type === 'E') {
            $window.location.href = "/events.html?id=" + iid + "&type=" + type;
        }
        if (type === 'D') {
            self.showDetailDiscussion(iid, type);
            self.notifications.discInvite = self.notifications.discInvite.filter(function (val) {
                if (val.discID === iid) {
                    return false;
                } else {
                    return true;
                }
            });
            self.countNotifications();
        }
        if (type === 'N') {
            self.notifications.noti = self.notifications.noti.filter(function (val) {
                if (val._id === iid) {
                    return false;
                } else {
                    return true;
                }
            });
            self.countNotifications();
            //remove from list
        }
    };
    self.readMark = function (iid, type) {
        var data = {
            'uid': id,
            'iid': iid,
            'type': type
        };
        GeneralService.markRead(data).then(function (result) {
            console.log(result);
        });
    };
    self.countNotifications = function () {
        self.notificationCount = 0;
        if (self.notifications.reqPending) {
            self.notificationCount += self.notifications.reqPending.length;
        }
        if (self.notifications.groupReq) {
            self.notificationCount += self.notifications.groupReq.length;
        }
        if (self.notifications.discInvite) {
            self.notificationCount += self.notifications.discInvite.length;
        }
        if (self.notifications.events) {
            self.notificationCount += self.notifications.events.length;
        }
        if (self.notifications.noti) {
            self.notificationCount += self.notifications.noti.length;
        }
    }
    GeneralService.loadGeneral(id, function (resp) {
        if (resp === true) {
            self.profile = GeneralService.myProfile;
            GeneralService.getListNotification(id).then(function (data) {
                self.notifications = data.data.extras.data.items;
                self.countNotifications();
            });
        } else {
            console.log("Error occured while loading mini profile");
        }
    });

    self.addAsFriend = function (fid) {
        var data = {
            uid: self.id,
            fid: fid
        };
        GeneralService.addAsAFriend(data).then(function (result) {
            $('#add-' + fid).hide();
            console.log('success');
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
    var searchWords = 100;
    self.searchFriends = function () {
        if (self.searchKeyword.length > 2) {
            if (self.searchKeyword.length > searchWords) {
                //searchWords = self.searchKeyword.length;
            } else {
                searchWords = self.searchKeyword.length;
                self.searchedFriends = null;
                self.noData = false;
                if (angular.isUndefinedOrNull(GeneralService.myLocations)) {
                    GeneralService.getMiniProfile(id).then(function (data) {
                        GeneralService.myLocations = data.data.extras.data.prof.location;
                        self.mylocations = data.data.extras.data.prof.location;
                        GeneralService.getSearchedResults(id, self.searchKeyword, self.mylocations).then(function (data) {
                            if (data && data.data) {
                                if (data.data.success) {
                                    self.searchedFriends = data.data.extras.data;
                                } else {
                                    self.noData = true;
                                }
                            }
                        });
                    });
                } else {
                    self.mylocations = GeneralService.myLocations;
                    GeneralService.getSearchedResults(id, self.searchKeyword, self.mylocations).then(function (data) {
                        if (data && data.data) {
                            if (data.data.success) {
                                self.searchedFriends = data.data.extras.data;
                            } else {
                                self.noData = true;
                            }
                        }
                    });
                }
                self.isPopupVisible = true;
            }

        } else {
            searchWords = 100;
            self.searchedFriends = null;
            self.noData = false;
            self.isPopupVisible = false;
        }
    };
    self.togglePopup = function () {
        self.isPopupVisible = !self.isPopupVisible;
    }
    self.acceptreject = function (fid, fname, type, confirm) {
        if (type == 'friend') {
            $http.post(API + '/friendapi/confirm', {
                uid: id,
                fid: fid,
                confirm: confirm
            }).then(function (response) {
                if (confirm) {
                    window.location.reload();
                } else {
                    alert('You have rejected friend request sent by ' + fname);
                }
            }, function error(response) {
                writeError(response);
            });
        } else if (type == 'group') {
            $http.post(API + '/groupapi/confirm', {
                uid: id,
                gid: fid,
                confirm: confirm
            }).then(function (response) {
                if (confirm) {
                    window.location.reload();
                } else {
                    alert('You have rejected group request ');
                }
            }, function error(response) {
                writeError(response);
            });

        }
    };
    self.acceptrejectgroup = function (uid, gid, gname, confirm) {
        $http.post(API + '/groupapi/confirm', {
            aid: id,
            uid: uid,
            gid: gid,
            confirm: confirm
        }).then(function (resp) {
            if (resp.data.success === true) {
                window.location.reload();
            } else {
                alert('You have rejected group request for group : ' + gname);
            }
        }, function error(response) {
            writeError(response);
        });
    };
}
;
function createEventController(auth, GeneralService, $http, API, ngDialog, $filter) {
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

    self.createEventSubmit = function () {
        var dt = $filter('date')(new Date(self.datetime.date), "yyyy-MM-dd");
        var hr = hours12to24(self.datetime.selHour, self.datetime.selMer);
        hr = (hr < 10) ? '0' + hr : hr;
        var dateString = dt + " " + hr + ":" + self.datetime.selMinute + ":00";
        if (valid_date(dateString) && (self.selGroup !== undefined || self.selectedFrds !== undefined))
            self.createEvent();
    }

    self.createEvent = function () {
        var hr = hours12to24(self.datetime.selHour, self.datetime.selMer);
        hr = (hr < 10) ? '0' + hr : hr;
        var eventData = {
            evtName: self.eventName,
            city: [self.selCity],
            evtTime: hr + ":" + self.datetime.selMinute + ":00",
            evtDate: $filter('date')(new Date(self.datetime.date), "yyyy-MM-dd"),
            sports: [self.selSport],
            uid: id,
            uname: uname,
            details: self.details
        };
        if (self.selFacility) {
            eventData.facility = [self.selFacility];
        }
        if (self.selGroup) {
            var newArray = [];
            angular.forEach(self.selGroup, function (item, index) {
                newArray.push(item.gid);
            });
            eventData.groups = newArray;
        }
        if (self.selectedFrds) {
            var newArray = [];
            angular.forEach(self.selectedFrds, function (item, index) {
                newArray.push(item.uid);
            });
            eventData.frnd = newArray;
        }
        GeneralService.createEvt(eventData).then(function (result) {
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
        //console.log("cancelled");
    };
    GeneralService.listStates().then(function (data) {
        self.states = data.data.extras.data;
    });
    self.loadCities = function (state) {
        GeneralService.listCities(state).then(function (data) {
            self.cities = data.data.extras.data;
        });
    };
    GeneralService.listSports().then(function (data) {
        self.sports = data.data.extras.data;
        self.selSport = self.sports[0];
    });
    self.getFacilities = function () {
        if (self.selCity && self.selSport) {
            GeneralService.listFacilities([self.selCity], [self.selSport]).then(function (data) {
                self.facilities = data.data.extras.data;
            });
        }
    };
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
function createTournamentController(auth, GeneralService, $http, API, ngDialog, $filter) {
	var self = this;
    var userInfo = auth.getUserDetails();
    var id = userInfo.id;
	self.tournament = {};
	self.confirm = {};
	self.datetime = {};
    self.datetime.currDate = new Date();
    self.datetime.startdate = $filter('date')(new Date(self.datetime.currDate), "dd MMM yyyy");
    self.datetime.enddate   = $filter('date')(new Date(self.datetime.currDate), "dd MMM yyyy");
	
	GeneralService.listSports().then(function (results) {
        self.allsports = results.data.extras.data;
    });
	
	// check For mobile number in user profile
	self.checkMobileNo = function(){		
		$http.get(API + '/userapi/userprofile?uid=' + id)
			.then(function success(response){
				if(!angular.isUndefinedOrNull(response.data.extras.data.mobile)){
					self.confirm.userMobile = true;
					self.createTournament();
				}else{
					self.confirm.userMobile = false;
				}
			}, function error(response){
				console.log(response);
				self.confirm.userMobile = false;
			});
	}
	
	// Add mobile number is user profile
	self.addMobileNo = function(){
		$http.post(API + '/userapi/setProfile', {'uid':id, 'mobile':self.confirm.mobileno})
			.then(function success(response) {
				self.confirm.userMobile = true;
			}, function error(response) {
				console.log(response);
			});
	}
	
	// Create new tournament
	self.createTournament = function () {
		self.confirm.btnDisable = true;
        self.tournament.banner = "90f792c28ed2ddc61bd537d3c08bfc17.png"; // default banner;
		self.tournament.startdate = $filter('date')(new Date(self.datetime.startdate), "yyyy-MM-ddTHH:mm:ss") + '.330Z';
		var newEndDate = new Date(self.datetime.enddate);
		newEndDate.setHours(newEndDate.getHours() + 18);
		self.tournament.enddate   = $filter('date')(newEndDate, "yyyy-MM-ddTHH:mm:ss") + '.330Z';
		console.log("Create tournament..")
		GeneralService.createTournament(self.tournament).then(function success(response) {
            var status = response.data ? response.data.success : null;
            if (status) {
                window.location = "/tournament.html?tid=" + response.data.extras.data;
            } else {
				self.confirm.btnDisable = false;
			}
        }, function error(response) {
			console.log(response);
			self.confirm.btnDisable = false;
		});
    }
	
	// Cancel tournament creation
    self.cancel = function () {
        ngDialog.close();
        self.tournament = {};
        self.isFocus.submitted = false;
    }
}
;
function myTournamentsController(auth, $http, API) {
	var self = this;
    var userInfo = auth.getUserDetails();
    var id = userInfo.id;	
	self.organizers  = [];
	self.tournaments = [];
	
	self.loadDetails = function (id) {
		$http.get(API + '/userapi/userprofile?uid=' + id).then(function (response) {
			var status = response.data ? response.data.success : null;
			if (status) {
				self.organizers  = response.data.extras.data.pages;
				self.tournaments = response.data.extras.data.tournaments;			
			}
		}, function error(response) {
			writeError(response);
		});
	};
	self.loadDetails(id);
}
;
function contactUsController(auth, GeneralService, ngDialog, $timeout) {
	var self = this;
	self.contact = {};
	self.isFocus = {
		msgSent: false
	};
	
	self.validateEmail = function(){
		if(isNaN(self.contact.email)){
			var emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			if (emailRegExp.test(self.contact.email)){
				self.isFocus.invEmail = false;
				return true;
			}
			self.isFocus.invEmail = true;
			return false;
		}else if(self.contact.email.length == 10){
			self.contact.phone = self.contact.email;
			self.contact.email = null;
			self.isFocus.invEmail = false;
			return true;	
		}
		self.isFocus.invEmail = true;
		return false;
	};
	
	self.sendMsg = function() {
		GeneralService.contactus(self.contact).then(function (resp) {
            var status = resp.data ? resp.data.success : null;
            if (status) {
				self.isFocus.msgSent = true;
				$timeout(function () {
					ngDialog.close();
				}, 2000);
			}
        });
	};
	
	self.cancel = function() {
		ngDialog.close();
        self.contact = {};
        self.isFocus.submitted = false;
	};
}
;
function quickMatchController(auth, GeneralService, $http, API, ngDialog, $filter) {
    var self = this;
    var userInfo = auth.getUserDetails();
    var id = userInfo.id;
    var uname = userInfo.fName + userInfo.lName;
    self.picture = "/img/upload_pic.jpg";
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

    self.createQuickMatchSubmit = function () {
        var dt = $filter('date')(new Date(self.datetime.date), "yyyy-MM-dd");
        var hr = hours12to24(self.datetime.selHour, self.datetime.selMer);
        hr = (hr < 10) ? '0' + hr : hr;
        var dateString = dt + " " + hr + ":" + self.datetime.selMinute + ":00";
        if (valid_date(dateString))
            self.createQuickMatch();
    }

    self.combinedFacility = [];
    self.combinedSports = [];
    self.firstName = userInfo.fName;

    if (angular.isUndefinedOrNull(GeneralService.myLocations)) {
        GeneralService.getMiniProfile(id).then(function (data) {
            //// GeneralService.fName = data.data.extras.data.prof.fName;
            //   self.fName = data.data.extras.data.prof.fName;
            GeneralService.myLocations = data.data.extras.data.prof.location;
            GeneralService.mySports = data.data.extras.data.prof.sports;
            self.mylocations = data.data.extras.data.prof.location;
            self.mysports = data.data.extras.data.prof.sports;
            if (self.mylocations && self.mysports) {
                GeneralService.listFacilities(self.mylocations, self.mysports).then(function (data) {
                    self.myfacilities = data.data.extras.data;
                    angular.forEach(self.myfacilities, function (item, index) {
                        self.combinedFacility.push({name: self.myfacilities[index].name, id: self.myfacilities[index]._id});
                    });
                });
                angular.forEach(self.mysports, function (item, index) {
                    if (self.combinedSports.indexOf(self.mysports[index]) == -1) {
                        self.combinedSports.push(self.mysports[index]);
                    }
                });
            }
        });
    } else {
        //  self.fName = GeneralService.fName;
        self.mylocations = GeneralService.myLocations;
        self.mysports = GeneralService.mySports;
        if (self.mylocations && self.mysports) {
            GeneralService.listFacilities(self.mylocations, self.mysports).then(function (data) {
                self.myfacilities = data.data.extras.data;
                angular.forEach(self.myfacilities, function (item, index) {
                    self.combinedFacility.push({name: self.myfacilities[index].name, id: self.myfacilities[index]._id});
                });
            });
            angular.forEach(self.mysports, function (item, index) {
                if (self.combinedSports.indexOf(self.mysports[index]) == -1) {
                    self.combinedSports.push(self.mysports[index]);
                }
            });
        }
    }

    //if (angular.isUndefinedOrNull(GeneralService.friendLocations)) {
    GeneralService.getFriendMiniProfile(GeneralService.friendID).then(function (data) {
        //GeneralService.friendsName = data.data.extras.data.prof.fName;
        self.friendName = data.data.extras.data.prof.fName;
        //GeneralService.friendLocations = data.data.extras.data.prof.location;
        //GeneralService.friendSports = data.data.extras.data.prof.sports;
        self.friendlocations = data.data.extras.data.prof.location;
        self.friendsports = data.data.extras.data.prof.sports;
        if (self.friendlocations && self.friendsports) {
            GeneralService.listFacilities(self.friendlocations, self.friendsports).then(function (data) {
                self.friendfacilities = data.data.extras.data;
                angular.forEach(self.friendfacilities, function (item, index) {
                    if (self.combinedFacility.indexOf(self.friendfacilities[index].name) == -1) {
                        self.combinedFacility.push({name: self.friendfacilities[index].name, id: self.friendfacilities[index]._id});
                    }
                });
                angular.forEach(self.friendsports, function (item, index) {
                    if (self.combinedSports.indexOf(self.friendsports[index]) == -1) {
                        self.combinedSports.push(self.friendsports[index]);
                    }
                });
                self.selSport = self.combinedSports[0];
                self.selFacility = self.combinedFacility[0].id;
            });
        }
    });
//    } else {
//        self.friendName = GeneralService.friendsName;
//        self.friendlocations = GeneralService.friendLocations;
//        self.friendsports = GeneralService.friendSports;
//        if (self.friendlocations && self.friendsports) {
//            GeneralService.listFacilities(self.friendlocations, self.friendsports).then(function (data) {
//                self.friendfacilities = data.data.extras.data;
//                angular.forEach(self.friendfacilities, function (item, index) {
//                    if (self.combinedFacility.indexOf(self.friendfacilities[index].name) == -1) {
//                        self.combinedFacility.push({name: self.friendfacilities[index].name, id: self.friendfacilities[index]._id});
//                    }
//                });
//                angular.forEach(self.friendsports, function (item, index) {
//                    if (self.combinedSports.indexOf(self.friendsports[index]) == -1) {
//                        self.combinedSports.push(self.friendsports[index]);
//                    }
//                });
//                self.selSport = self.combinedSports[0];
//                self.selFacility = self.combinedFacility[0].id;
//                //console.log(self.combinedFacility);
//            });
//        }
//    }

    self.createQuickMatch = function () {
        var hr = hours12to24(self.datetime.selHour, self.datetime.selMer);
        hr = (hr < 10) ? '0' + hr : hr;
        var eventData = {
            evtName: 'Activity between ' + self.firstName + ' and ' + self.friendName,
            city: self.friendlocations,
            evtTime: hr + ":" + self.datetime.selMinute + ":00",
            evtDate: $filter('date')(new Date(self.datetime.date), "yyyy-MM-dd"),
            sports: [self.selSport],
            uid: id,
            uname: uname,
            details: ''
        };
        if (self.selFacility) {
            eventData.facility = [self.selFacility];
        }

        eventData.frnd = [GeneralService.friendID];
        console.log(eventData);
        GeneralService.createEvt(eventData).then(function (result) {
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
        //console.log("cancelled");
    };
    self.getFacilities = function () {
        if (self.selCity && self.selSport) {
            GeneralService.listFacilities([self.selCity], [self.selSport]).then(function (data) {
                self.facilities = data.data.extras.data;
            });
        }
    };
//    if (angular.isUndefinedOrNull(GeneralService.myFriends)) {
//        GeneralService.getMiniProfile(id).then(function (data) {
//            GeneralService.myFriends = data.data.extras.data.friends;
//            GeneralService.myGroups = data.data.extras.data.groups;
//            self.myFriends = data.data.extras.data.friends;
//            self.myGroups = data.data.extras.data.groups;
//        });
//    } else {
//        self.myFriends = GeneralService.myFriends;
//        self.myGroups = GeneralService.myGroups;
//    }
}
;
function createDiscussionController(auth, GeneralService, $http, API, ngDialog) {
    var self = this;
    var userInfo = auth.getUserDetails();
    var id = userInfo.id;
    var uname = userInfo.fName + userInfo.lName;

    self.createDiscussion = function () {
        var discData = {
            uid: id,
            uname: uname,
            body: self.body,
            private: 'true'
        };
        if (self.addedGrps) {
            var newArray = [];
            angular.forEach(self.addedGrps, function (item, index) {
                newArray.push(item.gid);
            });
            discData.groups = newArray;
        }
        if (self.addedFrnds) {
            var newArray = [];
            angular.forEach(self.addedFrnds, function (item, index) {
                newArray.push(item.uid);
            });
            discData.frnd = newArray;
        }
        if (GeneralService.homeDiscussionType === 'E') {
            discData.event = GeneralService.homeDiscussionData._id;
        }
        if (GeneralService.homeDiscussionType === 'F') {
            discData.facility = GeneralService.homeDiscussionData._id;
        }

        GeneralService.createDisc(discData).then(function (data) {
            if (data.data) {
                if (data.data.success === true) {
                    GeneralService.addToHome(data.data.extras.data.disc);
                }
            } else {
                console.log("Warning: data not loaded");
            }
            ngDialog.close();
        });
    };
    //load my profile items and keep them saved in General Service so that they are not loaded again.
    //Warning refreshing of items will be required. 

    GeneralService.loadGeneral(id, function (resp) {
        if (resp === true) {
            self.myFriends = GeneralService.myFriends;
            self.myGroups = GeneralService.myGroups;
        } else {
            console.log("Error occured while loading mini profile");
        }
    });

    self.cancel = function () {
        ngDialog.close();
    };
    if (angular.isUndefinedOrNull(self.myevents)) {
        GeneralService.getMyItems(id, 'events').then(function (data) {
            self.myevents = data.data.extras.data.events;
            if (GeneralService.homeDiscussionType == 'E') {
                //console.log(GeneralService.homeDiscussionData._id);
                self.event = GeneralService.homeDiscussionData._id;
            }
        });
    }
}
;
function detailDiscussionController(auth, GeneralService, $timeout) {
    var self = this;
    var userInfo = auth.getUserDetails();
    self.uid = userInfo.id;
    self.did = GeneralService.discussionId;

    // Service call
    GeneralService.getDiscussions(self.uid, self.did).then(function (data) {
        if (data && data.data) {
            self.data = data.data.extras.data.disc;
            self.comments = data.data.extras.data.disc.comments;
            if (angular.isUndefinedOrNull(self.comments)) {
                self.comments = [];
            }

            $timeout(function () {
                $('.commentContainer').animate({scrollTop: $('.commentContainer').prop('scrollHeight')}, 100);
            }, 1000);
        } else {
            console.log('getDiscussions not loaded');
        }
    });

    self.createComment = function (index) {
        var createCommentData = {
            did: self.did,
            uid: self.uid,
            body: self.comment[index]
        };
        GeneralService.postComment(createCommentData).then(function (result) {
            if (result.data.success == true) {
                var newComment = {
                    'dcid': self.did,
                    'uid': userInfo.id,
                    'name': userInfo.fName + ' ' + userInfo.lName,
                    'pic': userInfo.id + '.jpg',
                    'cmnt': self.comment[index],
                    'date': new Date()
                }
                self.comments.push(newComment);
                self.comment[index] = '';
                self.isFocus.submitted = false;
                $('.commentContainer').animate({scrollTop: $('.commentContainer').prop('scrollHeight')}, 1000);
                // Adding comment on homepage
                GeneralService.addCommentToHome(newComment);

            } else {
                alert(result.data.extras.msg.message);
            }
            //self.subsCount = result.data.extras.data.items
            console.log(result);
        });
    };

    self.likeThisItem = function (index, type) {
        var likeData = {
            uid: self.uid,
            iid: index,
            type: type,
            like: true
        };
        console.log('likeData');
        console.log(likeData);
        GeneralService.likeItems(likeData).then(function (result) {
            if (result.data.success == true) {
                if (self.data.likeCount) {
                    self.data.likeCount = parseInt(self.data.likeCount) + 1;
                } else {
                    self.data.likeCount = 1;
                }
                console.log('success');
            } else {
                //alert(result.data.extras.msg.message);
            }
            //self.subsCount = result.data.extras.data.items
            console.log(result);
        });
    };

}
;
function peopleController(auth, GeneralService) {
    var self = this;
    var userInfo = auth.getUserDetails();
    self.uid = userInfo.id;

    // Service call
    GeneralService.getPeople(self.uid).then(function (data) {
        if (data && data.data) {
            self.location = data.data.extras.data.prof.location;
            self.people = data.data.extras.data.people;
        } else {
            console.log('getDiscussions not loaded');
        }
    });
    self.addAsFriend = function (fid) {
        var data = {
            uid: self.uid,
            fid: fid
        };
        GeneralService.addAsAFriend(data).then(function (result) {
            $('#add-' + fid).hide();
            console.log('success');
        });
    };
}
;
function groupDetailsController(auth, GeneralService, $filter, $document) {
    var self = this;
    self.id = GeneralService.userid;
    self.isAdmin = false;

    // Service call
    GeneralService.getGroupDetails(self.id, GeneralService.groupID).then(function (data) {
        if (data && data.data) {
            self.group = data.data.extras.data.group;
            if (self.id === self.group.uid)
                self.isAdmin = true;

            self.time = new Date().getTime();
            GeneralService.loadGeneral(self.id, function (resp) {
                if (resp === true) {
                    self.myFriends = [];
                    if (self.group.users.length > 0) {
                        angular.forEach(GeneralService.myFriends, function (item, index) {
                            var isFrd = false;
                            angular.forEach(self.group.users, function (i, ind) {
                                if (item.name == i.userName)
                                    isFrd = true;
                            });
                            if (!isFrd) {
                                self.myFriends.push(item);
                            }
                        });
                    } else {
                        self.myFriends = GeneralService.myFriends;
                    }
                } else {
                    console.log("Error occured while loading mini profile");
                }
            });

        } else {
            console.log('group details not loaded');
        }
    });

    // friends API call
    self.inviteFriends = function () {
        GeneralService.inviteFriendsInGroup({aid: self.group.uid, uid: self.selFriends.uid, gid: self.group._id}).then(function (res) {
            if (res.data.success === true) {
                var delIndex;
                angular.forEach(self.myFriends, function (item, index) {
                    if (self.selFriends.uid == item.uid) {
                        delIndex = index;
                        self.selFriends = "";
                    }
                });
                self.myFriends.splice(delIndex, 1);
            }
        });
    };

    // Upload logo
    self.uploadLogo = function (files, callback) {
        var file = files[0];
        GeneralService.uploadImage(file, self.group._id, 'G').then(function (resp) {
            if (resp.data) {
                if (resp.data.success === true) {
                    alert('Logo upload sucessfully.!!');
                    callback();
                } else {
                    alert('upload failed. Please try again' + resp.data.extras.message);
                }
            } else {
                alert('upload failed. Please try again');
            }
        });
    };

    // Upload  group logo
    self.uploadGroupLogo = function (files) {
        self.uploadLogo(files, function () {
            self.time = new Date().getTime();
        });
    };
}
;
function teamMembersController(auth, GeneralService, $timeout, $filter, $document) {
    var self = this;
    self.id  = GeneralService.userid;
    self.tid = GeneralService.tid;
    self.isAdmin = false;
    self.newMember = {hasValidContact: false};
	self.confirm = {
		imgRefreshTime: new Date().getTime()
	};
	
    // Service call
    function getGroupDetails() {
        GeneralService.getGroupDetails(self.id, GeneralService.groupID, GeneralService.tid).then(function (data) {
            if (data && data.data) {
                self.group = data.data.extras.data.group;
                if (self.id === self.group.uid) {
                    self.isAdmin = true;
                }
                self.canEdit = self.group.canEdit;

                GeneralService.loadGeneral(self.id, function (resp) {
                    if (resp === true) {
                        self.myFriends = [];
                        if (self.group.users.length > 0) {
                            angular.forEach(GeneralService.myFriends, function (item, index) {
                                var isFrd = false;
                                angular.forEach(self.group.users, function (i, ind) {
                                    if (item.name == i.userName)
                                        isFrd = true;
                                });
                                if (!isFrd) {
                                    self.myFriends.push(item);
                                }
                            });
                        } else {
                            self.myFriends = GeneralService.myFriends;
                        }
                    } else {
                        console.log("Error occured while loading mini profile");
                    }
                });

            } else {
                console.log('group details not loaded');
            }
        });
    }
	
	// Update group details
	self.updateGroup = function () {
		var editGroupData = {'tid':self.tid, 'gid':GeneralService.groupID, 'grpName':self.group.grpName};
		GeneralService.updateGroupByCreator(editGroupData).then(function (response) {
			var status = response.data ? response.data.success : null;
            if (status) {
				self.confirm.isEditable = false;
				console.log("Group name updated successfully.!!");
			}	
		}, function error(response) {
			console.log(response);
		});
	}
	
    // Upload logo
    self.uploadLogo = function (files, callback) {
        var file = files[0];
        GeneralService.uploadImage(file, self.group._id, 'G').then(function (resp) {
            if (resp.data) {
                if (resp.data.success === true) {
                    alert('Logo upload sucessfully.!!');
                    callback();
                } else {
                    alert('upload failed. Please try again' + resp.data.extras.message);
                }
            } else {
                alert('upload failed. Please try again');
            }
        });
    };

	self.updateProfPic = function (files, uid) {
		var file = files[0];		
		GeneralService.uploadProfilePic(file, 'tournament_user', uid, self.tid, self.group._id).then(function success(response){
			var status = response.data ? response.data.success : null;
            if (status) {
				self.confirm.uploadStatus = 1;
                $timeout(function () {
                    self.confirm.uploadStatus = null;
					self.updateTime();
				}, 2000);				
			}else{
				self.confirm.uploadStatus = 2;
                $timeout(function () {
                    self.confirm.uploadStatus = null;
                }, 2000);
			}	
		}, function error(response){
			console.log("Error uploading file : " + response);
			self.confirm.uploadStatus = 3;
			$timeout(function () {
				self.confirm.uploadStatus = null;
			}, 2000);
		});
	};
	
	// Update time to refresh image when changed
	self.updateTime = function () {
		self.confirm.imgRefreshTime = new Date().getTime();
	}
	
    // Upload  group logo
    self.uploadGroupLogo = function (files) {
        self.uploadLogo(files, function () {
            self.updateTime();
        });
    };

    self.validateMemberContact = function () {
        var member = self.newMember;

        if (member.contact) {
            var isMobile = /^\d{10}$/.test(member.contact);
            var isEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(member.contact);
            member.hasValidContact = (isMobile || isEmail);

            if (isEmail) {
                member["email"] = member.contact;
                delete member["mobile"];
            }

            if (isMobile) {
                delete member["email"];
                member["mobile"] = member.contact;
            }

            if (!isEmail && !isMobile) {
                if (member.email)
                    delete member.email;
                if (member.mobile)
                    delete member.mobile;
            }
        } else {
            member.hasValidContact = false;
        }
    };
	
	// Add member in group/team
    self.addNewMember = function (form) {
		self.confirm.btnDisable = true;
		var isDuplicate = false;
		
		if(angular.isUndefinedOrNull(self.newMember.lName) || self.newMember.lName == '')
			self.newMember.lName = '.';
		
		// check duplicate players
		angular.forEach(self.group.users, function (user, uInd) {
			if(angular.lowercase(user.userName.split(" ")[0]) == angular.lowercase(self.newMember.fName) && angular.lowercase(user.userName.split(" ")[1]) == angular.lowercase(self.newMember.lName)){
				self.newMember.ind = uInd;
				isDuplicate = true;
				return false;
			}					
		});
		
		if(isDuplicate == false){
			var params = angular.extend({}, self.newMember, {'tid': GeneralService.tid, 'gid': GeneralService.groupID});
			GeneralService.addTeamMember(params).then(function success(response) {
				var status = response.data ? response.data.success : null;
				if (status) {
					self.addedMember = response.data.extras.fName +" "+ response.data.extras.lName;
					self.newMember.success = true;
					self.newMember.msg = response.data.extras.fName +" "+ response.data.extras.lName +" added successfully.";
					getGroupDetails();
					$timeout(function () {
						self.newMember.success = false;						
						self.newMember = null;
						self.newMember = {hasValidContact: false};
						form.$setPristine();
						form.$setUntouched();
						self.confirm.btnDisable = false;
					}, 2000);
				} else {
					self.newMember.failed = true;
					self.newMember.msg = "Something went wrong!";
					$timeout(function () {
						self.newMember.failed = false;						
						self.confirm.btnDisable = false;
					}, 2000);
				}
			}, function error(response) {
				console.log(response);
				self.confirm.btnDisable = false;
			});
		} else {
			self.newMember.failed = true;
			self.newMember.msg = "Player with same name already exists. Please use different name.";
			self.confirm.btnDisable = false;
		}
    };
	
	// Remove member from group/team
	self.removeTeamMember = function(uid) {
		GeneralService.removeTeamMember({'tid':self.tid, 'gid':GeneralService.groupID, 'playerid':uid}).then(function (response) {
			var status = response.data ? response.data.success : null;
			if (status) {
				var ind = self.group.users.map(function(obj){
					return obj.uid;
				}).indexOf(uid);
				self.group.users.splice(ind, 1);
			}	
		});
	};
	
	// Reset member form
    self.resetNewMemberForm = function (form) {
        self.newMember = null;
        self.newMember = {hasValidContact: false};
        form.$setPristine();
        form.$setUntouched();
    }

    getGroupDetails();
}
;
function playingElevenController(auth, GeneralService, $timeout, ngDialog) {
	var self = this;
	var userInfo = auth.getUserDetails();
    self.id = userInfo.id;
	self.playerCount = 0;
	self.isAdmin = false;
    self.newMember = {hasValidContact: false};	
	self.event = {};
	self.event.players = [];
	self.event.eid = GeneralService.match.eid;
	self.event.tid = GeneralService.match.tid;
	self.event.participants = GeneralService.match.participants;
	self.event.members = GeneralService.match.members;
	self.confirm = {
		imgRefreshTime: new Date().getTime()
	};
	
	if(angular.isUndefinedOrNull(GeneralService.match.teamno)){
		self.event.teamno = "";
		self.event.team  = self.event.participants[0];
		self.event.users = self.event.members[0].users;
	}else{
		self.event.teamno = GeneralService.match.teamno;
		if(self.event.teamno == "team1"){
			self.event.team  = self.event.participants[0];
			self.event.users = self.event.members[0].users;
		}else{
			self.event.team  = self.event.participants[1];
			self.event.users = self.event.members[1].users;
		}		
	}
	
	// defual playing Squad selected
	if(!angular.isUndefinedOrNull(self.event.users) && !angular.isUndefinedOrNull(self.event.team.playingEleven)){
		angular.forEach(self.event.users, function(user){
			angular.forEach(self.event.team.playingEleven, function(pl){
				if(user.uid == pl.uid){
					self.playerCount += 1;
					user.selected = true;
				}	
			});	
		});	
	}
	
	// Count the number of players selected
	self.getPlayerCount = function () {
		self.playerCount = 0;
		angular.forEach(self.event.users, function(user){
			if(user.selected) 
				self.playerCount += 1;
		});
	}
	
	// Set Playing Squads
    self.setPlayingSquad = function (players) {
		var playersIds = players.map(function (obj) {
            return obj.uid;
        });
		if(self.event.teamno == ""){
			self.event.players.push(players);
		}else{
			if(self.event.teamno == "team1"){
				self.event.players.push(players);
				self.event.players.push(self.event.participants[1].playingEleven);
			}else{
				self.event.players.push(self.event.participants[0].playingEleven);
				self.event.players.push(players);
			}
		}
				
        GeneralService.playingEleven({'eid': self.event.eid, 'gid': self.event.team.pid, 'playingEleven': playersIds}).then(function (results) {
            var status = results.data ? results.data.success : null;
            if (status) {
                if (self.event.players.length < 2){
					self.playerCount = 0;
					self.event.team  = self.event.participants[1];
					self.event.users = self.event.members[1].users;
					console.log(self.event.users)
				}else{
					GeneralService.addPlayingEleven(self.event.players);
					self.event.players =  [];
					ngDialog.close();
				}
			}
        });
    };
	
	// Set Players in Squads
	self.setPlayersInSquad = function () {
		var players = [];
		angular.forEach(self.event.users, function(user){
			if(user.selected){
				players.push(user);
			}
		});
		self.setPlayingSquad(players);
	};	

	// Reset Players in Squads
	self.resetPlayersInSquad = function () {
		if(self.event.teamno == "")
			self.setPlayingSquad(self.event.users);
		else
			ngDialog.close();
	};
	
	// Validating user 
	self.validateMemberContact = function () {
        var member = self.newMember;
        if(member.contact){
            var isMobile = /^\d{10}$/.test(member.contact);
            var isEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(member.contact);
            member.hasValidContact = (isMobile || isEmail);

            if(isEmail){
                member["email"] = member.contact;
                delete member["mobile"];
            }
            if(isMobile){
                delete member["email"];
                member["mobile"] = member.contact;
            }
            if(!isEmail && !isMobile){
                if(member.email)
                    delete member.email;
                if(member.mobile)
                    delete member.mobile;
            }
        }else{
            member.hasValidContact = false;
        }
    };
	
	// Add Player in group/team  
    self.addNewMember = function (form) {
		self.confirm.btnDisable = true;
		var isDuplicate = false;
		
		if(angular.isUndefinedOrNull(self.newMember.lName) || self.newMember.lName == '')
			self.newMember.lName = '.';
		
		// check duplicate players
		angular.forEach(self.event.users, function (user, uInd) {
			if(angular.lowercase(user.userName.split(" ")[0]) == angular.lowercase(self.newMember.fName) && angular.lowercase(user.userName.split(" ")[1]) == angular.lowercase(self.newMember.lName)){
				self.newMember.ind = uInd;
				isDuplicate = true;
				return false;
			}					
		});
		
		if(isDuplicate == false){
			var params = angular.extend({}, self.newMember, {'tid': self.event.tid, 'gid': self.event.team.pid});
			GeneralService.addTeamMember(params).then(function success(response) {
				var status = response.data ? response.data.success : null;
				if (status) {
					self.addedPlayer = response.data.extras.fName + ' ' + response.data.extras.lName;
					self.event.users.push({'uid':response.data.extras.id, 'userName':response.data.extras.fName + ' ' + response.data.extras.lName, 'selected':true});
					self.playerCount += 1;
					GeneralService.addPlayerInPlaying11(self.event.team.pid, self.event.users);
					self.newMember.success = true;
					self.newMember.msg = response.data.extras.fName +" "+ response.data.extras.lName +" added successfully.";
					$timeout(function () {
						self.newMember.success = false;
						self.newMember = null;
						self.newMember = {hasValidContact: false};
						form.$setPristine();
						form.$setUntouched();
						self.confirm.btnDisable = false;
					}, 2000);
				} else {
					self.newMember.failed = true;
					self.newMember.msg = "Something went wrong!";
					$timeout(function () {
						self.newMember.failed = false;
						self.confirm.btnDisable = false;
					}, 2000);
				}
			}, function error(response) {
				console.log(response);
				self.confirm.btnDisable = false;
			});
		} else {
			self.newMember.failed = true;
			self.newMember.msg = "Player with same name already exists. Please use different name.";
			self.confirm.btnDisable = false;
		}
    };
	
	// Remove member from group/team
	self.removeTeamMember = function(uid) {
		GeneralService.removeTeamMember({'tid':self.event.tid, 'gid':self.event.team.pid, 'playerid':uid}).then(function (response) {
			var status = response.data ? response.data.success : null;
			if (status) {
				var ind = self.event.users.map(function(obj){
					return obj.uid;
				}).indexOf(uid);
				self.event.users.splice(ind, 1);
				self.getPlayerCount();
			}	
		});
	};
	
	self.updateProfPic = function (files, uid) {
		var file = files[0];
		GeneralService.uploadProfilePic(file, 'tournament_user', uid, self.event.tid, self.event.team.pid).then(function success(response){
			var status = response.data ? response.data.success : null;
            if (status) {
				self.confirm.uploadStatus = 1;
                $timeout(function () {
                    self.confirm.uploadStatus = null;
					self.updateTime();
				}, 2000);
			}else{
				self.confirm.uploadStatus = 2;
                $timeout(function () {
                    self.confirm.uploadStatus = null;
				}, 2000);
			}	
		}, function error(response){
			console.log("Error uploading file : " + response)
			self.confirm.uploadStatus = 3;
			$timeout(function () {
				self.confirm.uploadStatus = null;
			}, 2000);
		});
	};
	
	// Update time to refresh image when changed
	self.updateTime = function () {
		self.confirm.imgRefreshTime = new Date().getTime();
	}
	
	// Reset add Player in group/team form
    self.resetNewMemberForm = function (form) {
        self.newMember = null;
        self.newMember = {hasValidContact: false};
        form.$setPristine();
        form.$setUntouched();
    }	
}
;	
function selectPlayerController(auth, GeneralService, $timeout, ngDialog) {
	var self = this;
	var userInfo = auth.getUserDetails();
    self.id = userInfo.id;
	self.confirm = {};
	self.players = [];
	self.players = GeneralService.match.players;
	self.tid = GeneralService.match.tid;
	self.pid = GeneralService.match.pid;
	self.gid = GeneralService.match.gid;
	self.selected = GeneralService.match.selPlayer;
	if(!angular.isUndefinedOrNull(self.selected)){
		var ind = self.players.map(function(obj){
			return obj.uid
		}).indexOf(self.selected.uid);
		self.selected = self.players[ind];
	}	
	
	// Add new batsman/bowler
	self.setPlayerInMatch = function (){
		self.confirm.btnDisable = true;
		GeneralService.setPlayerInMatch(self.selected);
		ngDialog.close();
	};	
	
	// Validating user 
	self.validateMemberContact = function () {
        var member = self.newMember;
        if(member.contact){
            var isMobile = /^\d{10}$/.test(member.contact);
            var isEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(member.contact);
            member.hasValidContact = (isMobile || isEmail);

            if(isEmail){
                member["email"] = member.contact;
                delete member["mobile"];
            }
            if(isMobile){
                delete member["email"];
                member["mobile"] = member.contact;
            }
            if(!isEmail && !isMobile){
                if(member.email)
                    delete member.email;
                if(member.mobile)
                    delete member.mobile;
            }
        }else{
            member.hasValidContact = false;
        }
    };
	
	// Add Player in group/team  
    self.addNewMember = function (form) {
		self.confirm.btnDisable = true;
		var isDuplicate = false;
		
		if(angular.isUndefinedOrNull(self.newMember.lName) || self.newMember.lName == '')
			self.newMember.lName = '.';
		
		// check duplicate players
		angular.forEach(self.players, function (user, uInd) {
			if(angular.lowercase(user.userName.split(" ")[0]) == angular.lowercase(self.newMember.fName) && angular.lowercase(user.userName.split(" ")[1]) == angular.lowercase(self.newMember.lName)){
				self.newMember.ind = uInd;
				isDuplicate = true;
				return false;
			}					
		});
		
		if(isDuplicate == false){
			var params = angular.extend({}, self.newMember, {'tid': self.tid, 'gid': self.gid});
			GeneralService.addTeamMember(params).then(function success(response) {
				var status = response.data ? response.data.success : null;
				if (status) {
					self.addedPlayer = response.data.extras.fName + ' ' + response.data.extras.lName;
					self.players.push({'uid':response.data.extras.id, 'userName':response.data.extras.fName + ' ' + response.data.extras.lName});
					GeneralService.addPlayerInPlaying11(self.pid, self.players);	
					self.newMember.success = true;
					self.newMember.msg = response.data.extras.fName +" "+ response.data.extras.lName +" added successfully."; 
					$timeout(function () {
						self.newMember.success = false;
						self.newMember = null;
						self.newMember = {hasValidContact: false};
						form.$setPristine();
						form.$setUntouched();
						self.confirm.btnDisable = false;
					}, 2000);
				} else {
					self.newMember.failed = true;
					self.newMember.msg = "Something went wrong!";
					$timeout(function () {
						self.newMember.failed = false;
						self.confirm.btnDisable = false;
					}, 2000);
				}
			}, function error(response) {
				console.log(response);
				self.confirm.btnDisable = false;
			});
		} else {
			self.newMember.failed = true;
			self.newMember.msg = "Player with same name already exists. Please use different name.";
			self.confirm.btnDisable = false;
		}
	};
	
	// Remove Player from group/team
	self.removeTeamMember = function(uid) {
		GeneralService.removeTeamMember({'tid':self.tid, 'gid':self.gid, 'playerid':uid}).then(function (response) {
			var status = response.data ? response.data.success : null;
			if (status) {
				var ind = self.players.map(function(obj){
					return obj.uid;
				}).indexOf(uid);
				self.players.splice(ind, 1);
			}	
		});
	};
	
	// Reset add Player in group/team form
    self.resetNewMemberForm = function (form) {
        self.newMember = null;
        self.newMember = {hasValidContact: false};
        form.$setPristine();
        form.$setUntouched();
    }
}
;
function setPlayersController(auth, GeneralService, $timeout, ngDialog) {
	var self = this; 
	var userInfo = auth.getUserDetails();
    self.id = userInfo.id;
	self.confirm = {};
	self.batsmen = GeneralService.match.batsmen;
	self.bowlers = GeneralService.match.bowlers;
	self.tid = GeneralService.match.tid;
	self.pid = GeneralService.match.pid;
	self.gid = GeneralService.match.gid;
	self.team = GeneralService.match.team;
	
	// Setting player on strike
	self.setStrike = function (){
		angular.forEach(self.batsmen, function(item, index){
			delete item.batted;
			if(item.uid === self.onstrike.uid){
				item.batted = true;
			}
		});
	};
	
	// Add new batsman/bowler
	self.setPlayersOnInningStart = function (){
		self.confirm.btnDisable = true;
		GeneralService.setPlayersOnInningStart(self.onstrike, self.nonstrike, self.bowler);
		ngDialog.close();
	};
	
	// Cancel Popup
	self.cancelPopup = function () {
		ngDialog.close();
	}
	
	// Validating user 
	self.validateMemberContact = function () {
        var member = self.newMember;
        if(member.contact){
            var isMobile = /^\d{10}$/.test(member.contact);
            var isEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(member.contact);
            member.hasValidContact = (isMobile || isEmail);

            if(isEmail){
                member["email"] = member.contact;
                delete member["mobile"];
            }
            if(isMobile){
                delete member["email"];
                member["mobile"] = member.contact;
            }
            if(!isEmail && !isMobile){
                if(member.email)
                    delete member.email;
                if(member.mobile)
                    delete member.mobile;
            }
        }else{
            member.hasValidContact = false;
        }
    };
	
	// Add Player in group/team  
    self.addNewMember = function (form) {
		self.confirm.btnDisable = true;
		var isDuplicate = false;
		
		if(angular.isUndefinedOrNull(self.newMember.lName) || self.newMember.lName == '')
			self.newMember.lName = '.';
		
		// check duplicate players
		angular.forEach(self.batsmen, function (user, uInd) {
			if(angular.lowercase(user.userName.split(" ")[0]) == angular.lowercase(self.newMember.fName) && angular.lowercase(user.userName.split(" ")[1]) == angular.lowercase(self.newMember.lName)){
				self.newMember.ind = uInd;
				isDuplicate = true;
				return false;
			}					
		});
		
		if(isDuplicate == false){
			var params = angular.extend({}, self.newMember, {'tid': self.tid, 'gid': self.gid});
			GeneralService.addTeamMember(params).then(function success(response) {
				var status = response.data ? response.data.success : null;
				if (status) {
					self.addedPlayer = response.data.extras.fName + ' ' + response.data.extras.lName;
					self.batsmen.push({'uid':response.data.extras.id, 'userName':response.data.extras.fName + ' ' + response.data.extras.lName});
					GeneralService.addPlayerInPlaying11(self.pid, self.batsmen);	
					self.newMember.success = true;
					self.newMember.msg = response.data.extras.fName +" "+ response.data.extras.lName +" added successfully.";
					$timeout(function () {
						self.newMember.success = false;
						self.newMember = null;
						self.newMember = {hasValidContact: false};
						form.$setPristine();
						form.$setUntouched();
						self.confirm.btnDisable = false;
					}, 2000);
				} else {
					self.newMember.failed = true;
					self.newMember.msg = "Something went wrong!";
					$timeout(function () {
						self.newMember.failed = false;
						self.confirm.btnDisable = false;
					}, 2000);
				}
			}, function error(response) {
				console.log(response);
				self.confirm.btnDisable = false;
			});
		} else {
			self.newMember.failed = true;
			self.newMember.msg = "Player with same name already exists. Please use different name.";
			self.confirm.btnDisable = false;
		}	
    };
	
	// Reset add Player in group/team form
    self.resetNewMemberForm = function (form) {
        self.newMember = null;
        self.newMember = {hasValidContact: false};
        form.$setPristine();
        form.$setUntouched();
    };
}
;
function selectBatsmanController(auth, GeneralService, $timeout, ngDialog) {
	var self = this;
	var userInfo = auth.getUserDetails();
    self.id = userInfo.id;
	self.confirm = {};
	self.players = GeneralService.match.players;
	self.currBatting = GeneralService.match.currBatting;
	self.currBattingPlayer = GeneralService.match.currBattingPlayer;
	self.currBattingPlayerFake = self.currBattingPlayer.map(function(obj){
		return {
			'id': obj.id,
			'name': obj.name
		}
	});
	self.batsmanIndex = GeneralService.match.batsmanIndex;
	self.tid = GeneralService.match.tid;
	self.pid = GeneralService.match.pid;
	self.gid = GeneralService.match.gid;
	
	// Add selected batsman to current batting
	self.addToCurrBatting = function () {
		self.onstrike = null;
		if(angular.isUndefinedOrNull(self.confirm.selFlag)){
			self.confirm.selFlag = true;
			self.currBattingPlayerFake.push({'id':self.selected.uid, 'name':self.selected.userName});
		}else{
			self.currBattingPlayerFake.pop();
			self.currBattingPlayerFake.push({'id':self.selected.uid, 'name':self.selected.userName});
		}
	};
	
	// Calculate Current Run Rate
	self.calculateCRR = function (inning) {
		var teamCRR = (inning.score / (inning.overs + (0.1666 * inning.balls))).toFixed(2);
		if (isNaN(teamCRR))
			teamCRR = 0;
		return teamCRR;
	}
	self.teamCRR = self.calculateCRR(self.currBatting);
	
	// Select batsman
	self.selectBatsman = function () {
		self.confirm.btnDisable = true;
		self.currBatting.addBatsman(self.selected.uid, self.selected.userName, new Date().getTime());
		self.currBattingPlayer.push(self.currBatting.batting[self.currBatting.batting.length-1]);
		self.batsmanIndex.push(self.currBatting.batting.length - 1);
		var strikeIndex = self.currBatting.batting.map(function(obj){
			return obj.id;
		}).indexOf(self.onstrike.id);
		GeneralService.setBatsmanInMatch(strikeIndex);
		ngDialog.close();
	};
	
	// Cancel Popup
	self.cancelPopup = function () {
		ngDialog.close();
	}
	
	// Validating user 
	self.validateMemberContact = function () {
        var member = self.newMember;
        if(member.contact){
            var isMobile = /^\d{10}$/.test(member.contact);
            var isEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(member.contact);
            member.hasValidContact = (isMobile || isEmail);

            if(isEmail){
                member["email"] = member.contact;
                delete member["mobile"];
            }
            if(isMobile){
                delete member["email"];
                member["mobile"] = member.contact;
            }
            if(!isEmail && !isMobile){
                if(member.email)
                    delete member.email;
                if(member.mobile)
                    delete member.mobile;
            }
        }else{
            member.hasValidContact = false;
        }
    };
	
	// Add Player in group/team  
    self.addNewMember = function (form) {
		self.confirm.btnDisable = true;
		var isDuplicate = false;
		
		if(angular.isUndefinedOrNull(self.newMember.lName) || self.newMember.lName == '')
			self.newMember.lName = '.';
		
		// check duplicate players
		angular.forEach(self.players, function (user, uInd) {
			if(angular.lowercase(user.userName.split(" ")[0]) == angular.lowercase(self.newMember.fName) && angular.lowercase(user.userName.split(" ")[1]) == angular.lowercase(self.newMember.lName)){
				self.newMember.ind = uInd;
				isDuplicate = true;
				return false;
			}					
		});
		
		if(isDuplicate == false){
			var params = angular.extend({}, self.newMember, {'tid': self.tid, 'gid': self.gid});
			GeneralService.addTeamMember(params).then(function success(response) {
				var status = response.data ? response.data.success : null;
				if (status) {
					self.addedPlayer = response.data.extras.fName + ' ' + response.data.extras.lName;
					self.players.push({'uid':response.data.extras.id, 'userName':response.data.extras.fName + ' ' + response.data.extras.lName});
					GeneralService.addPlayerInPlaying11(self.pid, self.players);	
					self.newMember.success = true;
					self.newMember.msg = response.data.extras.fName +" "+ response.data.extras.lName +" added successfully.";
					$timeout(function () {
						self.newMember.success = false;
						self.newMember = null;
						self.newMember = {hasValidContact: false};
						form.$setPristine();
						form.$setUntouched();
						self.confirm.btnDisable = false;
					}, 2000);
				} else {
					self.newMember.failed = true;
					self.newMember.msg = "Something went wrong!";
					$timeout(function () {
						self.newMember.failed = false;
						self.confirm.btnDisable = false;
					}, 2000);
				}
			}, function error(response) {
				console.log(response);
				self.confirm.btnDisable = false;
			});
		} else {
			self.newMember.failed = true;
			self.newMember.msg = "Player with same name already exists. Please use different name.";
			self.confirm.btnDisable = false;
		}
	};
	
	// Reset add Player in group/team form
    self.resetNewMemberForm = function (form) {
        self.newMember = null;
        self.newMember = {hasValidContact: false};
        form.$setPristine();
        form.$setUntouched();
    };
}
;
function selectBatsmanBowlerController(auth, GeneralService, $timeout, ngDialog) {
	var self = this;
	var userInfo = auth.getUserDetails();
    self.id = userInfo.id;
	self.confirm = {};
	self.batsmen = GeneralService.match.batsmen;
	self.currBatting = GeneralService.match.currBatting;
	self.currBattingPlayer = GeneralService.match.currBattingPlayer;
	self.currBattingPlayerFake = self.currBattingPlayer.map(function(obj){
		return {
			'id': obj.id,
			'name': obj.name
		}
	});
	self.batsmanIndex = GeneralService.match.batsmanIndex;
	self.bowlers = GeneralService.match.bowlers;
	self.currBowling = GeneralService.match.currBowling;	
	self.tid = GeneralService.match.tid;
	self.pid = GeneralService.match.pid;
	self.gid = GeneralService.match.gid;
	
	// Add selected batsman to current batting
	self.addToCurrBatting = function () {
		self.onstrike = null;
		if(angular.isUndefinedOrNull(self.confirm.selFlag)){
			self.confirm.selFlag = true;
			self.currBattingPlayerFake.push({'id':self.selected.uid, 'name':self.selected.userName});
		}else{
			self.currBattingPlayerFake.pop();
			self.currBattingPlayerFake.push({'id':self.selected.uid, 'name':self.selected.userName});
		}
	};
	
	// Calculate Current Run Rate
	self.calculateCRR = function (inning) {
		var teamCRR = (inning.score / (inning.overs + (0.1666 * inning.balls))).toFixed(2);
		if (isNaN(teamCRR))
			teamCRR = 0;
		return teamCRR;
	}
	self.teamCRR = self.calculateCRR(self.currBatting);
	
	// Select batsman and bowler
	self.selectBatsmanBowler = function () {
		self.confirm.btnDisable = true;
		// Add batsman
		self.currBatting.addBatsman(self.selected.uid, self.selected.userName, new Date().getTime());
		self.currBattingPlayer.push(self.currBatting.batting[self.currBatting.batting.length-1]);
		self.batsmanIndex.push(self.currBatting.batting.length - 1);
		var strikeIndex = self.currBatting.batting.map(function(obj){
			return obj.id;
		}).indexOf(self.onstrike.id);
		
		// Add bolwer
		var isExist = false;
		var bowlerIndex = 0;
		angular.forEach(self.currBowling.bowling, function(item, index){
			if(item.over_count === 0 && item.balls === 0){
				self.currBowling.bowling.splice(index, 1);
			}
		});
		angular.forEach(self.currBowling.bowling, function(item, index){
			if(item.id === self.bowler.uid){
				isExist = true;
				bowlerIndex = index;
			}	
		});
		if(!isExist){
			self.currBowling.addBowler(self.bowler.uid, self.bowler.userName, new Date().getTime());
			bowlerIndex = self.currBowling.bowling.length - 1;	
		}
		
		GeneralService.setBatsmanBowlerInMatch(strikeIndex, bowlerIndex);
		ngDialog.close();
	};
	
	// Cancel Popup
	self.cancelPopup = function () {
		ngDialog.close();
	}
	
	// Validating user 
	self.validateMemberContact = function () {
        var member = self.newMember;
        if(member.contact){
            var isMobile = /^\d{10}$/.test(member.contact);
            var isEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(member.contact);
            member.hasValidContact = (isMobile || isEmail);

            if(isEmail){
                member["email"] = member.contact;
                delete member["mobile"];
            }
            if(isMobile){
                delete member["email"];
                member["mobile"] = member.contact;
            }
            if(!isEmail && !isMobile){
                if(member.email)
                    delete member.email;
                if(member.mobile)
                    delete member.mobile;
            }
        }else{
            member.hasValidContact = false;
        }
    };
	
	// Add Player in group/team  
    self.addNewMember = function (form) {
		self.confirm.btnDisable = true;
		var isDuplicate = false;
		
		if(angular.isUndefinedOrNull(self.newMember.lName) || self.newMember.lName == '')
			self.newMember.lName = '.';
		
		// check duplicate players
		angular.forEach(self.batsmen, function (user, uInd) {
			if(angular.lowercase(user.userName.split(" ")[0]) == angular.lowercase(self.newMember.fName) && angular.lowercase(user.userName.split(" ")[1]) == angular.lowercase(self.newMember.lName)){
				self.newMember.ind = uInd;
				isDuplicate = true;
				return false;
			}					
		});
		
		if(isDuplicate == false){
			var params = angular.extend({}, self.newMember, {'tid': self.tid, 'gid': self.gid});
			GeneralService.addTeamMember(params).then(function success(response) {
				var status = response.data ? response.data.success : null;
				if (status) {
					self.addedPlayer = response.data.extras.fName + ' ' + response.data.extras.lName;
					self.batsmen.push({'uid':response.data.extras.id, 'userName':response.data.extras.fName + ' ' + response.data.extras.lName});
					GeneralService.addPlayerInPlaying11(self.pid, self.batsmen);	
					self.newMember.success = true;
					self.newMember.msg = response.data.extras.fName +" "+ response.data.extras.lName +" added successfully.";
					$timeout(function () {
						self.newMember.success = false;
						self.newMember = null;
						self.newMember = {hasValidContact: false};
						form.$setPristine();
						form.$setUntouched();
						self.confirm.btnDisable = false;
					}, 2000);
				} else {
					self.newMember.failed = true;
					self.newMember.msg = "Something went wrong!";
					$timeout(function () {
						self.newMember.failed = false;
						self.confirm.btnDisable = false;
					}, 2000);
				}
			}, function error(response) {
				console.log(response);
				self.confirm.btnDisable = false;
			});
		} else {
			self.newMember.failed = true;
			self.newMember.msg = "Player with same name already exists. Please use different name.";
			self.confirm.btnDisable = false;
		}
	};
	
	// Reset add Player in group/team form
    self.resetNewMemberForm = function (form) {
        self.newMember = null;
        self.newMember = {hasValidContact: false};
        form.$setPristine();
        form.$setUntouched();
    };
}
;	
function selectBowlerController(auth, GeneralService, $timeout, ngDialog) {
	var self = this;
	var userInfo = auth.getUserDetails();
    self.id = userInfo.id;
	self.confirm = {};
	self.players = GeneralService.match.players;
	self.currBowling = GeneralService.match.currBowling;
	self.currBatting = GeneralService.match.currBatting;
	self.tid = GeneralService.match.tid;
	self.pid = GeneralService.match.pid;
	self.gid = GeneralService.match.gid;
	self.selected = GeneralService.match.selPlayer;
	if(!angular.isUndefinedOrNull(self.selected)){
		var ind = self.players.map(function(obj){
			return obj.uid
		}).indexOf(self.selected.uid);
		self.selected = self.players[ind];
	}	

	// Add new bowler
	self.setBowlerInMatch = function (){
		self.confirm.btnDisable = true;
		// Add bolwer
		var isExist = false;
		var bowlerIndex = 0;
		angular.forEach(self.currBowling.bowling, function(item, index){
			if(item.over_count === 0 && item.balls === 0){
				self.currBowling.bowling.splice(index, 1);
			}
		});
		angular.forEach(self.currBowling.bowling, function(item, index){
			if(item.id === self.selected.uid){
				isExist = true;
				bowlerIndex = index;
			}	
		});
		if(!isExist){
			self.currBowling.addBowler(self.selected.uid, self.selected.userName, new Date().getTime());
			bowlerIndex = self.currBowling.bowling.length - 1;	
		}		
		GeneralService.setBowlerInMatch(bowlerIndex);
		ngDialog.close();
	};	
	
	// Calculate Current Run Rate
	self.calculateCRR = function (inning) {
		var teamCRR = (inning.score / (inning.overs + (0.1666 * inning.balls))).toFixed(2);
		if (isNaN(teamCRR))
			teamCRR = 0;
		return teamCRR;
	}
	self.teamCRR = self.calculateCRR(self.currBatting);
	
	// Validating user 
	self.validateMemberContact = function () {
        var member = self.newMember;
        if(member.contact){
            var isMobile = /^\d{10}$/.test(member.contact);
            var isEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(member.contact);
            member.hasValidContact = (isMobile || isEmail);

            if(isEmail){
                member["email"] = member.contact;
                delete member["mobile"];
            }
            if(isMobile){
                delete member["email"];
                member["mobile"] = member.contact;
            }
            if(!isEmail && !isMobile){
                if(member.email)
                    delete member.email;
                if(member.mobile)
                    delete member.mobile;
            }
        }else{
            member.hasValidContact = false;
        }
    };
	
	// Add Player in group/team  
    self.addNewMember = function (form) {
		self.confirm.btnDisable = true;
		var isDuplicate = false;
		
		if(angular.isUndefinedOrNull(self.newMember.lName) || self.newMember.lName == '')
			self.newMember.lName = '.';
		
		// check duplicate players
		angular.forEach(self.players, function (user, uInd) {
			if(angular.lowercase(user.userName.split(" ")[0]) == angular.lowercase(self.newMember.fName) && angular.lowercase(user.userName.split(" ")[1]) == angular.lowercase(self.newMember.lName)){
				self.newMember.ind = uInd;
				isDuplicate = true;
				return false;
			}					
		});
		
		if(isDuplicate == false){
			var params = angular.extend({}, self.newMember, {'tid': self.tid, 'gid': self.gid});
			GeneralService.addTeamMember(params).then(function success(response) {
				var status = response.data ? response.data.success : null;
				if (status) {
					self.addedPlayer = response.data.extras.fName + ' ' + response.data.extras.lName;
					self.players.push({'uid':response.data.extras.id, 'userName':response.data.extras.fName + ' ' + response.data.extras.lName});
					GeneralService.addPlayerInPlaying11(self.pid, self.players);	
					self.newMember.success = true;
					self.newMember.msg = response.data.extras.fName +" "+ response.data.extras.lName +" added successfully.";
					$timeout(function () {
						self.newMember.success = false;
						self.newMember = null;
						self.newMember = {hasValidContact: false};
						form.$setPristine();
						form.$setUntouched();
						self.confirm.btnDisable = false;
					}, 2000);
				} else {
					self.newMember.failed = true;
					self.newMember.msg = "Something went wrong!";
					$timeout(function () {
						self.newMember.failed = false;
						self.confirm.btnDisable = false;
					}, 2000);
				}
			}, function error(response) {
				console.log(response);
				self.confirm.btnDisable = false;
			});
		} else {
			self.newMember.failed = true;
			self.newMember.msg = "Player with same name already exists. Please use different name.";
			self.confirm.btnDisable = false;
		}
	};
	
	// Remove Player from group/team
	self.removeTeamMember = function(uid) {
		GeneralService.removeTeamMember({'tid':self.tid, 'gid':self.gid, 'playerid':uid}).then(function (response) {
			var status = response.data ? response.data.success : null;
			if (status) {
				var ind = self.players.map(function(obj){
					return obj.uid;
				}).indexOf(uid);
				self.players.splice(ind, 1);
			}	
		});
	};
	
	// Reset add Player in group/team form
    self.resetNewMemberForm = function (form) {
        self.newMember = null;
        self.newMember = {hasValidContact: false};
        form.$setPristine();
        form.$setUntouched();
    };
}
;
function inviteFriendController(auth, GeneralService, $http, API, ngDialog) {
    var self = this;
    var userInfo = auth.getUserDetails();
    var id = userInfo.id;
    var email;
    self.inviteFriends = function () {
        self.email = self.email.replace(/\s/g, '');
        var datatoInvite = {
            uid: id,
            email: self.email
        };

        this.inviteFrnd(datatoInvite).then(function (result) {
            console.log('success');
            ngDialog.close();
        });
    };
    this.inviteFrnd = function (data) {
        return $http.post(API + '/friendapi/invite', data);
    };
    self.cancel = function () {
        ngDialog.close();
        //console.log("cancelled");
    };
}
;
function createGroupController(auth, GeneralService, $http, API, ngDialog) {
    var self = this;
    var userInfo = auth.getUserDetails();
    var id = userInfo.id;
    var uname = userInfo.fName + userInfo.lName;

    self.createGroup = function () {
        var groupData = {
            grpName: self.grpName,
            uid: id,
            userName: uname,
            city: self.selLocations
        };

        if (self.selFacility) {
            groupData.facility = self.selFacility;
        }
        if (self.selSports) {
            groupData.sports = self.selSports;
        }

        if (self.selectedFrds) {
            var newArray = [];
            angular.forEach(self.selectedFrds, function (item, index) {
                newArray.push(item.uid);
            });
            groupData.frnd = newArray;
        }

        GeneralService.createGrp(groupData).then(function (result) {
            if (result.data) {
                if (result.data.success === true) {
                    GeneralService.addToGroupList({'grpName': self.grpName, 'gid': result.data.extras.data, 'admin': true});
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
    GeneralService.loadGeneral(id, function (resp) {
        if (resp === true) {
            self.myLocations = GeneralService.mylocations;
            self.selLocations = self.myLocations[0];
            self.myFriends = GeneralService.myFriends;
        } else {
            console.log("Error occured while loading mini profile");
        }
    });
    GeneralService.listSports().then(function (data) {
        self.sports = data.data.extras.data;
        self.selSports = self.sports[0];
    });
}
;
function detailArticleController(auth, GeneralService, $timeout) {
    var self = this;
    var userInfo = auth.getUserDetails();
    self.uid = userInfo.id;
    self.aid = GeneralService.articleId;
    self.articletype = GeneralService.articleT;

    // Service call
    GeneralService.getAritcle(self.uid, self.aid, self.articletype).then(function (data) {

        if (data && data.data) {
            self.data = data.data.extras.data.content;
            //console.log(self.data);
            self.comments = data.data.extras.data.content.comments;
            if (angular.isUndefinedOrNull(self.comments)) {
                self.comments = [];
            }

            $timeout(function () {
                $('.commentContainer').animate({scrollTop: $('.commentContainer').prop('scrollHeight')}, 100);
            }, 1000);
        } else {
            console.log('getArticless not loaded');
        }
    });

    self.createArticleComment = function (index) {
        console.log('hererere');
        var createCommentData = {
            cid: self.aid,
            uid: self.uid,
            body: self.comment[index]
        };
        GeneralService.postArticleComment(createCommentData).then(function (result) {
            if (result.data.success == true) {
                var newComment = {
                    'acid': self.aid,
                    'uid': userInfo.id,
                    'name': userInfo.fName + ' ' + userInfo.lName,
                    'pic': userInfo.id + '.jpg',
                    'cmnt': self.comment[index],
                    'date': new Date()
                }
                self.comments.push(newComment);
                self.comment[index] = '';
                self.isFocus.submitted = false;
                $('.commentContainer').animate({scrollTop: $('.commentContainer').prop('scrollHeight')}, 1000);
                // Adding comment on homepage
                GeneralService.addCommentToHome(newComment);

            } else {
                alert(result.data.extras.msg.message);
            }
            //self.subsCount = result.data.extras.data.items
            console.log(result);
        });
    };

    self.likeThisItem = function (index, type) {
        var likeData = {
            uid: self.uid,
            iid: index,
            type: type,
            like: true
        };
        GeneralService.likeItems(likeData).then(function (result) {
            if (result.data.success == true) {
                if (self.data.likeCount) {
                    self.data.likeCount = parseInt(self.data.likeCount) + 1;
                } else {
                    self.data.likeCount = 1;
                }
                console.log('success');
            } else {
                //alert(result.data.extras.msg.message);
            }
            //self.subsCount = result.data.extras.data.items
            console.log(result);
        });
    };

}
;
function CreateIndividualMatchController(auth, GeneralService, $filter, ngDialog, $timeout) {
	var self = this;
    var userInfo = auth.getUserDetails();
	self.uid = userInfo.id;
	self.confirm = {};
	self.datetime = {};
	self.match = {};
	self.invalidPlayerDetails = true;
	self.newteam = {players: []};
    self.datetime.currDate = new Date();
    self.datetime.date = new Date();
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
        for (var i = 0; i <= 59; i += 5) {
            var min = (i < 10) ? "0" + i : i;
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

    self.datetime.hours = get_hours();  
    self.datetime.selHour = self.datetime.hours[hours24to12(self.datetime.currHour)].value;
    self.datetime.minutes = get_minutes();
    self.datetime.selMinute = self.datetime.minutes[0];
    self.datetime.selMer = get_meridiem(self.datetime.currHour);

	self.validDate = function () {
        var today = $filter('date')(new Date(), "yyyy-MM-dd HH:mm:ss");
        var dt = $filter('date')(new Date(self.datetime.date), "yyyy-MM-dd");
        var hr = hours12to24(self.datetime.selHour, self.datetime.selMer);
        hr = (hr < 10) ? '0' + hr : hr;
        self.datetime.evtDate = dt + "-" + hr + "-" + self.datetime.selMinute;
        self.datetime.invalidDate = false;
        return true;
    };
	
    self.convertDateToUTC = function (dt) {
        var tmp = dt.split("-");
        var date = new Date(tmp[0], parseInt(tmp[1]) - 1, tmp[2], tmp[3], tmp[4], "00");
        var utc_date = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
        return $filter('date')(utc_date, "yyyy-MM-ddTHH:mm:ss") + '.330Z';
    };
	
	// Get all groups created by user
	GeneralService.getGroupsByCreator(self.uid, "Cricket").then(function(results){
		self.userGroups = results.data;
	});
	
	self.listSquad = function (team, gid) {
		GeneralService.getGroupDetails(self.uid, gid).then(function (response) {
			var status = response.data ? response.data.success : null;
			if (status) {
				if(team === 'team1')
					self.team1squad = response.data.extras.data.group.users;
				else
					self.team2squad = response.data.extras.data.group.users;
			}
		});
	};
	
	self.createMatch = function () {
		var hr = hours12to24(self.datetime.selHour, self.datetime.selMer);
        hr = (hr < 10) ? '0' + hr : hr;
		var team = {
			uid:self.uid,
			userName:userInfo.fName +' '+ userInfo.lName, 
			evtName:"<span class='schTeam'>" + self.match.team1.grpName + "</span><span class='schTeamvs'>vs</span><span class='schTeam'>" + self.match.team2.grpName + "</span>", 
			sport:['Cricket'],
			evtDate:$filter('date')(new Date(self.datetime.date), "yyyy-MM-dd"), 
			evtTime:hr + ":" + self.datetime.selMinute + ":00",
			groups:[self.match.team1._id, self.match.team2._id],
                  evtType: "team",
                  city:"Vadodara"
		};
		self.confirm.btnDisable = true;
		GeneralService.createSingleMatch(team).then(function (response) {
			var status = response.data ? response.data.success : null;
			if (status) {
				GeneralService.addEventOnHomeFeed(response.data.extras.data.event);
				self.confirm.btnDisable = false;
			}else{
				self.confirm.btnDisable = false;
			}
			ngDialog.close();
		}, function error(response) {
            console.log(response);
            self.confirm.btnDisable = false;
        });
	};
	
	self.cancelPopup = function () {
        ngDialog.close();
    };
	
	self.createTeam = function (isValidForm) {
        if (isValidForm) {
            self.confirm.btnDisable = true;
            var team = {'teamName': self.newteam.name, 'city': GeneralService.mylocations.join(","), 'sport':['Cricket']};
            if (!angular.isUndefinedOrNull(self.newteam.players) && self.newteam.players.length > 0) {
                self.newteam.players[0].isAdmin = true;	// make first player admin by default
                team.teamMembers = self.newteam.players;
                angular.forEach(team.teamMembers, function (mem, memInd) {
                    if (angular.isUndefinedOrNull(mem.lName) || mem.lName == '') {
                        mem.lName = '.';
                    }
                });
            }

            GeneralService.createTeamByIndividual(team).then(function success(response) {
                var status = response.data ? response.data.success : null;
                if (status) {
                    self.userGroups.push({'_id': response.data.extras.data, 'grpName':team.teamName});
                    self.newteam.success = true;
                    $timeout(function () {
                        self.newteam.success = false;
                        self.newteam.players.length = 0;
                        self.newteam = null;
                        self.newteam = {players: []};
                        self.activeForm = null;
                        self.newTeamForm.$setPristine();
                        self.confirm.btnDisable = false;
                    }, 2000);
                } else {
                    self.newteam.failed = true;
                    $timeout(function () {
                        self.newteam.failed = false;
                        self.confirm.btnDisable = false;
                    }, 2000);
                }
            }, function error(response) {
                console.log(response);
                self.confirm.btnDisable = false;
            });
        } else {
            self.newteam.failed = true;
            $timeout(function () {
                self.newteam.failed = false;
                self.confirm.btnDisable = false;
            }, 2000);
        }
    };

	self.validatePlayerContact = function (player) {
        var isMobile = /^\d{10}$/.test(player.contact);
        var isEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(player.contact);
        self.invalidPlayerDetails = !(isMobile || isEmail);

        if (isEmail) {
            player["email"] = player.contact;
            delete player["mobile"];
        }

        if (isMobile) {
            delete player["email"];
            player["mobile"] = player.contact;
        }

        if (!isEmail && !isMobile) {
            if (player.email)
                delete player.email;
            if (player.mobile)
                delete player.mobile;
        }
    };
	
    self.addPlayer = function () {
        self.invalidPlayerDetails = true;
        self.newteam.players.push({});
    };

    self.removePlayer = function (index) {
        self.newteam.players.splice(index, 1);
        var playersCount = self.newteam.players.length;

        // disable Create button if all players have been removed from array
        if (playersCount == 0) {
            self.invalidPlayerDetails = true;
        } else {
            self.invalidPlayerDetails = false;
        }
    };
	
	self.resetTeamForm = function () {
        self.newteam.players.length = 0;
        self.newteam = null;
        self.newteam = {players: []};
        self.invalidPlayerDetails = false;
        self.newTeamForm.$setPristine();
        self.activeForm = null;
		self.confirm.btnDisable = false;
    };
	
}
;
angular.module('sem')
        .controller("headCtrl", headCtrl)
        .controller("createEvent", createEventController)
        .controller("createTournament", createTournamentController)
        .controller("myTournaments", myTournamentsController)
        .controller("contactUsCtrl", contactUsController)
        .controller("createDiscussion", createDiscussionController)
        .controller("detailDiscussion", detailDiscussionController)
        .controller("groupDetails", groupDetailsController)
        .controller("teamMembers", teamMembersController)
        .controller("playing11", playingElevenController)
        .controller("selectPlayer", selectPlayerController)
        .controller("setPlayers", setPlayersController)
		.controller("selectBatsman", selectBatsmanController)
		.controller("selectBatsmanBowler", selectBatsmanBowlerController)
		.controller("selectBowler", selectBowlerController)        
        .controller("createGroup", createGroupController)
        .controller("inviteFriend", inviteFriendController)
        .controller("QuickMatch", quickMatchController)
        .controller("frndGrpCtrl", frndGrpCtrl)
        .controller("detailArticle", detailArticleController)
        .controller("peopleController", peopleController)
		.controller("CreateIndividualMatchController", CreateIndividualMatchController)
		;
