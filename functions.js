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
					'buildings':{
						'spawns':[],
						'towers':[]
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

		for (let l in global.lazy) {
			// find all spawns in every owned room
			let spawns = Game.rooms[global.lazy[l].room.vars.roomname].find(
				FIND_MY_STRUCTURES,{filter: (s) => s.structureType == STRUCTURE_SPAWN});
			for (let s in spawns){
				global.lazy[l].room.buildings.spawns.push(spawns[s].id);
			}
			// find all towers in every owned room
			let towers = Game.rooms[global.lazy[l].room.vars.roomname].find(
				FIND_MY_STRUCTURES,{filter: (s) => s.structureType == STRUCTURE_TOWER});
			for (let t in towers){
				global.lazy[l].room.buildings.towers.push(towers[t].id);
			}
			// count all the creeps per room
			for(let name in Game.creeps) {
				let creep = Game.creeps[name];
				if (creep.memory.ori == global.lazy[l].room.vars.roomname) {
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
				if (curCreeps.harvesters[0] < curCreeps.harvesters[1]) {
					curSpawn.spawnCreep(global.creepTiers[1],
						"Harvester" + Game.time.toString(),{memory: {rol:0,ori:curRoomname,sta:0,src:9,dst:9},
						directions:[BOTTOM_RIGHT,BOTTOM,BOTTOM_LEFT]});
				}
				if (curCreeps.builders[0] < curCreeps.builders[1]) {
					curSpawn.spawnCreep(global.creepTiers[1],
						"Builder" + Game.time.toString(),{memory: {rol:1,ori:curRoomname,sta:0,src:9,dst:9},
						directions:[BOTTOM_RIGHT,BOTTOM,BOTTOM_LEFT]});
				}
				if (curCreeps.upgraders[0] < curCreeps.upgraders[1]) {
					curSpawn.spawnCreep(global.creepTiers[1],
						"Upgrader" + Game.time.toString(),{memory: {rol:2,ori:curRoomname,sta:0,src:9,dst:9},
						directions:[BOTTOM_RIGHT,BOTTOM,BOTTOM_LEFT]});
				}
				if (curCreeps.repairers[0] < curCreeps.repairers[1]) {
					curSpawn.spawnCreep(global.creepTiers[0],
						"Repairer" + Game.time.toString(),{memory: {rol:3,ori:curRoomname,sta:0,src:9,dst:9},
						directions:[BOTTOM_RIGHT,BOTTOM,BOTTOM_LEFT]});
				}
				if (curCreeps.haulers[0] < curCreeps.haulers[1]) {
					curSpawn.spawnCreep([CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
						"Haulers" + Game.time.toString(),{memory: {rol:4,ori:curRoomname,sta:0,src:9,dst:9},
						directions:[BOTTOM_RIGHT,BOTTOM,BOTTOM_LEFT]});
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


};
module.exports = exp;
