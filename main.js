"use strict";
const roles = require('./roles');
const functions = require('./functions');

module.exports.loop = function () {

  functions.cleanup(Memory.creeps)
  functions.spawning()
  functions.execJobs(roles);

}
