;
function detailsService($http, API, auth, $window) {
    "ngInject";
    
    var self = this;
    var uid = auth.getID();
    this.loadDetails = function (id, type) {
        //var id = getParam("id");
        if (type === "E") {
            return $http.get(API + '/eventapi/eventDetails?eid=' + id);
        }
        if (type === "F") {
            return $http.get(API + '/facilityapi/facDetails?facID=' + id);
        }
        if (type === "D") {
            return $http.get(API + '/discapi/details?did=' + id);
        }
        if (type === "S") {
            return $http.get(API + '/userapi/getSportsDetails?sport=' + id + '&uid=' + uid);
        }
    };

}
function detailsCtrl(detailsService, auth, GeneralService, $window, ngDialog) {
    "ngInject";

    var self = this;
    var uid = auth.getID();
    self.user = auth.getUserDetails();
    self.id = GeneralService.getParam("id");
    self.type = GeneralService.getParam("type");
    if(self.id === null) {
        if(self.type === "S"){
            self.id = GeneralService.getLastFromURL();
        }else {
            self.id = GeneralService.getLastFromString();
        }
    }
    
    function handleData(result) {
        if (self.type === "F") {
            self.details = result.data.extras.data.facility;
            if (self.details.loc) {
                GeneralService.gMap(self.details.loc[1], self.details.loc[0]);
            }
        }
        if (self.type === "E") {
            self.details = result.data.extras.data.event;
            if (self.details.facility) {
                if (self.details.facility.loc) {
                    GeneralService.gMap(self.details.facility.loc[1], self.details.facility.loc[0]);
                }
            }
        }
        if (self.type === "D") {
            self.details = result.data.extras.data.disc;
        }

        if (self.type === "S") {
            self.details = result.data.extras.data;
        }

        //self.message = res.data.message;
    }
    self.loadDetails = function () {
        detailsService.loadDetails(self.id, self.type)
                .then(handleData);
    };
    self.loadDetails();

    self.homeCreateDiscussion = function (data, type) {
        GeneralService.homeDiscussionData = data;
        GeneralService.homeDiscussionType = type;
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

    self.homeCreateEvent = function (data) {
        console.log('calling');
        console.log(data);
        GeneralService.homeEventData = data;
        ngDialog.open({
            template: '/dialogs/create-home-event.html',
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
        GeneralService.userid = uid;

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
    self.likeThisItem = function (index, type, itemId) {
        var likeData = {
            uid: uid,
            iid: itemId,
            type: type,
            like: true
        };

        GeneralService.likeItems(likeData).then(function (result) {
            if (result.data.success == true) {
                if (self.details.likeCount) {
                    self.details.likeCount = parseInt(self.details.likeCount) + 1;
                } else {
                    self.details.likeCount = 1;
                }
            } else {
                //alert(result.data.extras.msg.message);
            }
            //self.subsCount = result.data.extras.data.items
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
}

angular.module('sem')
        .service('detailsService', detailsService)
        .controller('Details', detailsCtrl);