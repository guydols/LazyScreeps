var exp = {



  //**************
  // init
  init: function() {

    global.creepTiers = [[WORK,CARRY,MOVE,MOVE],
                        [WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE]];

    // global var containing all info needed for the lazyscreeps
    global.lazy = [];

    // loop through rooms and create an template for each
    for (let r in Game.rooms){
      global.lazy.push({
        'room':{
          'vars':{
            'roomname':r,
            'epoch':0,
            'alert':0,
            'energylvl':0
          },
          'resources':{
            'energy':[],
            'minerals':[]
          },
          'buildings':{
            'spawns':[],
            'towers':[],
            'containers':[],
            'storages':[],
            'constructions':[]
          },
          'creeps':{
              'harvesters' : [0,3],
              'builders' : [0,0],
              'upgraders' : [0,6],
              'repairers' : [0,0],
              'haulers' : [0,0]
          }
        }
      });
    }

    //loop through global.lazy and fill
    for (let l in global.lazy) {
      let curRoomname = global.lazy[l].room.vars.roomname;
      // find all spawns in every owned room
      let spawns = Game.rooms[curRoomname].find(FIND_MY_SPAWNS);
      for (let s in spawns){
        global.lazy[l].room.buildings.spawns.push(spawns[s].id);
      }
      // find all towers in every owned room
      let towers = Game.rooms[curRoomname].find(
        FIND_MY_STRUCTURES,{filter: (s) => s.structureType == STRUCTURE_TOWER});
      for (let t in towers){
        global.lazy[l].room.buildings.towers.push(towers[t].id);
      }
      // find all minral sources in the room
      let constructions = Game.rooms[curRoomname].find(FIND_MY_CONSTRUCTION_SITES);
      for (let c in constructions){
        global.lazy[l].room.buildings.constructions.push(constructions[c].id);
      }
      // find all containers in every owned room
      let containers = Game.rooms[curRoomname].find(
        FIND_MY_STRUCTURES,{filter: (s) => s.structureType == STRUCTURE_CONTAINER});
      for (let c in containers){
        global.lazy[l].room.buildings.containers.push(containers[c].id);
      }
      // find all storages in every owned room
      let storages = Game.rooms[curRoomname].find(
        FIND_MY_STRUCTURES,{filter: (s) => s.structureType == STRUCTURE_STORAGE});
      for (let s in storages){
        global.lazy[l].room.buildings.storages.push(storages[s].id);
      }

      // find all energy sources in the room
      let sources = Game.rooms[curRoomname].find(FIND_SOURCES);
      for (let s in sources){
        global.lazy[l].room.resources.energy.push(sources[s].id);
      }
      // find all minral sources in the room
      let minerals = Game.rooms[curRoomname].find(FIND_MINERALS);
      for (let m in minerals){
        global.lazy[l].room.resources.minerals.push(minerals[m].id);
      }
      
      // count all the creeps per room
      for(let name in Game.creeps) {
        let creep = Game.creeps[name];
        if (creep.memory.ori == curRoomname) {
          if(creep.memory.rol == '0') {
          global.lazy[l].room.creeps.harvesters[0] += 1;
          }
          if(creep.memory.rol == '1') {
            global.lazy[l].room.creeps.builders[0] += 1;
          }
          if(creep.memory.rol == '2') {
            global.lazy[l].room.creeps.upgraders[0] += 1;
          }
          if(creep.memory.rol == '3') {
            global.lazy[l].room.creeps.repairers[0] += 1;
          }
          if(creep.memory.rol == '4') {
            global.lazy[l].room.creeps.haulers[0] += 1;
          }
        }
      }
      // console.log(JSON.stringify(global.lazy));
      // check if builders are needed
      if(global.lazy[l].room.buildings.constructions.length > 0){
        global.lazy[l].room.creeps.builders[1] = 1;
      }
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
    for (let l in global.lazy){
      let curRoom = global.lazy[l];
      let curRoomname = curRoom.room.vars.roomname;
      let curCreeps = curRoom.room.creeps;
      for (let s in curRoom.room.buildings.spawns){
        let curSpawn = Game.getObjectById(curRoom.room.buildings.spawns[s]); 
        if (curCreeps.harvesters[0] < curCreeps.harvesters[1] && curSpawn.spawning == null){
          curSpawn.spawnCreep(global.creepTiers[1],
            "Harvester" + Game.time.toString(),{memory: {rol:0,ori:curRoomname,sta:0,src:9,dst:9,ldr:9},
            directions:[BOTTOM_RIGHT,BOTTOM,BOTTOM_LEFT]});
        }
        if (curCreeps.builders[0] < curCreeps.builders[1] && curSpawn.spawning == null){
          curSpawn.spawnCreep(global.creepTiers[1],
            "Builder" + Game.time.toString(),{memory: {rol:1,ori:curRoomname,sta:0,src:9,dst:9,ldr:9},
            directions:[BOTTOM_RIGHT,BOTTOM,BOTTOM_LEFT]});
        }
        if (curCreeps.upgraders[0] < curCreeps.upgraders[1] && curSpawn.spawning == null){
          curSpawn.spawnCreep(global.creepTiers[1],
            "Upgrader" + Game.time.toString(),{memory: {rol:2,ori:curRoomname,sta:0,src:9,dst:9,ldr:9},
            directions:[BOTTOM_RIGHT,BOTTOM,BOTTOM_LEFT]});
        }
        if (curCreeps.repairers[0] < curCreeps.repairers[1] && curSpawn.spawning == null){
          curSpawn.spawnCreep(global.creepTiers[0],
            "Repairer" + Game.time.toString(),{memory: {rol:3,ori:curRoomname,sta:0,src:9,dst:9,ldr:9},
            directions:[BOTTOM_RIGHT,BOTTOM,BOTTOM_LEFT]});
        }
        if (curCreeps.haulers[0] < curCreeps.haulers[1] && curSpawn.spawning == null){
          curSpawn.spawnCreep([CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
            "Haulers" + Game.time.toString(),{memory: {rol:4,ori:curRoomname,sta:0,src:9,dst:9,ldr:9},
            directions:[BOTTOM_RIGHT,BOTTOM,BOTTOM_LEFT]});
        }
      }
    }
  },




  //**************
  // execute roles on creeps
  execJobs: function() {
    for(let name in Game.creeps) {
      var creep = Game.creeps[name];
      if(creep.memory.rol == '0') {
        global.roles.harvester(creep);
      }
      if(creep.memory.rol == '1') {
        global.roles.builder(creep);
      }
      if(creep.memory.rol == '2') {
        global.roles.upgrader(creep);
      }
      if(creep.memory.rol == '3') {
        global.roles.repairer(creep);
      }
      if(creep.memory.rol == '4') {
        global.roles.hauler(creep);
      }
    }
  },




  //**************
  // get all towers and execute their jobs
  towers: function(buildings) {
    for (let l in global.lazy){
      for (let t in global.lazy[l].room.buildings.towers){
        buildings.towerJobs(Game.getObjectById(global.lazy[l].room.buildings.towers[t]));
      }
    }
  },




  //**************
  // request energy for creep from stored or source
  reqEnergy: function(req) {

    var keeper = null;
    var ledger = null;
    var sources = [];

    for (let l in global.lazy){
      // get spawn, keeper of the ledger
      keeper = Game.getObjectById(global.lazy[l].room.buildings.spawns[0]);
      // get existing ledger from keeper
      ledger = keeper.memory.ledger;
      // get all possible sources of energy
      if (global.lazy[l].room.buildings.storages.length > 0){
        for (let s in global.lazy[l].room.buildings.storages){
          sources.push([global.lazy[l].room.buildings.storages[s],
          Game.getObjectById(global.lazy[l].room.buildings.storages[s]).store[RESOURCE_ENERGY]]);
        }
      }
      if (global.lazy[l].room.buildings.containers.length > 0){
        for (let c in global.lazy[l].room.buildings.containers){
          sources.push([global.lazy[l].room.buildings.containers[c],
          Game.getObjectById(global.lazy[l].room.buildings.containers[c]).store[RESOURCE_ENERGY]]);
        }
      }
      if (global.lazy[l].room.resources.energy.length > 0){
        for (let e in global.lazy[l].room.resources.energy){
          sources.push([global.lazy[l].room.resources.energy[e],
          Game.getObjectById(global.lazy[l].room.resources.energy[e]).energy]);
          console.log(Game.getObjectById(global.lazy[l].room.resources.energy[e]));
        }
      }
    }
    // check the ledger and apply changes to sources
    for (let l in ledger) {
      for (let s in sources) {
        if (ledger[l][0] == sources[s][0]){
          sources[s][1] -= ledger[l][2];
        }
      }
    }

    var target = null;
    // find viable source
    for (let s in sources) {
      // check if the source has requested energy
      if (sources[s][1] >= req){
        // select target
        target = sources[s][0];
        // get random id to keep track of ledger
        let id = Math.random(Game.time);
        // store new ledger in the keeper
        ledger.push([id,target,(req*-1)]);
        keeper.memory.ledger = ledger;
        // return target and id to creep
        return [target,id];
      }
    }
  },




  //**************
  // remove ledger where id = ledger[l][0]
  rmLedger: function(id) {

    var keeper = null;
    var ledger = null;

    for (let l in global.lazy){
      // get spawn, keeper of the ledger
      keeper = Game.getObjectById(global.lazy[l].room.buildings.spawns[0]);
      // get existing ledger from keeper
      ledger = keeper.memory.ledger;
    }

    for (let l in ledger) {
      if (ledger[l][0] == id){
        ledger.splice(l,1);
      }
    }
  }


};
module.exports = exp;
