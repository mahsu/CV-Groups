"use strict";
var app = angular.module('cvgroups.controllers', []);

app.controller('login.ctrl', ['$scope', '$http', '$location', function ($scope, $http, $location) {
    $scope.states = ('AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS ' +
    'MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI ' +
    'WY').split(' ').map(function (state) {
            return {
                abbrev: state
            };
        });
    $scope.login = function (user) {
        $http.post('/api/auth/login', user)
            .success(function (data) {
                $location.path('/landing');
            })
            .error(function (data, status, headers) {
                //todo handle error
                console.log(data, status, headers);
            })
    };

    $scope.register = function (user) {
        geoCode(user.address, function (err, loc) {
            if (err) {
                console.log("geocoding error");
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
                });
            console.log(user);
        });

    }
}]);

app.controller('landing.ctrl', ['$scope', '$mdSidenav', function ($scope, $mdSidenav) {
    $scope.toggleSidenav = function (menuId) {
        $mdSidenav(menuId).toggle();
    };

    $scope.searchInput = "";

    $scope.groups = [
        { name: 'Ari'},
        { name: 'Q'},
        { name: 'Sean'},
        { name: 'Anand'}
    ];
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
