/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function TournamentCtrl($http, API, auth, GeneralService, ngDialog, $filter, $timeout, $window) {
    var self = this;
    self.uid = auth.getID();
    self.isDroid = GeneralService.getDevT();
    var tid = GeneralService.getParam("tid");
    var orgId;
    if (angular.isUndefinedOrNull(tid)) {
        tid = GeneralService.getTypeParam("t");
        orgId = GeneralService.getTypeParam("o");
    } else {
        orgId = GeneralService.getParam("orgId");
    }
	self.AOid = {};
    self.isSchedule = {};
    self.confirm = {
		dialogMsg: "Sample dialog box",
		dialogShow: false,
		imgRefreshTime: new Date().getTime(),
		dateFormat: "dd-MMM-y"
	};
    self.isPublished = false;
    self.invalidPlayerDetails = true;
    self.markers = [];
    self.topBatsmen = [];
    self.topBowlers = [];
    self.topFielders = []
    self.fieldingTypes = [{'type':'Wickets','value':'maxWickets'},{'type':'Catch','value':'maxCO'}, {'type':'Runout','value':'maxRO'}, {'type':'Stumped','value':'maxST'}];
	self.todaysSchedule = [];
    self.newteam = {players: []};
    self.isFocus = {
        official: {}
    }
	
	// DatePicker - date format fix for IE-11 and above
	if($window.navigator.userAgent.indexOf("MSIE") == -1 && $window.navigator.userAgent.indexOf("Trident") != -1){
		self.confirm.dateFormat = "dd MMM y";
	}
	
    self.isMobileDevice = (function (a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) {
            return true;
        } else {
            return false;
        }
    })(navigator.userAgent || navigator.vendor || window.opera);

    self.now = new Date();
    $timeout(function () {
        self.now = new Date();
    }, 5000);
    self.datetime = {};
    self.datetime.currDate = new Date();
    //self.datetime.olddate = self.datetime.currDate.getFullYear() + "-" + (self.datetime.currDate.getMonth() + 1) + "-" + self.datetime.currDate.getDate();
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
        /* var dt1 = dt + " " + hr + ":" + self.datetime.selMinute + ":00";
         if (new Date(dt1) < new Date(today)) {
         self.datetime.invalidDate = true;
         return false;
         } */
        self.datetime.evtDate = dt + "-" + hr + "-" + self.datetime.selMinute;
        //var dt11 = new Date(dt + hr + self.datetime.selMinute);
        self.datetime.invalidDate = false;
        return true;
    };

    self.convertDateToUTC = function (dt) {
        var tmp = dt.split("-");
        var date = new Date(tmp[0], parseInt(tmp[1]) - 1, tmp[2], tmp[3], tmp[4], "00");
        var utc_date = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
        return $filter('date')(utc_date, "yyyy-MM-ddTHH:mm:ss") + '.330Z';
    };

    self.imageDiag = function () {
        if (angular.isUndefinedOrNull(window.JSInterface)) {
            console.log("false");
        } else {
            window.JSInterface.openGallery(tid, "TB");
        }
    };
    // get tournament details
    GeneralService.getTournament(self.uid, tid, orgId).then(function (results) {
        var status = results.data ? results.data.success : null;
        if (status) {
            self.tournament = results.data.extras.data;
            document.title = "Tournament - " + self.tournament.title;
            self.isAdmin = self.tournament.isAdmin;
			
			if(!angular.isUndefinedOrNull(self.tournament.organizer)){
				self.AOid = {
					type: 'orgId',
					id  : self.tournament.organizer.id
				}	
			}else if(!angular.isUndefinedOrNull(self.tournament.academy)){
				self.AOid = {
					type: 'aid',
					id  : self.tournament.academy.id
				}
			}
			
            self.tournament.startdate = $filter('date')(self.tournament.startdate, "dd MMM yyyy");
            self.tournament.enddate = $filter('date')(self.tournament.enddate, "dd MMM yyyy");
            self.tournament.newschedule = [];
            if (angular.isUndefinedOrNull(self.tournament.participants) || self.tournament.participants.length == 0) {
                self.tournament.participants = [];
            } else {
				self.allTeams = angular.copy(self.tournament.participants);
				self.allTeams.splice(0, 0, {'pid':null, 'name':'All teams'});
				self.confirm.selTeam = {'pid':null, 'name':'All teams'};
                self.tournament.participants = self.tournament.participants.map(function (obj) {
                    if (obj.type === "I")
                        return {'pid': obj.pid, 'name': obj.name, 'fName': obj.name.split(" ")[0], 'lName': obj.name.split(" ")[1], 'type': obj.type};
                    else
                        return obj;
                });

                // Calculate Point table
                self.tournament.teamPoints = [];
                if (!angular.isUndefinedOrNull(self.tournament.groups) && self.tournament.groups.length > 0) {
                    angular.forEach(self.tournament.groups, function (grp, grpInd) {
                        var group = {'name': grp.name, 'teams': []};

                        angular.forEach(self.tournament.participants, function (pt, ptInd) {
                            if (grp.participants.indexOf(pt.pid) > -1) {
                                var team = {'name': pt.name, 'played': 0, 'won': 0, 'lost': 0, 'draw': 0, 'pts': 0, 'nrr': 0};
                                var t_runs = 0, t_overs = 0, t_runsc = 0, t_oversc = 0;
                                angular.forEach(pt.matches, function (match, matchInd) {
                                    team.played = pt.matches.length;
                                    t_runs += match.totalRunScored;
                                    var tmp = (match.totalOversFaced % 1) * 10;
                                    t_overs += Math.floor(match.totalOversFaced) + (tmp / 6);
                                    t_runsc += match.totalRunsConceded;
                                    tmp = 0.00;
                                    tmp = (match.totalOversBowled % 1) * 10;
                                    t_oversc += Math.floor(match.totalOversBowled) + (tmp / 6);

                                    if (match.status.toLowerCase() === 'won')
                                        team.won += 1;
                                    else if (match.status.toLowerCase() === 'lost')
                                        team.lost += 1;
                                    else if (match.status.toLowerCase() === 'abandoned' || match.status.toLowerCase() === 'draw')
                                        team.draw += 1;
                                    team.pts += parseInt(match.points);
                                });
                                team.nrr = (t_runs / t_overs) - (t_runsc / t_oversc);
                                if (isNaN(team.nrr))
                                    team.nrr = 0;

                                group.teams.push(team);
                            }
                        });

                        self.tournament.teamPoints.push(group);
                    });
                } else {
                    var group = {'teams': []};
                    angular.forEach(self.tournament.participants, function (pt, ptInd) {
                        var team = {'name': pt.name, 'played': 0, 'won': 0, 'lost': 0, 'draw': 0, 'pts': 0, 'nrr': 0};
                        var t_runs = 0, t_overs = 0, t_runsc = 0, t_oversc = 0;
                        angular.forEach(pt.matches, function (match, matchInd) {
                            team.played = pt.matches.length;
                            t_runs += match.totalRunScored;
                            var tmp = (match.totalOversFaced % 1) * 10;
                            t_overs += Math.floor(match.totalOversFaced) + (tmp / 6);
                            t_runsc += match.totalRunsConceded;
                            tmp = 0.00;
                            tmp = (match.totalOversBowled % 1) * 10;
                            t_oversc += Math.floor(match.totalOversBowled) + (tmp / 6);
                            if (match.status.toLowerCase() === 'won')
                                team.won += 1;
                            else if (match.status.toLowerCase() === 'lost')
                                team.lost += 1;
                            else if (match.status.toLowerCase() === 'abandoned' || match.status.toLowerCase() === 'draw')
                                team.draw += 1;
                            team.pts += parseInt(match.points);
                        });

                        team.nrr = (t_runs / t_overs) - (t_runsc / t_oversc);
                        if (isNaN(team.nrr))
                            team.nrr = 0;

                        group.teams.push(team);
                    });

                    self.tournament.teamPoints.push(group);
                }
            }
            if (angular.isUndefinedOrNull(self.tournament.groups) || self.tournament.groups.length == 0) {
                self.tournament.groups = [];
            } else {
                var pInd = self.tournament.participants.map(function (obj) {
                    return obj.pid;
                });
                angular.forEach(self.tournament.groups, function (grp, grpInd) {
                    var newPt = [];
                    angular.forEach(grp.participants, function (gpt, gptInd) {
                        var ind = pInd.indexOf(gpt);
                        if (ind >= 0)
                            newPt.push({'pid': gpt, 'name': self.tournament.participants[ind].name, 'type': self.tournament.participants[ind].type});
                    });
                    grp.participants = newPt;
                });
            }
            if (angular.isUndefinedOrNull(self.tournament.rounds) || self.tournament.rounds.length == 0) {
                self.tournament.rounds = [];
            }
            if (angular.isUndefinedOrNull(self.tournament.gallery) || self.tournament.gallery.length == 0) {
                self.tournament.gallery = [];
            }
            if (angular.isUndefinedOrNull(self.tournament.schedule) || self.tournament.schedule.length == 0) {
                self.tournament.schedule = [];
            } else {
                var pushtotoday = true;
                angular.forEach(self.tournament.rounds, function (rnd, rndInd) {
                    rnd.schedule = [];
                    rnd.isPublished = false;
                    angular.forEach(self.tournament.schedule, function (sch, schInd) {
						
						// check for publishig
                        if (rnd._id === sch.roundId) { 
                            sch.evtName = "<span class='schTeam'>" + sch.participants[0].name + "</span><span class='schTeamvs'>vs</span><span class='schTeam'>" + sch.participants[1].name + "</span>";
                            rnd.schedule.push(sch);
                            if (sch.isPublished == true) {
                                rnd.isPublished = true;
                                self.isPublished = true;
                            }
                        }

                        // check for Today's schedule
                        if ($filter('date')(self.datetime.currDate, "yyyy-MM-dd") === $filter('date')(new Date(sch.evtDate), "yyyy-MM-dd")) {
                            for (var i = 0; i < self.todaysSchedule.length; i++) {
                                if (self.todaysSchedule[i].eid == sch.eid) {
                                    pushtotoday = false;
                                }
                            }
                            if (pushtotoday) {
                                self.todaysSchedule.push(sch);
                            }
                            pushtotoday = true;
                        }
						
						// check for groups
						/* if(angular.isUndefinedOrNull(sch.groupName) && !angular.isUndefinedOrNull(self.tournament.groups)){
							angular.forEach(self.tournament.groups, function (gp, gpInd) {
								var pInd = gp.participants.map(function (obj) {
									return obj.pid;
								});
								if(pInd.indexOf(sch.participants[0].pid) > -1 && pInd.indexOf(sch.participants[1].pid) > -1){
									sch.groupId = gp._id;
									sch.groupName = gp.name;
								}
							});
						} */						
                    });
                });
            }
            if (angular.isUndefinedOrNull(self.tournament.location) || self.tournament.location.length == 0) {
                self.tournament.location = [];
                if (angular.isUndefinedOrNull(GeneralService.myLocations)) {
                    GeneralService.getMiniProfile(self.uid).then(function (res) {
                        var status = res.data ? res.data.success : null;
                        if (status) {
                            self.tournament.location = res.data.extras.data.prof.location;
                            self.tournament.selFac = self.tournament.facility;
                            if (!angular.isUndefinedOrNull(self.tournament.selFac) && self.tournament.selFac.length > 0)
                                self.tournament.newschedule.facility = self.tournament.selFac[0];
                            angular.forEach(self.tournament.selFac, function (value, key) {
                                self.markers.push({'title': value.facName, 'lat': value.facLoc[1], 'lng': value.facLoc[0]});
                            });
                            self.updateTournament('location');
                        }
                    });
                } else {
                    self.tournament.location = GeneralService.myLocations;
                    self.tournament.selFac = self.tournament.facility;
                    if (!angular.isUndefinedOrNull(self.tournament.selFac) && self.tournament.selFac.length > 0)
                        self.tournament.newschedule.facility = self.tournament.selFac[0];
                    angular.forEach(self.tournament.selFac, function (value, key) {
                        self.markers.push({'title': value.facName, 'lat': value.facLoc[1], 'lng': value.facLoc[0]});
                    });
                    self.updateTournament('location');
                }
            } else {
                self.tournament.selFac = self.tournament.facility;
                if (!angular.isUndefinedOrNull(self.tournament.selFac) && self.tournament.selFac.length > 0)
                    self.tournament.newschedule.facility = self.tournament.selFac[0];
                angular.forEach(self.tournament.selFac, function (value, key) {
                    self.markers.push({'title': value.facName, 'lat': value.facLoc[1], 'lng': value.facLoc[0]});
                });
                self.listFacilities();
            }
            if (angular.isUndefinedOrNull(self.tournament.rules) || self.tournament.rules == "") {
                self.tournament.rules = "<p>No rules have been defined for this tournament.</p>";
            }
        }
    });

    // get tournament stats
    self.getTournamentStats = function(uid, tid, limit, gid){
		GeneralService.getTournamentStats(uid, tid, limit, gid).then(function (results) {
			var status = results.data ? results.data.success : null;
			if (status) {
				self.topBatsmen = results.data.extras.data.battingStats;
				self.topBowlers = results.data.extras.data.bowlingStats;
				angular.forEach(self.topBowlers, function (item, index) {
					item.bowlingStats.eco = item.bowlingStats.totalRun ? item.bowlingStats.totalRun / item.bowlingStats.totalOvers : 0;
				});
				if(!angular.isUndefinedOrNull(results.data.extras.data.fieldingStats)){
					self.topFieldersData = results.data.extras.data.fieldingStats[0];
					self.confirm.fieldingType = self.fieldingTypes[0];
					self.getFildingStats();
				}           
			}
		});
	}
	self.getTournamentStats(self.uid, tid, 30);
	
	self.getFildingStats = function(){
		if(!angular.isUndefinedOrNull(self.topFieldersData))
			self.topFielders = self.topFieldersData[self.confirm.fieldingType.value];
	}
	
	// get tournament stats by Team wise
	self.updateStats = function(gid){
		self.topBatsmen = [];
		self.topBowlers = [];
		self.topFieldersData = [];
		self.topFielders = [];
		self.getTournamentStats(self.uid, tid, 30, gid);
	}
	
    // get tournament officials
    GeneralService.getTournamentOfficials(tid).then(function (results) {
        var status = results.data ? results.data.success : null;
        if (status) {
            if (angular.isUndefinedOrNull(results.data.extras.data.officials) || results.data.extras.data.officials.length == 0)
                self.officials = [];
            else
                self.officials = results.data.extras.data.officials;
        }
    });

    // get all sports
    GeneralService.listSports().then(function (results) {
        self.allsports = results.data.extras.data;
    });

    // get all cities
    GeneralService.listAllCities().then(function (results) {
        self.allcities = [];
        angular.forEach(results.data.extras.data.cities, function (value, key) {
            self.allcities.push(value.City);
        });
    });

    self.listFacilities = function () {
        if (!angular.isUndefinedOrNull(self.tournament.location) && !angular.isUndefinedOrNull(self.tournament.sport)) {
            GeneralService.listFacilities(self.tournament.location, self.tournament.sport.split(",")).then(function (results) {
                self.allfacilities = [];
                angular.forEach(results.data.extras.data, function (value, key) {
                    self.allfacilities.push({facID: value._id, facName: value.name, facLoc: value.loc});
                });
            });
        }
    }
	
	// Change Logo or Banner image
	self.changeImages = function (files) {
        self.uploadLogoOrBanner(files, function () {
            self.confirm.imgRefreshTime = new Date().getTime();
        });
    };
	
	// Upload Logo or Banner image
	self.uploadLogoOrBanner = function (files, callback) {
        var file = files[0];
        GeneralService.uploadImage(file, self.tournament._id, "TB").then(function (response) {
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
		if(self.tournament.gallery.length < 50){	
			if(!angular.isUndefinedOrNull(files)){
				if(files.length > 5){
					self.confirm.dialogMsg = "You have selected "+ files.length +" images, from that only first 5 images will uploaded.";
					self.confirm.dialogShow = true;
					angular.element('body').trigger('click');
				}
				
				angular.forEach(files, function(file, index){
					if(index < 5 && (self.tournament.gallery.length + index + 1) <= 50){
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
    self.uploadIMGtoGallery = function (img) {
        var imgObj = {'iid': tid, 'type': 'T', 'image': img}
        if (!angular.isUndefinedOrNull(self.AOid.type))
            imgObj[self.AOid.type] = self.AOid.id;

        GeneralService.uploadIMGtoGallery(imgObj).then(function (response) {
            var status = response.data ? response.data.success : null;
            if (status) {
                self.tournament.gallery.push({'id': img});
            } else {
                alert("Error in image upload.");
            }
        });
    }
	
	// remove image from gallery
	self.removeImage = function(event, img){
		event.stopPropagation();
		event.preventDefault();
		
		var imgObj = {'iid': tid, 'type': 'T', 'image': img, 'action':'remove'}
        if (!angular.isUndefinedOrNull(self.AOid.type))
            imgObj[self.AOid.type] = self.AOid.id;
		
		GeneralService.uploadIMGtoGallery(imgObj).then(function (response) {
			var status = response.data ? response.data.success : null;
            if (status) {
                var delIndex = self.tournament.gallery.map(function(obj){
					return obj.id;
				}).indexOf(img);
				self.tournament.gallery.splice(delIndex, 1);
				self.confirm.removeImg = false;
            } else {
                alert("Error in image upload.");
            }			
		});
	}
	
	// Update tournament details
    self.updateTournament = function (type) {
        if (type === "location" || type === "sport") {
            self.listFacilities();
        }
        if (type === "facility") {
            self.tournament.facility = [];
            self.markers = [];
            self.tournament.facility = self.tournament.selFac.map(function (fac) {
                self.markers.push({'title': fac.facName, 'lat': fac.facLoc[1], 'lng': fac.facLoc[0]});
                return fac.facID;
            });
        }
        var editTournamentData = {'uid': self.uid, 'tid': tid};
		if (!angular.isUndefinedOrNull(self.AOid.type))
            editTournamentData[self.AOid.type] = self.AOid.id;

        if (type === "startdate") {
            editTournamentData[type] = $filter('date')(new Date(self.tournament[type]), "yyyy-MM-ddTHH:mm:ss") + '.330Z';
        } else if (type === "enddate") {
            var newEndDate = new Date(self.tournament[type]);
            newEndDate.setHours(newEndDate.getHours() + 18);
            editTournamentData[type] = $filter('date')(newEndDate, "yyyy-MM-ddTHH:mm:ss") + '.330Z';
        } else {
            editTournamentData[type] = self.tournament[type];
        }
        GeneralService.updateTournament(editTournamentData).then(function success(resp) {
            console.log(resp);
        }, function error(resp) {
            console.log(resp);
        });
    }

    // Participants
    self.ptype = "grp";
    self.pholder = "Search Team";

    self.clearSearch = function () {
        self.searchquery = "";
        self.addPt = false;
        self.allparticipants = [];
        if (self.ptype === "grp")
            self.pholder = "Search Team";
        else
            self.pholder = "Search Player";
    }
    self.searchParticipant = function () {
        self.addPt = true;
        if (self.ptype === "grp") {
            GeneralService.searchGroups(self.uid, self.searchquery).then(function (res) {
                var status = res.data ? res.data.success : null;
                if (status) {
                    self.allparticipants = [];
                    self.allparticipants = res.data.extras.data.map(function (obj) {
                        var newObj = {};
                        newObj.pid = obj._id;
                        newObj.type = 'G';
                        newObj.name = obj.grpName;
                        if (!angular.isUndefinedOrNull(obj.users) && obj.users.length > 0)
                            newObj.admin = obj.users[0].userName;
                        if (!angular.isUndefinedOrNull(obj.city))
                            newObj.city = obj.city;
                        if (!angular.isUndefinedOrNull(obj.sports))
                            newObj.sport = obj.sports;
                        if (self.tournament.participants.map(function (pt) {
                            return pt.pid
                        }).indexOf(newObj.pid) > -1)
                            newObj.isAdded = true;
                        return newObj;
                    });
                }
            });
        } else {
            GeneralService.getSearchedResults(self.uid, self.searchquery).then(function (res) {
                var status = res.data ? res.data.success : null;
                if (status) {
                    self.allparticipants = [];
                    self.allparticipants = res.data.extras.data.map(function (obj) {
                        var newObj = {};
                        newObj.pid = obj._id;
                        newObj.type = 'I';
                        newObj.fName = obj.fName;
                        newObj.lName = obj.lName;
                        newObj.name = obj.fName + " " + obj.lName;
                        if (!angular.isUndefinedOrNull(obj.location))
                            newObj.city = obj.location.join(", ");
                        if (!angular.isUndefinedOrNull(obj.sports))
                            newObj.sport = obj.sports.join(", ");
                        if (self.tournament.participants.map(function (pt) {
                            return pt.pid
                        }).indexOf(newObj.pid) > -1)
                            newObj.isAdded = true;
                        return newObj;
                    });
                }
            });
        }
    }
    self.togglePopup = function () {
        self.addPt = !self.addPt
    }
    
	// Add Team function
	self.addParticipant = function (index) {
        self.tournament.participants.push(self.allparticipants[index]);
        self.allparticipants[index].isAdded = true;
        var pt = {'uid': self.uid, 'tid': tid, 'pid': self.allparticipants[index].pid, 'type': self.allparticipants[index].type};
        if (!angular.isUndefinedOrNull(self.AOid.type))
            pt[self.AOid.type] = self.AOid.id;

        GeneralService.addParticipant(pt).then(function success(resp) {
            console.log(resp);
        }, function error(resp) {
            console.log(resp);
        });
    }
	
	// Update team details
	self.updateGroup = function (pid, teamName) {
		console.log(pid);
		console.log(teamName);
		var editGroupData = {'tid':tid, 'gid':pid, 'grpName':teamName};
		GeneralService.updateGroupByCreator(editGroupData).then(function (response) {
			var status = response.data ? response.data.success : null;
            if (status) {
				self.confirm.isEditable = null;
				var index = self.tournament.participants.map(function (obj) {
					return obj.pid;
				}).indexOf(pid);
				self.tournament.participants[index].name = teamName;
				console.log("Group name updated successfully.!!");
			}else{
				self.confirm.dupTeam = response.data.extras.msg.message;
				$timeout(function () {
                    self.confirm.dupTeam = null;
				}, 2000);
			}	
		}, function error(response) {
			console.log(response);
		});
	}
	
	// Remove Team function
    self.removeParticipant = function (pid) {
		
		// check schedule matches for the deleting team
		var team1 = self.tournament.schedule.map(function(obj){
			return obj.participants[0].pid;
		}).indexOf(pid);
		
		var team2 = self.tournament.schedule.map(function(obj){
			return obj.participants[1].pid;
		}).indexOf(pid);
		
		if(team1 > -1 || team2 > -1){
			self.confirm.dialogMsg = "This team exists in the schedule. Delete the match first and remove the team. you are only allowed to delete the team which is not played yet.";
			self.confirm.dialogShow = true;
		}else{
			
			var index = self.tournament.participants.map(function (obj) {
				return obj.pid;
			}).indexOf(pid);
			var pt = {'uid': self.uid, 'tid': tid, 'pid': self.tournament.participants[index].pid, 'type': self.tournament.participants[index].type};
			if (!angular.isUndefinedOrNull(self.AOid.type))
				pt[self.AOid.type] = self.AOid.id;
			
			GeneralService.removeParticipant(pt).then(function success(resp) {
				var status = resp.data ? resp.data.success : null;
				if (status) {
					self.tournament.participants.splice(index, 1);
					if (!angular.isUndefinedOrNull(self.tournament.groups) && self.tournament.groups.length > 0) {
						angular.forEach(self.tournament.groups, function (grp, grpInd) {
							var delIndex = "";
							angular.forEach(grp.participants, function (gpt, gptInd) {
								if (gpt.pid === pid)
									delIndex = gptInd;
							});
							if (delIndex != "") {
								grp.participants.splice(delIndex, 1);
								self.updateTournamentGroup(grp);
							}
						});
					}
				}

			}, function error(resp) {
				console.log(resp);
			});	
		}        
    }
	
	// dialog box close event handler
	self.dialogHandler = function () {
		self.confirm.dialogShow = false;
	};
	
    self.resetTeamForm = function () {
        self.newteam.players.length = 0;
        self.newteam = null;
        self.newteam = {players: []};
        self.invalidPlayerDetails = false;
        self.newTeamForm.$setPristine();
        self.activeForm = null;
    };

    self.createTeam = function (isValidForm) {
        if (isValidForm) {
			var isDuplicate = false;
			self.confirm.btnDisable = true;
            var team = {'tid': tid, 'teamName': self.newteam.name, city: ''};
            if (!angular.isUndefinedOrNull(self.newteam.players) && self.newteam.players.length > 0) {
                self.newteam.players[0].isAdmin = true;	// make first player admin by default
                team.teamMembers = self.newteam.players;
                angular.forEach(team.teamMembers, function (mem, memInd) {
                    if (angular.isUndefinedOrNull(mem.lName) || mem.lName == '') {
                        mem.lName = '.';
                    }
                });
				
				// check duplicate players
				angular.forEach(team.teamMembers, function (mem1, memInd1) {
					angular.forEach(team.teamMembers, function (mem2, memInd2) {
						if(memInd1 != memInd2 && angular.lowercase(mem1.fName) == angular.lowercase(mem2.fName) && angular.lowercase(mem1.lName) == angular.lowercase(mem2.lName)){
							self.newteam.ind1 = memInd1;
							self.newteam.ind2 = memInd2;
							isDuplicate = true;	
							return false;
						}					
					});
				});
            }

            if (self.tournament && self.tournament.location && self.tournament.location.length) {
                team.city = self.tournament.location[0];
            }
			
			if(isDuplicate == false){
				GeneralService.createTeam(team).then(function success(response) {
					var status = response.data ? response.data.success : null;
					if (status) {
						self.tournament.participants.push({'pid': response.data.extras.data, 'name': team.teamName, 'type': 'G'});
						self.newteam.success = true;
						self.newteam.msg = "Team created successfully!";
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
						self.newteam.msg = "Something went wrong!";
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
				self.newteam.msg = "Player with same name already exists. Please use different name.";
				self.confirm.btnDisable = false;
			}
        } else {
            self.newteam.failed = true;
			self.newteam.msg = "Fill all the details properly!";
            $timeout(function () {
                self.newteam.failed = false;
                self.confirm.btnDisable = false;
            }, 2000);
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

    self.validateEmail = function (official) {
        if (isNaN(official.username)) {
            var emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (emailRegExp.test(official.username)) {
                official.email = official.username;
                self.isFocus.official.invEmail = false;
                return true;
            }
            self.isFocus.official.invEmail = true;
            return false;
        } else if (official.username.length == 10) {
            official.mobile = official.username;
            self.isFocus.official.invEmail = false;
            return true;
        }
        self.isFocus.official.invEmail = true;
        return false;
    };

    self.checkForm = function (formValue) {
        if (formValue) {
            if (angular.isUndefinedOrNull(self.newOfficial.username) || self.newOfficial.username == "") {
                self.isFocus.official.confirm = true;
                delete self.newOfficial.username;
            } else if (self.validateEmail(self.newOfficial)) {
                self.isFocus.official.confirm = true;
            } else {
                self.isFocus.official.confirm = false;
            }
        } else {
            self.isFocus.official.confirm = false;
        }
    };

    // Add official in tournament
    self.addOfficial = function (official) {
        self.confirm.btnDisable = true;
        official.tid = tid;
        if (angular.isUndefinedOrNull(official.lName) || official.lName == '')
            official.lName = '.';
        GeneralService.addOfficial(official).then(function success(response) {
            var status = response.data ? response.data.success : null;
            if (status) {
                self.officials.push({'uid': response.data.extras.data.uid, 'userName': response.data.extras.data.fName + ' ' + response.data.extras.data.lName});
                self.newOfficial = {};
                self.isFocus.official = {};
                self.confirm.btnDisable = false;
            } else {
                self.confirm.btnDisable = false;
            }
        }, function error(response) {
            console.log(response);
            self.confirm.btnDisable = false;
        });
    };

    // Remove official from tournament
    self.removeOfficial = function (officialId) {
        self.confirm.btnDisable = true;
        GeneralService.removeOfficial({'tid': tid, 'officialId': officialId}).then(function success(response) {
            var status = response.data ? response.data.success : null;
            if (status) {
                var ind = self.officials.map(function (obj) {
                    return obj.uid;
                }).indexOf(officialId);
                self.officials.splice(ind, 1);
                self.confirm.btnDisable = false;
                self.confirm.remOfficial = {};
            } else {
                self.confirm.btnDisable = false;
            }
        }, function error(response) {
            console.log(response);
            self.confirm.btnDisable = false;
        });
    };

    // Cancel official form
    self.cancelOfficial = function () {
        $timeout(function () {
            angular.element('#addOff').trigger('click');
        }, 100);
        self.newOfficial = {};
        self.isFocus.official = {};
    };

    // Groups
    self.createTournamentGroup = function () {
        self.confirm.btnDisable = true;
        var group = {'tid': tid, 'uid': self.uid, 'name': self.tournament.newgroup.name};
		if (!angular.isUndefinedOrNull(self.AOid.type))
            group[self.AOid.type] = self.AOid.id;

        group.participants = self.tournament.newgroup.participants.map(function (obj) {
            return obj.pid;
        });

        GeneralService.createTournamentGroup(group).then(function success(response) {
            var status = response.data ? response.data.success : null;
            if (status) {
                self.tournament.newgroup._id = response.data.extras.data;
                self.tournament.groups.push(self.tournament.newgroup);
                self.tournament.newgroup = {};
                self.isFocus.gSubmitted = false;
                self.confirm.btnDisable = false;
            } else {
                self.confirm.btnDisable = false;
            }
        }, function error(response) {
            console.log(response);
            self.confirm.btnDisable = false;
        });
    };
    self.updateTournamentGroup = function (updatedGroup) {
        var group = {'tid': tid, 'uid': self.uid, 'gid': updatedGroup._id, 'name': updatedGroup.name};
        if (!angular.isUndefinedOrNull(self.AOid.type))
            group[self.AOid.type] = self.AOid.id;
		
        group.participants = updatedGroup.participants.map(function (obj) {
            return obj.pid;
        });

        GeneralService.updateTournamentGroup(group).then(function success(resp) {
            console.log('Updated!');
        }, function error(resp) {
            console.log(resp);
        });
    }
    self.deleteTournamentGroup = function (index, gid) {
        var group = {'tid': tid, 'uid': self.uid, 'gid': gid};
		if (!angular.isUndefinedOrNull(self.AOid.type))
            group[self.AOid.type] = self.AOid.id;
		
        GeneralService.deleteTournamentGroup(group).then(function success(resp) {
            self.tournament.groups.splice(index, 1);
        }, function error(resp) {
            console.log(resp);
        });
    };
    self.cancelTournamentGroup = function () {
        $timeout(function () {
            angular.element('#addGroupBtn').trigger('click');
        }, 100);
        self.tournament.newgroup = {};
        self.isFocus.gSubmitted = false;

    };
    self.grpParticipantDetails = function (pid, tid) {		
        GeneralService.groupID = pid;
        GeneralService.userid = self.uid;
        GeneralService.tid = tid;
        ngDialog.open({
            template: '/dialogs/team-members.html',
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

    // Rounds
    self.createRound = function (name) {
        self.confirm.btnDisable = true;
        var round = {'tid': tid, 'uid': self.uid, 'name': self.tournament.newround.name};
        if (!angular.isUndefinedOrNull(self.AOid.type))
            round[self.AOid.type] = self.AOid.id;
		
        GeneralService.createRound(round).then(function success(response) {
            var status = response.data ? response.data.success : null;
            if (status) {
                self.tournament.newround.schedule = [];
                self.tournament.newround._id = response.data.extras.data;
                self.tournament.rounds.push(self.tournament.newround)
                self.tournament.newround = {};
                self.confirm.btnDisable = false;
            } else {
                self.confirm.btnDisable = false;
            }
        }, function error(response) {
            console.log(response);
            self.confirm.btnDisable = false;
        });
    };
    self.updateRound = function (updatedRound) {
        var round = {'tid': tid, 'uid': self.uid, 'id': updatedRound._id, 'name': updatedRound.name};
		if (!angular.isUndefinedOrNull(self.AOid.type))
            round[self.AOid.type] = self.AOid.id;
		
        GeneralService.updateRound(round).then(function success(resp) {
            console.log('Updated!');
        }, function error(resp) {
            console.log(resp);
        });
    };
    self.publishRound = function (round, index) {
        var round = {'tid': tid, 'uid': self.uid, 'roundId': round._id}
		if (!angular.isUndefinedOrNull(self.AOid.type))
            round[self.AOid.type] = self.AOid.id;
		
        GeneralService.publishRound(round).then(function success(resp) {
            var status = resp.data ? resp.data.success : null;
            if (status) {
                /*
                 var scheduleIds = resp.data.extras.data; 
                 angular.forEach(round.schedule, function (sch, schInd) {
                 if (scheduleIds.indexOf(sch.eid) >= 0) {
                 sch.isPublished = true;
                 }
                 });
                */
				if (!angular.isUndefinedOrNull(self.AOid.type))
					window.location = "/tournament.html?" + self.AOid.type + "=" + self.AOid.id + "&tid=" + tid;
				else
					window.location = "/tournament.html?tid=" + tid; 

                round.isPublished = true;
                self.isFocus.showNoti[index] = true;
                $timeout(function () {
                    self.isFocus.showNoti[index] = false;
                }, 2000);
            }
        }, function error(resp) {
            console.log(resp);
        });
    };

    // Schedules
    self.getParticipants = function () {
        if (!angular.isUndefinedOrNull(self.tournament.newschedule.selGroup) && self.tournament.newschedule.selGroup.length != 0)
            return self.tournament.newschedule.selGroup.participants;
        else
            return self.tournament.participants;
    };
    self.createSchedule = function (round) {
        self.confirm.btnDisable = true;
        var schedule = {'tid': tid, 'uid': self.uid, 'evtType': 'team', 'participants': []};
        if (!angular.isUndefinedOrNull(self.AOid.type))
            schedule[self.AOid.type] = self.AOid.id;
		
        schedule.roundId = round._id;
        schedule.evtName = self.tournament.newschedule.participants[0].name + ' vs ' + self.tournament.newschedule.participants[1].name;
        if (!angular.isUndefinedOrNull(self.tournament.newschedule.facility))
            schedule.facID = self.tournament.newschedule.facility.facID;
        if (!angular.isUndefinedOrNull(self.tournament.newschedule.selGroup))
            schedule.groupId = self.tournament.newschedule.selGroup._id;
        schedule.participants.push({'pid': self.tournament.newschedule.participants[0].pid});
        schedule.participants.push({'pid': self.tournament.newschedule.participants[1].pid});
        schedule.evtDate = self.convertDateToUTC(self.datetime.evtDate);
        schedule.sport = self.tournament.sport;
        self.tournament.newschedule.evtDate = self.convertDateToUTC(self.datetime.evtDate);
        self.tournament.newschedule.evtName = "<span class='schTeam'>" + self.tournament.newschedule.participants[0].name + "</span><span class='schTeamvs'>vs</span><span class='schTeam'>" + self.tournament.newschedule.participants[1].name + "</span>";

        GeneralService.createSchedule(schedule).then(function success(response1) {
            var status1 = response1.data ? response1.data.success : null;
            if (status1) {
                var publish_round = {'tid': tid, 'uid': self.uid, 'roundId': round._id}
                if (!angular.isUndefinedOrNull(self.AOid.type))
					publish_round[self.AOid.type] = self.AOid.id;
				
                GeneralService.publishRound(publish_round).then(function success(response2) {
                    var status2 = response2.data ? response2.data.success : null;
                    if (status2) {
						
						GeneralService.loadEventWithPlayers(response2.data.extras[0]).then(function success(response3) {
							var status3 = response3.data ? response3.data.success : null;
							if (status3) {
								var event = response3.data.extras.data.event;
								self.addComment(event.discussion._id);
							}
						}, function error(response3) {
							console.log(response3);
						});						
                    } else {
                        self.confirm.btnDisable = false;
                    }
                }, function error(response2) {
                    console.log(response2);
                    self.confirm.btnDisable = false;
                });
            } else {
                self.confirm.btnDisable = false;
            }
        }, function error(response1) {
            console.log(response1);
            self.confirm.btnDisable = false;
        });
    };
	
	self.addComment = function(did) {
		GeneralService.postComment({'did':did, 'comment':'Come on! Comment and Cheers your team.', 'timeStamp':new Date()}).then(function success(response) {
			var status = response.data ? response.data.success : null;
			if (status) {
				console.log("First comment added successfully");
				if (!angular.isUndefinedOrNull(self.AOid.type))
					window.location = "/tournament.html?" + self.AOid.type + "=" + self.AOid.id + "&tid=" + tid;
				else
					window.location = "/tournament.html?tid=" + tid;
			}
		}, function error(response) {
			console.log(response);
		});
	};	
    self.updateSchedule = function (type, updatedSchedule) {
        var editScheduleData = {'eid': updatedSchedule.eid, 'uid': self.uid, 'tid': tid, 'evtType': 'team'};
        angular.forEach(self.tournament.selFac, function (fac, fInd) {
            if (updatedSchedule.facility.facName === fac.facName)
                updatedSchedule.facility.facID = fac.facID;
        });
        editScheduleData.fid = updatedSchedule.facility.facID;
        GeneralService.updateSchedule(editScheduleData).then(function success(resp) {
            console.log("Updated!!");
        }, function error(resp) {
            console.log(resp);
        });
    };
    self.removeSchedule = function (schedule) {
        GeneralService.removeSchedule({'eid': schedule.eid}).then(function (response) {
            var status = response.data ? response.data.success : null;
            if (status) {
                window.location.reload();
            }
        });
    };
    self.cancelSchedule = function (ele) {
        $timeout(function () {
            angular.element('#' + ele).trigger('click');
        }, 100);
        self.tournament.newschedule = {};
        self.isSchedule.submitted = false;
    };
    self.regenerateFieldingStats = function(){
       GeneralService.regenerateFieldingStats({"tid":tid}).then(function success(response) {
            var status = response.data ? response.data.success : null;
			if(status){
				window.location.reload();
			}
        }, function error(response){
			console.log(response);
		});
    }
	self.regeneratePointsTable = function(){
       GeneralService.regeneratePointsTable({"tid":tid}).then(function success(response) {
            var status = response.data ? response.data.success : null;
			if(status){
				window.location.reload();
			}
        }, function error(response){
			console.log(response);
		});
    }
	
	self.goToScorePage = function(sid){
		window.location = "/" + $filter('lowercase')(self.tournament.sport) + "/score.html?id=" + sid + "&type=E";
	}
	
	// Return styling of team color on tournament schedule
	self.selectTeam = function (schedule) {
		if(!angular.isUndefinedOrNull(schedule.result) && !angular.isUndefinedOrNull(schedule.result.winner)){
			if(schedule.result.winner.pid == schedule.score[0].id){
				return {color: '#228B22'}
			}else{
				return {color: '#3897f0'}
			}
		}
	}
}
;
angular.module('sem')
        .controller('Tournament', TournamentCtrl)
        .directive('tabScript', [function () {
                return {
                    restrict: 'A',
                    scope: {
                        isPublished: "=isPublished"
                    },
                    link: function (scope, element, attr) {
                        scope.$watch(function () {
                            return scope.isPublished;
                        }, function (newValue, oldValue) {
                            if (newValue != oldValue) {
                                $(element).find('li:first-child').addClass('current');
                                var dt = $(element).find('li:first-child').attr('data-tab');
                                $("#" + dt).siblings('.tabContent').removeClass('current');
                                $("#" + dt).addClass('current');
                            }
                        });
                    }
                }
            }])
        .directive('googleAdsenseTournament', ['$window', '$compile', function ($window, $compile) {
                var adSenseTpl = '<ins class="adsbygoogle" style="display:block;min-width:320px;max-width:1140px;width:100%;height:130px" data-ad-client="ca-pub-7999525691080451" data-ad-slot="1913415071" data-ad-layout-key="-fp+5k+7b-ea-i" data-ad-format="fluid"></ins></ins>';
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
        ;
