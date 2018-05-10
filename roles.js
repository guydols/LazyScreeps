var func = {


  //**************
  // harvester role
  harvester: function(creep) {
    if(creep.carry.energy < creep.carryCapacity) {
      var sources = creep.room.find(FIND_SOURCES);
      if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
      }
    }
    else {
      var targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return (structure.structureType == STRUCTURE_EXTENSION ||
            structure.structureType == STRUCTURE_SPAWN ||
            structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
        }
      });
      if(targets.length > 0) {
        if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
        }
      }
    }
  },


  //**************
  // builder role
  builder: function(creep) {
    if(creep.memory.s && creep.carry.energy == 0) {
      creep.memory.s = false;
      creep.say('🔄 harvest');
    }
    if(!creep.memory.s && creep.carry.energy == creep.carryCapacity) {
      creep.memory.s = true;
      creep.say('🚧 build');
    }
    if(creep.memory.s) {
      var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
      if(targets.length) {
        if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
        }
      }
    }
    else {
      var sources = creep.room.find(FIND_SOURCES);
      if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
      }
    }
  },


  //**************
  // upgrader role
  upgrader: function(creep) {
    if(creep.memory.s && creep.carry.energy == 0) {
      creep.memory.s = false;
      creep.say('🔄 harvest');
    }
    if(!creep.memory.s && creep.carry.energy == creep.carryCapacity) {
      creep.memory.s = true;
      creep.say('⚡ upgrade');
    }
    if(creep.memory.s) {
      if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
      }
    }
    else {
      var sources = creep.room.find(FIND_SOURCES);
      if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
      }
    }
  },
  hello: function(){
    console.log("test")
  }
}
module.exports = func;
