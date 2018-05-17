"use strict";
global.roles = require('./roles');
global.func = require('./functions');
global.buildings = require('./buildings');

module.exports.loop = function () {

  global.func.cleanup();

  global.func.init();

  global.func.spawning();

  global.func.execJobs();

  global.func.towers(global.buildings);


};
