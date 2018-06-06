var clientId = '1081474314719-1bvhjcksgghvm7fjqbpgl1vv8uca7k1m.apps.googleusercontent.com';
var apiKey = 'AIzaSyAbfj-XLCM5RR9LvSsRTmTNYZB7J3dwQ18';
var scopes = 'https://www.google.com/m8/feeds';

$(document).on("click", ".google", function () {
    gapi.client.setApiKey(apiKey);
    window.setTimeout(checkAuth, 3);
});

function checkAuth() {
    gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: false}, inviteFriendsCtrl);
}

function inviteFriendsCtrl(authResult) {
    "ngInject";
    
    var self = this;
    if (authResult && !authResult.error) {
//        $(".cont").hide();
//        $(".div").show();

        $.get("https://www.google.com/m8/feeds/contacts/default/full?alt=json&access_token=" + authResult.access_token + "&max-results=50&v=3.0",
                function (response) {
                    if (response.feed.entry.length > 0) {
                        //Handle Response
                        //console.log(response);
                        var email = [];
                        var pic = [];
                        var surya = [];
                        //console.log(response.feed.entry.length);
                        for (var i = 0; i < response.feed.entry.length; i++)
                        {
                            //console.log(i);
                            if (response.feed.entry[i].gd$phoneNumber)
                            {
                                continue;
                            }
                            if (response.feed.entry[i].gd$email) {
                                email[i] = response.feed.entry[i].gd$email[0].address;
                                //console.log(email[i]);
                                //console.log('here');
                            } else
                            {
                                continue;
                            }
                        }
                        self.invite = email;
                        console.log(self.invite);
                    }
                });
    }
}
;

angular.module('sem')
        .service('checkAuth', checkAuth)
        .controller('InviteFriends', inviteFriendsCtrl);