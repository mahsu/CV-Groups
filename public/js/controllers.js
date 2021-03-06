"use strict";
var app = angular.module('cvgroups.controllers', ['ngMessages']);

app.filter('reverse', function () {
    return function (items) {
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

app.controller('landing.ctrl', ['$scope', '$http', '$mdSidenav', '$location', '$mdToast', function ($scope, $http, $mdSidenav, $location, $mdToast) {
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

    $scope.joinGroup = function (inputName) {
        $http({
            method: 'POST',
            url: '/api/users/addgroup',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            transformRequest: function (obj) {
                var str = [];
                for (var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
            data: {groupname: inputName}
        }).success(function (data, status, headers, config) {
            console.log("group joined");
            $scope.loadAllGroups();
            $scope.loadUserGroups();
            $scope.showSimpleToast("Successfully joined " + inputName);
        }).error(function (data, status, headers, config) {
            console.log("error in joining group");
            $scope.showSimpleToast("Error joining " + inputName);
        });
    };

    $scope.leaveGroup = function (inputName) {
        $http({
            method: 'POST',
            url: '/api/users/removegroup',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            transformRequest: function (obj) {
                var str = [];
                for (var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
            data: {groupname: inputName}
        }).success(function (data, status, headers, config) {
            console.log("removed from group");
            $scope.showSimpleToast("Successfully left " + inputName);
            $scope.loadAllGroups();
            $scope.loadUserGroups();
        }).error(function (data, status, headers, config) {
            $scope.showSimpleToast("Error leaving " + inputName);
            console.log("error in removing from group");
        });
    };

    $scope.loadAllGroups();
    $scope.loadUserGroups();
    $scope.showSimpleToast = function (msg) {
        console.log("toast");
        $mdToast.show(
            $mdToast.simple()
                .content(msg)
                .position('top left right')
                .hideDelay(2000)
        );
    };
}]);

app.controller('posts.ctrl', ['$scope', '$http', '$mdToast', '$location', function ($scope, $http, $mdToast, $location) {
    $scope.postText = "";

    $scope.newPost = function () {
        if (typeof $scope.postText !== "undefined" && $scope.postText != "") {
            console.log("new posted - " + $scope.postText);
            $scope.makePost($location.search().group, $scope.postText, "");

        }
    };

    $scope.newComment = function(commentText, postid) {
        console.log(commentText);
        if (typeof commentText !== "undefined" && commentText != "") {
            console.log("new comment - ",postid,commentText,$location.search().group);
            $scope.addComments(postid, commentText, $location.search().group);
        }
    };

    $scope.showSimpleToast = function (msg) {
        console.log("toast");
        $mdToast.show(
            $mdToast.simple()
                .content(msg)
                .position('top left right')
                .hideDelay(2000)
        );
    };

    $scope.messages = [];

    $scope.getPosts = function (callback) {
        $scope.messages = [];
        console.log($location.search());
        $http({
            method: 'GET',
            url: '/api/groups/showposts/' + $location.search().group,
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

    $scope.makePost = function (groupName, body, tags) {
        $http({
            method: 'POST',
            url: '/api/users/addPost',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            transformRequest: function (obj) {
                var str = [];
                for (var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
            data: {groupname: groupName, postbody: body, posttags: tags}
        }).success(function (data, status, headers, config) {
            if (data.status == "0") {
                return $scope.showSimpleToast("Failed to post. Please make sure you are part of the group first.");
            }
            $scope.postText = "";
            $scope.showSimpleToast("Posted!!!!!");
            console.log("post success!");
            $scope.getPosts();
        }).error(function (data, status, headers, config) {

            console.log("stfu");
        });
    };

    $scope.getComments = function(postid){
        $http({
            method: 'GET',
            url: '/api/users/showcomments/',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            transformRequest: function (obj) {
                var str = [];
                for (var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
            data: {'_id': postid}
        }).success(function (data, status, headers, config) {
            console.log("get comments", data);
            return data;
            //console.log($scope.messages);
        }).error(function (data, status, headers, config) {
            console.log("posts failed");
        });
    };

    $scope.addComments = function(postid, commentText, groupName) {
        $http({
            method: 'POST',
            url: '/api/users/addcomment',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            transformRequest: function(obj) {
                var str = [];
                for(var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
            data: {groupname: groupName, commentbody: commentText, postid: postid}
        }).success(function (data, status, headers, config) {
            if (data.status == 0) {
                console.error(data.res);
            }
            console.log("add comment success!");
            $scope.getPosts();
        }).error(function(data,status,headers,config){
            console.log(data);
        });
    };

    $scope.addUpvote = function (post) {
        console.log(post._id);
        $http({
            method: 'POST',
            url: '/api/users/upvote/' + post._id,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            transformRequest: function (obj) {
                var str = [];
                for (var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            }
        }).success(function (data, status, headers, config) {
            if (data.status == "0") {
                return;
            }
            console.log(data.message);
            console.log("up success");
            $scope.getPosts();
        }).error(function (data, status, headers, config) {
            console.log("up failed");
        });
    };

    $scope.addDownvote = function (post) {
        console.log(post._id);
        $http({
            method: 'POST',
            url: '/api/users/downvote/' + post._id,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            transformRequest: function (obj) {
                var str = [];
                for (var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            }
        }).success(function (data, status, headers, config) {
            console.log(data);
            console.log("down success");
            $scope.getPosts();
        }).error(function (data, status, headers, config) {
            console.log("down failed");
        });
    };

    $scope.getPosts();
}]);

app.controller('car.ctrl', ['$scope', '$http', '$mdToast', '$location', function ($scope, $http, $mdToast, $location) {
    $scope.messages=[];

    $scope.getNearby = function(){
        //console.log($location.search())
        $http({
            method: 'GET',
            url: '/api/carpool/nearby'
        }).success(function (data, status, headers, config) {
            console.log("showed nearby");
            console.log(data);
            //console.log($scope.messages);
            $scope.messages = data;
        }).error(function (data, status, headers, config) {
            console.log("nearby failed");
            console.log(data);
        });
    };

    $scope.getNearby();
}]);

function geoCode(address, callback) {
    if (typeof address == 'object') {
        address = address.street + " " + address.city + ", " + address.state + " " + address.zip;
    }
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address': address}, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            console.log(results);
            var res = results[0].geometry.location;
            var loc = {};
            var keys = Object.keys(res);
            loc.lat = res[keys[0]];
            loc.lon = res[keys[1]];
            //loc.lat = res.A;
            //loc.lon = res.F;
            console.log(loc);
            callback(null, loc);
        } else {
            callback(true);
        }
    });
}
