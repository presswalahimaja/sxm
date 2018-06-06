/* ;
 function CreateOrganizerCtrl(auth, GeneralService, ngDialog){
 var self = this;
 var id = auth.getID();
 self.organizer = {};
 self.organizer.uid = id;
 
 self.uploadFile = function (files, type) {
 var file = files[0];
 if (file.size > 2097152) {
 alert("Please select file less than 2 MB!!")
 } else {
 GeneralService.uploadFile(file, "organizer").then(function (resp) {
 if (resp.data) {
 if (resp.data.success === true) {
 self.organizer[type] = resp.data.extras.fileName;
 } else {
 alert('upload failed. Please try again' + resp.data.extras.message);
 }
 } else {
 alert('upload failed. Please try again');
 }
 });
 }
 };
 
 self.createOrganizer = function(){
 GeneralService.createOrganizer(self.organizer).then(function (resp){
 var status = resp.data ? resp.data.success : null;
 if (status) {
 window.location = "/organization.html?orgId="+ resp.data.extras.data;
 }
 });
 };
 
 self.cancel = function () {
 ngDialog.close();
 };
 } */
;
function EditOrganizerCtrl($http, $timeout, API, auth, GeneralService, ngDialog, $filter) {
    "ngInject";
    var self = this;
    self.uid = auth.getID();
    var orgId = GeneralService.getParam("orgId");
    self.isDroid = GeneralService.getDevT();
    self.tournament = {};
    self.tournament.uid = self.uid;
    self.tournament.orgId = orgId;
	self.isFocus = {};    
	self.confirm = {
		dialogMsg: "Sample dialog box",
		dialogShow: false,
		imgRefreshTime: new Date().getTime()
	};
    self.datetime = {};
	self.datetime.currDate = new Date();
    self.datetime.startdate = $filter('date')(new Date(self.datetime.currDate), "dd MMM yyyy");
    self.datetime.enddate   = $filter('date')(new Date(self.datetime.currDate), "dd MMM yyyy");
	
	// Organizer API call
    GeneralService.getOrganizer(self.uid, orgId).then(function (results) {
        self.organizer = results.data.extras.data;
        self.isAdmin = self.organizer.isAdmin;
        if (angular.isUndefinedOrNull(self.organizer.tournaments)) {
            self.organizer.tournaments = [];
        }
		if(angular.isUndefinedOrNull(self.organizer.gallery) || self.organizer.gallery.length == 0){
			self.organizer.gallery = [];
		}
        GeneralService.loadGeneral(self.uid, function (resp) {
            if (resp === true) {
                self.allfriends = [];
                if (self.organizer.users.length > 0) {
                    angular.forEach(GeneralService.myFriends, function (item, index) {
                        var isFrd = false;
                        angular.forEach(self.organizer.users, function (i, ind) {
                            if (item.uid === i.uid)
                                isFrd = true;
                        });
                        if (!isFrd) {
                            self.allfriends.push(item);
                        }
                    });
                } else {
                    self.allfriends = GeneralService.myFriends;
                }
            } else {
                console.log("Error occured while loading mini profile");
            }
        });
    });
	
	// List all sports
    GeneralService.listSports().then(function (results) {
        self.allsports = results.data.extras.data;
    });

	// Add new admin on the organization
    self.addAdmin = function () {
		if(self.selAdmins.length > 0){
			self.confirm.btnDisable = true;
			var admins = self.selAdmins.map(function (user) {
				return user.uid;
			});
			GeneralService.addAdmin({'uid': self.uid, 'orgId': orgId, 'admins': admins}).then(function success(response) {
				var status = response.data ? response.data.success : null;
				if (status) {
					angular.forEach(self.selAdmins, function (value, key) {
						self.organizer.users.push(value);
						var delIndex;
						angular.forEach(self.allfriends, function (item, index) {
							if (value.uid == item.uid) {
								delIndex = index;
							}
						});
						self.allfriends.splice(delIndex, 1);
					});
					self.selAdmins = [];
					self.confirm.btnDisable = false;
				} else {
					self.confirm.btnDisable = false;
				}
			}, function error(response) {
				console.log(response);
				self.confirm.btnDisable = false;
			});
		}
    }
	
	// Remove admin from the organization
    self.removeAdmin = function (index) {
		self.confirm.btnDisable = true;
        GeneralService.removeAdmin(self.uid, orgId, self.organizer.users[index].uid).then(function success(response) {
            var status = response.data ? response.data.success : null;
            if (status) {
                self.allfriends.push(self.organizer.users[index]);
                self.organizer.users.splice(index, 1);
				self.confirm.btnDisable = false;
            } else {
				self.confirm.btnDisable = false;
			}
        }, function error(response) {
			console.log(response);
			self.confirm.btnDisable = false;
		});
    }
	
	// check For mobile number in user profile
	self.checkMobileNo = function(){		
		$http.get(API + '/userapi/userprofile?uid=' + self.uid)
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
		$http.post(API + '/userapi/setProfile', {'uid':self.uid, 'mobile':self.confirm.mobileno})
			.then(function success(response) {
				self.confirm.userMobile = true;
			}, function error(response) {
				console.log(response);
			});
	}
	
	// Create new tournament
    self.createTournament = function () {
		self.confirm.btnDisable = true;
        self.tournament.banner = self.organizer.banner;
		self.tournament.startdate = $filter('date')(new Date(self.datetime.startdate), "yyyy-MM-ddTHH:mm:ss") + '.330Z';
		var newEndDate = new Date(self.datetime.enddate);
		newEndDate.setHours(newEndDate.getHours() + 18);
		self.tournament.enddate   = $filter('date')(newEndDate, "yyyy-MM-ddTHH:mm:ss") + '.330Z';
        GeneralService.createTournament(self.tournament).then(function success(response) {
            var status = response.data ? response.data.success : null;
            if (status) {
                window.location = "/tournament.html?orgId="+ orgId +"&tid=" + response.data.extras.data;
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
        $timeout(function () {
            angular.element('#addItemBtn').trigger('click');
        }, 100);
        self.tournament = {};
        self.isFocus.submitted = false;
    }
    
    self.imageDiag = function (type) {
        if(angular.isUndefinedOrNull(window.JSInterface)){
            console.log("false");
        }else {
            window.JSInterface.openGallery(orgId, type);
        }
    };
	
	// Change Logo or Banner image
	self.changeImages = function (files, type) {
        self.uploadLogoOrBanner(files, type, function () {
            self.confirm.imgRefreshTime = new Date().getTime();
        });
    };
	
	// Upload Logo or Banner image
	self.uploadLogoOrBanner = function (files, type, callback) {
        var file = files[0];
		GeneralService.uploadImage(file, self.organizer._id, type).then(function (response) {
			if (response.data) {
				if (response.data.success === true) {
                    alert("Image uploaded successfully.!");
					callback();
				} else {
					alert('Image upload failed. Please try again' + response.data.extras.message);
				}
			} else {
				alert('Image upload failed. Please try again');
			}
		});
    };
	
	// Upload images to image gallery
	self.uploadImages = function (files) {
		if(self.organizer.gallery.length < 50){	
			if(!angular.isUndefinedOrNull(files)){
				if(files.length > 5){
					self.confirm.dialogMsg = "You have selected "+ files.length +" images, from that only first 5 images will uploaded.";
					self.confirm.dialogShow = true;
					angular.element('body').trigger('click');
				}
				
				angular.forEach(files, function(file, index){
					if(index < 5 && (self.organizer.gallery.length + index + 1) <= 50){
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
		GeneralService.uploadIMGtoGallery({'iid':orgId, 'type':'O', 'image':img}).then(function (response) {
			var status = response.data ? response.data.success : null;
            if (status) {
				self.organizer.gallery.push({'id':img});
			}else{
				alert("Error in image upload.");
			}			
		});	
	}	
	
	// remove image from gallery
	self.removeImage = function(event, img){
		event.stopPropagation();
		event.preventDefault();
		
		GeneralService.uploadIMGtoGallery({'iid':orgId, 'type':'O', 'image':img, 'action':'remove'}).then(function (response) {
			var status = response.data ? response.data.success : null;
            if (status) {
				var delIndex = self.organizer.gallery.map(function(obj){
					return obj.id;
				}).indexOf(img);
				self.organizer.gallery.splice(delIndex, 1);
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
	
	// Update organizer details
    self.setOrganizerProfile = function (type) {
        var editOrganizerData = {'uid': self.uid, 'orgId': orgId};
        editOrganizerData[type] = self.organizer[type];
        GeneralService.editOrganizer(editOrganizerData).then(function success(resp) {
            console.log(resp);
			self.confirm.isEditable = false;
        }, function error(resp) {
            console.log(resp);
        });
    };
	
	self.editRichText = function(){
		if(self.isAdmin)
			self.confirm.isEditable = true;
	}

}
;
angular.module('sem')
        /* .controller('CreateOrganizer', CreateOrganizerCtrl) */
        .controller('EditOrganizer', EditOrganizerCtrl)
        ;