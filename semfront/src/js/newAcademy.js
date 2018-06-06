function academyController($http, API, auth, GeneralService, ngDialog, $filter, $timeout, $q) {
	"ngInject";

	var aid = GeneralService.getParam("aid");
	var self = this;
	self.tabScroller = {};
	self.uid = auth.getID(); 
	self.tournament = {};
	self.tournament.uid = self.uid;
	self.tournament.aid = aid;
	self.confirm = {
		dialogMsg: "Sample dialog box",
		dialogShow: false,
		imgRefreshTime: new Date().getTime()
	};
	self.datetime = {};
	self.batch = {};
	self.datetime.currDate = new Date();
	self.datetime.startdate = $filter('date')(new Date(self.datetime.currDate), "dd MMM yyyy");
	self.datetime.enddate   = $filter('date')(new Date(self.datetime.currDate), "dd MMM yyyy");
	self.datetime.fromHH  = '07';
	self.datetime.fromMM  = '00';
	self.datetime.fromMer = 'AM';
	self.datetime.toHH  = '09';
	self.datetime.toMM  = '00';
	self.datetime.toMer = 'AM';
	self.tabs = [
		{
			id: "details",
			title: "Details",
			isLoaded: false,
			tabSections: [{ id: "about", title: "About" }, { id: "contact", title: "Contact" }]
		},
		{
			id: "activities",
			title: "Activities",
			isLoaded: false,
			tabSections: [{ id: "facilities", title: "Facilities" }, { id: "timings", title: "Timings" }, { id: "tournaments", title: "Tournaments" }]
		},
		{
			id: "players",
			title: "Players",
			isLoaded: false,
			tabSections: [{ id: "players", title: "Registered Players" }, { id: "archive", title: "Archive Players" }]
		},
		{
			id: "coaches",
			title: "Coaches",
			isLoaded: false,
			tabSections: [{ id: "registered", title: "Registered Coaches" }, { id: "archive", title: "Archive Coaches" }]
		},
		{
			id: "pics",
			title: "Pics",
			isLoaded: false,
			tabSections: [{ id: "pics", title: "Pics" }]
		}
	];
	self.isMobileDevice = (function(userAgent) {
		if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(userAgent.substr(0, 4))) {
			return true;
		} else {
			return false;
		}
	})(navigator.userAgent || navigator.vendor || window.opera);
	
	// List all sports
	GeneralService.listSports().then(function (results) {
		self.allsports = results.data.extras.data;
	});
	
	self.setCurrentTab = setCurrentTab;
	function setCurrentTab(newTab) {
		self.updateTime();
		self.newMember  = null;
		self.currentTab = newTab;
		self.currentTab.activeSection = self.currentTab.tabSections[0];

		if (self.tabScroller.api && self.tabScroller.api.doRecalculate) {
			self.tabScroller.api.doRecalculate();
		}

		// partially load and cache current tab's data
		if (!self.currentTab.isLoaded) {
			GeneralService.getAcademy(aid, self.currentTab.id).then(function(results) {
				var status = results.data ? results.data.success : null;
                if (status) {
					self.currentTab.isLoaded = true;
					self.academy = Object.assign({}, self.academy, results.data.extras.data);
					if(angular.isUndefinedOrNull(self.academy.banners))
						self.academy.banners = [];
					if(angular.isUndefinedOrNull(self.academy.batchTimings))
						self.academy.batchTimings = [];
					if(angular.isUndefinedOrNull(self.academy.gallery))
						self.academy.gallery = [];
					if(angular.isUndefinedOrNull(self.academy.players))
						self.academy.players = [];
					if(angular.isUndefinedOrNull(self.academy.coaches))
						self.academy.coaches = [];
					
					// getting admins - friends
					GeneralService.loadGeneral(self.uid, function (resp) {
						if (resp === true) {
							self.admins = [];
							if (!angular.isUndefinedOrNull(self.academy.admins) && self.academy.admins.length > 0) {
								angular.forEach(GeneralService.myFriends, function (item, index) {
									var isFrd = false;
									angular.forEach(self.academy.admins, function (i, ind) {
										if (item.uid === i.id)
											isFrd = true;
									});
									if (!isFrd) {
										self.admins.push(item);
									}
								});
							} else {
								self.academy.admins = [];	
								self.admins = GeneralService.myFriends;
							}
						} else {
							console.log("Error occured while loading mini profile");
						}
					});
				}	
			});
		}
	}
	
	// Change Logo or Banner image
	self.changeImages = function (files, type) {
        self.uploadLogoOrBanner(files, type, function () {
            self.updateTime();
        });
    };
	
	// Upload Logo or Banner image
	self.uploadLogoOrBanner = function (files, type, callback) {
		var file = files[0];
		GeneralService.uploadImage(file, self.academy._id, type).then(function (resp) {
			if (resp.data) {
				if (resp.data.success === true) {
					alert("Image uploaded sucessfully..!! Kindly refresh.");
					callback();
				} else {
					alert('upload failed. Please try again' + resp.data.extras.message);
				}
			} else {
				alert('upload failed. Please try again');
			}
		});
	};
	
	// Upload images to image gallery
	self.uploadImages = function (files) {
		if(self.academy.gallery.length < 50){	
			if(!angular.isUndefinedOrNull(files)){
				if(files.length > 5){
					self.confirm.dialogMsg = "You have selected "+ files.length +" images, from that only first 5 images will uploaded.";
					self.confirm.dialogShow = true;
					angular.element('body').trigger('click');
				}
				
				angular.forEach(files, function(file, index){
					if(index < 5 && (self.academy.gallery.length + index + 1) <= 50){
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
		GeneralService.uploadIMGtoGallery({'iid':aid, 'type':'A', 'image':img}).then(function (response) {
			var status = response.data ? response.data.success : null;
            if (status) {
				self.academy.gallery.push({'id':img});
			}else{
				alert("Error in image upload.");
			}			
		});	
	}
	
	// Upload images in Banner
	self.uploadBanners = function (files) {
		if(self.academy.banners.length < 5){	
			if(!angular.isUndefinedOrNull(files)){
				if(files.length > 5){
					self.confirm.dialogMsg = "You have selected "+ files.length +" images, from that only first 5 images will uploaded.";
					self.confirm.dialogShow = true;
					angular.element('body').trigger('click');
				}
				
				angular.forEach(files, function(file, index){
					if(index < 5 && (self.academy.banners.length + index + 1) <= 5){
						GeneralService.uploadFile(file, "organizer").then(function(response) {
							self.addBanner(response.data.extras.fileName);
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
	
	// Add new banner in Academy
	self.addBanner = function (img) {
		GeneralService.addBanner({'iid':aid, 'collection':'A', 'image':img}).then(function (response) {
			var status = response.data ? response.data.success : null;
            if (status) {
				self.academy.banners.push({'id':img});
			}else{
				alert("Error in image upload.");
			}			
		});
	}
	
	// remove image from gallery
	self.removeImage = function(event, img){
		event.stopPropagation();
		event.preventDefault();
		
		GeneralService.uploadIMGtoGallery({'iid':aid, 'type':'A', 'image':img, 'action':'remove'}).then(function (response) {
			var status = response.data ? response.data.success : null;
            if (status) {
				var delIndex = self.academy.gallery.map(function(obj){
					return obj.id;
				}).indexOf(img);
				self.academy.gallery.splice(delIndex, 1);
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
	
	// Update time to refresh image when changed
	self.updateTime = function () {
		self.confirm.imgRefreshTime = new Date().getTime();
	}
	
	// Update academy fields
	function updateAcademy(category) {
		var payload = { aid: aid };

		switch (category) {
			case 'name':
			{
				Object.assign(payload, {
					name: self.academy.name
				});
				break;
			}
			case 'about':
			{
				Object.assign(payload, {
					about: self.academy.about
				});
				break;
			}
			case 'contact':
			{
				Object.assign(payload, {
					address: self.academy.address,
					city   : self.academy.city,
					state  : self.academy.state,
					country: self.academy.country,
					phone  : self.academy.phone
				});
				break;
			}                
		}

		//Update academy details logic goes here
		GeneralService.updateAcademy(payload).then(function success(response) {
			var status = response.data ? response.data.success : null;
			if (status) {
				console.log("success");
				self.confirm.isEditable = false;
				self.cancelForm('contactFormBtn');
			}	
		}, function error(response) {
			console.log(response);
		});

	}
	self.updateAcademy = updateAcademy;
	
	// Upload Academy User Profile pic
	self.updateProfPic = function (files, uid) {
		var file = files[0];
		GeneralService.uploadProfilePic(file, 'academy_user', uid, aid).then(function success(response){
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
	
	// set initial tab
	setCurrentTab(self.tabs[0]);

	// Create new tournament
	self.createTournament = function () {
		self.confirm.btnDisable = true;
		//self.tournament.banner = self.organizer.banner;
		self.tournament.startdate = $filter('date')(new Date(self.datetime.startdate), "yyyy-MM-ddTHH:mm:ss") + '.330Z';
		var newEndDate = new Date(self.datetime.enddate);
		newEndDate.setHours(newEndDate.getHours() + 18);
		self.tournament.enddate   = $filter('date')(newEndDate, "yyyy-MM-ddTHH:mm:ss") + '.330Z';
		GeneralService.createTournament(self.tournament).then(function success(response) {
			var status = response.data ? response.data.success : null;
			if (status) {
				window.location = "/tournament.html?aid="+ aid +"&tid=" + response.data.extras.data;
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
		self.confirm.submitted = false;
	}
	
	// Validate email
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

	// Add member in Academy
	self.addAcademyMember = function (form) {
		if(self.newMember.hasValidContact !== false){
			self.confirm.btnDisable = true;
			if(angular.isUndefinedOrNull(self.newMember.lName) || self.newMember.lName == '')
				self.newMember.lName = '.';
			
			var params = angular.extend({}, self.newMember, {'aid': aid});
			GeneralService.addAcademyMember(params).then(function success(response) {
				var status = response.data ? response.data.success : null;
				if (status) {
					var _pid = response.data.extras.id;
					var _pname = response.data.extras.fName +" "+ response.data.extras.lName;
					var _idInd = self.academy.players.map(function(obj){
						return obj.id;
					}).indexOf(_pid);
					if(_idInd == -1){
						self.academy.players.push({'id':_pid, 'name':_pname});
						
						// Check if user Birthdate exists in his profile
						$http.get(API + '/userapi/userprofile?uid=' + _pid)
							.then(function success(results){
								if(angular.isUndefinedOrNull(results.data.extras.data.dob)){
									// Update user Birthdate in User profile
									$http.post(API + '/userapi/setProfile', {'uid':_pid, 'dob':$filter('date')(new Date(self.datetime.dob), "yyyy-MM-ddTHH:mm:ss") + '.330Z'})
										.then(function success(results1) {
											console.log("User Birthdate updated successfully.");
										}, function error(results1) {
											console.log(results1);
										});
								}
							}, function error(results){
								console.log(results);
							});						
						
						self.newMember.success = true;
						$timeout(function () {
							self.newMember.success = false;
							self.newMember = null;
							self.newMember = {hasValidContact: false};
							form.$setPristine();
							form.$setUntouched();
							self.confirm.btnDisable = false;
						}, 2000);
					}					
				} else {
					self.newMember.failed = true;
					$timeout(function () {
						self.newMember.failed = false;
						self.confirm.btnDisable = false;
					}, 2000);
				}
			}, function error(response) {
				console.log(response);
				self.confirm.btnDisable = false;
			});
		}
	};
	
	// Archive member in Academy
	self.archiveAcademyMember = function(playerId){
		GeneralService.archiveAcademyMember({'aid':aid, 'playerId':playerId}).then(function success(response) {
			var status = response.data ? response.data.success : null;
			if (status) {
				var arcIndex = self.academy.players.map(function(obj){
					return obj.id;
				}).indexOf(playerId);
				self.academy.players[arcIndex].isArchived = true;		
			}	
		}, function error(response) {
			console.log(response);
		});
	}
	
	// Remove member from Academy
	self.removeAcademyMember = function(playerId){
		GeneralService.removeAcademyMember({'aid':aid, 'playerId':playerId}).then(function success(response) {
			var status = response.data ? response.data.success : null;
			if (status) {
				var delIndex = self.academy.players.map(function(obj){
					return obj.id;
				}).indexOf(playerId);
				self.academy.players.splice(delIndex, 1);				
			}	
		}, function error(response) {
			console.log(response);
		});
	}
	
	// Add coach in Academy 
	self.addAcademyCoach = function (form) {
		if(self.newMember.hasValidContact !== false){
			self.confirm.btnDisable = true;
			if(angular.isUndefinedOrNull(self.newMember.lName) || self.newMember.lName == '')
				self.newMember.lName = '.';
			
			var params = angular.extend({}, self.newMember, {'aid': aid});
			GeneralService.addAcademyCoach(params).then(function success(response) {
				var status = response.data ? response.data.success : null;
				if (status) {
					var _cid = response.data.extras.id;
					var _cname = response.data.extras.fName +" "+ response.data.extras.lName;
					var _idInd = self.academy.coaches.map(function(obj){
						return obj.id;
					}).indexOf(_cid);
					if(_idInd == -1){
						self.academy.coaches.push({'id':_cid, 'name':_cname});
					}
				}	
			});
		}	
	}
	
	// Archive coach in Academy
	self.archiveAcademyCoach = function(coachId){
		GeneralService.archiveAcademyCoach({'aid':aid, 'coachId':coachId}).then(function success(response) {
			var status = response.data ? response.data.success : null;
			if (status) {
				var arcIndex = self.academy.coaches.map(function(obj){
					return obj.id;
				}).indexOf(coachId);
				self.academy.coaches[arcIndex].isArchived = true;		
			}	
		}, function error(response) {
			console.log(response);
		});
	}
	
	// Archive coach in Academy
	self.unarchiveAcademyCoach = function(coachId){
		GeneralService.unarchiveAcademyCoach({'aid':aid, 'coachId':coachId}).then(function success(response) {
			var status = response.data ? response.data.success : null;
			if (status) {
				var arcIndex = self.academy.coaches.map(function(obj){
					return obj.id;
				}).indexOf(coachId);
				self.academy.coaches[arcIndex].isArchived = false;		
			}	
		}, function error(response) {
			console.log(response);
		});
	}
	
	// Reset member form
	self.resetNewMemberForm = function (form) {
		self.newMember = null;
		self.newMember = {hasValidContact: false};
		form.$setPristine();
		form.$setUntouched();
	}
	
	// Add new admin on the organization
    self.addAdmin = function () {
		if(self.selAdmins.length > 0){
			self.confirm.btnDisable = true;
			angular.forEach(self.selAdmins, function(item, index){
				self.academy.admins.push({'id':item.uid, 'name':item.name});
			});
			var admins = self.academy.admins.map(function (user) {
				return user.id;
			});
			GeneralService.updateAcademy({'aid': aid, 'admins': admins}).then(function success(response) {
				var status = response.data ? response.data.success : null;
				if (status) {
					angular.forEach(self.selAdmins, function (value, key) {
						var delIndex;
						angular.forEach(self.admins, function (item, index) {
							if (value.uid == item.uid) {
								delIndex = index;
							}
						});
						self.admins.splice(delIndex, 1);
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
	
	// Remove admin from the academy
    self.removeAdmin = function (index) {
		self.confirm.btnDisable = true;
        GeneralService.removeAcademyAdmin(aid, self.academy.admins[index].id).then(function success(response) {
            var status = response.data ? response.data.success : null;
            if (status) {
                self.admins.push(self.academy.admins[index]);
                self.academy.admins.splice(index, 1);
				self.confirm.btnDisable = false;
            } else {
				self.confirm.btnDisable = false;
			}
        }, function error(response) {
			console.log(response);
			self.confirm.btnDisable = false;
		});
    }
	
	// Clear selected days in batch creation
	self.clearDays = function(){
		angular.forEach(self.datetime.days, function(item, index){
			item.isSelected = false;
		});
	}
	
	// Check for the days selection while creating new batch
	self.isDaysSelected = function(){
		var isChanged = false;
		if(!angular.isUndefinedOrNull(self.datetime.days)){
			angular.forEach(self.datetime.days, function(item, index){
				if(item.isSelected == true){
					isChanged = true;
				}	
			});
		}
		return isChanged;
	}
	
	// Create new Batch in Academy
	self.createAcademyBatch = function(){		
		self.confirm.btnDisable = true;
		var days = [];
		angular.forEach(self.datetime.days, function(item, index){
			if(item.isSelected)
				days.push(item.name);
		});
		Object.assign(self.batch, {
			sport: 'cricket', 
			days : days,
			timings: self.datetime.fromHH +':'+ self.datetime.fromMM +' '+ self.datetime.fromMer +' to '+ self.datetime.toHH +':'+ self.datetime.toMM +' '+  self.datetime.toMer
		});
		self.academy.batchTimings.push(self.batch);
		GeneralService.updateAcademy({'aid':aid, 'batchTimings':self.academy.batchTimings}).then(function success(response) {
			var status = response.data ? response.data.success : null;
            if (status) {				
				self.batch = {};
				self.clearDays();
				self.confirm.batchSubmit = false;
				self.confirm.btnDisable = false;
			}else{
				self.confirm.btnDisable = false;
			}
		}, function error(response){
			self.confirm.btnDisable = false;
		});
	}

	// Cancel event on the form
	self.cancelForm = function(ele){
		$timeout(function () {
            angular.element('#' + ele).trigger('click');
        }, 100);
	}

	self.editRichText = function(){
		if(self.academy.isAdmin)
			self.confirm.isEditable = true;
	}	
}
;
angular.module('sem')
	.controller('editAcademy', academyController)
	.directive("ngWeekdaySelector", function() {
		var const_days = [{
		  id: 0,
		  name: "SUN",
		  isSelected: false
		}, {
		  id: 1,
		  name: "MON",
		  isSelected: false
		}, {
		  id: 2,
		  name: "TUE",
		  isSelected: false
		}, {
		  id: 3,
		  name: "WED",
		  isSelected: false
		}, {
		  id: 4,
		  name: "THU",
		  isSelected: false
		}, {
		  id: 5,
		  name: "FRI",
		  isSelected: false
		}, {
		  id: 6,
		  name: "SAT",
		  isSelected: false
		}];

		var template = "<div class='days-container'>" +
		  "<div class='day-circle' ng-class='{\"selected\": ngModel[0].isSelected}' ng-click='onDayClicked(0)'>{{ngModel[0].name}}</div>" +
		  "<div class='day-circle' ng-class='{\"selected\": ngModel[1].isSelected}' ng-click='onDayClicked(1)'>{{ngModel[1].name}}</div>" +
		  "<div class='day-circle' ng-class='{\"selected\": ngModel[2].isSelected}' ng-click='onDayClicked(2)'>{{ngModel[2].name}}</div>" +
		  "<div class='day-circle' ng-class='{\"selected\": ngModel[3].isSelected}' ng-click='onDayClicked(3)'>{{ngModel[3].name}}</div>" +
		  "<div class='day-circle' ng-class='{\"selected\": ngModel[4].isSelected}' ng-click='onDayClicked(4)'>{{ngModel[4].name}}</div>" +
		  "<div class='day-circle' ng-class='{\"selected\": ngModel[5].isSelected}' ng-click='onDayClicked(5)'>{{ngModel[5].name}}</div>" +
		  "<div class='day-circle' ng-class='{\"selected\": ngModel[6].isSelected}' ng-click='onDayClicked(6)'>{{ngModel[6].name}}</div>" +
		  "</div>";

		var link = function(scope) {
			var initDaysSelected = function(){
				if (!scope.ngModel){
					scope.ngModel = [];
					angular.extend(scope.ngModel, const_days);
				}
			};

			scope.onDayClicked = function(dayIndex){
				scope.ngModel[dayIndex].isSelected = !scope.ngModel[dayIndex].isSelected;
				var isChanged = false;
				angular.forEach(scope.ngModel, function(item, index){
					if(item.isSelected == true)
						isChanged = true;
				});
				scope.ngChange({'isChanged':isChanged});
			};
			
			initDaysSelected();
		};

		return {
			restrict: 'AE',
			scope: {
				ngModel: '=?',
				ngChange: '&'
			},
			link: link,
			template: template
		};
	})
	.filter("range", function(){
		return function(input, min, max){
			var hours = [];
			for (var i = min; i <= max; i++) {
				var val = (i < 10) ? '0' + i : i;
				input.push({'value': val});
			}
			return input;
		}
	})
	;