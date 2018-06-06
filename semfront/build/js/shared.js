;
var sharedServicesModule = angular.module('sharedServices', []);
//sharedServicesModule.constant('API', 'http://www.sportsextramile.com/api');
sharedServicesModule.service('GeneralService', function ($window, $rootScope, API, $http) {
    "ngInject";
    var self = this;
	var shareURL = $window.location.href;
	if(shareURL.indexOf('score.html') > 0)
		shareURL = shareURL.replace('score.html', 'view.html');
    $rootScope.currUrl = encodeURIComponent(shareURL);
    //$rootScope.currUrl = encodeURIComponent($window.location.href);
   // console.log($window.location.href);
   // console.log($window.location.href.indexOf("profile") >= 0);
   
   //extract parameter from the url
    this.getParam = function (param) {
        var item = $window.location.search.split(param + '=')[1];
        if (item) {
            return item.split('&')[0];
        } else {
            return null;
        }
    };
    this.getDevT = function(){
         if(angular.isUndefinedOrNull(window.JSInterface)){
             return false;
         }else {
             return true;
         }
    }
    function getLastFromString(url){
        if (!url)
            url = window.location.href;
        var items = url.split("-");
        return(items[items.length-1]);
    }
    //to get -o-id-t-id oid and tid from url
    this.getTypeParam = function(type, url){
        if (!url)
            url = window.location.href;
        var items = url.split("-");
        var id = null;
        for(var i =0; i< items.length;i++){
            if(items[i] == type){
                id = items[i+1];
            }
        }
        return(id);
    }
    this.markRead = function (data) {
        return $http.post(API + '/userapi/readNotification', data);
    };

    this.createEvt = function (data) {
        return $http.post(API + '/eventapi/createEvent', data);
    };
    this.createSingleMatch = function (data) {
        return $http.post(API + '/eventapi/singleMatch', data);
    };
    this.loadEvent = function (id) {
        return $http.get(API + '/eventapi/eventDetails?eid=' + id);
    };
    this.loadEventWithPlayers = function (id) {
        return $http.get(API + '/eventapi/eventDetailsWithPlayers?eid=' + id);
    };
    this.loadEventWithPlayersEdit = function (id) {
        var local = $window.localStorage[id];
        if (angular.isUndefinedOrNull(local)) {
            console.log("loading from remote");
            return $http.get(API + '/eventapi/eventAdmnDetailsWithPlayers?eid=' + id);
        } else {
            console.log("loading from local");
            return new Promise(function(resolve,reject){resolve(local)});
        }

    };

    this.createDisc = function (data) {
        return $http.post(API + '/discapi/create', data);
    };
    this.eventSubscribe = function (data) {
        return $http.post(API + '/eventapi/subscribe', data);
    };
	this.createTeamByIndividual = function (data) {
		return $http.post(API + '/eventapi/createTeam', data);
	};
	this.addEventVideo = function (data) {
		return $http.post(API + '/eventapi/addVideo', data);
	};
	this.setYoutubeFlag = function (data) {
		return $http.post(API + '/eventapi/youtubeFlag', data);
	};
	
    this.likeItems = function (data) {
        return $http.post(API + '/userapi/like', data);
    };

    this.facilitySubscribe = function (data) {
        return $http.post(API + '/facilityapi/subscribe', data);
    };
    this.postComment = function (data) {
        return $http.post(API + '/discapi/comment', data);
    };
	this.getComments = function (did, offset, fetchReverse, fetchCount) {
		if (angular.isUndefinedOrNull(fetchReverse))
			return $http.get(API + '/discapi/getComments?did=' + did + '&offset=' + offset + '&fetchCount=' + fetchCount);
		else
			return $http.get(API + '/discapi/getComments?did=' + did + '&offset=' + offset + '&fetchReverse=' + fetchReverse + '&fetchCount=' + fetchCount);
	}
	
    this.postArticleComment = function (data) {
        return $http.post(API + '/contentapi/comment', data);
    };

    this.getSearchedResults = function (uid, searchKeyword, city) {
        return $http.get(API + '/friendapi/search?uid=' + uid + '&name=' + searchKeyword + '&city=' + city);
    };

    this.addAsAFriend = function (data) {
        return $http.post(API + '/friendapi/addFriendRequest', data);
    };

    this.subscribeForGroup = function (data) {
        return $http.post(API + '/groupapi/subscribe', data);
    };

    this.createGrp = function (data) {
        return $http.post(API + '/groupapi/create', data);
    };

    this.getMyItems = function (uid, type) {
        return $http.get(API + '/userapi/getMyItems?uid=' + uid + '&type=' + type);
    };

    this.inviteFriendsInGroup = function (data) {
        return $http.post(API + '/groupapi/invite', data);
    };

    this.getMiniProfile = function (uid) {
        return $http.get(API + '/userapi/getMiniProf?uid=' + uid);
    };

    this.getFriendMiniProfile = function (fid) {
        return $http.get(API + '/friendapi/getMiniProf?fid=' + fid);
    };

    this.getListReceived = function (uid) {
        return $http.get(API + '/friendapi/listReceived?uid=' + uid);
    };

    this.getListNotification = function (uid) {
        return $http.get(API + '/userapi/getNotificationD?uid=' + uid);
    };

    this.createArticle = function (article) {
        return $http.post(API + '/contentapi/create', article);
    };
	this.contactus = function (data) {
        return $http.post(API + '/genapi/contactus', data);
    };
    this.getIP = function (ip) {
        return $http.get(API + '/genapi/getIP?ip=' + ip);
    };
    this.listSports = function () {
        return $http.get(API + '/genapi/listSports');
    };
    this.listStates = function () {
        return $http.get(API + '/genapi/listStates');
    };
    this.listCities = function (state) {
        return $http.get(API + '/genapi/listCities?state=' + state);
    };
    this.listSS = function () {
        return $http.get(API + '/genapi/listSS');
    };
    this.listAllCities = function () {
        return $http.get(API + '/genapi/listAllCities');
    };
    this.listFacilities = function (city, sports) {
        return $http.post(API + '/facilityapi/list', {
            sports: sports,
            city: city
        });
    };
	this.listRunningTournaments = function (sport, page) {
		return $http.get(API + '/listapi/listRunning?sport=' + sport + '&page=' + page);
	};
	this.listComingTournaments = function (sport, page) {
		return $http.get(API + '/listapi/listComing?sport=' + sport + '&page=' + page);
	};
	this.listPastTournaments = function (sport, page) {
		return $http.get(API + '/listapi/listPast?sport=' + sport + '&page=' + page);
	};
	
    this.getDiscussions = function (uid, did) {
        return $http.get(API + '/discapi/details?uid=' + uid + '&did=' + did);
    };
    this.getAritcle = function (uid, cid, type) {
        return $http.get(API + '/contentapi/details?uid=' + uid + '&cid=' + cid + '&type=' + type);
    };
    this.getPeople = function (uid, did) {
        return $http.get(API + '/userapi/getPeople?uid=' + uid);
    };
    this.getGroupDetails = function (uid, gid, tid) {
        //call to general group list if not logged in
        if(angular.isUndefinedOrNull(uid)){
            return $http.get(API + '/listapi/grpdetails?gid=' + gid);
        }else{
        if (angular.isUndefinedOrNull(tid)) {
            return $http.get(API + '/groupapi/details?uid=' + uid + '&gid=' + gid);
        }
        else{
            return $http.get(API + '/groupapi/details?uid=' + uid + '&gid=' + gid + '&tid=' + tid);
        }
    }
    };

    // Organizer APIs
    this.createOrganizer = function (data) {
        return $http.post(API + '/organizerapi/organizer', data);
    };
    this.editOrganizer = function (data) {
        return $http.put(API + '/organizerapi/organizer', data);
    };
    this.getOrganizer = function (uid, oid) {
        if (angular.isUndefinedOrNull(uid)) {
            return $http.get(API + '/organizerapi/organizer?orgId=' + oid);
        } else {
            return $http.get(API + '/organizerapi/organizer?uid=' + uid + '&orgId=' + oid);
        }
    };
	
	// Academy APIs
	this.createAcademy = function (data) {
        return $http.post(API + '/facilityapi/academy', data);
    };    
	this.getAcademy = function (aid, q) {
        var query = q || '';
        return $http.get(API + '/facilityapi/academy/' + aid + "/" + query);
    };
    this.updateAcademy = function(data){
        return $http.put(API + '/facilityapi/academy', data);
    };	
	this.removeAcademyAdmin = function (aid, adminId) {
        return $http.delete(API + '/facilityapi/academyAdmin?aid=' + aid + '&adminId=' + adminId);
    };
	this.addAcademyMember = function (data) {
        return $http.post(API + '/facilityapi/academyMember', data);
    };	
	this.archiveAcademyMember = function (data) {
		return $http.post(API + '/facilityapi/archiveAcademyMember', data);
	};	
	this.removeAcademyMember = function (data) {
		return $http.post(API + '/facilityapi/removeAcademyMember', data);
	};
	this.addAcademyCoach = function (data) {
        return $http.post(API + '/facilityapi/addAcademyCoach', data);
    };
	this.archiveAcademyCoach = function (data) {
        return $http.post(API + '/facilityapi/archiveAcademyCoach', data);
    };
	this.unarchiveAcademyCoach = function (data) {
        return $http.post(API + '/facilityapi/unarchiveAcademyCoach', data);
    };	
	
	// Organizer APIs
    this.addAdmin = function (data) {
        return $http.put(API + '/organizerapi/organizer', data);
    };
    this.removeAdmin = function (uid, oid, adminId) {
        return $http.delete(API + '/organizerapi/organizer?uid=' + uid + '&orgId=' + oid + '&adminId=' + adminId);
    };

    // Tournament APIs
    this.createTournament = function (data) {
        return $http.post(API + '/tournamentapi/create', data);
    };
    this.updateTournament = function (data) {
        return $http.put(API + '/tournamentapi/update', data);
    };
    this.getTournament = function (uid, tid, oid) {
        if (angular.isUndefinedOrNull(uid)) {
            return $http.get(API + '/tournamentapi/get?tid=' + tid);
        } else if (angular.isUndefinedOrNull(oid)) {
            return $http.get(API + '/tournamentapi/get?uid=' + uid + '&tid=' + tid);
        } else {
			return $http.get(API + '/tournamentapi/get?uid=' + uid + '&tid=' + tid + '&orgId=' + oid);
		}
    };
    this.getTournamentStats = function (uid, tid, limit, gid) {
		if(angular.isUndefinedOrNull(gid)){
			return $http.get(API + '/tournamentapi/tournamentStats?uid=' + uid + '&tid=' + tid + '&limit=' + limit);
		}else{
			return $http.get(API + '/tournamentapi/tournamentStats?uid=' + uid + '&tid=' + tid + '&limit=' + limit +'&gid=' + gid);
		}        
    };
	this.getUserTournamentStats = function(pid) {
		return $http.get(API + '/tournamentapi/userTournamentStats?pid=' + pid);
	};
	this.getUserTournamentMatchStats = function (pid, tid, teamName) {
		return $http.get(API + '/tournamentapi/userTournamentMatchStats?pid=' + pid + "&tid=" + tid + "&teamName=" + teamName);
	};
	this.getTournamentOfficials = function(tid) {
		return $http.get(API + '/tournamentapi/tournamentOfficials?tid=' + tid);
	};
	this.addOfficial = function (data) {
		return $http.post(API + '/tournamentapi/addOfficial', data);
	};
	this.removeOfficial = function (data) {
		return $http.post(API + '/tournamentapi/removeTournamentOfficial', data);
	};
	this.addEventOfficial = function (data) {
		return $http.post(API + '/tournamentapi/addEventOfficial', data);
	};
	this.removeEventOfficial = function (data) {
		return $http.post(API + '/tournamentapi/removeEventOfficial', data);
	};	
    this.addParticipant = function (data) {
        return $http.post(API + '/tournamentapi/addParticipant', data);
    };
    this.removeParticipant = function (data) {
        return $http.post(API + '/tournamentapi/removeParticipant', data);
    };
	this.createTeam = function (data) {
		return $http.post(API + '/tournamentapi/createTeam', data);
	};
    this.searchGroups = function (uid, query) {
        return $http.get(API + '/groupapi/search?uid=' + uid + '&name=' + query);
    };
	this.getGroupsByCreator = function (uid, sport) {
        return $http.get(API + '/groupapi/bycreator?uid=' + uid + '&sport=' + sport);
    };
	this.updateGroupByCreator = function (data) {
        return $http.post(API + '/groupapi/update', data);
    };
    this.createTournamentGroup = function (data) {
        return $http.post(API + '/tournamentapi/group', data);
    };
    this.updateTournamentGroup = function (data) {
        return $http.put(API + '/tournamentapi/group', data);
    };
    this.deleteTournamentGroup = function (data) {
        return $http.post(API + '/tournamentapi/removeGroup', data);
    };
    this.createRound = function (data) {
        return $http.post(API + '/tournamentapi/round', data);
    };
    this.updateRound = function (data) {
        return $http.put(API + '/tournamentapi/round', data);
    };
    this.publishRound = function (data) {
        return $http.put(API + '/tournamentapi/publish-schedule', data);
    };
    this.createSchedule = function (data) {
        return $http.post(API + '/tournamentapi/schedule', data);
    };
    this.updateSchedule = function (data) {
        return $http.put(API + '/tournamentapi/schedule', data);
    };
	this.removeSchedule = function (data) {
		return $http.post(API + '/tournamentapi/removeMatch', data);
	};
	this.addTeamMember = function (data) {
		return $http.post(API + '/tournamentapi/addTeamMember', data);
	};
	this.removeTeamMember = function (data) {
		return $http.post(API + '/tournamentapi/removeTeamMember', data);
	};	
    this.regenerateFieldingStats = function(data){
		return $http.post(API + '/tournamentapi/regenerateStats', data);
    }
	this.regeneratePointsTable = function(data){
		return $http.post(API + '/tournamentapi/regeneratePoints', data);
    }
    this.uploadIMGtoGallery = function (data) {
        return $http.post(API + '/userapi/gallery', data);
    };
	this.addBanner = function (data) {
        return $http.post(API + '/userapi/banner', data);
    };

    // Scorecard APIs
    this.startMatch = function (data) {
        return $http.post(API + '/scoreapi/start', data);
    };
    this.setToss = function (data) {
        return $http.post(API + '/scoreapi/toss', data);
    };
    this.editMatch = function (data) {
        return $http.post(API + '/scoreapi/edit', data);
    };
    this.removeLocal = function(id){
        $window.localStorage.removeItem(id);
    };
    this.saveGame = function (data, event) {
        $window.localStorage[event._id] = JSON.stringify(event);
        return $http.post(API + '/scoreapi/save', data);
    };
    this.updateResult = function (data) {
        return $http.post(API + '/scoreapi/updateResult', data);
    };
    this.updateStats = function (data) {
        return $http.post(API + '/scoreapi/updateStats', data);
    };
	this.updatePointsTable = function (data) {
        return $http.post(API + '/scoreapi/updatePointsTable', data);
    };
	this.matchSummary = function (sport, eid) {
        return $http.get(API + '/scoreapi/matchSummary?sport=' + sport + '&eid=' + eid);
    };
	this.playingEleven = function (data) {
		return $http.post(API + '/eventapi/playingEleven', data);
	};
	self.addPlayingEleven = function (players) {
		self.match = {};
		self.match.players = players;
        $rootScope.$broadcast('playingElevenSet');
    };
	
	self.addPlayerInPlaying11 = function (pid, players) {
		self.match = {};
		self.match.pid = pid;
		self.match.players = players;
        $rootScope.$broadcast('addPlayerInPlaying11');
    };
	
	self.setPlayerInMatch = function (player) {
		self.match.selectedPlayer = player;
        $rootScope.$broadcast('setPlayerInMatch');
    };
	
	self.setPlayersOnInningStart = function (onstrike, nonstrike, bowler) {
		self.match = {};
		self.match.onstrike  = onstrike;
		self.match.nonstrike = nonstrike;
		self.match.bowler    = bowler;
		$rootScope.$broadcast('setPlayersOnInningStart');
	};
	
	self.setBatsmanInMatch = function (strikeIndex) {
		self.match = {};
		self.match.strikeIndex = strikeIndex;
        $rootScope.$broadcast('setBatsmanInMatch');
	};
	
	self.setBatsmanBowlerInMatch = function (strikeIndex, bowlerIndex) {
		self.match = {};
		self.match.strikeIndex = strikeIndex;
		self.match.bowlerIndex = bowlerIndex;
		$rootScope.$broadcast('setBatsmanBowlerInMatch');
	};
	
	self.setBowlerInMatch = function (bowlerIndex) {
		self.match = {};
		self.match.bowlerIndex = bowlerIndex;
        $rootScope.$broadcast('setBowlerInMatch');
	};
	
    self.addToHome = function (item) {
        self.newItem = item;
        $rootScope.$broadcast('newItemAdded');
    };
    self.addToGroupList = function (item) {
        self.newGroup = item;
        $rootScope.$broadcast('newGroupAdded');
    };
    self.addCommentToHome = function (item) {
        self.newComment = item;
        $rootScope.$broadcast('newCommentAdded');
    };
	self.addEventOnHomeFeed = function (item) {
		self.newEventOnHomeFeed = item;
		$rootScope.$broadcast('newEventAddedOnHomeFeed');
	};
    self.loadGeneral = function (id, callback) {
        if (angular.isUndefinedOrNull(self.mylocations)) {
            console.log("loading gprofile")
            self.getMiniProfile(id).then(function (data) {
                self.myFriends = data.data.extras.data.friends;
                self.myGroups = data.data.extras.data.groups;
                self.myGroupsPending = data.data.extras.data.groupPending;
                self.mylocations = data.data.extras.data.prof.location;
                self.mysports = data.data.extras.data.prof.sports;
                self.myProfile = data.data.extras.data.prof;
                return callback(true);
            });
        } else {
            return callback(true);
        }
        ;
    };

    this.uploadFile = function (file, type) {
        var url = "";
        if (type === "user") {
            url = API + "/genapi/upload";
        }
        if (type === "organizer") {
            url = API + "/genapi/postIMG";
        }
        var fd = new FormData();
        fd.append('pic', file);
        fd.append('action', 'fileupload');
        return $http.post(url, fd, {
            transformRequest: angular.identity,
            headers: {'processData': false, 'Content-Type': undefined}
        });
    };
	this.uploadProfilePic = function (file, type, userId, id, gid) {
        var url = API + "/genapi/upload";
        var fd = new FormData();
		fd.append('userId', userId);
		if(type === 'academy_user'){
			fd.append('aid', id);
		}
		if(type === 'tournament_user'){
			fd.append('tid', id);
			fd.append('gid', gid);
		}		
		fd.append('pic', file);
        fd.append('action', 'fileupload');		
        return $http.post(url, fd, {
            transformRequest: angular.identity,
            headers: {'processData': false, 'Content-Type': undefined}
        });
    };	
    this.uploadLogo = function (file, id) {
        var url = API + "/genapi/postLogo";
        var fd = new FormData();
        fd.append('pic', file);
        fd.append('iid', id);
        fd.append('action', 'fileupload');
        return $http.post(url, fd, {
            transformRequest: angular.identity,
            headers: {'processData': false, 'Content-Type': undefined}
        });
    };
    this.uploadImage = function (file, iid, type) {
        var url = API + "/genapi/postGenImg";
        var fd = new FormData();
        fd.append('pic', file);
        fd.append('iid', iid);
        fd.append('type', type);
        fd.append('action', 'fileupload');
        return $http.post(url, fd, {
            transformRequest: angular.identity,
            headers: {'processData': false, 'Content-Type': undefined}
        });
    };
    this.gMap = function (lat, lng) {
        var uluru = {lat: lat, lng: lng};
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 15,
            center: uluru,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        var infowindow = new google.maps.InfoWindow();
        var marker = new google.maps.Marker({
            position: uluru,
            map: map
        });
        var i; // dont know what this is
        google.maps.event.addListener(marker, 'click', (function (marker, i) {
            return function () {
                infowindow.setContent($scope.eventDetail.facility.name);
                infowindow.open(map, marker);
            }
        })(marker, i));
        return;
    };
    this.getLocation = function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        }
        function showPosition(position) {
            if (position && position.coords) {
                self.lat = position.coords.latitude;
                self.long = position.coords.longitude;
                // console.log(position.coords.latitude);
                // console.log(position.coords.longitude);
            }
        }
    };
    this.getLastFromString = function () {
        url = window.location.href.split('?')[0];
        var items = url.split("-");
        return(items[items.length - 1]);
    };
    this.getLastFromURL = function () {
        url = window.location.href.split('?')[0];
        var items = url.split("/");
        return(items[items.length - 1]);
    };
});
//not in use as of now
sharedServicesModule.directive('checkImage', function ($http) {
    "ngInject";
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            attrs.$observe('ngSrc', function (ngSrc) {
                console.log("source is ");
                console.log(ngSrc);
                if (!angular.isDefined(obj) || obj === null) {
                    {
                        {
                            // home.IMGURL
                        }
                    }
                    / uploads /
                    element.attr('src', 'http://upload.wikimedia.org/wikipedia/commons/7/73/Lion_waiting_in_Namibia.jpg'); // set default image
                    return pimg;
                } else {
                    return obj;
                }
                $http.get(ngSrc).success(function () {
                    alert('image exist');
                }).error(function () {
                    alert('image not exist');
                    element.attr('src', 'http://upload.wikimedia.org/wikipedia/commons/7/73/Lion_waiting_in_Namibia.jpg'); // set default image
                });
            });
        }
    };
});
