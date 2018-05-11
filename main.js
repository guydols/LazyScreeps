"use strict";
const roles = require('./roles');
const functions = require('./functions');
const buildings = require('./buildings');

module.exports.loop = function () {

  functions.cleanup();
  functions.spawning();
  functions.execJobs(roles);
  functions.towers(buildings);

}
