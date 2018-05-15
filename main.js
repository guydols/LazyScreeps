"use strict";
const roles = require('./roles');
const func = require('./functions');
const buildings = require('./buildings');

module.exports.loop = function () {

  func.cleanup();

  func.init();

  func.spawning();

  func.execJobs(roles);

  func.towers(buildings);


};
