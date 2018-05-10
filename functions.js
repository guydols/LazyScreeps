var func = {


  //**************
  // remove any dead registered creeps
  cleanup: function(creeps) {
    for (let name in creeps) {
      if (Game.creeps[name] == undefined) {
        delete Memory.creeps[name];
      }
    }
  },


  //**************
  // spawn screeps in rooms where they are lacking
  spawning: function() {
    var ownedRooms = [];
    var ownedSpawns = [];
    var ownedCreeps = {};

    // register owned rooms and spawns
    for(let room in Game.rooms) {
      var spawns = Game.rooms[room].find(FIND_MY_STRUCTURES,
        {filter: (s) => s.structureType == STRUCTURE_SPAWN});
    }
    for (let x = 0; x < spawns.length; x++) {
      ownedSpawns.push(spawns[x]);
      if (!(ownedRooms.includes(spawns[x].room.name))) {
        ownedRooms.push(spawns[x].room.name);
      }
    }

    // register owned creeps assigned to each room
    for (let room in ownedRooms) {
      if (!(ownedRooms[room] in ownedCreeps)) {
        ownedCreeps[ownedRooms[room]] = {
          'harvesters' : 0,
          'builders' : 0,
          'upgraders' : 0
        };
      }

      for(let name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.o == ownedRooms[room]) {
          if(creep.memory.r == '0') {
            ownedCreeps[ownedRooms[room]]['harvesters'] += 1;
          }
          if(creep.memory.r == '1') {
            ownedCreeps[ownedRooms[room]]['builders'] += 1;
          }
          if(creep.memory.r == '2') {
            ownedCreeps[ownedRooms[room]]['upgraders'] += 1;
          }
        }
      }

      // var sources = room.find(FIND_SOURCES);
      for (let room in ownedCreeps) {
        if (ownedCreeps[room]['harvesters'] < 2) {
          for (let spawn in spawns) {
            if (spawns[spawn].spawning == null){
              spawns[spawn].spawnCreep([WORK,CARRY,MOVE,MOVE],"Harvester" + Game.time.toString(),{memory: {r:0,o:room,s:0}});
            }
          }
        }
        if (ownedCreeps[room]['builders'] < 2) {
          for (let spawn in spawns) {
            if (spawns[spawn].spawning == null){
              spawns[spawn].spawnCreep([WORK,CARRY,MOVE,MOVE],"Builder" + Game.time.toString(),{memory: {r:1,o:room,s:0}});
            }
          }
        }
        if (ownedCreeps[room]['upgraders'] < 1) {
          for (let spawn in spawns) {
            if (spawns[spawn].spawning == null){
              spawns[spawn].spawnCreep([WORK,CARRY,MOVE,MOVE],"Upgrader" + Game.time.toString(),{memory: {r:2,o:room,s:0}});
            }
          }
        }
      }
    }
  },


  //**************
  // execute roles on creeps
  execJobs: function(roles) {
    for(let name in Game.creeps) {
      var creep = Game.creeps[name];
      if(creep.memory.r == '0') {
        roles.harvester(creep);
      }
      if(creep.memory.r == '1') {
        roles.builder(creep);
      }
      if(creep.memory.r == '2') {
        roles.upgrader(creep);
      }
    }
  },


  //**************
  // tower fire at enemies
  towerJob: function() {
    var tower = Game.getObjectById('TOWER_ID');
    if(tower) {
      var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => structure.hits < structure.hitsMax});
      if(closestDamagedStructure) {
        tower.repair(closestDamagedStructure);
      }

      var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
      if(closestHostile) {
        tower.attack(closestHostile);
      }
    }
  }
}
module.exports = func;