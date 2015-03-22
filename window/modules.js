var app = angular.module('GitWork', ['ui.router']);
var gui = require('nw.gui');
var win = gui.Window.get();
var fs = require("fs");
var NodeGit = require("nodegit");
