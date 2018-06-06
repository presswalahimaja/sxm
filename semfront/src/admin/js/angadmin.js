var pimg = "default.jpg";
angular.isUndefinedOrNull = function (val) {
    return angular.isUndefined(val) || val === null;
};
function imgSizeFilter() {
    return function (input, size) {
        if (input) {
            var path = input.substr(0, 1) + "/" + input.substr(1, 2) + "/" + input.substr(3, 1) + "/" + input;
            var sz = "";
            if (size === 40) {
                sz = "-40x40.jpg";
            }
            if (size === 108) {
                sz = "-108x108.jpg";
            }
            return path + sz;
            /* var tokens = input.split(".");
             if (tokens[1]) {
             return tokens[0] + sz + tokens[1];
             } else {
             return tokens[0] + sz ;
             }*/
        } else {
            return "default.jpg";
        }
    };
}
angular.isUndefinedOrNull = function (val) {
    return angular.isUndefined(val) || val === null;
};
;
function authInterceptor(API, auth) {
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
            if (res.headers('token')) {
                auth.saveToken(res.headers('token'));
            }
            return res;
        }
    };
}

function authService($window) {
    var self = this;
    this.getParam = function (param) {
        var item = $window.location.search.split(param + '=')[1];
        if (item) {
            return item.split('&')[0];
        } else {
            return null;
        }
    };
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
        $window.localStorage.removeItem('jwtadmToken');
        $window.location.href = "./login.html";
    };
    self.saveToken = function (token) {
        $window.localStorage['jwtadmToken'] = token;
    };
    self.getToken = function () {
        if (self.token) {
            return self.token;
        } else {
            self.token = $window.localStorage['jwtadmToken'];
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
            $window.location.href = "./login.html";
        } else {
            return((self.parseJwt(token)).id);
        }
    };
    self.getUserDetails = function () {
        var token = self.getToken();
        if (angular.isUndefined(token) || token === null) {
            $window.location.href = "./login.html";
        } else {
            return(self.parseJwt(token));
        }
    };
}

