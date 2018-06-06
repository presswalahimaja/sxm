;
function loginCtrl(user, auth, $http, API, $timeout, $rootScope, GeneralService, ngDialog) {
    "ngInject";
    var self = this;
    self.email = "";
	self.mobile = "";
    self.fName = "";
    self.lName = "";
    self.pswd = "";
    self.isFocus = {};	
	self.confirm = {
		dialogMsg: "Sample dialog box",
		dialogShow: false,
	};
	self.localVars = {};
	self.isMobileDevice = (function (a) {
		if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) {
			return true;
		} else {
			return false;
		}
	})(navigator.userAgent || navigator.vendor || window.opera);
	
    // Reset password
    self.reset = GeneralService.getParam("reset");
    if (self.reset === 'true') {
        ngDialog.open({
            template: '/dialogs/reset-password.html',
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
	
	// self.getAllTournaments("Cricket");
	
	// List cities
    user.getCity().then(function (data) {
        GeneralService.userCity = data.data.extras.data;
        self.city = GeneralService.userCity;
		if(!angular.isUndefinedOrNull(self.city))
			self.userCities = self.city.split(",");
    });

    // Login
    function handleLogin(res) {
        var status = res.data ? res.data.success : null;
        if (status) {
            var currPage = window.location.href;
            if (currPage.includes("login.html")) {
                window.location = "/";
            } else {
                window.location.reload();
            }
        }
		self.isFocus.loginMsg = res.data.extras.msg.message;
        if (res.data.extras.msg.id == 0) {
            self.isFocus.emailErr = true;
            self.isFocus.passErr = false;
        } else if(res.data.extras.msg.id == 1) {
			self.isFocus.emailErr = false;
            self.isFocus.passErr = true;
		} else if (res.data.extras.err[0].param === 'userName') {
            self.isFocus.emailErr = true;
            self.isFocus.passErr = false;
			self.isFocus.loginMsg = res.data.extras.err[0].msg;
        } else {
            self.isFocus.emailErr = false;
            self.isFocus.passErr = true;
        }	        
    }
    self.login = function () {
        user.login(angular.lowercase(self.username), self.password)
                .then(handleLogin);
    };
    self.clearLogin = function () {
        self.username = "";
        self.password = "";
    };
	
    // Register
    function handleRegister(res) {
        var status = res.data ? res.data.success : null;
        if (status) {
            var currPage = window.location.href;
            if (currPage.includes("login.html")) {
                window.location = "/";
            } else {
                window.location.reload();
            }
        }			
		self.isFocus.register = true;;
    }
	self.openForgotPassword = function(){	
		ngDialog.close();
		self.forgotPassword();
		self.isFocus.register = false;
	}
	
	self.validateEmail = function(){
		if(isNaN(self.email)){
			var emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			if (emailRegExp.test(self.email)){
				self.isFocus.invEmail = false;
				return true;
			}
			self.isFocus.invEmail = true;
			return false;
		}else if(self.email.length == 10){
			self.mobile = self.email;
			self.email = null;
			self.isFocus.invEmail = false;
			return true;	
		}
		self.isFocus.invEmail = true;
		return false;
	}
    self.register = function(){
		var username;
		var type;
		if(self.email != null){
			type = "email",
			username = angular.lowercase(self.email);
		}else{
			type = "mobile";
			username = self.mobile;
		}
		var sports = self.sports.map(function(obj){
			return obj.name;
		});
        user.register(type, username, self.fName, self.lName, self.pswd, sports, GeneralService.lat, GeneralService.long, self.userCities)
                .then(handleRegister);
    };
    self.clearRegister = function () {
        self.email = "";
		self.mobile = "";
        self.fName = "";
        self.lName = "";
        self.pswd = "";
    };
    self.logout = function () {
        auth.logout && auth.logout();
    };
    self.isAuthed = function () {
        return auth.isAuthed ? auth.isAuthed() : false;
    };

    // Location change
    self.openDropdown = function (city) {
        self.open = !self.open;
        if (city !== undefined && city !== null && city !== "")
            self.open = true;
    };
    $http.get(API + '/listapi/listAllCities').then(function (res) {
        var status = res.data ? res.data.success : null;
        if (status) {
            self.allcities = res.data.extras.data.cities;
        } else {
            console.log("No data found");
        }
    });
    self.setCity = function (city) {
        GeneralService.userCity = city;
        self.city = GeneralService.userCity;
        self.open = false;
        self.changeLoc = false;
        self.query = "";
    };
	self.filterObjArray = function(items, filterBy) {
        var results = [];
        angular.forEach(items, function(value, key) {
			results.push(value[filterBy]);
		});
		return results;
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
	
    // Forgot Password
    self.forgotPassword = function () {
        ngDialog.open({
            template: '/dialogs/forgot-password.html',
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
    self.cancel = function () {
        ngDialog.close();
    };

    // Login boxes
    self.openFacilityPopup = function () {
        ngDialog.open({
            template: '/dialogs/facility-list.html',
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
    self.openEventPopup = function () {
        ngDialog.open({
            template: '/dialogs/event-list.html',
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
    self.openDiscussionPopup = function () {
        ngDialog.open({
            template: '/dialogs/discussion-list.html',
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
    self.openUserPopup = function () {
        ngDialog.open({
            template: '/dialogs/user-list.html',
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
	
	// dialog box close event handler
	self.dialogHandler = function () {
		self.confirm.dialogShow = false;
	};
}
;
function forgotPasswordCtrl(user, auth, GeneralService, ngDialog) {
    "ngInject";
    var self = this;
	
	self.validateEmail = function(){
		if(isNaN(self.username)){
			var emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			if (emailRegExp.test(self.username)){
				self.isFocus.invEmail = false;
				return true;
			}
			self.isFocus.invEmail = true;
			return false;
		}else if(self.username.length == 10){
			self.isFocus.invEmail = false;
			return true;	
		}
		self.isFocus.invEmail = true;
		return false;
	}
	
    self.sendResetLink = function () {
        user.sendReset(angular.lowercase(self.username), true).then(function (res) {
            var status = res.data ? res.data.success : null;
            if (status) {
                self.showMsg = true;
            } else {
                self.invEmail = true;
            }
        });
    };
    self.cancel = function () {
        ngDialog.close();
    };
}
;
function resetPasswordCtrl(user, auth, GeneralService, ngDialog) {
    "ngInject";
    var self = this;
    self.resetPassword = function () {
        self.rid = GeneralService.getParam("id");
        user.resetPassword(self.rid, self.newPassword, true).then(function (res) {
            var status = res.data ? res.data.success : null;
            if (status) {
                self.resetMsg = true;
            }
        });
    };
    self.cancel = function () {
        ngDialog.close();
    };
}
;
function facilityPopupCtrl(user, auth, $http, API, GeneralService, ngDialog) {
    "ngInject";
    var self = this;
    self.city = GeneralService.userCity;

    if (self.city != "") {
        $http.get(API + '/listapi/listfac?city=' + self.city).then(function (res) {
            var status = res.data ? res.data.success : null;
            if (status) {
                self.facilities = res.data.extras.data;
            } else {
                self.noData = "No Data found";
            }
        });
    } else if (GeneralService.lat && GeneralService.long) {
        $http.get(API + '/listapi/listfac?lat=' + GeneralService.lat + '&lng=' + GeneralService.long).then(function (res) {
            var status = res.data ? res.data.success : null;
            if (status) {
                self.facilities = res.data.extras.data;
            } else {
                self.noData = "No Data found";
            }
        });
    }
}
;
function eventPopupCtrl(user, auth, $http, API, GeneralService, ngDialog) {
    "ngInject";
    var self = this;
    self.city = GeneralService.userCity;

    if (self.city != "") {
        $http.get(API + '/listapi/listevt?city=' + self.city).then(function (res) {
            var status = res.data ? res.data.success : null;
            if (status) {
                self.events = res.data.extras.data;
            } else {
                self.noData = "No Data found";
            }
        });
    } else if (GeneralService.lat && GeneralService.long) {
        $http.get(API + '/listapi/listevt?lat=' + GeneralService.lat + '&lng=' + GeneralService.long).then(function (res) {
            var status = res.data ? res.data.success : null;
            if (status) {
                self.events = res.data.extras.data;
            } else {
                self.noData = "No Data found";
            }
        });
    }
}
;
function discussionPopupCtrl(user, auth, $http, API, GeneralService, ngDialog) {
    "ngInject";
    var self = this;
    self.city = GeneralService.userCity;

    if (self.city != "") {
        $http.get(API + '/listapi/listdisc?city=' + self.city).then(function (res) {
            var status = res.data ? res.data.success : null;
            if (status) {
                self.discussions = res.data.extras.data;
            } else {
                self.noData = "No Data found";
            }
        });
    }
}
;
function userPopupCtrl(user, auth, $http, API, GeneralService, ngDialog) {
    "ngInject";
    var self = this;
    self.city = GeneralService.userCity;

    if (self.city != "") {
        $http.get(API + '/listapi/listppl?city=' + self.city).then(function (res) {
            var status = res.data ? res.data.success : null;
            if (status) {
                self.users = res.data.extras.data;
            } else {
                self.noData = "No Data found";
            }
        });
    } else if (GeneralService.lat && GeneralService.long) {
        $http.get(API + '/listapi/listppl?lat=' + GeneralService.lat + '&lng=' + GeneralService.long).then(function (res) {
            var status = res.data ? res.data.success : null;
            if (status) {
                self.users = res.data.extras.data;
            } else {
                self.noData = "No Data found";
            }
        });
    }
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
angular.module('sem')
        .controller('Login', loginCtrl)
		.directive('googleAdsenseLogin', ['$window', '$compile', function($window, $compile) {
			var adSenseTpl = '<ins class="adsbygoogle" style="display:block;min-width:320px;max-width:1140px;width:100%;height:263px" data-ad-client="ca-pub-7999525691080451" data-ad-slot="4642686045" data-ad-layout-key="-8f+21-ea+dp+ih" data-ad-format="fluid"></ins></ins>';
			return {
				restrict: 'A',
				transclude: true,
				template: adSenseTpl,
				replace: false,
				link: function postLink(scope, element, iAttrs) {
						element.html("");
						element.append(angular.element($compile(adSenseTpl)(scope)));
						if (!$window.adsbygoogle) {
							$window.adsbygoogle = [];
						}
						$window.adsbygoogle.push({});
				}
			};
		}])
        .controller('ForgotPassword', forgotPasswordCtrl)
        .controller('ResetPassword', resetPasswordCtrl)
        .controller('FacilityPopupController', facilityPopupCtrl)
        .controller('EventPopupController', eventPopupCtrl)
        .controller('DiscussionPopupController', discussionPopupCtrl)
        .controller('UserPopupController', userPopupCtrl)
		.controller("contactUsCtrl", contactUsController)
        ;
