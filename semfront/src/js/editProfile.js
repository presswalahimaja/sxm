;
/*function GeneralService($http, API, auth, $window){
 var self = this;
 this.loadAllCities = function () {
 return $http.get(API + '/genapi/listallcities'); 
 };
 this.loadAllFacilities = function (city, sports) {
 return $http.post(API + '/facilityapi/list', {
 city: city,
 sports: sports
 });
 };
 this.loadStates = function () {
 return $http.get(API + '/genapi/liststates'); 
 };
 this.loadCities = function (state) {
 return $http.get(API + '/genapi/listCities?state=' + state);
 };
 this.loadSports = function () {
 return $http.get(API + '/genapi/listSports');
 };
 }*/
function profileEditService($http, API, auth, $filter) {
    "ngInject";

    var self = this;
    self.loadDetails = function () {
        var id = auth.getID();
        return $http.get(API + '/userapi/userprofile?uid=' + id);
    };
    self.subscribeFacility = function (uid, fid) {
        return $http.post(API + '/facilityapi/subscribe', {'uid': uid, 'facID': fid});
    };
    self.unsubscribeFacility = function (uid, fid) {
        return $http.post(API + '/facilityapi/unsubscribe', {'uid': uid, 'facID': fid});
    };
    self.saveProfile = function (userProfile, type) {
        var editProfileData = {uid: userProfile._id};
        if (type === 'about') {
            editProfileData.about = userProfile.about;
        }
        if (type === 'fName') {
            editProfileData.fName = userProfile.fName;
        }
        if (type === 'lName') {
            editProfileData.lName = userProfile.lName;
        }
        if (type === 'mobile') {
            editProfileData.mobile = userProfile.mobile;
        }
        if (type === 'work') {
            editProfileData.work = userProfile.work;
			editProfileData.isCoach = userProfile.isCoach;
        }
        if (type === 'dob') {
            editProfileData.dob = $filter('date')(new Date(userProfile.dob), "yyyy-MM-ddTHH:mm:ss") + '.330Z';
        }
        if (type === 'location') {
            editProfileData.location = userProfile.location;
        }
        if (type === 'sports') {
            editProfileData.sports = userProfile.sports;
        }
        if (type === 'sportLevel') {
            editProfileData.spolvl = userProfile.sportLevel;
        }
        if (type === 'pic') {
            editProfileData.uid = auth.getID(); // override id as it will not be avilable from userProfile
            editProfileData.pic = userProfile; // userProfile itself is pic id
        }
        if (type === 'cSports') {
            editProfileData.cSports = userProfile.cSports;
        }
        if (type === 'cFacilities') {
            editProfileData.cFacilities = userProfile.cFacilities;
        }
        if (type === 'cAwards') {
            editProfileData.cTitle = userProfile.cTitle;
			editProfileData.cText  = userProfile.cText;
			editProfileData.cYear  = userProfile.cYear;
			editProfileData.cMonth = userProfile.cMonth;
			editProfileData.cawards = 1;
        }

        return $http.post(API + '/userapi/setProfile', editProfileData)
                .then(function success(response) {
                    console.log(response);
                }, function error(response) {
                    console.log(response);
                });

    };
}
;
function profileEditCtrl(auth, GeneralService, profileEditService, ngDialog, $filter, $timeout) {
    "ngInject";

    var self = this;
    var userInfo = auth.getUserDetails();
    var id = userInfo.id;
	self.isFocus = {};
    self.userprofile = {};
	self.confirm = {
		dialogMsg: "Sample dialog box",
		dialogShow: false,
	};
	self.organizer = {
		uid: id
	};
	self.userTournamentStats = [];
    self.professions = [
        {'value': '1', 'text': 'Student'},
        {'value': '2', 'text': 'Working professional'},
        {'value': '3', 'text': 'Household activities'},
        {'value': '4', 'text': 'Sports professional'},
        {'value': '5', 'text': 'Retired'},
        {'value': '6', 'text': 'Sports coach'},
    ];
    self.expertiseList = [
        {'value': '1', 'text': 'Beginner'},
        {'value': '2', 'text': 'Intermediate'},
        {'value': '3', 'text': 'Expert'}
    ];
    self.frequencyList = [
        {'value': '1', 'text': 'Daily'},
        {'value': '2', 'text': 'Frequently'},
        {'value': '3', 'text': 'Weekend'},
        {'value': '4', 'text': 'Occasionally'}
    ];
	self.awardSelYear = new Date().getFullYear();
	var getYears = function(startYear, total, time){
		var years = [];
		if(time == 'past'){
			for(var i=0; i<total; i++){
				years.push(startYear - i);
			}
		}else if(time == 'future'){
			for(var i=0; i<total; i++){
				years.push(startYear + i);
			}
		}else{
			years = null;
		}		
		return years;
	};
	self.awardYears  = getYears(self.awardSelYear, 25, 'past');
	self.awardMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']; 
	
    self.openDropdown = function (city) {
        self.open = !self.open;
        if (city !== undefined && city !== null && city !== "")
            self.open = true;
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
    self.selectAll = function () {
        self.model = [];
        angular.forEach(self.options, function (item, index) {
            self.model.push(item);
        });
    };
    self.setProfile = function (field) {
        if (field === 'sportLevel') {
            self.userprofile.sportLevel = [];
            angular.forEach(self.userprofile.sports, function (s, index) {
                var ex = (self.userprofile.expertise[index] === undefined) ? '0' : self.userprofile.expertise[index];
                var fr = (self.userprofile.frequency[index] === undefined) ? '0' : self.userprofile.frequency[index];
                self.userprofile.sportLevel.push(s + ':' + fr + ':' + ex);
            });
        }
        profileEditService.saveProfile(self.userprofile, field);
    };
    self.deselectAll = function () {
        self.model = [];
    };
    /* self.toggleSelectItem = function (option, add) {
     self.open = false;
     self.query = "";
     if (add) {
     if (self.userprofile.location) {
     var toAdd = true;
     for (var i = 0; i < self.userprofile.location.length; i++) {
     if (self.userprofile.location[i] == option.City) {
     toAdd = false;
     }
     }
     if (toAdd) {
     self.userprofile.location.push(option.City);
     }
     } else {
     self.userprofile.location = [option.City];
     }
     } else {
     self.userprofile.location = self.userprofile.location.filter(function (val) {
     if (val === option) {
     return false;
     } else {
     return true;
     }
     });
     }
     profileEditService.saveProfile(self.userprofile, 'location');
     self.getAllFacilities();
     }; */
    self.getClassName = function (option) {
        var varClassName = 'glyphicon glyphicon-remove-circle';
        angular.forEach(self.SelectedCountries, function (item, index) {
            if (item.City === option.City) {
                varClassName = 'glyphicon glyphicon-ok-circle';
            }
        });
        return (varClassName);
    };
    self.moveGroupItem = function (item, from, to, type) {
        if (type === 'groups') {
            angular.forEach(item, function (s, index) {
                //console.log(index);
                var delIndex;
                var result = $.grep(from, function (e, tempIndex) {
                    if (e.gid === s.gid)
                        delIndex = tempIndex;
                    return e.gid === s.gid;
                });
                //console.log(delIndex);
                if (result.length > 0) {
                    from.splice(delIndex, 1);
                    to.push(s);
                }
            });
        } else if (type === 'friends') {
            angular.forEach(item, function (s, index) {
                //console.log(index);
                var delIndex;
                var result = $.grep(from, function (e, tempIndex) {
                    if (e.uid === s.uid)
                        delIndex = tempIndex;
                    return e.uid === s.uid;
                });
                //console.log(delIndex);
                if (result.length > 0) {
                    from.splice(delIndex, 1);
                    to.push(s);
                }
            });
        }
    };
    self.imageDiag = function () {
        if(angular.isUndefinedOrNull(window.JSInterface)){
            ngDialog.open({
                template: '/dialogs/fileUpload.html',
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
        }else {
            window.JSInterface.openGallery();
        }
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
    /* self.subsFacility = function (mode) {
     if (mode) {
     if (!self.userprofile.facility) {
     self.userprofile.facility = [];
     }
     self.available.forEach(function (s, index) {
     //not good need to revisit and fix
     self.facilities = self.facilities.filter(function (val) {
     if (val._id === s) {
     alert(val._id);
     alert(val.name);
     alert(self.userprofile._id);
     self.userprofile.facility.push({"facID": val._id, "facName": val.name});
     profileEditService.subscribeFacility(self.userprofile._id, val._id).then(function (data) {
     console.log("facility subscription status..... should be properly visible to user in case of error");
     console.log(data);
     });
     return false;
     } else {
     return true;
     }
     });
     });
     
     } else {
     self.selected.forEach(function (s, index) {
     self.userprofile.facility = self.userprofile.facility.filter(function (val) {
     if (val.facID === s) {
     self.facilities.push({"_id": val.facID, "name": val.name});
     profileEditService.unsubscribeFacility(self.userprofile._id, val.facID).then(function (data) {
     console.log("facility unsubscription status..... should be properly visible to user in case of error");
     console.log(data);
     });
     return false;
     } else {
     return true;
     }
     });
     });
     }
     }; */
    /* self.upSports = function (item, from, to, type) {
     angular.forEach(item, function (s, index) {
     var delIndex;
     var result = $.grep(from, function (e, tempIndex) {
     if (e === s)
     delIndex = tempIndex;
     return e === s;
     });
     if (result.length > 0) {
     from.splice(delIndex, 1);
     to.push(s);
     }
     
     //
     var delItem;
     var result1 = $.grep(self.userprofile.spolvl, function (obj, ind) {
     if (obj.sport === s)
     delItem = ind;
     return obj.sport === s;
     });
     if (result1.length > 0) {
     self.userprofile.expertise.splice(delItem, 1);
     self.userprofile.frequency.splice(delItem, 1);
     }
     console.log(self.userprofile.expertise);
     
     });
     profileEditService.saveProfile(self.userprofile, 'sports');
     self.sports = self.userprofile.sports;
     self.getAllFacilities();
     
     self.userprofile.sportLevel = [];
     self.userprofile.spolvl = [];
     angular.forEach(self.userprofile.sports, function (s, index) {
     var ex = (self.userprofile.expertise[index] === undefined) ? '0' : self.userprofile.expertise[index];
     var fr = (self.userprofile.frequency[index] === undefined) ? '0' : self.userprofile.frequency[index];
     self.userprofile.sportLevel.push(s + ':' + fr + ':' + ex);
     self.userprofile.spolvl.push({'sport': s, 'freq': fr, 'exp': ex});
     });
     profileEditService.saveProfile(self.userprofile, 'sportLevel');
     }; */

    self.opened = {};
    self.open = function ($event, elementOpened) {
        $event.preventDefault();
        $event.stopPropagation();
        self.opened[elementOpened] = !self.opened[elementOpened];
    };
    self.activetTab = function ($event) {
        if ($($event.target).hasClass('active')) {
            return false;
        }
        $($event.target).parents('div').find("#frdSection .tab-content").removeClass('active');
        $($event.target).parents('div').find("#frdSection .tab-item").removeClass("active");
        $($event.target).parents('div').addClass('active');
        var id = $($event.target).attr('data-href');
        $('#frdSection .tab-content[data-id="' + id + '"]').addClass('active');
        return false;
    };
    function handleUsersData(result) {
        self.userprofile = result.data.extras.data;
		if (!angular.isUndefinedOrNull(self.userprofile.facility)) {
			var tempFacilities = [];
			angular.forEach(self.userprofile.facility, function (value, key) {
                tempFacilities.push({facID:value.facID, facName: value.facName});
            });
			self.userprofile.facility = tempFacilities;	
		}
		if(angular.isUndefinedOrNull(self.userprofile.gallery) || self.userprofile.gallery.length == 0){
			self.userprofile.gallery = [];
		}
		if(!angular.isUndefinedOrNull(self.userprofile.sports)){
			self.organizer.sports = self.userprofile.sports;
		}
		if(angular.isUndefinedOrNull(self.userprofile.pages) || self.userprofile.pages.length == 0){
			self.userprofile.pages = [];
		}
        if (angular.isUndefinedOrNull(self.userprofile.dob)) {
            self.userprofile.dob = "01 Jan 1970";
        } else {
            self.userprofile.dob = $filter('date')(new Date(self.userprofile.dob), "dd MMM yyyy");
        }
        if (angular.isUndefinedOrNull(self.userprofile.work)) {
            self.userprofile.work = '1';
			self.userprofile.isCoach = false;
        }else{
			if(self.userprofile.work == '6')
				self.userprofile.isCoach = true;
			else
				self.userprofile.isCoach = false;
		}
		
		if (angular.isUndefinedOrNull(self.userprofile.cawards)) {
            self.userprofile.cawards = [];
        }
		self.userprofile.cYear  = '2017';
		self.userprofile.cMonth = 'Feb';
		
		self.sports = result.data.extras.data.sports;
        self.userprofile.expertise = [];
        self.userprofile.frequency = [];
        if (!angular.isUndefinedOrNull(self.userprofile.spolvl)) {
            angular.forEach(self.userprofile.spolvl, function (s, index) {
                self.userprofile.expertise[index] = s.exp;
                self.userprofile.frequency[index] = s.freq;
            });
        }

        self.getAllCities();
        self.getAllFacilities();
        self.getAllSports();
		self.getCoachFacilities();
    }
    function handleCityData(result) {
        self.SelectedCountries = [];
        self.allcities = [];
        self.allcities = result.data.extras.data.cities;
    }
    self.loadDetails = function () {
        profileEditService.loadDetails()
                .then(handleUsersData);
    };
    self.getAllCities = function () {
        GeneralService.listAllCities()
                .then(handleCityData);
    };
    self.getAllFacilities = function () {
        GeneralService.listFacilities(self.userprofile.location, self.userprofile.sports).then(function (result) {
            self.facilities =[];
            angular.forEach(result.data.extras.data, function (value, key) {
                self.facilities.push({facID:value._id, facName: value.name});
            });
        });
    };
    self.getAllSports = function () {
        GeneralService.listSports().then(function (result) {
            if (result.data.extras.data !== null && result.data.extras.data.length > 0) {
                self.availablesports = result.data.extras.data;
            }
        });
    };
	self.getCoachFacilities = function() {
		GeneralService.listFacilities(self.userprofile.location, self.userprofile.cSports).then(function (result) {
            self.coachFacilities = [];
            angular.forEach(result.data.extras.data, function (value, key) {
                self.coachFacilities.push({facID:value._id, facName: value.name});
            });
        });
	};
    self.loadDetails();
	self.loadUserTournamentStats = function () {
		GeneralService.getUserTournamentStats(id).then(function(response){
			var status = response.data ? response.data.success : null;
			if (status) {
				self.userTournaments = response.data.extras.data;
			}	
		});
	};
	self.loadUserTournamentStats();
	self.loadTournamentMatches = function (tid, team, index) {
		if(angular.isUndefinedOrNull(self.userTournamentStats[index])){
			GeneralService.getUserTournamentMatchStats(id, tid, team).then(function(response){
				var status = response.data ? response.data.success : null;
				if (status) {
					self.userTournamentStats[index] = {};
					self.userTournamentStats[index].matches = response.data.extras.data;
					self.userTournamentStats[index].loaded = true;
				}	
			});
		}		
	};
	
    self.setLocation = function () {
        self.setProfile('location');
        self.getAllFacilities();
		self.getCoachFacilities();
    };
    self.setSport = function (sport, type) {
		if(type === 'remove'){
			var delIndex;
			angular.forEach(self.userprofile.spolvl, function(s, index) {
				if(s.sport === sport)
					delIndex = index;
			});
			self.userprofile.expertise.splice(delIndex, 1);
			self.userprofile.frequency.splice(delIndex, 1);
		}		
		
        self.userprofile.sportLevel = [];
        self.userprofile.spolvl = [];
        angular.forEach(self.userprofile.sports, function (s, index) {
            var ex = (self.userprofile.expertise[index] === undefined) ? '0' : self.userprofile.expertise[index];
            var fr = (self.userprofile.frequency[index] === undefined) ? '0' : self.userprofile.frequency[index];
            self.userprofile.sportLevel.push(s + ':' + fr + ':' + ex);
            self.userprofile.spolvl.push({'sport': s, 'freq': fr, 'exp': ex});
        });
        self.getAllFacilities();
        profileEditService.saveProfile(self.userprofile, 'sports');
        profileEditService.saveProfile(self.userprofile, 'sportLevel');
	};
	self.setFacility = function (facility, type) {
		if(type === "subscribe"){
			profileEditService.subscribeFacility(self.userprofile._id, facility._id).then(function (data) {
				console.log("facility subscription status..... should be properly visible to user in case of error");
				console.log(data);
			});
		}else{
			profileEditService.unsubscribeFacility(self.userprofile._id, facility._id).then(function (data) {
				console.log("facility unsubscription status..... should be properly visible to user in case of error");
				console.log(data);
			});
		}
	};
    self.setCoachSport = function(){
		self.setProfile('cSports');	
		self.getCoachFacilities();
	};
	self.setCoachProfile = function(){
		if(self.userprofile.work === '6'){
			self.userprofile.isCoach = true;
		}else{
			self.userprofile.isCoach = false;
		}
		self.setProfile('work');
	};
	self.setCoachFacility = function (facility, type) {
        if (angular.isUndefinedOrNull(self.userprofile.cFacilities)) {
            self.userprofile.cFacilities = [];
        }
        if (type === "add") {
            self.userprofile.cFacilities.push(facility._id);
        } else {
            self.userprofile.cFacilities.pop();
        }
        self.setProfile('cFacilities');
    };
	self.filterObjArray = function(items, filterBy) {
        var results = [];
        angular.forEach(items, function(value, key) {
			results.push(value[filterBy]);
		});
		return results;
    };
	self.addMoment = function() {		
		self.userprofile.cawards.push({'cTitle':self.userprofile.cTitle, 'cText':self.userprofile.cText, 'cYear':self.userprofile.cYear, 'cMonth':self.userprofile.cMonth}) 
		self.setProfile('cAwards');
		self.userprofile.cTitle = "";
		self.userprofile.cText  = "";
		self.isFocus.submitted  = false;
	};	
	self.cancelMoment = function(){
		$timeout(function() {
			angular.element('#addPM').trigger('click');
		}, 100);
		self.userprofile.cTitle = "";
		self.userprofile.cText  = "";
		self.isFocus.submitted  = false;	
	}
	
    // Creat Article section
    self.openArticlePopup = function () {
        ngDialog.open({
            template: '/dialogs/create-article.html',
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
	
	// Create Organizer section
	self.uploadBanner = function (files, type) {
		var file = files[0];
		GeneralService.uploadFile(file, "organizer").then(function (response) {
			if (response.data) {
				if (response.data.success === true) {
					self.organizer[type] = response.data.extras.fileName;
				} else {
					alert('upload failed. Please try again' + response.data.extras.message);
				}
			} else {
				alert('upload failed. Please try again');
			}
		});
    };
	
	// Upload images to image gallery
	self.uploadImages = function (files) {
		if(self.userprofile.gallery.length < 50){	
			if(!angular.isUndefinedOrNull(files)){
				if(files.length > 5){
					self.confirm.dialogMsg = "You have selected "+ files.length +" images, from that only first 5 images will uploaded.";
					self.confirm.dialogShow = true;
					angular.element('body').trigger('click');
				}
				
				angular.forEach(files, function(file, index){
					if(index < 5 && (self.userprofile.gallery.length + index + 1) <= 50){
						GeneralService.uploadFile(file, "organizer").then(function(response) {
							self.uploadIMGtoGallery(response.data.extras.fileName);
							console.log("Image : " + (index+1) + " uploaded successfully");
						}, function(response) {
							console.log("Image : " + (index+1) + " upload failed");
						});
					}
				});
			}
		}else{
			self.confirm.dialogMsg = "Please contact contact@sportsextramile.com, if you wish to upload more images.";
			self.confirm.dialogShow = true;
			angular.element('body').trigger('click');
		}
    };
	
	// Add uploaded image to gallery array
	self.uploadIMGtoGallery = function(img){
		GeneralService.uploadIMGtoGallery({'iid':self.userprofile._id, 'type':'P', 'image':img}).then(function (response) {
			var status = response.data ? response.data.success : null;
            if (status) {
				self.userprofile.gallery.push({'id':img});
			}else{
				alert("Error in image upload.");
			}			
		});	
	}
	
	// remove image from gallery
	self.removeImage = function(event, img){
		event.stopPropagation();
		event.preventDefault();
		
		GeneralService.uploadIMGtoGallery({'iid':self.userprofile._id, 'type':'P', 'image':img, 'action':'remove'}).then(function (response) {
			var status = response.data ? response.data.success : null;
            if (status) {
				var delIndex = self.userprofile.gallery.map(function(obj){
					return obj.id;
				}).indexOf(img);
				self.userprofile.gallery.splice(delIndex, 1);
				self.confirm.removeImg = false;
			}else{
				alert("Error in image upload.");
			}			
		});
	}
	
	// dialog box close event handler
	self.dialogHandler = function () {
		self.confirm.dialogShow = false;
	};
	
    self.createOrganizer = function(){
		if(angular.isUndefinedOrNull(self.organizer.banner))
			self.organizer.banner = "90f792c28ed2ddc61bd537d3c08bfc17.png"; // default banner
		if(angular.isUndefinedOrNull(self.organizer.logo))
			self.organizer.logo = "0fe08e53a0058435014497fa573baf4c.png"; // default logo
        
        if(self.pageType == "organizer"){
            GeneralService.createOrganizer(self.organizer).then(function (resp){
                var status = resp.data ? resp.data.success : null;
                if (status) {
                    window.location = "/organization.html?orgId="+ resp.data.extras.data;
                }
            });
        }else{
            GeneralService.createAcademy({
                name: self.organizer.title,
                about: self.organizer.about,
				sports: self.organizer.sports
            }).then(function (resp){
                var status = resp.data ? resp.data.success : null;
                if (status) {
                   window.location = "/academy.html?aid="+ resp.data.extras.data;
                   //alert("Academy Created Successfully");
                }
            });
        }
    };

	self.cancelOrganizer = function () {
        $timeout(function() {
			angular.element('#addOrg').trigger('click');
		}, 100);
		self.organizer = {};
		self.isFocus.submitted  = false;
    };
	
	self.tournament = {};
	self.datetime = {};
    self.datetime.currDate = new Date();
    self.datetime.date = self.datetime.currDate.getFullYear() + "-" + (self.datetime.currDate.getMonth() + 1) + "-" + self.datetime.currDate.getDate();
    self.datetime.yesterday = new Date(new Date().setDate(self.datetime.currDate.getDate() - 1));

	self.createTournament = function(){
		self.tournament.uid = id;
		self.tournament.banner = '';
		console.log(self.tournament)
        /* GeneralService.createTournament(self.tournament).then(function (resp) {
            var status = resp.data ? resp.data.success : null;
            if (status) {
                window.location = "/tournament.html?orgId="+ orgId +"&tid=" + resp.data.extras.data;
            }
        }); */
	};
	self.cancelTournament = function(){
		$timeout(function () {
            angular.element('#addItemBtn').trigger('click');
        }, 100);
        self.tournament = {};
        self.isFocus.tSubmitted = false;
	};
}
;
function createArticleCtrl(auth, GeneralService, ngDialog) {
    "ngInject";

    var self = this;
    var userInfo = auth.getUserDetails();
    var id = userInfo.id;
    self.disabled = false;
    self.htmlcontent = "";

    GeneralService.getMiniProfile(id).then(function (data) {
        self.locations = data.data.extras.data.prof.location;
    });
    GeneralService.listSports().then(function (data) {
        self.sports = data.data.extras.data;
    });
    self.createArticle = function () {
        var article = {
            'uid': id,
            'title': self.title,
            'body': self.htmlcontent,
            // 'excerpt': 'This is test content',
            'private': false
        };

        if (self.selSports) {
            article.sports = self.selSports;//.split(',');
        }
        //article.sports = self.selSports;
        article.city = self.locations;

        /* if (self.tags) {
         article.tags = self.tags.split(',');
         } */
        GeneralService.createArticle(article).then(function (res) {
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
function imgUploadCtrl(GeneralService, profileEditService, ngDialog, $window) {
    "ngInject";
    
    self = this;
    self.save = function () {
		GeneralService.uploadFile(self.file, "user").then(function (resp) {
			if (resp.data) {
				if (resp.data.success === true) {
					profileEditService.saveProfile(resp.data.extras.fileName, 'pic');
					$window.location.reload();
				} else {
					alert('upload failed. Please try again' + resp.data.extras.message);
				}
			} else {
				alert('upload failed. Please try again');
			}
			ngDialog.close();
		});
    };

    self.cancel = function () {
        ngDialog.close();
        console.log("cancelled");
    };
    self.uploadFile = function (files) {
        self.fd = new FormData();
        //Take the first selected file
        self.file = files[0];
    };
}
;
angular.module('sem')
        .service('profileEditService', profileEditService)
        .controller('profileEdit', profileEditCtrl)
        .controller('createArticle', createArticleCtrl)
        .controller('imgUpload', imgUploadCtrl);
