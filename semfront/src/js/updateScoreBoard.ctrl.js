(function() {
    angular.module("sem")

    .controller("ScoreBoardCtrl", Controller)

    .directive('integer', function() {
        return {
            require: 'ngModel',
            link: function(scope, ele, attr, ctrl) {
                ctrl.$parsers.unshift(function(viewValue) {
                    return parseInt(viewValue, 10);
                });
            }
        };
    });

    function Controller(GeneralService) {

        /**
         * Variables
         */
        var self = this;

        // for testing
        //self.qry = "5929d2690996d22c5c6cb5a1";

        /**
         * Functions' index
         */
        self.loadEventDetails = loadEventDetails;
        self.change = change;
        self.cancel = cancel;
        self.resetQuery = resetQuery;
        self.rollbackChanges = rollbackChanges;
        self.commit = commit;
        self.outTypeChanged = outTypeChanged;

        /**
         * Functions' implementation
         */

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
            //console.log(JSON.stringify({"scid": self.qry, "score": self.eventData.score.score }, null, 8));
            // Call save scorecard api here..
            GeneralService.saveGame({ "scid": self.eventData.scid, "score": self.eventData.score.score }, self.eventData).then(function(response) {
                if (response.data.success) {
                    alert('Scorecard updated successfully.');
                } else {
                    alert('Something went wrong!');
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