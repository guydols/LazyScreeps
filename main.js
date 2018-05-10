"use strict";
const roles = require('./roles');
const functions = require('./functions');

module.exports.loop = function () {

  functions.cleanup()
  functions.spawning()
  functions.execJobs(roles);

}
