;
function getParameterByName(name, url) {
    if (!url)
        url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
    if (!results)
        return null;
    if (!results[2])
        return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
function getLastFromString(url){
    if (!url)
        url = window.location.href;
    var items = url.split("-");
    return(items[items.length-1]);
}
function profileViewService($http, API, auth, $window) {
    "ngInject";
    var userInfo = auth.getUserDetails();
    var id = userInfo.id;
    var self = this;
    this.loadDetails = function () {
        var fid = getParameterByName('uid');
        if(fid == null){
            fid = getLastFromString();
        }
        return $http.get(API + '/userapi/viewProfile?fid=' + fid);
    };
}
function profileViewCtrl(auth, GeneralService, profileViewService, ngDialog) {
    "ngInject";
    var userInfo = auth.getUserDetails();
    var id = userInfo.id;
	var fid = getParameterByName('uid');
	if(fid == null){
		fid = getLastFromString();
	}
    var self = this;
	self.userTournamentStats = [];
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
        self.uid = id;
        self.userprofile = result.data.extras.data;
        self.professions = ['Student', 'Working professional', 'Household activities', 'Sports professional', 'Retired', 'Sports coach'];
        self.expertise = ['Beginner', 'Intermediate', 'Expert'];
        self.frequency = ['Daily', 'Frequently', 'Weekend', 'Occasionally'];
        if (self.userprofile !== null && (self.userprofile.pic === null || self.userprofile.pic === undefined)){
            self.userprofile.defaultpic = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxAQDg4QDxAQDxAQEA8OEA4PEA8QDRAPGRIXFhUSFRYYICkgGBolGxUVITEhJSkrLy4uFx8zODMtNygtLisBCgoKBQUFDgUFDisZExkrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrK//AABEIAOEA4QMBIgACEQEDEQH/xAAbAAEAAwEBAQEAAAAAAAAAAAAABQYHBAMBAv/EADwQAAIBAgIGBwYEBAcAAAAAAAABAgMRBAUGEiExQXETIjJRYYGRQlJyobHBYqKy0SM0c/AkM1NjksLS/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/ANxAAAAAAAAAAAAAAfGyNxud4eldSqRlJexFqUvRbgJMFSraZ+5Qb8ZTS+STOV6YVuFOmueswLuCkLTCvxp03/yR00dM1fr0GvGM0/k0gLcCKwWeYerbVqRjLZ1JtRly27yUTvu2gfQAAAAAAAAAAAAAAAAAAAAAAAAAAODM8zp4eDlUfKMe3LkjxzzN44aF9kqktkId/i/Az/FYiVWbnUetJ8fslwQEjmmkFas5JS6OntWpG2s14viRIAAAAAAAJbLM/rUHFa2vT3dHK2zlIiQBpOVZrSxMdam3sdnGVlNPl3EiZTh68qc4zg9Wa3P+96L9kGcxxMLO0asEteP3XgBMAAAAAAAAAAAAAAAAAAAAAByZhi40ac6krdWLaTfafBLmdZSNM8ep1I0YvZTu5+Mnay8l9QIPHYyVarOpNbX7N7pLgl4I8AAAAAAAAAAAAAHthMTKlUhUg2pRabS9pLen4M8QBp2W46NelCpHdLhe9nxR2FG0NxzhWdJy6lRdVd01b6r6F5AAAAAAAAAAAAAAAAAAADyr1VCMpPdFNvkZfiarnUqTe+UpTfm7l/0nq6uDrtcUoeskvuZ2gAAAAAAAAAAAAAAAAEKjjJSjvi01zTujVaFVTjGS3SSa9LmVGgaJVnPCU774uUPJPZ8gJoAAAAAAAAAAAAAAAAAAQWmX8nP4qf6kUI0DS+N8FU8HTf50Z+AAAAAAAAAAAAAAAAALvoO/8LL+tL9MSkF70LhbCX96pOX0X2AnwAAAAAAAAAAAAAAAAABx5rh+loVafvRaXPgZjJWbT4OxrRnOkmAdHEz92o5VY257V6gRYAAAAAAAAAAAAAAABpuU4VUqFOHFRTfxPf8AMoWQYLp8RCHsx68uS4eppQAAAAAAAAAAAAAAAAAAACE0nyzp6N1fXpKUobtvfF87E2fGBkwLRpVkbTdeim1K2vThHds7at8yrgAAAAAAAAAAAALLotkevKNetG0YtOnFrtP3n4brATGi2W9DR1px1alS7luulfYidPlj6AAAAAAAAAAAAAAAAAAAAAAfLFTzzRi96mGSjZXlS22b7493Is9evCnFynJQS4t2RBY7S2jBWpJ1ZcnGHq9oFIkmnJNNOPaTVmvIHfmmbzxDWvGnG3ZcYvX5NvecAAAAAAAPqTdrJtvcltb8j4dmW5nUw7bpqF378b/PeBPZFoxtU8Sk1vVL/wBfsW6MbJJcCrYDS+L2V4an4oXlH03on8FjqVaN6dRTWzdvXNcAOwAAAAAAAAAAAAAAAAAAADizLMYYeGvUfglHfJ9yQHTUqxim5SUUt7k7JFZzfSuMXKFBKo9q6S/VXL3iBzfOauIdm9Wm91NWtzb4sjQPfFYypVbdWcpvuk3qrktyPAAAAAAAAAAAAAB+6FWcHrQcoNcYtpv0PwALNlWlko6sa611/qLZNbeK4lsw2Jp1YqVOcZxfGLuZadOBx1WhLWpSt3repeDQGogh8kzyniVZXjUilrQls29670TAAAAAAAAAAAAADhzTMI4elKpLbbYo3tKT4JAeWc5tDDQu3eck9SG27f2Rn+Nxk61SVSo9su7cl3JcD7jcXKtUlObbu20ntUVwS8DnAAAAAAAAAAAAAAAAAAAAAAP1Tk4yjKLacbSi1sakXfR7PVX/AIdSyqq73NRnG+9ePgUY/UZOLTjJxad049pPvA1gEJo7nSxELStGrF7Y32yVu0ibAAAAAAAAA85ySTbdkldvwM6z3NHiarlt1Iq1NeHfzf7E9plmaUVh4PrNqVTvULbF5lQAAAAAAAAAAAAAAAAAAAAAAAAAAAD1weKlSqQqQdpRfquKfgzScuxsa1KFSO6SWzinxTMxJ3RPM+irdE+xVajyqcH53sBfQAAAAA8MTXUITnLYoRlJ8krnuVrTTGOFKFNb6ret8Ctf5tAVDG4p1qs6slZzd+S4LyVkeIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAnZ3W9bfMADRsgx3T4aE32tsZ/Enb57/MlCkaEYtxrTpN9WcXJL8aa+qv6F3AAAAZ9pXjOkxU48KXU897/AGL+5WVzLMZU16tWfvVJy/MwPIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHvgsS6VWE17Mk/LivQ1JO6MmZpWSYnpMNSl+FRfNbGB3n0+H0DizepqYavLuhJ/IzK5oukztg6/wpeskjOkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAL1oVO+Et7tSa+j+5RS6aCv+BVX+83+SP7AWYCwAidKP5Kvyj+pGdgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC6aCf5Nb+r/1iABZgAB//2Q==";
        }		
		if(angular.isUndefinedOrNull(self.userprofile.friends) || self.userprofile.friends.length == 0){
			self.userprofile.friends = [];
		}
		if(angular.isUndefinedOrNull(self.userprofile.groups) || self.userprofile.groups.length == 0){
			self.userprofile.groups = [];
		}
		if(angular.isUndefinedOrNull(self.userprofile.gallery) || self.userprofile.gallery.length == 0){
			self.userprofile.gallery = [];
		}
		if(angular.isUndefinedOrNull(self.userprofile.pages) || self.userprofile.pages.length == 0){
			self.userprofile.pages = [];
		}
        self.location = result.data.extras.data.location;
        self.spolvl = result.data.extras.data.prof.spolvl;

    }
    self.loadDetails = function () {
        profileViewService.loadDetails()
                .then(handleUsersData);
    };
    self.loadDetails();
	
	self.loadUserTournamentStats = function () {
		GeneralService.getUserTournamentStats(fid).then(function(response){
			var status = response.data ? response.data.success : null;
			if (status) {
				self.userTournaments = response.data.extras.data;
			}	
		});
	};
	self.loadUserTournamentStats();
	self.loadTournamentMatches = function (tid, team, index) {
		if(angular.isUndefinedOrNull(self.userTournamentStats[index])){
			GeneralService.getUserTournamentMatchStats(fid, tid, team).then(function(response){
				var status = response.data ? response.data.success : null;
				if (status) {
					self.userTournamentStats[index] = {};
					self.userTournamentStats[index].matches = response.data.extras.data;
					self.userTournamentStats[index].loaded = true;
				}	
			});
		}		
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

    self.addAsFriend = function (frdid) {
        var data = {
            uid: id,
            fid: frdid
        };

        GeneralService.addAsAFriend(data).then(function (result) {
            $('#add-' + frdid).hide();
            console.log('success');
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

}
angular.module('sem')
        .service('profileViewService', profileViewService)
        .controller('profileView', profileViewCtrl);