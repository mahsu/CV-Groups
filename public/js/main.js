'use strict';

angular.module('cvgroups', ['ngMap', 'ngAnimate', 'ngRoute', 'ngMaterial', 'cvgroups.controllers'])
    .factory('httpResponseInterceptor', ['$q', '$location', function ($q, $location) {
        return {
            response: function (response) {
                console.log(response.status, response.body);
                if (response.status === 401) {
                    console.log("Response 401");
                }
                return response || $q.when(response);
            },
            responseError: function (rejection) {
                console.log(rejection.status, rejection.body);
                if (rejection.status === 401) {
                    window.location = "/login";
                    //$location.path('/').search('returnTo', $location.path());
                }
                return $q.reject(rejection);
            }
        }
    }])
    .config(['$httpProvider', '$routeProvider', '$locationProvider', '$mdThemingProvider', function ($httpProvider, $routeProvider, $locationProvider, $mdThemingProvider) {
        $httpProvider.interceptors.push('httpResponseInterceptor');
        $routeProvider
            /*.when('/me', {
             templateUrl: 'partials/requests',
             controller: RequestsController
             })
             .when('/group/:id', {
             templateUrl: 'partials/create',
             controller: RequestsController
             })
             .when('/group/', {

             })
             .when('/me/profile', {
             templateUrl: 'partials/user'
             //controller: UsersController
             })*/
            .when('/login', {
                templateUrl: 'partials/login',
                controller: "login.ctrl"
            })
            .when('/landing', {
                templateUrl: 'partials/landing',
                controller: "landing.ctrl"
            })
            .when('/register', {
                templateUrl: 'partials/register'
            })
            .when('/posts', {
                templateUrl: 'partials/posts',
                controller: "posts.ctrl"
            })
            .when('/car', {
                templateUrl: 'partials/car',
                controller: "car.ctrl"
            })
            .otherwise({
                redirectTo: '/login'
            });
        $locationProvider.html5Mode(true);
        $mdThemingProvider.definePalette('cv-navy', {
            "50": "#e6e6eb",
            "100": "#b3b4c2",
            "200": "#80839a",
            "300": "#555978",
            "400": "#2a2f56",
            "500": "#000634",
            "600": "#00052e",
            "700": "#000527",
            "800": "#000421",
            "900": "#00031a",
            "A100": "#b3b4c2",
            "A200": "#80839a",
            "A400": "#2a2f56",
            "A700": "#000527",
            'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
            // on this palette should be dark or light
            'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
                '200', '300', '400', 'A100'],
            'contrastLightColors': undefined    // could also specify this if default was 'dark'
        });
        $mdThemingProvider.definePalette('cv-red', {
            "50": "#fdeaea",
            "100": "#fac1c1",
            "200": "#f79897",
            "300": "#f47674",
            "400": "#f15352",
            "500": "#ee312f",
            "600": "#d02b29",
            "700": "#b32523",
            "800": "#951f1d",
            "900": "#771918",
            "A100": "#fac1c1",
            "A200": "#f79897",
            "A400": "#f15352",
            "A700": "#b32523"
        });
        $mdThemingProvider.definePalette('cv-blue', {
            "50": "#e6f8fd",
            "100": "#b3e9f9",
            "200": "#80daf5",
            "300": "#55cdf2",
            "400": "#2ac0ee",
            "500": "#00b4eb",
            "600": "#009ece",
            "700": "#0087b0",
            "800": "#007193",
            "900": "#005a76",
            "A100": "#b3e9f9",
            "A200": "#80daf5",
            "A400": "#2ac0ee",
            "A700": "#0087b0"
        });
        $mdThemingProvider.theme('default')
            .primaryPalette('cv-navy')
    }])
;