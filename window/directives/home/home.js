'use strict';

var app = angular.module('GitWork', []);

app.directive('home', function () {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'window/directives/home/home.html'
    };

});