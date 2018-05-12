var func = {


  //**************
  // remove any dead creeps to save memory
  cleanup: function() {
    for (let name in Memory.creeps) {
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
    var population = [5,0,1,0,0];
    var creepTiers = [[WORK,CARRY,MOVE,MOVE],
                      [WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE]];

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
          'upgraders' : 0,
          'repairers' : 0,
          'haulers' : 0
        };
      }

      // count all the creeps per room
      for(let name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.ori == ownedRooms[room]) {
          if(creep.memory.rol == '0') {
            ownedCreeps[ownedRooms[room]]['harvesters'] += 1;
          }
          if(creep.memory.rol == '1') {
            ownedCreeps[ownedRooms[room]]['builders'] += 1;
          }
          if(creep.memory.rol == '2') {
            ownedCreeps[ownedRooms[room]]['upgraders'] += 1;
          }
          if(creep.memory.rol == '3') {
            ownedCreeps[ownedRooms[room]]['repairers'] += 1;
          }
          if(creep.memory.rol == '4') {
            ownedCreeps[ownedRooms[room]]['haulers'] += 1;
          }
        }
      }

      // console.log(JSON.stringify(ownedCreeps));

      // check if hauler is needed


      // var sources = room.find(FIND_SOURCES);
      for (let spawn in spawns) {
        if (spawns[spawn].spawning == null){
          for (let room in ownedCreeps) {
            if (ownedCreeps[room]['harvesters'] < population[0]) {
              spawns[spawn].spawnCreep(creepTiers[1],
                "Harvester" + Game.time.toString(),{memory: {rol:0,ori:room,sta:0,t:9},
                directions:[BOTTOM_RIGHT,BOTTOM,BOTTOM_LEFT]});
            }
            if (ownedCreeps[room]['builders'] <  population[1]) {
              spawns[spawn].spawnCreep(creepTiers[1],
                "Builder" + Game.time.toString(),{memory: {rol:1,ori:room,sta:0,t:9},
                directions:[BOTTOM_RIGHT,BOTTOM,BOTTOM_LEFT]});
            }
            if (ownedCreeps[room]['upgraders'] <  population[2]) {
              spawns[spawn].spawnCreep(creepTiers[1],
                "Upgrader" + Game.time.toString(),{memory: {rol:2,ori:room,sta:0,t:9},
                directions:[BOTTOM_RIGHT,BOTTOM,BOTTOM_LEFT]});
            }
            if (ownedCreeps[room]['repairers'] <  population[3]) {
              spawns[spawn].spawnCreep(creepTiers[0],
                "Repairer" + Game.time.toString(),{memory: {rol:3,ori:room,sta:0,t:9},
                directions:[BOTTOM_RIGHT,BOTTOM,BOTTOM_LEFT]});
            }
            if (ownedCreeps[room]['haulers'] <  population[4]) {
              spawns[spawn].spawnCreep([CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                "Haulers" + Game.time.toString(),{memory: {rol:4,ori:room,sta:0,src:9,dst:9},
                directions:[BOTTOM_RIGHT,BOTTOM,BOTTOM_LEFT]});
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
      if(creep.memory.rol == '0') {
        roles.harvester(creep);
      }
      if(creep.memory.rol == '1') {
        roles.builder(creep);
      }
      if(creep.memory.rol == '2') {
        roles.upgrader(creep);
      }
      if(creep.memory.rol == '3') {
        roles.repairer(creep);
      }
      if(creep.memory.rol == '4') {
        roles.hauler(creep);
      }
    }
  },


  //**************
  // get all towers and execute their jobs
  towers: function(buildings) {
    for(let room in Game.rooms) {
      var towers = Game.rooms[room].find(FIND_MY_STRUCTURES,
        {filter: (s) => s.structureType == STRUCTURE_TOWER});
    }
    for (let tower in towers) {
      buildings.towerJobs(towers[tower]);
    }
  }


}
module.exports = func;
