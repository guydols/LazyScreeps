var exp = {



  //**************
  // init
  init: function() {
    // global.ownedRooms = [];
    // global.ownedSpawns = [];
    // global.ownedCreeps = {};
    // global.population = [4,1,1,0,0];
    // global.creepTiers = [[WORK,CARRY,MOVE,MOVE],
    //                   [WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE]];

    global.lazy = [];
    for (let r in Game.rooms){
      global.lazy.push({
        'room':{
          'vars':{
            'roomname':r,
            'epoch':0,
            'alert':0,
            'energylvl':0
          },
          'buildings':{
            'spawns':[],
            'towers':[]
          },
          'creeps':{
              'harvesters' : 0,
              'builders' : 0,
              'upgraders' : 0,
              'repairers' : 0,
              'haulers' : 0
          }
        }
      });
    }
  },


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
    global.ownedRooms = [];
    global.ownedSpawns = [];
    global.ownedCreeps = {};
    global.population = [4,0,1,0,0];
    global.creepTiers = [[WORK,CARRY,MOVE,MOVE],
                      [WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE]];

    // register owned rooms and spawns
    for(let room in Game.rooms) {
      var spawns = Game.rooms[room].find(FIND_MY_STRUCTURES,
        {filter: (s) => s.structureType == STRUCTURE_SPAWN});
    }
    for (let spawn in spawns) {
      global.ownedSpawns.push(spawns[spawn].id);
      if (!(global.ownedRooms.includes(spawns[spawn].room.name))) {
        global.ownedRooms.push(spawns[spawn].room.name);
      }
    }

    // register owned creeps assigned to each room
    for (let room in global.ownedRooms) {
      if (!(global.ownedRooms[room] in global.ownedCreeps)) {
        global.ownedCreeps[global.ownedRooms[room]] = {
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
        if (creep.memory.ori == global.ownedRooms[room]) {
          if(creep.memory.rol == '0') {
            global.ownedCreeps[global.ownedRooms[room]]['harvesters'] += 1;
          }
          if(creep.memory.rol == '1') {
            global.ownedCreeps[global.ownedRooms[room]]['builders'] += 1;
          }
          if(creep.memory.rol == '2') {
            global.ownedCreeps[global.ownedRooms[room]]['upgraders'] += 1;
          }
          if(creep.memory.rol == '3') {
            global.ownedCreeps[global.ownedRooms[room]]['repairers'] += 1;
          }
          if(creep.memory.rol == '4') {
            global.ownedCreeps[global.ownedRooms[room]]['haulers'] += 1;
          }
        }
      }



      // check if hauler is needed


      // var sources = room.find(FIND_SOURCES);
      for (let spawn in spawns) {
        if (spawns[spawn].spawning == null){
          for (let room in global.ownedCreeps) {
            if (global.ownedCreeps[room]['harvesters'] < population[0]) {
              spawns[spawn].spawnCreep(creepTiers[1],
                "Harvester" + Game.time.toString(),{memory: {rol:0,ori:room,sta:0,t:9},
                directions:[BOTTOM_RIGHT,BOTTOM,BOTTOM_LEFT]});
            }
            if (global.ownedCreeps[room]['builders'] <  population[1]) {
              spawns[spawn].spawnCreep(creepTiers[1],
                "Builder" + Game.time.toString(),{memory: {rol:1,ori:room,sta:0,t:9},
                directions:[BOTTOM_RIGHT,BOTTOM,BOTTOM_LEFT]});
            }
            if (global.ownedCreeps[room]['upgraders'] <  population[2]) {
              spawns[spawn].spawnCreep(creepTiers[1],
                "Upgrader" + Game.time.toString(),{memory: {rol:2,ori:room,sta:0,t:9},
                directions:[BOTTOM_RIGHT,BOTTOM,BOTTOM_LEFT]});
            }
            if (global.ownedCreeps[room]['repairers'] <  population[3]) {
              spawns[spawn].spawnCreep(creepTiers[0],
                "Repairer" + Game.time.toString(),{memory: {rol:3,ori:room,sta:0,t:9},
                directions:[BOTTOM_RIGHT,BOTTOM,BOTTOM_LEFT]});
            }
            if (global.ownedCreeps[room]['haulers'] <  population[4]) {
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
module.exports = exp;
