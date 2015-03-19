'use strict';

var app = angular.module('GitWork', []);

app.directive('navbar', function () {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'window/directives/common/navbar/navbar.html'
    };

});
