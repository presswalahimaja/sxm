;
function authInterceptor(API, auth) {
    "ngInject";
    return {
        // automatically attach Authorization header
        request: function (config) {
            var token = auth.getToken();
            if (config.url.indexOf(API) === 0 && token) {
                config.headers.Authorization = token;
            }
            return config;
        },
        // If a token was sent back, save it
        response: function (res) {
            if (res.config.url.indexOf(API) === 0 && res.headers('token') && res.headers('reset')) {
                auth.saveToken(res.headers('token'));
            }
            return res;
        }
    };
}

function authService($window) {
    "ngInject";
    var self = this;
    self.isAuthed = function () {
        var token = self.getToken();
        if (token) {
            var params = self.parseJwt(token);
            return Math.round(new Date().getTime() / 1000) <= params.exp;
        } else {
            return false;
        }
    };
    self.logout = function () {
        $window.localStorage.removeItem('jwtToken');
        $window.location.href = "/login.html";
    };
    self.saveToken = function (token) {
        $window.localStorage['jwtToken'] = token;
    };
    self.getToken = function () {
        if (self.token) {
            return self.token;
        } else {
            self.token = $window.localStorage['jwtToken'];
            return self.token;
        }
    };
    self.parseJwt = function (token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse($window.atob(base64));
    };
    self.getID = function () {
        var token = self.getToken();
        if (angular.isUndefined(token) || token === null) {
            if(($window.location.href.indexOf("CricketScoreView") >=0) || ($window.location.href.indexOf("youtube") >=0) || ($window.location.href.indexOf("organization") >=0) || ($window.location.href.indexOf("tournament")>=0) || ($window.location.href.indexOf("view") >=0)){
                //console.log("stay")
            }else
            {
                $window.location.href = "/login.html";
            }
        } else {
            return((self.parseJwt(token)).id);
        }
    };
    self.getUserDetails = function () {
        var token = self.getToken();
        if (angular.isUndefined(token) || token === null) {
            if(($window.location.href.indexOf("view") >=0) || ($window.location.href.indexOf("CricketScoreView") >=0) || ($window.location.href.indexOf("youtube") >=0) || ($window.location.href.indexOf("organization") >=0) || ($window.location.href.indexOf("tournament")>=0)){
                console.log("stay")
            }else
            {
                $window.location.href = "/login.html";
            }
        } else {
            return(self.parseJwt(token));
        }
    };
}

function userService($http, API, auth) {
    "ngInject";
    var self = this;
	
	this.getCity = function(){
		return $http.get(API + '/listapi/listcity');
	};
    this.register = function (type, username, fName, lName, pswd, sports, lat, long, userCities) {			
        var user = {
            fName: fName,
            lName: lName,
            pswd: pswd,
            sports: sports,
			location: userCities
        };
		
		if(type === "email")
			user.email = username;
		else
			user.mobile = username;
		
        if(lat && long){
            user.lat = lat;
            user.long = long;
        };
        return $http.post(API + '/userapi/register', user);
    };
    this.login = function (username, password) {
        return $http.post(API + '/userapi/login', {
            userName: username,
            pswd: password
        });
    };
	this.sendReset = function(username, check){
		return $http.post(API + '/userapi/sendReset', {
            userName: username,
            check: check
        });
	};
	this.resetPassword = function(id, password, reset){
		return $http.post(API + '/userapi/resetPassword', {
            id: id,
            password: password,
			reset: reset
        });
	};
    this.loadHome = function () {
        var id = auth.getID();
        return $http.get(API + '/userapi/getHomeA?uid=' + id);
    };

}

angular.module('sem')
        .factory('authInterceptor', authInterceptor)
        .service('user', userService)
        .service('auth', authService)
        .config(function ($httpProvider) {
            "ngInject";
            $httpProvider.interceptors.push('authInterceptor');
        });
       