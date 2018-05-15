"use strict";
const roles = require('./roles');
const functions = require('./functions');
const buildings = require('./buildings');

module.exports.loop = function () {

  functions.cleanup();
  functions.init();

  functions.spawning();
  functions.execJobs(roles);
  functions.towers(buildings);


  // console.log(" ");
  // console.log(" ");
  // for (let l in global.lazy) {
  //   console.log(global.lazy[l].room.buildings.spawns);
  // }
};
