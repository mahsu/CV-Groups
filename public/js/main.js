'use strict';

angular.module('cvgroups', ['ngMap', 'ngAnimate', 'ngRoute', 'ngMaterial', 'cvgroups.controllers'])
    .factory('httpResponseInterceptor',['$q','$location',function($q,$location){
        return {
            response: function(response){
                console.log(response.status, response.body);
                if (response.status === 401) {
                    console.log("Response 401");
                }
                return response || $q.when(response);
            },
            responseError: function(rejection) {
                console.log(rejection.status, rejection.body);
                if (rejection.status === 401) {
                    window.location = "/";
                    //$location.path('/').search('returnTo', $location.path());
                }
                return $q.reject(rejection);
            }
        }
    }])
    .config(['$httpProvider', '$routeProvider', '$locationProvider', function($httpProvider, $routeProvider, $locationProvider) {
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
            .otherwise({
                redirectTo: '/login'
            });
        $locationProvider.html5Mode(true);
    }]);