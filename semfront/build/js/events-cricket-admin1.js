/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function EventsAdminCtrl(auth, GeneralService, $scope, $timeout, $window, $interval, ngDialog, $templateCache) {
    var self = this;
    self.isAdmin = true;
    self.uid = auth.getID();
    self.doSave = false;
    self.eid = GeneralService.getParam("id"); // eventid
    self.scorecard;
    self.showInnBtn = false;
    self.showInnings = false;
    self.currInning = 0; // current innings index
    self.batIndex = null; //index of batting team
    self.bowlIndex = null; //index of batting team
    self.batsmanIndex = []; // current playing batsmans
    self.currBattingPlayer = [];
    self.strikeIndex = null; // index of batsman on strike, must be reset once a plyer is our or new innings started. 
    self.nsIndex = null; // non strike index
    self.strikeBat = null; // strike batsman
    self.nonStrikeBat = null; // non strike batsman
    self.strikeBowl = null; // strike bowler
    self.currBatting = null; // current batting team
    self.currBowling = null; // current bowling team;
    self.prevBatting = null;
    self.prevBowling = null;
    self.bowlerStrikeIndex = null; // current bowler index
    self.lastBowlerStrikeIndex = null; // last bowler index
    self.ballCount = 0; // current over ball count;
    self.setExtra = null; // for extras
    self.extraType = null;
    self.extraType = null;
    self.teams = []; // local teams array
    self.showControls = true; // make false if game is over
    self.scoreAdded = true;
    self.matchResult = {};
    self.isOfficial = {};
    self.runsPerOver = [];
    self.wickets;
    self.confirm = {
		dialogMsg: "Sample dialog box",
		dialogShow: false,
		setPlaying11Flag : true,
		resultType: '',
		isOffline: false,
		imgRefreshTime: new Date().getTime()
    };
    self.officialRoles = [{'role': 'Umpire', 'code': 'U'}, {'role': 'Referee', 'code': 'R'}, {'role': 'Commentator', 'code': 'C'}, , {'role': 'Scorer', 'code': 'S'}];
	self.finishOptions = [
		{type:'Abandoned', code:'abandoned', showOption:true, winnerShow:false, winnerReq:false, summaryShow:false, summaryReq:false}, 
		{type:'Bye', code:'bye', showOption:true, winnerShow:true, winnerReq:true, summaryShow:false, summaryReq:false},
		{type:'Draw', code:'draw', showOption:true, winnerShow:false, winnerReq:false, summaryShow:true, summaryReq:true},
		{type:'Tie', code:'draw', showOption:false, winnerShow:false, winnerReq:false, summaryShow:true, summaryReq:true},
		{type:'Super Over', code:'concluded', showOption:false, winnerShow:true, winnerReq:true, summaryShow:false, summaryReq:false},		
		{type:'DL', code:'concluded', showOption:false, winnerShow:true, winnerReq:true, summaryShow:false, summaryReq:false}
	];
	self.isMobile = (function (a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) {
            return true;
        } else {
            return false;
        }
    })(navigator.userAgent || navigator.vendor || window.opera);
	
    // Load current event details
    GeneralService.loadEventWithPlayersEdit(self.eid).then(function (results) {
        if (typeof results === "object") {
            self.event = results.data.extras.data.event;
        } else {
            results = JSON.parse(results);
            self.event = results;
        }
		if(self.event.wickets){
			self.wickets = self.event.wickets - 1;
		}else {
			self.event.wickets = 11;
			self.wickets = 10;
		}
        self.loadOfficials();
        self.scid = self.event.scid;
		
        // init local variables 
        self.loadLocals();
        var lat = 22.2844062;
        var lng = 73.1996624;
        // GeneralService.gMap(lat, lng);
		
    });

    // Load tournament officials
    self.loadOfficials = function () {
       if(self.event.tournament){
        GeneralService.getTournamentOfficials(self.event.tournament.tid).then(function (results) {
            var status = results.data ? results.data.success : null;
            if (status) {
                if (!angular.isUndefinedOrNull(results.data.extras.data.officials) && results.data.extras.data.officials.length > 0) {
                    self.officials = results.data.extras.data.officials;

                    if (!angular.isUndefinedOrNull(self.event.officials) && self.event.officials.length > 0) {
                        var offRoles = self.officialRoles.map(function (obj) {
                            return obj.code;
                        });
                        angular.forEach(self.event.officials, function (off1, offInd1) {
                            off1.role = self.officialRoles[offRoles.indexOf(off1.officialRole)].role;
                        });
                    } else {
                        self.event.officials = [];
                    }
                } else {
                    self.officials = [];
                    self.event.officials = [];
                }
            }
        });
     }
    };

    // load local variables once data is loaded from server. 
    self.loadLocals = function () {
        // load data if scorecard already exist
        if (self.event.scid) {
            if (self.event.score.score) {
                var scorecardtemp = self.event.score.score;
                self.scorecard = new Scorecard(self.eid, self.event.scid);
                self.scorecard.setInning(0, new Team(scorecardtemp.innings[0].id, scorecardtemp.innings[0].name));
                self.scorecard.setInning(1, new Team(scorecardtemp.innings[1].id, scorecardtemp.innings[1].name));
                self.scorecard.innings[0].setTeam(scorecardtemp.innings[0]);
                self.scorecard.innings[1].setTeam(scorecardtemp.innings[1]);
                for (var i = 0; i < scorecardtemp.innings[0].batting.length; i++) {
                    if (!angular.isUndefinedOrNull(scorecardtemp.innings[0].batting[i])) {
                        self.scorecard.innings[0].batting[i] = new Batsman(scorecardtemp.innings[0].batting[i].id, scorecardtemp.innings[0].batting[i].name);
                        self.scorecard.innings[0].batting[i].setBatsman(scorecardtemp.innings[0].batting[i]);
                    }
                }
                for (var i = 0; i < scorecardtemp.innings[0].bowling.length; i++) {
                    if (!angular.isUndefinedOrNull(scorecardtemp.innings[0].bowling[i])) {
                        self.scorecard.innings[0].bowling[i] = new Bowler(scorecardtemp.innings[0].bowling[i].id, scorecardtemp.innings[0].bowling[i].name);
                        self.scorecard.innings[0].bowling[i].setBowler(scorecardtemp.innings[0].bowling[i]);
                    }
                }
                for (var i = 0; i < scorecardtemp.innings[1].batting.length; i++) {
                    if (!angular.isUndefinedOrNull(scorecardtemp.innings[1].batting[i])) {
                        self.scorecard.innings[1].batting[i] = new Batsman(scorecardtemp.innings[1].batting[i].id, scorecardtemp.innings[1].batting[i].name);
                        self.scorecard.innings[1].batting[i].setBatsman(scorecardtemp.innings[1].batting[i]);
                    }
                }
                for (var i = 0; i < scorecardtemp.innings[1].bowling.length; i++) {
                    if (!angular.isUndefinedOrNull(scorecardtemp.innings[1].bowling[i])) {
                        self.scorecard.innings[1].bowling[i] = new Bowler(scorecardtemp.innings[1].bowling[i].id, scorecardtemp.innings[1].bowling[i].name);
                        self.scorecard.innings[1].bowling[i].setBowler(scorecardtemp.innings[1].bowling[i]);
                    }
                }
                if (self.event.participants[0].pid === self.event.toss.pid) {
                    if (self.event.toss.decision === "Bat") {
                        self.batIndex = 0;
                        self.bowlIndex = 1;
                    } else {
                        self.batIndex = 1;
                        self.bowlIndex = 0;
                    }
                } else {
                    if (self.event.toss.decision === "Bat") {
                        self.batIndex = 1;
                        self.bowlIndex = 0;
                    } else {
                        self.batIndex = 0;
                        self.bowlIndex = 1;
                    }
                }
                if (self.scorecard.innings[1].batting.length > 0 || self.scorecard.innings[0].overs == self.event.overs) {
                    self.currInning = 1;
                    var temp = self.batIndex;
                    self.batIndex = self.bowlIndex;
                    self.bowlIndex = temp;
                    self.currBatting = self.scorecard.innings[1];
                    self.currBowling = self.scorecard.innings[0];
                    self.prevBatting = self.scorecard.innings[0];
                    self.prevBowling = self.scorecard.innings[1];
                } else {
                    self.currInning = 0;
                    self.currBatting = self.scorecard.innings[0];
                    self.currBowling = self.scorecard.innings[1];
                }

                self.teams[0] = {'id': self.event.participants[0].pid, 'name': self.event.participants[0].name, 'players': self.event.participants[0].playingEleven};
                self.teams[1] = {'id': self.event.participants[1].pid, 'name': self.event.participants[1].name, 'players': self.event.participants[1].playingEleven};
				
                // disable already selected players
                /* var batIds = self.currBatting.batting.map(function (obj) {
                    return obj.balls > 0 ? obj.id : null;
                });
                angular.forEach(self.teams[self.batIndex].players, function (item, index) {
                    if (batIds.indexOf(item.uid) > -1)
                        item.batted = true;
                }); */
                var bowIds = self.currBowling.bowling.map(function (obj) {
                    return obj.id;
                });
                angular.forEach(self.teams[self.bowlIndex].players, function (item, index) {
                    if (bowIds.indexOf(item.uid) > -1)
                        item.bowled = true;
                });

                if (self.currBowling.over_count == 0 && self.currBowling.balls == 0) {
                    self.newbowler = self.currBowling;
                }
                /* if (self.currInning === 1) {
                 self.prevBatting = self.scorecard.innings[self.bowlIndex];
                 self.prevBowling = self.scorecard.innings[self.batIndex];
                 }*/
                for (var i = 0; i < self.currBatting.batting.length; i++) {
                    if (self.currBatting.batting[i].batting) {
                        self.batsmanIndex.push(i);
                        self.currBattingPlayer.push(self.currBatting.batting[i]);
                    }
                }
                self.ballCount = self.currBatting.balls; // current over ball count;

                self.strikeIndex = scorecardtemp.SI; // index of batsman on strike, must be reset once a plyer is our or new innings started. 
                if (self.batsmanIndex[0] == self.strikeIndex) {
                    self.nsIndex = self.batsmanIndex[1];
                } else {
                    self.nsIndex = self.batsmanIndex[0];
                }
                self.strikeBat = self.currBatting.batting[self.strikeIndex];
                self.nonStrikeBat = self.currBatting.batting[self.nsIndex]; // non strike batsman
                self.bowlerStrikeIndex = scorecardtemp.BSI; // current bowler index
                self.lastBowlerStrikeIndex = scorecardtemp.LBSI; // last bowler index 
                self.strikeBowl = self.currBowling.bowling[self.bowlerStrikeIndex]; // strike bowler
                if (angular.isUndefinedOrNull(self.event.result)) {
                    self.checkGame();
                }else{
					self.team1CRR = self.calculateCRR(self.scorecard.innings[0]);
					self.team2CRR = self.calculateCRR(self.scorecard.innings[1]);
				}
				
                scorecardtemp = null;
				self.calculateRunsPerOver();
				var timer = $interval(function(){
					if (angular.isUndefinedOrNull(self.event.result)){
						self.calculateRunsPerOver();
					}else
						 $interval.cancel(timer);
				}, 5000);				
            }
        }
		
		// Result status
		if (!angular.isUndefinedOrNull(self.event.result)) {
			self.mom = {};
			self.matchResult.matchStatus = self.event.result.matchStatus;
			if (!angular.isUndefinedOrNull(self.event.result.winner)) {
				self.matchResult.pid = self.event.result.winner.pid
				self.matchResult.pName = self.event.result.winner.name;
			}
			self.matchResult.by = self.event.result.by;
			if (!angular.isUndefinedOrNull(self.event.result.mom)) {
				self.mom.uid = self.event.result.mom.uid;
				self.mom.userName = self.event.result.mom.name;
			}
			if(!angular.isUndefinedOrNull(self.scorecard)){
				self.allplayers = self.event.participants[0].playingEleven.map(function(obj){
					return {'uid':obj.uid, 'userName':obj.userName, 'team':self.event.participants[0].name};
				});
				self.allplayers = self.allplayers.concat(self.event.participants[1].playingEleven.map(function(obj){
					return {'uid':obj.uid, 'userName':obj.userName, 'team':self.event.participants[1].name};
				}));
			}
		}		
		
        // check for Playing 11
		if (self.scid){
			if(angular.isUndefinedOrNull(self.event.participants[0].playingEleven) || angular.isUndefinedOrNull(self.event.participants[1].playingEleven)) {
                self.confirm.setPlaying11Flag = true;
			}else{
                self.confirm.setPlaying11Flag = false;
            }
        }

        // toss not done yet, init toss object.
        if (self.scid && angular.isUndefinedOrNull(self.event.toss)) {
            self.event.toss = {};
        }

        // toss done but innings not started
        if (!angular.isUndefinedOrNull(self.event.toss) && angular.isUndefinedOrNull(self.scorecard)) {
            if (self.event.overs)
                self.showInnBtn = true;
            else
                self.showInnBtn = false;

            self.teams[0] = {'id': self.event.participants[0].pid, 'name': self.event.participants[0].name, 'players': self.event.participants[0].playingEleven};
            self.teams[1] = {'id': self.event.participants[1].pid, 'name': self.event.participants[1].name, 'players': self.event.participants[1].playingEleven};
        }
		self.allteams = [];
		self.allteams.push({'id':self.event.participants[0].pid, 'name':self.event.participants[0].name});
		self.allteams.push({'id':self.event.participants[1].pid, 'name':self.event.participants[1].name});
    };

    self.range = function (n) {
        if (!angular.isUndefinedOrNull(n)) {
            return new Array(parseInt(n));
        }
    };

    // Start Match
    self.startMatch = function () {
		self.confirm.btnDisable = true;
        if (!self.scorecard) { // only if it is not set
			var dataObj = {'eid': self.eid};
			if(!angular.isUndefinedOrNull(self.event.tournament))
				dataObj.tid = self.event.tournament.tid;
			
            GeneralService.startMatch(dataObj).then(function success(response) {
				var status = response.data ? response.data.success : null;
                if (status) {
					self.scid = response.data.extras.data.scid;
					self.confirm.btnDisable = false;
				} else {
					self.confirm.btnDisable = false;
				}
            }, function error(response) {
				console.log(response);
				self.confirm.btnDisable = false;	
			});
        }
    };

	// Popup call - init
	self.openPlayingElevenPopupInit = function () {
		GeneralService.match = {};
        GeneralService.match.eid = self.eid;
        if(self.event.tournament){
		GeneralService.match.tid = self.event.tournament.tid;
         }
        GeneralService.match.participants = self.event.participants;
		GeneralService.match.members = self.event.members;		
        ngDialog.open({
            template: 'setPlaying11',
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
	
	// Popup call
	self.openPlayingElevenPopup = function (teamno) {
		GeneralService.match = {};
        GeneralService.match.eid = self.eid;
        if(self.event.tournament){
		GeneralService.match.tid = self.event.tournament.tid;
         }
        GeneralService.match.participants = self.event.participants;
		GeneralService.match.members = self.event.members;		
        GeneralService.match.teamno = teamno;
		ngDialog.open({
            template: 'setPlaying11',
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
	
    // Set default Playing squad - all players
    self.setDefaultSquad = function () {
		self.confirm.btnDisable = true;
        self.setPlayingSquad(self.event.members[0].users, self.event.participants[0], "team1");
        self.setPlayingSquad(self.event.members[1].users, self.event.participants[1], "team2");
    };
	
	// Set Playig 11
	$scope.$on('playingElevenSet', function () {
		self.event.participants[0].playingEleven = GeneralService.match.players[0];
		self.event.participants[1].playingEleven = GeneralService.match.players[1];
		self.teams[0] = {'id': self.event.participants[0].pid, 'name': self.event.participants[0].name, 'players': self.event.participants[0].playingEleven};
        self.teams[1] = {'id': self.event.participants[1].pid, 'name': self.event.participants[1].name, 'players': self.event.participants[1].playingEleven};
		self.confirm.setPlaying11Flag = false;
		self.event.toss = {};
		GeneralService.match = {};
		self.updateTime();
    });
	
	// Add new player in playing 11
	$scope.$on('addPlayerInPlaying11', function () {
		var dataObj = {'eid': self.eid, 'gid': GeneralService.match.pid};
		if(GeneralService.match.players.length > 0){
			dataObj.playingEleven = GeneralService.match.players.map(function (obj) {
				return obj.uid;
			});
		}
		GeneralService.playingEleven(dataObj).then(function success(response) {
            var status = response.data ? response.data.success : null;
            if (status) {
				console.log("Playing 11 set.!!");
				if(GeneralService.match.pid === self.event.participants[0].pid){
					self.event.participants[0].playingEleven = GeneralService.match.players;
					self.teams[0].players = self.event.participants[0].playingEleven;
				}else{
					self.event.participants[1].playingEleven = GeneralService.match.players;
					self.teams[1].players = self.event.participants[1].playingEleven;
				}
				GeneralService.match = {};
			}else{
				console.log("Error in adding new player in Playing 11.");
				GeneralService.match = {};
			}
			self.confirm.isOffline = false;
		}, function error(response){
			self.confirm.btnDisable = false;
			self.confirm.isOffline = true; // offline mode
			self.confirm.dialogMsg = "You are currently offline. Check your internet connection!!";
			self.confirm.dialogShow = true;
		});		
    });
	
    // Set Playing Squads
    self.setPlayingSquad = function (players, team, teamno) {
		self.confirm.btnDisable = true;
        var dataObj = {'eid': self.eid, 'gid': team.pid};
		if(players.length > 0){
			dataObj.playingEleven = players.map(function (obj) {
				return obj.uid;
			});
		}
		
        GeneralService.playingEleven(dataObj).then(function success(results) {
            var status = results.data ? results.data.success : null;
            if (status) {
				team.playingEleven = players;
                if (teamno == "team2"){
					self.confirm.setPlaying11Flag = false;					
					self.event.toss = {};
				}
				self.confirm.btnDisable = false;	
			} else {
				self.confirm.btnDisable = false;
			}
			self.confirm.isOffline = true;
        }, function error(response) {
			self.confirm.btnDisable = false;
			self.confirm.isOffline = true; // offline mode
			self.confirm.dialogMsg = "You are currently offline. Check your internet connection!!";
			self.confirm.dialogShow = true;
		});
    };
    self.setIsBatted = function(){
       var tmp =  self.teams[self.batIndex].players;
       for(var i = 0;i < tmp.length;i++){
           delete tmp[i].batted;
           for(var j = 0; j < self.currBatting.batting.length; j++){
               if (self.currBatting.batting[j].id == tmp[i].uid){
                   if((self.currBatting.batting[j].outObj && self.currBatting.batting[j].outObj.type !== "RR") || self.currBatting.batting[j].outObj == null){
						tmp[i].batted = true;
					}
                }
           }
       }
    };
	self.setIsBowled = function(){
       var tmp =  self.teams[self.bowlIndex].players;
       for(var i = 0;i < tmp.length;i++){
           delete tmp[i].bowled;
		   if(self.strikeBowl.id == tmp[i].uid)
			   tmp[i].bowled = true;
       }
    };
	
	// Select Player - New batsman
	self.selectPlayer = function (players, pid, gid, changePlayer, index, selPlayer) {
        GeneralService.match = {};
		GeneralService.match.players = players;
            if(self.event.tournament){
		GeneralService.match.tid = self.event.tournament.tid;
         }
		GeneralService.match.pid = pid;
		GeneralService.match.gid = gid;
        if(changePlayer !== undefined && changePlayer !== null){
			GeneralService.changePlayer = changePlayer;
			GeneralService.changePlayerInd = index;
			GeneralService.match.selPlayer = {'uid':selPlayer.id, 'userName':selPlayer.name};
		}	
		ngDialog.open({
            template: 'selPlayer',
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

	// Set players
	self.setPlayers = function (batsmen, bowlers, pid, gid, team) {
		GeneralService.match = {};
		GeneralService.match.batsmen = batsmen;
		GeneralService.match.bowlers = bowlers;
            if(self.event.tournament){
               GeneralService.match.tid = self.event.tournament.tid;
            }
		GeneralService.match.pid = pid;
		GeneralService.match.gid = gid;
		GeneralService.match.team = team;
		ngDialog.open({
            template: 'setPlayers',
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
	
	// Select batsman on out event
	self.selectBatsman = function (players, pid, gid) {
		GeneralService.match = {};
		GeneralService.match.players = players;
		GeneralService.match.currBatting = self.currBatting;
		GeneralService.match.currBattingPlayer = self.currBattingPlayer;
		GeneralService.match.batsmanIndex = self.batsmanIndex;
            if(self.event.tournament){
		GeneralService.match.tid = self.event.tournament.tid;
         }
		GeneralService.match.pid = pid;
		GeneralService.match.gid = gid;
		ngDialog.open({
            template: 'selBatsman',
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
	
	// Select batsman and bowler when batsman out on last ball event
	self.selectBatsmanBowler = function (batsmen, bowlers, pid, gid) {
		GeneralService.match = {};
		GeneralService.match.batsmen = batsmen;
		GeneralService.match.currBatting = self.currBatting;
		GeneralService.match.currBattingPlayer = self.currBattingPlayer;
		GeneralService.match.batsmanIndex = self.batsmanIndex;
		GeneralService.match.bowlers = bowlers;
		GeneralService.match.currBowling = self.currBowling;
            if(self.event.tournament){
		GeneralService.match.tid = self.event.tournament.tid;
         }
		GeneralService.match.pid = pid;
		GeneralService.match.gid = gid;
		ngDialog.open({
            template: 'selBatsmanBowler',
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
	
	// Select bowler on over complete
	self.selectBowler = function (players, pid, gid) {
		GeneralService.match = {};
		GeneralService.match.players = players;
		GeneralService.match.currBowling = self.currBowling;
		GeneralService.match.currBatting = self.currBatting;
		if(self.event.tournament){
			GeneralService.match.tid = self.event.tournament.tid;
        }
		GeneralService.match.pid = pid;
		GeneralService.match.gid = gid;
		ngDialog.open({
            template: 'selBowler',
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
	
	// Set Player in Match
	$scope.$on('setPlayerInMatch', function () {
		if(GeneralService.changePlayer === true){
			self.changePlayer(GeneralService.changePlayerInd, GeneralService.match.selectedPlayer);
		}else{
			self.currBatting.addBatsman(GeneralService.match.selectedPlayer.uid, GeneralService.match.selectedPlayer.userName, new Date().getTime());
			self.currBattingPlayer.push(self.currBatting.batting[self.currBatting.batting.length-1]);
			self.batsmanIndex.push(self.currBatting.batting.length - 1);
		}
		self.strikeIndex = self.currBatting.batting.map(function(obj){
			return obj.id;
		}).indexOf(GeneralService.match.selectedPlayer.uid);
		self.setStrike(self.strikeIndex);
		GeneralService.match = {};
		GeneralService.changePlayer = null;
		GeneralService.changePlayerInd = -1;
        self.setIsBatted();
	});

	// Set players on Inning start
	$scope.$on('setPlayersOnInningStart', function () {
		// on-strike
		self.currBatting.addBatsman(GeneralService.match.onstrike.uid, GeneralService.match.onstrike.userName, new Date().getTime());
		self.currBattingPlayer.push(self.currBatting.batting[self.currBatting.batting.length-1]);
		self.batsmanIndex.push(self.currBatting.batting.length - 1);
		
		// non-strike
		self.currBatting.addBatsman(GeneralService.match.nonstrike.uid, GeneralService.match.nonstrike.userName, new Date().getTime());
		self.currBattingPlayer.push(self.currBatting.batting[self.currBatting.batting.length-1]);
		self.batsmanIndex.push(self.currBatting.batting.length - 1);
		
		// bowler
		self.currBowling.addBowler(GeneralService.match.bowler.uid, GeneralService.match.bowler.userName, new Date().getTime());
         self.setStrike(0);	
         self.setBowlingStrike(0);
		
		GeneralService.match = {};
		GeneralService.changePlayer = null;
		GeneralService.changePlayerInd = -1;
        self.setIsBatted();
		self.setIsBowled();
	});
	
	// set Batsman in Match
	$scope.$on('setBatsmanInMatch', function () {
		self.setStrike(GeneralService.match.strikeIndex);
		self.setIsBatted();
		GeneralService.match = {};
	});

	// set Batsman in Match
	$scope.$on('setBatsmanBowlerInMatch', function () {
		self.setStrike(GeneralService.match.strikeIndex);
		self.setIsBatted();
		self.setBowlingStrike(GeneralService.match.bowlerIndex);
		self.setIsBowled();		
		GeneralService.match = {};
	});	
	
	// set Bowler in Match
	$scope.$on('setBowlerInMatch', function () {
		self.setBowlingStrike(GeneralService.match.bowlerIndex);
		self.setIsBowled();
		GeneralService.match = {};
	});	
	
    // Toss
    self.setToss = function () {
        if (self.event.participants[0].pid === self.event.toss.pid) {
            self.event.toss.pid = self.event.participants[0].pid;
            self.event.toss.name = self.event.participants[0].name;
        } else {
            self.event.toss.pid = self.event.participants[1].pid;
            self.event.toss.name = self.event.participants[1].name;
        }
        var data = {
            eid: self.eid,
            uid: self.uid,
            toss: self.event.toss
        };
        if (data.toss.decision && data.toss.pid) {
            // save toss data
            GeneralService.setToss(data).then(function (results) {
                var status = results.data ? results.data.success : null;
                if (status) {
                    console.log("Toss done");
					self.showInnBtn = true;
                }
            });
        }
    };
	
	// Set overs & wickets
	self.setMatchInfo = function () {
		self.confirm.btnDisable = true;
		GeneralService.editMatch({'eid': self.eid, 'overs': self.event.overs, 'wickets': self.event.wickets}).then(function success(response) {
            var status = response.data ? response.data.success : null;
            if (status) {
                self.showInnBtn = false;
				self.showInnings = true;
				self.wickets = self.event.wickets - 1;
				self.confirm.btnDisable = false;
            } else {
				self.confirm.btnDisable = false;
			}
        }, function error(response) {
			console.log(response);
			self.confirm.btnDisable = false;
		});
	};
	
    // Add officials on the match
    self.addEventOfficial = function (official) {
		self.confirm.btnDisable = true;
        GeneralService.addEventOfficial({'tid': self.event.tournament.tid, 'eid': self.event._id, 'officialId': official.user.uid, 'officialRole': official.role.code}).then(function success(response) {
            var status = response.data ? response.data.success : null;
            if (status) {
                self.event.officials.push({'uid': official.user.uid, 'userName': official.user.userName, 'officialRole': official.role.code, 'role': official.role.role});
                self.newOfficial = {};
                self.isOfficial.submitted = false;
				self.confirm.btnDisable = false;
            } else {
				self.confirm.btnDisable = false;
			}
			self.confirm.isOffline = false;
        }, function error(response) {
			self.confirm.btnDisable = false;
			self.confirm.isOffline = true; // offline mode
			self.confirm.dialogMsg = "You are currently offline. Check your internet connection!!";
			self.confirm.dialogShow = true;
		});
    };
	
	// Remove official from the match
	self.removeEventOfficial = function (officialId) {
		self.confirm.btnDisable = true;
		GeneralService.removeEventOfficial({'eid':self.event._id, 'officialId':officialId}).then(function success(response) {
			var status = response.data ? response.data.success : null;
            if (status) {
				var ind = self.event.officials.map(function (obj) {
					return obj.uid;
				}).indexOf(officialId);
				self.event.officials.splice(ind, 1);
				self.confirm.btnDisable = false;
				self.confirm.remOfficial = {};
            } else {
				self.confirm.btnDisable = false;
			}
			self.confirm.isOffline = false;
		}, function error(response) {
			self.confirm.btnDisable = false;
			self.confirm.isOffline = true; // offline mode
			self.confirm.dialogMsg = "You are currently offline. Check your internet connection!!";
			self.confirm.dialogShow = true;
		});	
	};
	
    // Cancel offical
    self.cancelEventOfficial = function () {
        $timeout(function () {
            angular.element('#addEventOff').trigger('click');
        }, 100);
        self.newOfficial = {};
        self.isOfficial.submitted = false;
    };
	
	// Add event video
	self.addEventVideo = function () {
		self.confirm.btnDisable = true;
		var vID = self.eventVideoLink.split('v=')[1].split('&')[0];
        GeneralService.addEventVideo({'eid': self.event._id, 'link':vID, 'type':'youtube'}).then(function success(response) {
            var status = response.data ? response.data.success : null;
            if (status) {
				self.eventVideoLink = null;
                self.confirm.vSubmitted = false;
				self.confirm.btnDisable = false;
            } else {
				self.confirm.btnDisable = false;
			}
			self.confirm.isOffline = false;
        }, function error(response) {
			self.confirm.btnDisable = false;
			self.confirm.isOffline = true; // offline mode
			self.confirm.dialogMsg = "You are currently offline. Check your internet connection!!";
			self.confirm.dialogShow = true;
		});
	};
	
	// Cancel Event Video 
	self.cancelEventVideo = function () {
		$timeout(function () {
            angular.element('#addEventVideoLink').trigger('click');
        }, 100);
        self.eventVideoLink = null;
        self.confirm.vSubmitted = false;
	};
	
	// Cancel Add player in team
	self.addPlayerInTeamCancel = function (ele) {
        $timeout(function () {
            angular.element('#' + ele).trigger('click');
        }, 100);
    };
	
	// Set Youtube page integration flag
	self.setYoutubeFlag = function (page) {
		self.confirm.btnDisable = true;
		GeneralService.setYoutubeFlag({'eid': self.event._id, 'page': page}).then(function success(response) {
			var status = response.data ? response.data.success : null;
            if (status) {
				self.event.youtubeFlag = page;
				self.confirm.btnDisable = false;
			}
            self.confirm.isOffline = false;
        }, function error(response) {
			self.confirm.btnDisable = false;
			self.confirm.isOffline = true; // offline mode
			self.confirm.dialogMsg = "You are currently offline. Check your internet connection!!";
			self.confirm.dialogShow = true;
		});
	};
	
    // start innings
    self.startInnings = function () {
        self.showInnBtn = false;
        self.showInnings = false;
        self.scorecard = new Scorecard(self.eid, self.event.scid);
        self.setInnings(self.event.toss.decision, self.event.toss.pid);
		self.setPlayers(self.teams[self.batIndex].players, self.teams[self.bowlIndex].players, self.currBatting.id, self.teams[self.batIndex].id, self.teams[self.batIndex].name);
		var timer = $interval(function(){
			if (angular.isUndefinedOrNull(self.event.result)){
				self.calculateRunsPerOver();
			}else
				 $interval.cancel(timer);
		}, 5000);
	};

    // set innings
    self.setInnings = function (decision, tossID) {
        if (self.event.participants[0].pid === tossID) {
            if (decision === "Bat") {
                self.batIndex = 0;
                self.bowlIndex = 1;
            } else {
                self.batIndex = 1;
                self.bowlIndex = 0;
            }
        } else {
            if (decision === "Bat") {
                self.batIndex = 1;
                self.bowlIndex = 0;
            } else {
                self.batIndex = 0;
                self.bowlIndex = 1;
            }
        }
        self.teams[0] = {'id': self.event.participants[0].pid, 'name': self.event.participants[0].name, 'players': self.event.participants[0].playingEleven};
        self.teams[1] = {'id': self.event.participants[1].pid, 'name': self.event.participants[1].name, 'players': self.event.participants[1].playingEleven};
        self.scorecard.setInning(0, new Team(self.event.participants[self.batIndex].pid, self.event.participants[self.batIndex].name));
        self.scorecard.setInning(1, new Team(self.event.participants[self.bowlIndex].pid, self.event.participants[self.bowlIndex].name));
        self.currBatting = self.scorecard.innings[0];
        self.currBowling = self.scorecard.innings[1];
    };

    // Select Batsman
    self.changePlayer = function (index, player) {
        var playerID = self.currBatting.batting[index].id//required if player is changed without facing a ball
        self.currBatting.batting[index] = new Batsman(player.uid, player.userName, new Date().getTime());
		var ind = self.currBattingPlayer.map(function (obj) {
			return obj.id;
		}).indexOf(playerID);
		self.currBattingPlayer[ind] = self.currBatting.batting[index];
	};

    // Select Bowler
    /* self.selectBowler = function (index, player) {
        self.currBowling.bowling[index] = new Bowler(player.uid, player.userName);
        self.setBowlingStrike(index);
    }; */

    // set strike 
    self.setStrike = function (index) {
        self.strikeBat = self.currBatting.batting[index];
        self.strikeIndex = index;
        if (self.batsmanIndex[0] === index) {
            self.nsIndex = self.batsmanIndex[1];
            self.nonStrikeBat = self.scorecard.innings[self.currInning].batting[self.batsmanIndex[1]];
        } else {
            self.nsIndex = self.batsmanIndex[0];
            self.nonStrikeBat = self.scorecard.innings[self.currInning].batting[self.batsmanIndex[0]];
        }
    };

    // add new batsman
    /* self.addNewBatsman = function () {
        var batIds = self.currBatting.batting.map(function (obj) {
            return obj.balls > 0 ? obj.id : null;
        });
        angular.forEach(self.teams[self.batIndex].players, function (item, index) {
            if (batIds.indexOf(item.uid) > -1)
                item.batted = true;
        });
        var totalBatting = 0;
        for (var i = 0; i < self.currBatting.batting.length; i++) {
            if (self.currBatting.batting[i].batting === true) {
                totalBatting += 1;
            }
        }
        if (totalBatting < 2) {
            self.currBatting.addBatsman();
        }
    }; */

    // add new bowler
    /* self.addNewBowler = function () {
        var bowIds = self.currBowling.bowling.map(function (obj) {
            return obj.id;
        });
        angular.forEach(self.teams[self.bowlIndex].players, function (item, index) {
            if (bowIds.indexOf(item.uid) > -1)
                item.bowled = true;
        });
        self.currBowling.addBowler();
    }; */

    // set bowler strike
    self.setBowlingStrike = function (index) {
        self.strikeBowl = self.currBowling.bowling[index];
        self.bowlerStrikeIndex = index;
    };

    // add runs to scoreboard
    self.addScore = function (runs, type) {
        self.currBatting.addTrace({"runs": runs, "type": type});
        if (self.isStrikeSet()) {
            var thisBall = "";
            if (angular.isUndefinedOrNull(runs)) {
                runs = 0;
            }
            if (runs === 0 && !self.outType) {
                thisBall += runs;
            } else {
                thisBall += runs;
            }
            if (!angular.isUndefinedOrNull(type)) {
                thisBall += type;
            }
            if (self.outType) {
                thisBall += "W";
            }
            self.currBatting.currOver.push({"a": thisBall, "b": self.strikeIndex, "c": self.bowlerStrikeIndex});
            if (typeof runs === "string") {
                var mix = runs.substr(1, 2);
                if (mix === "LB" || mix === "BY") {
                    var tmpruns = parseInt(runs.substr(0, 1));
                    self.currBatting.addExtra(tmpruns, mix, type);
                    runs = 0;
                }
            }
            runs = parseInt(runs);

            if (!angular.isUndefinedOrNull(type)) {
                self.currBatting.addExtra(runs, type);
                if(type !== "PT"){
                    self.strikeBowl.addBowl(runs, type);
                }
                if (type === "NB") {
                    self.strikeBat.addRuns(runs);
                }
                if (type === "LB" || type === "BY") {
                    self.strikeBat.addRuns(0);
                }
                // switch strike for odd runs
               /* if (type !== "P") { // need to confirm about penalty strike change
                    if (runs === 1 || runs === 3 || runs === 5 || runs === 7) {
                        self.switchStrike();
                    }
                }*/
                if (type !== "WD" && type !== "NB" && type !== "PT") {
                    self.addBall();
                }
                var stRuns;
                        if(angular.isUndefinedOrNull(tmpruns) || (runs > tmpruns)){
                           stRuns = runs;
                        } else {
                           stRuns = tmpruns;
                        } 
                if ((stRuns === 1 || stRuns === 3 || stRuns === 5 || stRuns === 7) && type !== "PT") {
                    self.switchStrike();
                }
                self.clearExtra();
            } else {
                if (mix === "OT") {
                    self.strikeBat.addRuns(runs, true);
                } else {
                    self.strikeBat.addRuns(runs);
                }
                self.strikeBowl.addBowl(runs);
                self.currBatting.addRuns(runs);
                // switch strike for odd runs
                if (runs === 1 || runs === 3 || runs === 5 || runs === 7) {
                    self.switchStrike();
                }
                self.addBall();
            }
            if (self.scoreAdded) {
                self.doSave = true;
                self.checkGame();
            }
        } else {
			self.confirm.dialogMsg = "Please select batsman and bowler on strike!!";
			self.confirm.dialogShow = true;
        }
    };

    // Flush local data
    self.flushLocal = function () {
		if(!self.confirm.isOffline){
			GeneralService.removeLocal(self.event._id);
			window.location.reload();
		}else{
			self.confirm.btnDisable = false;
			self.confirm.dialogMsg = "You are currently offline. Check your internet connection!!";
			self.confirm.dialogShow = true;
		}        
    };
	
	// Go to Update score page
	self.goToUpdateScore = function () {
		if(!self.confirm.isOffline){
			window.location = "/UpdateScoreBoard1.html?eid="+ self.eid +"&type=E";
		}else{
			self.confirm.btnDisable = false;
			self.confirm.dialogMsg = "You are currently offline. Check your internet connection!!";
			self.confirm.dialogShow = true;
		}
	};
	
    // check game status
    self.checkGame = function () {
        self.scorecard.SI = self.strikeIndex;
        self.scorecard.BSI = self.bowlerStrikeIndex;
        self.scorecard.LBSI = self.lastBowlerStrikeIndex;
        self.event.score = {"_id": self.scid, "eid": self.event._id, "score": self.scorecard};
        self.event.scid = self.scid;
        if (self.doSave) {
            GeneralService.saveGame({"scid": self.scid, "uid": self.uid, "score": self.scorecard}, self.event).then(function success(response) {
				self.confirm.isOffline = false;
            }, function error(response) {
				self.confirm.btnDisable = false;
				if(!self.confirm.isOffline){
					self.confirm.isOffline = true; // offline mode
					self.confirm.dialogMsg = "You are currently offline. Check your internet connection!!";
					self.confirm.dialogShow = true;
				}
			});
            self.doSave = false;
        }
		self.setYetToBat();
		self.team1CRR = self.calculateCRR(self.scorecard.innings[0]);
		self.team2CRR = self.calculateCRR(self.scorecard.innings[1]);
        if (self.currInning === 1) { // Second inning			

            if ((self.prevBatting.score < self.currBatting.score) && ((self.currBatting.overs !== self.event.overs || self.currBatting.W !== self.wickets))) {
                self.mom = {};
                self.matchResult.pid = self.currBatting.id;
                self.matchResult.pName = self.currBatting.name;
				self.matchResult.by = (self.wickets - self.currBatting.W) + " wickets";
				self.matchResult.matchStatus = "concluded";
				self.confirm.dialogMsg = "Match is Over. Please click on Finish Match and select Man of the Match.";
				self.confirm.dialogShow = true;
				self.confirm.matchFinished = true;
				
			} else if (self.currBatting.overs == self.event.overs || self.currBatting.W === self.wickets) {
                self.mom = {};
                if (self.prevBatting.score < self.currBatting.score) {
                    self.matchResult.pid = self.currBatting.id;
                    self.matchResult.pName = self.currBatting.name;
					self.matchResult.by = (self.wickets - self.currBatting.W) + " wickets";
					self.matchResult.matchStatus = "concluded";
				} else if (self.prevBatting.score > self.currBatting.score) {
                    self.matchResult.pid = self.prevBatting.id;
                    self.matchResult.pName = self.prevBatting.name;
                    self.matchResult.by = (self.prevBatting.score - self.currBatting.score) + " runs";
					self.matchResult.matchStatus = "concluded";
				} else {
					self.matchResult.by = "Both innings score are equal. Select Finish match options to finish match.";
					self.matchResult.matchStatus = "draw";
				}
				
				self.confirm.dialogMsg = "Match is Over. Please click on Finish Match and select Man of the Match.";
				self.confirm.dialogShow = true;
				self.confirm.matchFinished = true;				
				
			} else {
				self.calculateRR();
			}
        }
        if (self.currInning === 0) { // first inning
			self.checkRR = "";
            if (self.currBatting.overs == self.event.overs || self.currBatting.W === self.wickets) { // do not use === as one is number and other string
				self.isSwitchInnings();
            }
        }
    };
	
	// Calculate Current Run Rate
	self.calculateCRR = function (inning) {
		var teamCRR = (inning.score / (inning.overs + (0.1666 * inning.balls))).toFixed(2);
		if (isNaN(teamCRR))
			teamCRR = 0;
		return teamCRR;
	}
	
	// Calculate Required Run Rate
	self.calculateRR = function () {
		var rruns  = self.scorecard.innings[0].score + 1 - self.scorecard.innings[1].score;
		var pballs = self.event.overs * 6 - (self.scorecard.innings[1].overs * 6 + self.scorecard.innings[1].balls);
		if(rruns < 0)
			rruns = 0;
		var RRR = ((rruns) / (pballs / 6)).toFixed(2);
		self.checkRR = "<strong>" + self.scorecard.innings[1].name + "</strong> needs " + rruns + " runs in " + pballs + " balls to win (" + RRR + ")";
	};
	
	// Calculate Yet To bat/Did not bat
	self.setYetToBat = function () {
		// Current batting Yet To Bat
		self.currBattingYTB = [];
		var currBatObj = self.currBatting.batting.map(function (obj) {
			return obj.name;
		});
		angular.forEach(self.teams[self.batIndex].players, function (player, index) {
			if (currBatObj.indexOf(player.userName) == -1)
				self.currBattingYTB.push(player);
		});
	
		// Team - 2 Yet to Bat
		self.prevBattingYTB = [];
		if(self.currInning === 1){ 
			var prevBatObj = self.scorecard.innings[0].batting.map(function (obj) {
				return obj.name;
			});
			angular.forEach(self.teams[self.bowlIndex].players, function (player, index) {
				if (prevBatObj.indexOf(player.userName) == -1)
					self.prevBattingYTB.push(player);
			});
		}
	};
	
	// Check Match Status
	/* self.checkMatchStatus = function () {
		if(angular.isUndefinedOrNull(self.matchResult.matchStatus) || self.matchResult.matchStatus == ""){
			if(angular.isUndefinedOrNull(self.scorecard.innings[1]) || (self.scorecard.innings[1].overs == 0 && self.scorecard.innings[1].balls == 0)){
				self.matchResult.matchStatus = "abandoned";
				self.confirm.hasResult = true;
				self.confirm.resultType  = "abd";
			}else{
				self.confirm.hasResult = false;
				self.confirm.resultType  = "dl";
			}
		}else if(self.matchResult.matchStatus === "concluded"){
			self.confirm.hasResult = true;
			self.confirm.resultType  = "con";
		}else if(self.matchResult.matchStatus === "abandoned"){
			self.confirm.hasResult = true;
			self.confirm.resultType  = "abd";
		}
	}; */
	
	// Checking DL Method type (Abondoned / Concluded)
	/* self.checkDLType = function (type) {
		if(type === 'abandoned'){
			self.matchResult.matchStatus = "abandoned";
			self.confirm.hasResult = true;
			self.confirm.resultType  = "abd";
		}else{
			self.allteams = [];
			self.allteams.push({'id':self.teams[0].id, 'name':self.teams[0].name});
			self.allteams.push({'id':self.teams[1].id, 'name':self.teams[1].name});
		}
	}; */
	
	// Cancel Finish Match
	/* self.cancelFinishMatch = function(){
		self.confirm.hasResult = false;
		self.confirm.resultType = null;
		self.matchResult.matchStatus = null;	
		self.confirm.dlType = null;
		self.confirm.submitted = null;
		self.confirm.dlWinner = null;
		self.confirm.dlRun = null;
	}; */
	
	// Save DL Method result
	/* self.saveDLResult = function () {
		self.confirm.btnDisable = true;
		self.matchResult.pid = self.confirm.dlWinner.id;
		self.matchResult.pName = self.confirm.dlWinner.name;
		self.matchResult.matchStatus = "concluded";
		self.matchResult.by = self.confirm.dlRun + " runs";
		self.saveResult();	
	}; */
	
	// Abondoned/Bye match
	/* self.finishMatchWithOptions = function (finishtype) {
		self.confirm.btnDisable = true;
		if(finishtype === 'abd')
			self.matchResult.matchStatus = "abandoned";
		else if(finishtype === 'bye'){
			self.matchResult.matchStatus = "bye";
			self.matchResult.pid = self.confirm.byeWinner.pid
			self.matchResult.pName = self.confirm.byeWinner.name;
		}
		self.saveResult();
	}; */
	
	/* self.checkFinishType = function () {
		self.confirm.resultType = self.finishType.code;
		self.allteams = [];
		self.allteams.push({'id':self.event.participants[0].pid, 'name':self.event.participants[0].name});
		self.allteams.push({'id':self.event.participants[1].pid, 'name':self.event.participants[1].name});
		self.confirm.showFinishBtns = true;
	}; */
	
	self.updateFinishOptions = function () {
		if(self.scorecard !== undefined){
			if(self.matchResult.matchStatus === 'draw'){
				angular.forEach(self.finishOptions, function(item, index){
					if(item.type === 'Abandoned' || item.type === 'Bye' || item.type === 'Draw'){
						item.showOption = false;
					}else{
						item.showOption = true;
					}
				});
				self.confirm.hideFinishOptions = false;
			}else if(self.matchResult.matchStatus === 'concluded'){
				self.confirm.hideFinishOptions = true;
			}else{
				angular.forEach(self.finishOptions, function(item, index){
					if(item.type === 'Abandoned' || item.type === 'Bye' || item.type === 'Draw' || item.type === 'DL'){
						item.showOption = true;
					}else{
						item.showOption = false;
					}
				});
			}
		}		
		self.focusCancelBtn();
	}
	
    // Save Match results
    self.saveResult = function () {		
		self.confirm.btnDisable = true;
        self.matchResult.eid = self.event._id;

		// status
		if(angular.isUndefinedOrNull(self.matchResult.matchStatus)){
			self.matchResult.matchStatus = self.finishType.code;
		}
		
		// by string	
		if(!angular.isUndefinedOrNull(self.finishType)){	
			switch(self.finishType.type){
				case 'Draw' : {
					self.matchResult.by = self.confirm.by;
					break;
				}
				case 'Tie' : {
					self.matchResult.matchStatus = self.finishType.code;
					self.matchResult.by = self.confirm.by;
					break;
				}
				case 'Bye' : {
					self.matchResult.matchStatus = self.finishType.code;
					self.matchResult.by = "BYE";
					break;
				}
				case 'Super Over' : {
					self.matchResult.matchStatus = self.finishType.code;
					self.matchResult.by = "Super Over";
					break;
				}
				case 'DL' : {
					self.matchResult.matchStatus = self.finishType.code;
					self.matchResult.by = "DL";
					break;
				}			
			}
		}
		
		if(self.event.tournament){
			self.matchResult.tid = self.event.tournament.tid;
		}
		console.log(self.matchResult);
		
		// Save scorecard - incase it's not saved in offline mode
		if(!angular.isUndefinedOrNull(self.scorecard)){
			GeneralService.saveGame({"scid": self.scid, "uid": self.uid, "score": self.scorecard}, self.event).then(function success(response) {
				self.doSave = false;
				self.confirm.isOffline = false;
			}, function error(response) {
				self.confirm.btnDisable = false;
				self.confirm.isOffline = true; // offline mode
				self.confirm.dialogMsg = "You are currently offline. Check your internet connection!!";
				self.confirm.dialogShow = true;
			});
		}
		
		// Finish match
		GeneralService.updateResult(self.matchResult).then(function success(response) {
			var status = response.data ? response.data.success : null;
			if (status) {
				self.event.result = self.matchResult;
				window.localStorage.removeItem(self.eid);
				if(!angular.isUndefinedOrNull(self.scorecard)){
					self.allplayers = self.event.participants[0].playingEleven.map(function(obj){
						return {'uid':obj.uid, 'userName':obj.userName, 'team':self.event.participants[0].name};
					});
					self.allplayers = self.allplayers.concat(self.event.participants[1].playingEleven.map(function(obj){
						return {'uid':obj.uid, 'userName':obj.userName, 'team':self.event.participants[1].name};
					}));
				}
				self.confirm.btnDisable = false;
			} else {
				self.confirm.btnDisable = false;
			}
			self.confirm.isOffline = false;
		}, function error(response) {
			self.confirm.btnDisable = false;
			self.confirm.isOffline = true; // offline mode
			self.confirm.dialogMsg = "You are currently offline. Check your internet connection!!";
			self.confirm.dialogShow = true;
		});
    
		// Re-Generate Fielding Stats
		GeneralService.regenerateFieldingStats({"tid":self.event.tournament.tid}).then(function success(response) {
            var status = response.data ? response.data.success : null;
			if(status){
				self.confirm.isOffline = false;
			}
        }, function error(response){
			console.log(response);
		});
	};
	
	self.focusCancelBtn = function () {
		$timeout(function() {
			var element = $window.document.getElementById("CancelMatchBtn");
			if(element){
				element.focus();
			}
		});		
	}
	
	// Cancel Finish Match action
	self.cancelFinishMatch = function(){
		console.log(self.confirm.hideFinishOptions)
		if(!angular.isUndefinedOrNull(self.finishType) && angular.isUndefinedOrNull(self.confirm.hideFinishOptions)){
			self.finishType = null;
			self.confirm.btnDisable = false;
			self.confirm.submitted = false;
			self.matchResult = {};
			self.confirm.by = null;
			self.confirm.winner = null;
		}
		self.confirm.showFinishOpt = false;
	}
	
	// Filter - group by mom team members
	self.groupTeamMembers = function(item){
		return item.team.indexOf(self.event.participants[0].name) > -1 ? self.event.participants[0].name : self.event.participants[1].name;
    };
	
    // Save MoM details
    self.saveMoM = function () {
		self.confirm.btnDisable = true;
            var resultObj = {
               'eid': self.event._id, 
               'momID': self.mom.uid, 
               'momName': self.mom.userName, 
               'matchStatus': self.matchResult.matchStatus
            }
            if(self.event.tournament){
               resultObj['tid'] = self.event.tournament.tid;
            }
        GeneralService.updateResult(resultObj).then(function success(response) {
            var status = response.data ? response.data.success : null;
            if (status) {
                self.event.result.mom = true;
                self.confirm.momFlag = false;
                window.localStorage.removeItem(self.eid);
                self.confirm.btnDisable = false;
            } else {
				self.confirm.btnDisable = false;
			}
			self.confirm.isOffline = false;
        }, function error(response) {
			self.confirm.btnDisable = false;
			self.confirm.isOffline = true; // offline mode
			self.confirm.dialogMsg = "You are currently offline. Check your internet connection!!";
			self.confirm.dialogShow = true;
		});
    };

    // Update User Stats
    self.updateUserStats = function () {
		self.confirm.btnDisable = true;
        var obj = {"scid": self.scid, "tid": self.event.tournament.tid};
        if (!angular.isUndefinedOrNull(self.event.organizer) && !angular.isUndefinedOrNull(self.event.organizer.id))
            obj.orgid = self.event.organizer.id;

        GeneralService.updateStats(obj).then(function success(response) {
            var status = response.data ? response.data.success : null;
            if (status) {
                window.localStorage.removeItem(self.eid);
                window.location.reload();
            } else {
				self.confirm.btnDisable = false;
			}
			self.confirm.isOffline = false;
        }, function error(response) {
			self.confirm.btnDisable = false;
			self.confirm.isOffline = true; // offline mode
			self.confirm.dialogMsg = "You are currently offline. Check your internet connection!!";
			self.confirm.dialogShow = true;
		});
    };

    // update Points Table
    self.updatePointsTable = function () {
		self.confirm.btnDisable = true;
        GeneralService.updatePointsTable({'eid':self.eid}).then(function success(response) {
            var status = response.data ? response.data.success : null;
            if (status) {
                window.localStorage.removeItem(self.eid);
                window.location.reload();
            } else {
				self.confirm.btnDisable = false;
			}
			self.confirm.isOffline = false;
        }, function error(response) {
			self.confirm.btnDisable = false;
			self.confirm.isOffline = true; // offline mode
			self.confirm.dialogMsg = "You are currently offline. Check your internet connection!!";
			self.confirm.dialogShow = true;
		});
    };

    // Calculate Runs per over
    self.calculateRunsPerOver = function () {
		self.runsPerOver = [];
		var innings = [];
		for (var i = 0; i < self.scorecard.innings.length; i++) {
			var inning = [];
			var total = 0, wicket = 0;
			for (var j = 0; j < self.scorecard.innings[i].overMap.length; j++) {
				var runs = 0, bowler = "", overmap = [];
				for (var k = 0; k < self.scorecard.innings[i].overMap[j].length; k++) {
					overmap.push(self.scorecard.innings[i].overMap[j][k].a);
					if (isNaN(self.scorecard.innings[i].overMap[j][k].a))
						runs += self.getRuns(self.scorecard.innings[i].overMap[j][k].a);
					else
						runs += parseInt(self.scorecard.innings[i].overMap[j][k].a);

					// bowler
					if (bowler == "") {
						var ind = (i == 0) ? 1 : 0;
						bowler = self.scorecard.innings[ind].bowling[self.scorecard.innings[i].overMap[j][k].c].name;
					}

					// wicket
					if (self.checkForWicket(self.scorecard.innings[i].overMap[j][k].a))
						wicket += 1;
				}
				total += runs;
				inning.push({'runs': runs, 'total': total, 'wicket': wicket, 'bowler': bowler, 'overmap': overmap});
			}
			if (self.scorecard.innings[i].currOver.length > 0) {
				var runs = 0, bowler = "", overmap = [];
				for (var j = 0; j < self.scorecard.innings[i].currOver.length; j++) {
					overmap.push(self.scorecard.innings[i].currOver[j].a);
					if (isNaN(self.scorecard.innings[i].currOver[j].a))
						runs += self.getRuns(self.scorecard.innings[i].currOver[j].a);
					else
						runs += parseInt(self.scorecard.innings[i].currOver[j].a);

					// bowler
					if (bowler == "") {
						var ind = (i == 0) ? 1 : 0;
						bowler = self.scorecard.innings[ind].bowling[self.scorecard.innings[i].currOver[j].c].name;
					}

					// wicket
					if (self.checkForWicket(self.scorecard.innings[i].currOver[j].a))
						wicket += 1;
				}
				total += runs;
				inning.push({'runs': runs, 'total': total, 'wicket': wicket, 'bowler': bowler, 'overmap': overmap});
			}
			innings.push(inning);
		}
		
		var len = (innings[0].length > innings[1].length) ? innings[0].length : innings[1].length;
		for(var i = 0; i < len; i++) {
			var obj = {};
			obj['over'] = i+1;
			if(i < innings[0].length){
				obj['team1'] = innings[0][i];
			}
			if(i < innings[1].length){
				obj['team2'] = innings[1][i];
			}
			self.runsPerOver.push(obj);
		}
	};

    // Translate extras and out runs
    self.getRuns = function (runs) {
        if (typeof runs === "string") {
            var extRuns = parseInt(runs.substr(0, 1));
            var extType = runs.substr(1, runs.length - 1);
            if (extType === "NB" || extType === "WD") {
                extRuns = extRuns + 1;
            }
            return extRuns;
        }
        return runs;
    };

    // Checks if over has wicket
    self.checkForWicket = function (runs) {
        if (typeof runs === "string") {
            var extType = runs.substr(1, runs.length - 1);
            if (extType === "W") {
                return true;
            }
        }
        return false;
    };

    // Returns wicket over
    self.getWicketOver = function (over) {
        var ovArray = over.split(".");
        var ov = parseInt(ovArray[0]);
        var bl = parseInt(ovArray[1]);
        if (bl > 0)
            ov += 1;
        return ov;
    };

    // clear extra runs
    self.clearExtra = function () {
        self.setExtra = null; // for extras
        self.extraType = null;
        self.extraRun = null;
    };

    // switch strike
    self.switchStrike = function (index) {
        if (!angular.isUndefinedOrNull(index)) {
            self.strikeBat = self.scorecard.innings[self.currInning].batting[index];
            self.strikeIndex = index;
            if (self.batsmanIndex[0] === index) {
                self.nsIndex = self.batsmanIndex[1];
                self.nonStrikeBat = self.scorecard.innings[self.currInning].batting[self.batsmanIndex[1]];
            } else {
                self.nsIndex = self.batsmanIndex[0];
                self.nonStrikeBat = self.scorecard.innings[self.currInning].batting[self.batsmanIndex[0]];
            }
        } else {
            if (self.batsmanIndex[0] === self.strikeIndex) {
                self.strikeBat = self.scorecard.innings[self.currInning].batting[self.batsmanIndex[1]];
                self.strikeIndex = self.batsmanIndex[1];
                self.nsIndex = self.batsmanIndex[0];
                self.nonStrikeBat = self.scorecard.innings[self.currInning].batting[self.batsmanIndex[0]];
            } else {
                self.strikeBat = self.scorecard.innings[self.currInning].batting[self.batsmanIndex[0]];
                self.strikeIndex = self.batsmanIndex[0];
                self.nsIndex = self.batsmanIndex[1];
                self.nonStrikeBat = self.scorecard.innings[self.currInning].batting[self.batsmanIndex[1]];
            }
        }
    };

    // check for strike set while adding runs
    self.isStrikeSet = function () {
        if ((self.strikeIndex === null || self.bowlerStrikeIndex === null || self.batsmanIndex.length !== 2) && angular.isUndefinedOrNull(self.outType)) {
            return false;
        } else {
            return true;
        }
    };

    // add ball in bowler account
    self.addBall = function () {
        self.ballCount += 1;
        if (self.ballCount === 6) {
            self.ballCount = 0;
            self.switchStrike();
            self.lastBowlerStrikeIndex = self.bowlerStrikeIndex;
            self.bowlerStrikeIndex = null;
			console.log("self.lastBowlerStrikeIndex " + self.lastBowlerStrikeIndex);
			console.log("self.bowlerStrikeIndex " + self.bowlerStrikeIndex);
			if(self.currBatting.overs < self.event.overs && !self.outType){
				self.selectBowler(self.teams[self.bowlIndex].players, self.currBowling.id, self.teams[self.bowlIndex].id);
			}
				
        }
    };

	self.dialogHandler = function () {
		self.confirm.dialogShow = false;
		if(self.confirm.switchInnings)
			self.switchInnings();
		if(self.confirm.matchFinished){
			$timeout(function() {
				var element = $window.document.getElementById("FinishMatchBtn");
				if(element){
					element.focus();
				}
			});
		}
	};	
	
	self.isSwitchInnings = function () {
		self.confirm.dialogMsg = "1st Innings Over. Do you want to continue second inning?";
		self.confirm.dialogShow = true;
		self.confirm.switchInnings = true;
	};
	
    // switch innings
    self.switchInnings = function () {
        self.prevBatting = self.currBatting;
        self.prevBowling = self.currBowling;
        //flush current indexes
        self.currInning = 1; // current innings index
        var temp = self.batIndex;
        self.batIndex = self.bowlIndex;
        self.bowlIndex = temp;
        self.batsmanIndex = []; // current playing batsmans
        self.currBattingPlayer = [];
        self.strikeIndex = null; // index of batsman on strike, must be reset once a plyer is our or new innings started. 
        self.nsIndex = null; // non strike index
        self.strikeBat = null; // strike batsman
        self.nonStrikeBat = null; // non strike batsman
        self.strikeBowl = null; // strike bowler
        self.currBatting = null; // current batting team
        self.currBowling = null; // current bowling team;
        self.newbatsman = null;
        self.newbowler = null;
        self.bowlerStrikeIndex = null; // current bowler index
        self.lastBowlerStrikeIndex = null;
        self.ballCount = 0; // current over ball count;
        self.setExtra = null; // for extras
        self.extraType = null;
        self.extraType = null;
        self.confirm.switchInnings = false;
		self.currBatting = self.scorecard.innings[1];
        self.currBowling = self.scorecard.innings[0];
		self.setPlayers(self.teams[self.batIndex].players, self.teams[self.bowlIndex].players, self.currBatting.id, self.teams[self.batIndex].id, self.teams[self.batIndex].name);
    };

    // out batsman
    self.tryOut = function () {
        self.currBatting.addTrace({"outType": self.outType, "outRuns": self.outRuns, "extratype": self.extraType, "outbat": self.outBat});
        if (!(self.strikeIndex === null || self.bowlerStrikeIndex === null || self.batsmanIndex.length !== 2)) {
            self.doScore = true;
            self.scoreAdded = false;
            if (!angular.isUndefinedOrNull(self.extraType)) {
                self.doScore = false;
                self.addScore(self.outRuns, self.extraType);
            }
            if (self.outType === "B") {
                if (self.isStrikeSet) {
                    self.out(self.strikeIndex, self.strikeBat, self.strikeBowl, self.outType);
                    self.strikeBowl.addWicket();
                    self.addScore(0); // to add balls to the batsman, need to revisit and improve
                } else {
					self.confirm.dialogMsg = "Strike not set!!";
					self.confirm.dialogShow = true;
                }
                self.clearOut();
            }
            if (self.outType === "CO") {
                if (self.fielder) {
                    if (self.isStrikeSet) {
                        if (self.strikeBowl.id === self.fielder.uid) {
                            // caught and bowl
                            self.outType = "CB";
                        } else {
                            self.outType = "CF"; // do not have wicket keeper identified, so till then CF;
                        }
                        self.out(self.strikeIndex, self.strikeBat, self.strikeBowl, self.outType, {"id": self.fielder.uid, "name": self.fielder.userName});
                        self.strikeBowl.addWicket();
                        self.addScore(0); // to add balls to the batsman, need to revisit and improve
                    } else {
						self.confirm.dialogMsg = "Strike not set!!";
						self.confirm.dialogShow = true;
                    }
                    self.clearOut();
                }
            }
            if (self.outType === "RO") {
                if (angular.isUndefinedOrNull(self.outRuns)) {
                    self.outRuns = 0;
                }
                if (self.fielder) {
                    var who = null;
                    if (self.isStrikeSet) {
                        var ROIndex;
                        if (self.outBat.id === self.strikeBat.id) {
                            ROIndex = self.strikeIndex;
                            who = self.strikeBat;
                        } else {
                            if (self.batsmanIndex[0] === self.strikeIndex) {
                                ROIndex = self.batsmanIndex[1];
                            } else {
                                ROIndex = self.batsmanIndex[0];
                            }
                            who = self.nonStrikeBat;
                        }
                        if (self.doScore) {
                            self.addScore(parseInt(self.outRuns)); // to add balls to the batsman, need to revisit and improve
                        }
                        self.out(ROIndex, who, self.strikeBowl, self.outType, {"id": self.fielder.uid, "name": self.fielder.userName});

                    } else {
						self.confirm.dialogMsg = "Strike not set!!";
						self.confirm.dialogShow = true;
                    }
                    self.clearOut();
                }
            }
            if (self.outType === "ST") {
                if (self.fielder) {
                    if (self.isStrikeSet) {
                        self.strikeBowl.addWicket();
                        self.out(self.strikeIndex, self.strikeBat, self.strikeBowl, self.outType, {"id": self.fielder.uid, "name": self.fielder.userName});
                        if (self.doScore) {
                            self.addScore(0); // to add balls to the batsman, need to revisit and improve
                        }
                    } else {
						self.confirm.dialogMsg = "Strike not set!!";
						self.confirm.dialogShow = true;
                    }
                    self.clearOut();
                }
            }
            if (self.outType === "HW") {
                if (self.isStrikeSet) {
                    self.strikeBowl.addWicket();
                    if (self.doScore) {
                        self.addScore(0); // to add balls to the batsman, need to revisit and improve
                    }
                    self.out(self.strikeIndex, self.strikeBat, self.strikeBowl, self.outType);

                } else {
                    self.confirm.dialogMsg = "Strike not set!!";
					self.confirm.dialogShow = true;
                }
                self.clearOut();
            }
            if (self.outType === "RT") {
                var who = null;
                if (self.isStrikeSet) {
                    var OutIndex;
                    if (self.outBat.id === self.strikeBat.id) {
                        OutIndex = self.strikeIndex;
                        who = self.strikeBat;
                    } else {
                        if (self.batsmanIndex[0] === self.strikeIndex) {
                            OutIndex = self.batsmanIndex[1];
                        } else {
                            OutIndex = self.batsmanIndex[0];
                        }
                        who = self.nonStrikeBat;
                    }
                    //pushing manually as no ball is counted for this
                    self.currBatting.currOver.push({"a": "0W", "b": OutIndex, "c": self.bowlerStrikeIndex});
                    self.out(OutIndex, who, self.strikeBowl, self.outType);
                } else {
					self.confirm.dialogMsg = "Strike not set!!";
					self.confirm.dialogShow = true;
                }
                self.clearOut();
            }
            if (self.outType === "RR") {
                if (self.isStrikeSet) {
                    var OutIndex;
                    if (self.outBat.id === self.strikeBat.id) {
                        OutIndex = self.strikeIndex;
                    } else {
                        if (self.batsmanIndex[0] === self.strikeIndex) {
                            OutIndex = self.batsmanIndex[1];
                        } else {
                            OutIndex = self.batsmanIndex[0];
                        }
                    }
                   // self.currBatting.batting[OutIndex].retired = true;
                    self.currBatting.batting[OutIndex].batting = false;
                    self.currBatting.batting[OutIndex].outObj = {type:"RR"};
                    var ind = self.currBattingPlayer.map(function (obj) {
                        return obj.id;
                    }).indexOf(self.outBat.id);
                    self.currBattingPlayer.splice(ind, 1);
                    if (self.batsmanIndex[0] === OutIndex) {
                        self.batsmanIndex = [self.batsmanIndex[1]];
                    } else {
                        self.batsmanIndex = [self.batsmanIndex[0]];
                    }
                    //pushing manually as no ball is counted for this
                    self.currBatting.currOver.push({"a": "0R", "b": OutIndex, "c": self.bowlerStrikeIndex});
                    var pElv = self.event.participants[self.currInning].playingEleven
                    for(var i = 0; i < pElv.length; i++){
                        if(pElv[i].uid == self.outBat.id){
                            delete pElv[i].batted;
                        };
                    }
                    //self.out(OutIndex, who, self.strikeBowl, self.outType);
                } else {
					self.confirm.dialogMsg = "Strike not set!!";
					self.confirm.dialogShow = true;
                }
                self.clearOut();
            }
            if (self.outType === "LB") {
                if (self.isStrikeSet) {
                    self.out(self.strikeIndex, self.strikeBat, self.strikeBowl, self.outType);
                    self.strikeBowl.addWicket();
                    self.addScore(0); // to add balls to the batsman, need to revisit and improve
                } else {
                    self.confirm.dialogMsg = "Strike not set!!";
					self.confirm.dialogShow = true;
                }
                self.clearOut();
            }
            if (self.outType === "HH") {
                if (self.isStrikeSet) {
                    self.out(self.strikeIndex, self.strikeBat, self.strikeBowl, self.outType);
                    self.addScore(0); // to add balls to the batsman, need to revisit and improve
                } else {
                    self.confirm.dialogMsg = "Strike not set!!";
					self.confirm.dialogShow = true;
                }
                self.clearOut();
            }
            if (self.outType === "OF" || self.outType === "HB") {
                var who = null;
                if (self.isStrikeSet) {
                    var OutIndex;
                    if (self.outBat.id === self.strikeBat.id) {
                        OutIndex = self.strikeIndex;
                        who = self.strikeBat;
                    } else {
                        if (self.batsmanIndex[0] === self.strikeIndex) {
                            OutIndex = self.batsmanIndex[1];
                        } else {
                            OutIndex = self.batsmanIndex[0];
                        }
                        who = self.nonStrikeBat;
                    }
                    self.out(OutIndex, who, self.strikeBowl, self.outType);
                    self.addScore(0); // to add balls to the batsman, need to revisit and improve
                } else {
                    self.confirm.dialogMsg = "Strike not set!!";
					self.confirm.dialogShow = true;
                }
                self.clearOut();
            }
            if (self.outType === "TO") {
                if (self.isStrikeSet) {
                    //pushing manually as no ball is counted for this
                    self.currBatting.currOver.push({"a": "0W", "b": self.strikeIndex, "c": self.bowlerStrikeIndex});
                    // self.addScore(0); // to add balls to the batsman, need to revisit and improve
                    self.out(self.strikeIndex, self.strikeBat, self.strikeBowl, self.outType);
                } else {
                    self.confirm.dialogMsg = "Strike not set!!";
					self.confirm.dialogShow = true;
                }
                self.clearOut();
            }
            if (self.outType === "AO") {
                if (self.isStrikeSet) {
                    //pushing manually as no ball is counted for this
                    self.currBatting.currOver.push({"a": "0W", "b": self.nsIndex, "c": self.bowlerStrikeIndex});
                    // self.addScore(0); // to add balls to the batsman, need to revisit and improve
                    self.out(self.nsIndex, self.nonStrikeBat, self.strikeBowl, self.outType, self.strikeBowl);
                } else {
                    self.confirm.dialogMsg = "Strike not set!!";
					self.confirm.dialogShow = true;
                }
                self.clearOut();
            }
            self.scoreAdded = true;
            self.doSave = true;
            self.checkGame();
			if(self.currBatting.W < self.wickets && !self.confirm.switchInnings && self.matchResult.matchStatus == undefined){
				if(self.ballCount === 0)
					self.selectBatsmanBowler(self.teams[self.batIndex].players, self.teams[self.bowlIndex].players, self.currBatting.id, self.teams[self.batIndex].id);
				else
					self.selectBatsman(self.teams[self.batIndex].players, self.currBatting.id, self.teams[self.batIndex].id);
			}
		} else {
            self.extraType = null;
            self.outType = null;
            self.setOut = null;
			self.confirm.dialogMsg = "Please select batsman and bowler on strike!!";
			self.confirm.dialogShow = true;
        }
    };

    // set out
    self.out = function (index, who, by, type, fielder) {
        //set strike index as per type of dismissal, for bowled, new batsman will be on strike, for catch strike must be selected.
        self.currBatting.batting[index].out(type, by, fielder);
        var ind = self.currBattingPlayer.map(function (obj) {
            return obj.id;
        }).indexOf(who.id);
        self.currBattingPlayer.splice(ind, 1);

        if (self.batsmanIndex[0] === index) {
            self.batsmanIndex = [self.batsmanIndex[1]];
        } else {
            self.batsmanIndex = [self.batsmanIndex[0]];
        }
        self.currBatting.addWicket(who);
    };

	//wicket bug
    self.cancelOut = function(){
        self.outType = null;
        self.outBat = null;
        self.outRuns = null;
    }
    // clear values
    self.clearOut = function () {
        self.strikeBat = null;
        self.strikeIndex = null;
        self.outBat = null;
        self.outRuns = null;
        self.fielder = null;
        self.outType = null;
        self.setOut = null;
        self.fielder = null;
        self.doScore = true;
    };

    self.clearOutOptions = function () {
        self.outBat = null;
        self.outRuns = null;
        self.fielder = null;
        self.outType = null;
        self.setOut = null;
        self.fielder = null;
        self.doScore = true;
    }; 

    // undo score
    self.undo = function () {
        self.currBatting.addTrace({"undo": true});
        //check if something is there to revert
        if ((self.currBatting.overMap.length === 0) && (self.currBatting.currOver.length === 0)) {
            console.log("nothing to revert");
            return false;
        }

        if (angular.isUndefinedOrNull(self.currBatting.currOver) || self.currBatting.currOver.length === 0) {
            self.currBatting.currOver = self.currBatting.overMap.pop();
        }
        //over was completed, bring last bowler back
        if (self.ballCount === 0 || angular.isUndefinedOrNull(self.ballCount)) {
            self.ballCount = 6;
            /*  if (!angular.isUndefinedOrNull(self.lastBowlerStrikeIndex)) {
             self.bowlerStrikeIndex = self.lastBowlerStrikeIndex; // bring back last bowler
             self.lastBowlerStrikeIndex = null;
             // self.strikeBowl = self.currBowling.bowling[self.bowlerStrikeIndex];
             //  self.switchStrike(); // rotate strike as well
             self.ballCount = 6;
             } else {
				self.confirm.dialogMsg = "can not undo!!";
				self.confirm.dialogShow = true;
				return false;
             }*/
        }
        var toRemove = null;
        var runsToRemove = null;
        /*if (self.currBatting.currOver.length > 0) {
         
         } else {
         
         }*/
        lastBall = self.currBatting.currOver.pop();
        toRemove = lastBall.a;
        self.switchStrike(lastBall.b);
        self.bowlerStrikeIndex = lastBall.c;
        self.strikeBowl = self.currBowling.bowling[lastBall.c];

        if (toRemove == "0" || toRemove == "1" || toRemove == "2" || toRemove == "3" || toRemove == "4" || toRemove == "5" || toRemove == "6" || toRemove == "7") {
            if (self.isStrikeSet()) {
                runsToRemove = parseInt(toRemove);
                // switch strike for odd runs
                /* if (runsToRemove === 1 || runsToRemove === 3 || runsToRemove === 5 || runsToRemove === 7) {
                 self.switchStrike();
                 }*/
                //remove runs
                self.strikeBat.removeRuns(runsToRemove);
                self.strikeBowl.removeBall(runsToRemove);
                self.currBatting.removeRuns(runsToRemove);

                self.ballCount -= 1;

            } else {
				self.confirm.dialogMsg = "Please select batsman and bowler on strike!!";
				self.confirm.dialogShow = true;
            }
        } else {
            runsToRemove = parseInt(toRemove.substr(0, 1));
            var mix = toRemove.substr(1, 2);
            var mix1 = toRemove.substr(3, 2);
            if (mix === "W" || mix1 === "W") {
                var outType = null;
                var wicket = self.currBatting.FOW.pop();
                for (var i = 0; i < self.currBatting.batting.length; i++) {
                    if (self.currBatting.batting[i].id == wicket.batsman.id) {
                        outType = self.currBatting.batting[i].outObj;
                        self.currBatting.batting[i].outObj = null;
                        self.currBatting.batting[i].batting = true;
                        self.currBatting.W -= 1;
                        if (self.batsmanIndex.length > 1) {
                            self.currBatting.batting.splice(self.currBatting.batting.length - 1, 1);
                            self.batsmanIndex.splice(1, 1);
                            self.currBattingPlayer.splice(self.currBatting.batting.length - 1, 1);
                        }
                        self.batsmanIndex.push(i);
                        self.currBattingPlayer.push(self.currBatting.batting[i]);
                        //remove last batsman if batsmanIndex is greater then 2
                        self.switchStrike(lastBall.b);
                        if (outType.type == "B" || outType.type == "CB" || outType.type == "CF" || outType.type == "ST" || outType.type == "HW" || outType.type == "LB") {
                            //   self.strikeIndex = i;
                            self.strikeBowl.wicket -= 1;
                            //  self.strikeBat = self.currBatting.batting[i];
                            if (mix !== "NB" && mix !== "WD") {
                                self.strikeBat.removeRuns(runsToRemove);
                                self.strikeBowl.removeBall(runsToRemove);
                                self.currBatting.removeRuns(runsToRemove);
                            }
                        }
                        if (outType.type == "RO") {
                            //   self.strikeIndex = i;
                            //  self.strikeBat = self.currBatting.batting[i];
                            if (mix !== "NB" && mix !== "WD") {
                                self.strikeBat.removeRuns(runsToRemove);
                                self.strikeBowl.removeBall(runsToRemove);
                                self.currBatting.removeRuns(runsToRemove);
                            }
                        }
                    }
                }
            }
            //retired, can be revived.
            if (mix === "R" || mix1 === "R") {
                //var wicket = self.currBatting.FOW.pop();
                        self.currBatting.batting[lastBall.b].outObj = null;
                        self.currBatting.batting[lastBall.b].batting = true;
                        self.currBatting.batting[lastBall.b].batting = true;
                        if (self.batsmanIndex.length > 1) {
                            self.currBatting.batting.splice(self.currBatting.batting.length - 1, 1);
                            self.batsmanIndex.splice(1, 1);
                            self.currBattingPlayer.splice(self.currBatting.batting.length - 1, 1);
                        }
                        self.batsmanIndex.push(lastBall.b);
                        self.currBattingPlayer.push(self.currBatting.batting[lastBall.b]);
            }
            if (mix === "WD" || mix === "NB" || mix === "LB" || mix === "BY") {
                self.strikeBowl.removeBall(runsToRemove, mix, mix1);
                var extraToRemove = 1 + runsToRemove;
                // switch strike for odd runs
                if (runsToRemove === 1 || runsToRemove === 3 || runsToRemove === 5 || runsToRemove === 7) {
                    //   self.switchStrike();
                }
                if (mix === "WD") {
                    self.currBatting.extras.wd -= extraToRemove;
                    self.currBatting.extras.runs -= extraToRemove;
                    self.currBatting.score -= extraToRemove;
                }
                if (mix === "NB") {
                    self.currBatting.extras.nb -= 1;
                    self.currBatting.extras.runs -= 1;
                    self.currBatting.score -= extraToRemove;
                    self.strikeBat.removeRuns(runsToRemove);
                }
                if (mix === "LB") {
                    self.currBatting.extras.lb -= runsToRemove;
                    self.currBatting.removeRuns(runsToRemove, mix1);
                    self.currBatting.extras.runs -= runsToRemove;
                    self.strikeBat.removeRuns(0);
                    if (mix1 === "NB") {
                        self.currBatting.extras.nb -= 1;
                        self.currBatting.extras.runs -= 1;
                        self.currBatting.score -= 1;
                    }
                }
                if (mix === "BY") {
                    self.currBatting.extras.b -= runsToRemove;
                    self.currBatting.removeRuns(runsToRemove);
                    self.strikeBat.removeRuns(0);
                    self.currBatting.extras.runs -= runsToRemove;
                }
                
                //remove runs

            }
            if (mix === "PT") {
                self.currBatting.extras.p -= runsToRemove;
                self.currBatting.extras.runs -= runsToRemove;
                self.currBatting.score -= runsToRemove;
            }
            if (mix === "OT") {
                runsToRemove = parseInt(toRemove);
                self.strikeBat.removeRuns(runsToRemove, mix);
                self.strikeBowl.removeBall(runsToRemove);
                self.currBatting.removeRuns(runsToRemove);
        }
            if (mix !== "WD" && mix !== "NB" && mix!== "PT") {
                self.ballCount -= 1;
            }
            /* if (!angular.isUndefinedOrNull(mix1)) {
             console.log("mix 1 is " + mix1);
             //remove mix
             } else {
             console.log("mix is " + mix);
             //remove extras or wicket
             }*/
        }

    };

	//front end validation for fielder check in case of ST, RO and CO
    self.checkFielder = function(){
        if(self.outType == "RO" || self.outType == "CO" || self.outType == "ST"){
            if(angular.isUndefinedOrNull(self.fielder)){
                return false;
            }else {
                return true;
            }
        }else {
            return true;
        }
    };

	// check strike, if not set show popup
    self.checkStrike = function(){
        if(self.isStrikeSet()){
            return true;
        }else {
            self.confirm.dialogMsg = "Please select batsman and bowler on strike!!";
            self.confirm.dialogShow = true;
            return false;
        }
    }
    
	// Reverse array
    self.reverseArray = function (array) {
        if (!angular.isUndefinedOrNull(array))
            return array.slice().reverse();
    };
	
	// Update time to refresh image when changed
	self.updateTime = function () {
		self.confirm.imgRefreshTime = new Date().getTime();
	}

}
;
function playerFilter() {
    return function (type, players, input) {
        var newList = [];
        if (type === 'bat') {
            for (var i = 0; i < input.length; i++) {

            }
        }
        return newList;
    };
}
;
angular.module('sem')
        .controller('CricketMaster', EventsAdminCtrl)
        .run(function($http, $templateCache) {
			$http.get('/dialogs/set-playing11.html').then(function (response){
				$templateCache.put('setPlaying11', response.data);
			});
			$http.get('/dialogs/set-players.html').then(function (response){
				$templateCache.put('setPlayers', response.data);
			});
			$http.get('/dialogs/select-player.html').then(function (response){
				$templateCache.put('selPlayer', response.data);
			});			
			$http.get('/dialogs/select-batsman-bowler.html').then(function (response){
				$templateCache.put('selBatsmanBowler', response.data);
			});
			$http.get('/dialogs/select-batsman.html').then(function (response){
				$templateCache.put('selBatsman', response.data);
			});
			$http.get('/dialogs/select-bowler.html').then(function (response){
				$templateCache.put('selBowler', response.data);
			});			
		})
		.directive('isNumber', function () {
            return {
                scope: {
                    ngModel: "=",
                    inputValueSet: "&",
                },
                link: function (scope, element, attr) {
                    scope.$watch(function () {
                        return scope.ngModel
                    }, function (newValue, oldValue) {
                        var arr = String(newValue).split("");
                        if (arr.length === 0)
                            return;
                        if (arr.length === 1 && (arr[0] == '-' || arr[0] === '.'))
                            return;
                        if (arr.length === 2 && newValue === '-.')
                            return;
                        if (isNaN(newValue)) {
                            scope.ngModel = "";
                        } else if (newValue !== oldValue) {
                            scope.inputValueSet();
                        }
                    });
                }
            };
        })
        .filter('playerFilter', playerFilter);
