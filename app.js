'use strict';

var app = angular.module('GitWork', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider){

    $stateProvider
        .state('home', {
            url: '',
            templateUrl: 'window/home/home.html',
            controller: 'MainController'
        })
});

app.controller('MainController', function ($scope, repoFactory) {



});





