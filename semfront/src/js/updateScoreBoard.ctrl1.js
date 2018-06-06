(function() {
    angular.module("sem")
    .controller("ScoreBoardCtrl", Controller)
    .directive('integer', [function() {
        return {
            require: 'ngModel',
            link: function(scope, ele, attr, ctrl) {
                ctrl.$parsers.unshift(function(viewValue) {
                    return parseInt(viewValue, 10);
                });
            }
        };
    }])
	.directive('customDialogBox', [function(){
		return {
			restrict: 'E',
			scope: {
				eid : "=",
				dialogMsg : "@",
				dialogShow: "="					
			},
			template: "<div class='cDialogBoxContainer' ng-show='dialogShow'><div class='cDialogBoxContent'><p>{{dialogMsg}}</p><div class='cDialogBoxGoBackBtn stdBtn'>Go back to Scoring page</div><div class='cDialogBoxOkBtn stdBtn'>More Changes?</div></div></div>",
			link : function(scope, elem, attrs){
				jQuery(".cDialogBoxOkBtn").on("click", function(){
					scope.$apply(function(){
						scope.dialogShow = false;
					});
				});
				jQuery(".cDialogBoxGoBackBtn").on("click", function(){
					window.location = "/cricket/score.html?eid="+ scope.eid +"&type=E";
				});
			}	
		}
	}]);
	
    function Controller(GeneralService) {
        var self = this;
		self.qry = GeneralService.getParam("id"); // eventid
        self.confirm = {
			dialogMsg : "Sample dialog box",
			dialogShow: false
		};
		self.loadEventDetails = loadEventDetails;
        self.change = change;
        self.cancel = cancel;
        self.resetQuery = resetQuery;
        self.rollbackChanges = rollbackChanges;
        self.commit = commit;
        self.outTypeChanged = outTypeChanged;
		self.isMobileDevice = (function (a) {
			if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) {
				return true;
			} else {
				return false;
			}
		})(navigator.userAgent || navigator.vendor || window.opera);
		
		if(!angular.isUndefinedOrNull(self.qry))
			self.loadEventDetails();
		
        function loadEventDetails() {
            // for testing - 5929d2690996d22c5c6cb5a1
            GeneralService.loadEventWithPlayers(self.qry).then(function(response) {
                if (response.data.extras.data.event) {
                    self.eventData = response.data.extras.data.event;

                    var opponent1 = self.eventData.members.filter(function(group) {
                        if (group._id != self.eventData.score.score.innings[0].id) {
                            return true;
                        } else {
                            return false;
                        }
                    })[0];
                    self.opponent1 = opponent1.users.map(function(member) {
                        return {
                            id: member.uid,
                            name: member.userName
                        }
                    });

                    var opponent2 = self.eventData.members.filter(function(group) {
                        if (group._id != self.eventData.score.score.innings[1].id) {
                            return true;
                        } else {
                            return false;
                        }
                    })[0];
                    self.opponent2 = opponent2.users.map(function(member) {
                        return {
                            id: member.uid,
                            name: member.userName
                        }
                    });
                } else {
                    // error handling
                }
            });
        }

        function resetQuery(form) {
            form.$setPristine();
            form.$setUntouched();
            self.qry = null;
            self.eventData = null;
        }

        function change(formCtrl) {
            if (formCtrl.$viewValue != formCtrl.$modelValue) {
                console.log(formCtrl.$viewValue + " " + formCtrl.$modelValue);
            }
        }

        function cancel(e) {
            if (e.keyCode === 27) {
                self.scoreBoardForm.$rollbackViewValue();
            }
        }

        function rollbackChanges() {
            self.scoreBoardForm.$rollbackViewValue();
        }

        function commit() {
            self.isUpdating = true;
			
			for(var i=0; i<self.eventData.score.score.innings.length; i++){
				// Set SR for batsman
				for(var j=0; j<self.eventData.score.score.innings[i].batting.length; j++){
					var batsman = self.eventData.score.score.innings[i].batting[j];
					var SR = ((batsman.total * 100) / batsman.balls).toFixed(2);
					if (isNaN(SR)) {
						SR = 0;
					}
					self.eventData.score.score.innings[i].batting[j].SR = SR;
				}
				// Set Eco for bowler
				for(var j=0; j<self.eventData.score.score.innings[i].bowling.length; j++){
					var bowler = self.eventData.score.score.innings[i].bowling[j];
					var Eco = 0;
					var blsp = 1 / 6 * bowler.balls;
					if (bowler.over_count === 0 && blsp === 0) {
						Eco = 0;
					} else {
						Eco = bowler.runs / (bowler.over_count + blsp);
						Eco = Math.round(Eco * 100) / 100;
					}
					self.eventData.score.score.innings[i].bowling[j].Eco = Eco;
				}
			}
			
            // Call save scorecard api here..
            GeneralService.saveGame({"scid":self.eventData.scid, "score":self.eventData.score.score}, self.eventData).then(function(response) {
                if (response.data.success) {
					self.confirm.dialogMsg  = "Scorecard updated successfully!!";
					self.confirm.dialogShow = true;
                    // alert('Scorecard updated successfully!!');
                } else {
					self.confirm.dialogMsg  = "Something went wrong!!";
					self.confirm.dialogShow = true;
                    // alert('Something went wrong!!');
                }
            }).finally(function() {
                self.isUpdating = false;
            });
        }

        function outTypeChanged(batsman) {
            console.log('onOutTypeChanged called');
            if (!batsman.outObj.type) {
                batsman.outObj = null;
                batsman.batting = true;
            } else {
                batsman.batting = false;
            }
        }
    }
})();