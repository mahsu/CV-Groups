"use strict";
var app = angular.module('cvgroups.controllers', ['ngMessages']);

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

    $scope.register = function (user, valid) {
        geoCode(user.address, function (err, loc) {
            if (err) {
                console.log("geocoding error");
                $mdToast.show(
                    $mdToast.simple()
                        .content('Error in geocoding. Pleas check address.')
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
                    //todo handle error
                    console.log(data, status, headers);
                    $mdToast.show(
                        $mdToast.simple()
                            .content('Unable to complete user registration.')
                            .position("top left right")
                            .hideDelay(2000)
                    );
                });
            console.log(user);
        });

    }
}]);

app.controller('landing.ctrl', ['$scope', '$http', '$mdSidenav', function ($scope, $http, $mdSidenav) {
    $scope.toggleSidenav = function (menuId) {
        $mdSidenav(menuId).toggle();
    };

    $scope.searchInput = "";

    $scope.allGroups = [];
    $scope.userGroups = [];

    //Getting data for all Groups
    $http.get('/api/groups/showall')
        .success(function (data, status, headers, config) {
            console.log("trying to get /groups/showall");
            $scope.allGroups = data;
            console.log("get succeeded, data in var allGroups");
        })
        .error(function (data, status, headers, config) {
            console.log("failure");
        });

    //Uncomment when logged in to get userGroups
    /*
     $http.get('/api/users/viewGroup')
     .success(function(data, status, headers, config) {
     console.log("trying to get user groups");
     $scope.userGroups = data;
     console.log("get user groups succeeded, data in var userGroups");
     })
     .error(function (data, status, headers, config) {
     console.log("failure");
     });
     */
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
};
