'use strict';

var app = angular.module('GitWork', []);

app.controller('MainController', function ($scope) {


});

app.directive('home', function () {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'window/directives/home/home.html'
    };

});

app.directive('navbar', function () {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'window/directives/common/navbar/navbar.html'
    };

});