function userService($http, API, auth) {
    var self = this;


    this.login = function (username, password) {
        return $http.post(API + '/admin/auth', {
            user: username,
            pass: password
        });
    };
    this.sendReset = function (email, check) {
        return $http.post(API + '/admin/sendReset', {
            email: email,
            check: check
        });
    };
    this.resetPassword = function (id, password, reset) {
        return $http.post(API + '/admin/resetPassword', {
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
function homeCtrl(auth, $http, API) {
    var self = this;
    $http.get(API + '/admin/listContent').then(function (res) {
        var status = res.data ? res.data.success : null;
        if (status === true) {
            self.items = res.data.extras.data;
        }
    });
    $http.get(API + '/admin/listDetails').then(function (res) {
        var status = res.data ? res.data.success : null;
        if (status === true) {
            self.counts = res.data.extras.data;
        }
    });
    this.save = function (id) {
        console.log(this.checked);
        console.log(id);
        if (this.checked == id) {
            $http.post(API + '/admin/markGlobal', {'cid': id, global: true}).then(function (res) {
                var status = res.data ? res.data.success : null;
                if (status === true) {
                    alert("Marked as Global");
                }
            });
        } else {
            console.log("no match");
        }
    };

}

function contentCtrl(auth, $http, API) {
    var self = this;
    self.cid = auth.getParam("cid");

    $http.get(API + '/admin/getContent?cid=' + self.cid).then(function (res) {
        var status = res.data ? res.data.success : null;
        if (status === true) {
            self.items = res.data.extras.data;
            self.excerpt = self.items.excerpt;
        }
    });
    self.approve = function (status) {
        if (angular.isUndefinedOrNull(self.excerpt)) {
            alert("Please set excerpt first!!");
        } else {
            $http.post(API + '/admin/approveContent', {"cid": self.cid, "approve": status}).then(function (res) {
                var status = res.data ? res.data.success : null;
                alert(status);
            });
        }
    };
    self.save = function () {
        console.log("saving content");
        $http.post(API + '/admin/saveContent', {"cid": self.cid, "excerpt": self.excerpt}).then(function (res) {
            var status = res.data ? res.data.success : null;
            alert(status);
        });
    };
}

function facilityCtrl(auth, $http, API) {
    var self = this;

   
}

function fixesCtrl(auth, $http, API) {
    var self = this;
    self.iid = null;
    self.eid = null;
    self.getData = function () {
        if (self.type === "T") {
            $http.get(API + '/admin/getItem?iid=' + self.iid + '&type=T').then(function (res) {
                var status = res.data ? res.data.success : null;
                if (status === true) {
                    self.item = res.data.extras.data[0];
                }
            });
        }
        if (self.type === "TE") {
            $http.get(API + '/admin/getItem?iid=' + self.iid + '&eid=' + self.eid + '&type=TE').then(function (res) {
                var status = res.data ? res.data.success : null;
                if (status === true) {
                    self.item = res.data.extras.data[0];
                }
            });
        }
    };
    self.getUData = function () {
        self.mobile = null;
        self.email = null;
        $http.get(API + '/admin/getItem?iid=' + self.uid + '&type=U').then(function (res) {
            var status = res.data ? res.data.success : null;
            if (status === true) {
                self.user = res.data.extras.data[0];
                if (self.user.mobile) {
                    self.mobile = self.user.mobile;
                }
                if (self.user.email) {
                    self.email = self.user.email;
                }
            }
        });
    };
    self.remove = function () {
        if (self.type === "T") {
            $http.post(API + '/admin/removeItem', {"iid": self.iid, "type": self.type}).then(function (res) {
                var status = res.data ? res.data.success : null;
                alert(status);
            });
        }
        if (self.type === "TE") {
            $http.post(API + '/admin/removeItem', {"iid": self.iid, "eid": self.eid, "type": self.type}).then(function (res) {
                var status = res.data ? res.data.success : null;
                alert(status);
            });
        }
    };
    self.updateUser = function () {
        var data = {"uid": self.uid, "type": "U"};
        if (self.mobile) {
            data.mobile = self.mobile;
        }
        ;
        if (self.email) {
            data.email = self.email;
        }
        $http.post(API + '/admin/updateUser', data).then(function (res) {
            var status = res.data ? res.data.success : null;
            alert(status);
        });
    };
}
;
function matchFixesCtrl(auth, $http, API) {
    var self = this;
    self.eid = null;
    self.mom = null;
    self.getData = function () {
        if (self.type == "E") {
            $http.get(API + '/admin/getItem?iid=' + self.iid + '&type=E').then(function (res) {
                var status = res.data ? res.data.success : null;
                if (status === true) {
                    self.item = res.data.extras.data[0];
                    self.players = self.item.participants[0].playingEleven;
                    Array.prototype.push.apply(self.players, self.item.participants[1].playingEleven);
                }
                if (self.item.result.mom) {
                    self.mom = self.item.result.mom;
                }
                if (self.item.result.winner) {
                    self.winner = self.item.result.winner;
                }
            });
        }
        if (self.type == "S") {
            $http.get(API + '/admin/getItem?iid=' + self.iid + '&type=S').then(function (res) {
                var status = res.data ? res.data.success : null;
                if (status === true) {
                    self.item = res.data.extras.data[0];
                    // set json
                    editor.set(self.item);
                }
            });
        }
        if (self.type == "T") {
            $http.get(API + '/admin/getItem?iid=' + self.iid + '&type=T').then(function (res) {
                var status = res.data ? res.data.success : null;
                if (status === true) {
                    self.item = res.data.extras.data[0];
                    editor.set(self.item);
                }
            });
        }
        if (self.type == "TS") {
            $http.get(API + '/admin/getItem?iid=' + self.iid + '&pid=' + self.pid + '&type=TS').then(function (res) {
                var status = res.data ? res.data.success : null;
                if (status === true) {
                    self.item = res.data.extras.data[0];
                    editor.set(self.item);
                }
            });
        }
    };
    self.updateItem = function () {
        var data = {};
        data.iid = self.item._id;
        if (self.type == "T") {
            data.type = "T";
            alert("tournament update not available")
            /*if (!angular.isUndefinedOrNull(self.item.startdate)) {
             $http.post(API + '/admin/updateItem', data).then(function (res) {
             var status = res.data ? res.data.success : null;
             alert(status);
             });
             }*/
        }
        if (self.type == "S") {
            data.type = "S";
            // get json
            var json = editor.get();
            data.obj = {score: json.score};
            if (!angular.isUndefinedOrNull(self.item.score)) {
                $http.post(API + '/admin/updateItem', data).then(function (res) {
                    var status = res.data ? res.data.success : null;
                    alert(status);
                });
            }
        }
        if (self.type == "TS") {
            data.type = "TS";
            var json = editor.get();
            data.obj = {totalInnings: json.totalInnings};
            if (json.bowlingStats) {
                data.obj.bowlingStats = json.bowlingStats;
            }
            if (json.battingStats) {
                data.obj.battingStats = json.battingStats;
            }
            if (!angular.isUndefinedOrNull(self.item.totalInnings)) {
                $http.post(API + '/admin/updateItem', data).then(function (res) {
                    var status = res.data ? res.data.success : null;
                    alert(status);
                });
            }
        }

    };
    self.updateUser = function () {
        var data = {"uid": self.uid, "type": "U"};
        if (self.mobile) {
            data.mobile = self.mobile;
        }
        ;
        if (self.email) {
            data.email = self.email;
        }
        $http.post(API + '/admin/updateUser', data).then(function (res) {
            var status = res.data ? res.data.success : null;
            alert(status);
        });
    };
    self.setMOM = function () {
        if (!self.item.result.mom) {
            self.item.result.mom = {};
        }
        self.item.result.mom.name = self.mom.userName;
        self.item.result.mom.uid = self.mom.uid;
        //save to backend.

        $http.post(API + '/admin/updateMatch', {"iid": self.iid, "mom": self.item.result.mom, "type": "E"}).then(function (res) {
            var status = res.data ? res.data.success : null;
            alert(status);
        });
    };
    self.setWinner = function () {
        self.item.result.winner = self.winner;
        delete self.winner.playingEleven;
        //save to backend.
        var obj = {"iid": self.iid, "winner": self.winner, "type": "E"};
        if (self.item.tournament) {
            obj.tid = self.item.tournament.tid;
        }
        if (self.item.result.by) {
            obj.by = self.item.result.by;
        }
        obj.status = self.status;
        $http.post(API + '/admin/updateMatch', obj).then(function (res) {
            var status = res.data ? res.data.success : null;
            alert(status);
        });
    };
}
;
function tournamentsCtrl(auth, $http, API) {
    var self = this;
    $http.get(API + '/admin/getTournaments').then(function (res) {
        var status = res.data ? res.data.success : null;
        if (status === true) {
            self.item = res.data.extras.data[0];
        }
    });
    self.getTournaments = function () {
        $http.get(API + '/admin/getTournaments').then(function (res) {
            var status = res.data ? res.data.success : null;
            if (status === true) {
                self.item = res.data.extras.data[0];
            }
        });
    };
    self.getUData = function () {
        self.mobile = null;
        self.email = null;
        $http.get(API + '/admin/getItem?iid=' + self.uid + '&type=U').then(function (res) {
            var status = res.data ? res.data.success : null;
            if (status === true) {
                self.user = res.data.extras.data[0];
                if (self.user.mobile) {
                    self.mobile = self.user.mobile;
                }
                if (self.user.email) {
                    self.email = self.user.email;
                }
            }
        });
    };
    self.remove = function () {
        if (self.type === "T") {
            $http.post(API + '/admin/removeItem', {"iid": self.iid, "type": self.type}).then(function (res) {
                var status = res.data ? res.data.success : null;
                alert(status);
            });
        }
        if (self.type === "TE") {
            $http.post(API + '/admin/removeItem', {"iid": self.iid, "eid": self.eid, "type": self.type}).then(function (res) {
                var status = res.data ? res.data.success : null;
                alert(status);
            });
        }
    };
    self.updateUser = function () {
        var data = {"uid": self.uid, "type": "U"};
        if (self.mobile) {
            data.mobile = self.mobile;
        }
        ;
        if (self.email) {
            data.email = self.email;
        }
        $http.post(API + '/admin/updateUser', data).then(function (res) {
            var status = res.data ? res.data.success : null;
            alert(status);
        });
    };
}
;
function loginCtrl(user, auth, $http, API) {
    var self = this;
    self.email = "";
    self.fName = "";
    self.lName = "";
    self.pswd = "";
    self.isFocus = {};

    // Login
    function handleLogin(res) {
        var status = res.data ? res.data.success : null;
        if (status) {
            window.location = "/admin/landing.html";
        }
    }
    self.login = function () {
        user.login(self.username, self.password)
                .then(handleLogin);
    };
    self.clearLogin = function () {
        self.username = "";
        self.password = "";
    };

    self.logout = function () {
        auth.logout && auth.logout();
    };
    self.isAuthed = function () {
        return auth.isAuthed ? auth.isAuthed() : false;
    };


}
;
var semadmin = angular.module('semadmin', ['ngSanitize']);
semadmin
        .factory('authInterceptor', authInterceptor)
        .service('user', userService)
        .service('auth', authService)
        .config(function ($httpProvider) {
            $httpProvider.interceptors.push('authInterceptor');
        })
        .controller('Login', loginCtrl)
        .controller("Home", homeCtrl)
        .controller("Content", contentCtrl)
        .controller("Fixes", fixesCtrl)
        .controller("matchFixesCtrl", matchFixesCtrl)
        .controller("TournamentsCtrl", tournamentsCtrl)
         .controller("facilityCtrl", facilityCtrl)
        .filter('imgsize', imgSizeFilter)
