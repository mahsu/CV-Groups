"use strict";
var app = angular.module('cvgroups.controllers', ['ngMessages']);

app.filter('reverse', function() {
    return function(items) {
        return items.slice().reverse();
    };
});

app.controller('login.ctrl', ['$scope', '$http', '$location', '$mdToast', function ($scope, $http, $location, $mdToast) {
    $scope.states = ('AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS ' +
    'MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI ' +
    'WY').split(' ').map(function (state) {
            return {
                abbrev: state
            };
        });

    $scope.login = function (user, valid) {
        console.log(valid);
        $http.post('/api/auth/login', user)
            .success(function (data) {
                $location.path('/landing');
            })
            .error(function (data, status, headers) {
                $mdToast.show(
                    $mdToast.simple()
                        .content('Invalid Username/Password.')
                        .position("top left right")
                        .hideDelay(2000)
                );
                console.log(data, status, headers);
            })
    };

    $scope.register = function (user) {
        geoCode(user.address, function (err, loc) {
            if (err) {
                console.log("geocoding error");
                $mdToast.show(
                    $mdToast.simple()
                        .content('Unable to geocode address. Please check address.')
                        .position("top left right")
                        .hideDelay(2000)
                );
            }
            else {
                user.loc = loc;
            }

            $http.post('/api/auth/register', user)
                .success(function (data) {
                    $location.path('/landing');
                })
                .error(function (data, status, headers) {
                    $mdToast.show(
                        $mdToast.simple()
                            .content('Unable to complete user registration.')
                            .position("top left right")
                            .hideDelay(2000)
                    );
                    console.log(data, status, headers);
                });
            console.log(user);
        });

    }
}]);

app.controller('landing.ctrl', ['$scope', '$http', '$mdSidenav', function ($scope, $http, $mdSidenav) {
    $scope.toggleSidenav = function (menuId) {
        $mdSidenav(menuId).toggle();
    };

    $scope.types = ('classified carpool general finance').split(' ').map(function (type) {
        return {
            abbrev: type
        };
    });

    $scope.searchInput = "";

    $scope.newGroupName = "";
    $scope.newGroupType = "";
    $scope.newGroupDesc = "";

    $scope.allGroups = [];
    $scope.userGroups = [];

    $scope.tempName = "";


    $scope.addNewBool = false;
    $scope.newName = "";
    $scope.submit = function () {
        $http({
            method: 'POST',
            url: '/api/groups/add',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            transformRequest: function (obj) {
                var str = [];
                for (var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
            data: {groupname: $scope.newGroupName, grouptype: $scope.newGroupType, description: $scope.newGroupDesc}
        }).success(function (data, status, headers, config) {
            console.log("new group submitted");
            $scope.loadAllGroups();
            $scope.loadUserGroups();
        }).error(function (data, status, headers, config) {
            console.log("error in submitting new group");
        });
    };

    //Getting data for all Groups
    $scope.loadAllGroups = function () {
        $http.get('/api/groups/showall')
            .success(function (data, status, headers, config) {
                console.log("trying to get /groups/showall");
                $scope.allGroups = data.res;
                console.log("get succeeded, data in var allGroups");
            })
            .error(function (data, status, headers, config) {
                console.log("failure");
            });
    };

    $scope.loadUserGroups = function () {
        $http.get('/api/users/viewGroup')
            .success(function (data, status, headers, config) {
                console.log("trying to get user groups");
                $scope.userGroups = data.res;
                console.log("get user groups succeeded, data in var userGroups");
            })
            .error(function (data, status, headers, config) {
                console.log("failure");
            });
    };

    $scope.joinGroup = function(inputName) {
        $http({
            method: 'POST',
            url: '/api/users/addgroup',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            transformRequest: function(obj) {
                var str = [];
                for(var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
            data: {groupname: inputName}
        }).success(function (data, status, headers, config) {
            console.log("group joined");
            $scope.loadAllGroups();
            $scope.loadUserGroups();
        }).error(function(data,status,headers,config){
            console.log("error in joining group");
        });
    };

    $scope.leaveGroup = function(inputName) {
        $http({
            method: 'POST',
            url: '/api/users/removegroup',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            transformRequest: function(obj) {
                var str = [];
                for(var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
            data: {groupname: inputName}
        }).success(function (data, status, headers, config) {
            console.log("removed from group");
            $scope.loadAllGroups();
            $scope.loadUserGroups();
        }).error(function(data,status,headers,config){
            console.log("error in removing from group");
        });
    };

    $scope.loadAllGroups();
    $scope.loadUserGroups();
}]);

app.controller('posts.ctrl', ['$scope', '$http', '$mdToast', function ($scope, $http, $mdToast) {
    $scope.postText = "";

    $scope.user = {
        title: 'Developer',
        email: 'ipsum@lorem.com',
        firstName: '',
        lastName: '',
        company: 'Google',
        address: '1600 Amphitheatre Pkwy',
        city: 'Mountain View',
        state: 'CA',
        biography: 'Loves kittens, snowboarding, and can type at 130 WPM.\n\nAnd rumor has it she bouldered up Castle Craig!',
        postalCode: '94043'
    };

    $scope.newPost = function () {
        if (typeof $scope.postText !== "undefined" && $scope.postText != "") {
            console.log("new posted - " + $scope.postText);
            $scope.makePost("Test", $scope.postText, "");
            $scope.showSimpleToast();
        }
    };
    $scope.showSimpleToast = function () {
        $mdToast.show(
            $mdToast.simple()
                .content('Posted!!')
                .position('top right')
                .hideDelay(2000)
        );
    };
    $scope.messages = [];


    $scope.getPosts = function(callback){
            $http({
                method: 'GET',
                url: '/api/groups/showposts/Test',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: {}
            }).success(function (data, status, headers, config) {
                console.log("showed Posts");
                console.log(data);
                data.res.forEach(function (e) {
                    //console.log(e.posts);
                    $scope.messages.push(e);
                });
                //console.log($scope.messages);
            }).error(function (data, status, headers, config) {
                console.log("posts failed");
            });
    };

    $scope.makePost = function(groupName, body, tags){
        $http({
            method: 'POST',
            url: '/api/users/addPost',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            transformRequest: function(obj) {
                var str = [];
                for(var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
            data: {groupname: groupName, postbody: body, posttags: tags}
        }).success(function (data, status, headers, config) {
            console.log("post success!");
            $scope.getPosts();
        }).error(function(data,status,headers,config){
            console.log("stfu");
        });
    };

    $scope.getComments = function(){

    };

    $scope.addComments = function() {

    };

    $scope.addUpvote = function() {

    };

    $scope.addDownvote = function() {

    };

    $scope.getPosts();
}]);

app.controller('car.ctrl', ['$scope', '$http', '$mdToast', function ($scope, $http, $mdToast) {

}]);

function geoCode(address, callback) {
    if (typeof address == 'object') {
        address = address.street + " " + address.city + ", " + address.state + " " + address.zip;
    }
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address': address}, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var res = results[0].geometry.location;
            var loc = {};
            loc.lat = res.A;
            loc.lon = res.F;
            callback(null, loc);
        } else {
            callback(true);
        }
    });
}
