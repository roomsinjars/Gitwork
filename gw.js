#!/usr/bin/env node

var spawn = require('child_process').spawn,
		gw = spawn('nw', [__dirname]);
		