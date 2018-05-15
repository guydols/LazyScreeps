var exp = {


	//**************
	// harvester role
	harvester: function(creep) {
	// states
	// s == 0 get energy
	// s == 1 store energy
	// s == 2 loiter *not implemented
	// s == 9 init new creep
	switch(creep.memory.sta) {

		// state: s == 9
		// init new creep
		case 9:
			creep.memory.sta = 0;
			break;

		// state: s == 0
		// request and gather energy
		case 0:
			if(creep.carry.energy == creep.carryCapacity){
				creep.memory.sta = 1;
				break;
			}
			var sources = creep.room.find(FIND_SOURCES);
			if (sources[0].energy != 0){
				if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
					creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
				}
			} else {
				if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
					creep.moveTo(sources[1], {visualizePathStyle: {stroke: '#ffaa00'}});
				}
			}
			break;

		// state: s == 1
		// store the energy carried by the creep
		case 1:
			// check if carrying energy is empty
			if (creep.carry.energy == 0) {
				creep.memory.sta = 0;
				break;
			}
			// extension and spawns have 1st priority
			var targets = creep.room.find(FIND_STRUCTURES, { filter: (structure) => {
			return (structure.structureType == STRUCTURE_EXTENSION ||
							structure.structureType == STRUCTURE_SPAWN) &&
							structure.energy < structure.energyCapacity;
			}});
			// var targets = creep.pos.findClosestByRange(targets);
			if (targets.length == 0){
				// towers have 2nd priority
				var targets = creep.room.find(FIND_STRUCTURES, { filter: (structure) => {
				return (structure.structureType == STRUCTURE_TOWER) &&
								structure.energy < structure.energyCapacity;
				}});
				targets.sort((x,y) => x.energy - y.energy);
			}
			if (targets.length == 0){
				// containers have 3nd priority
				var targets = creep.room.find(FIND_STRUCTURES, { filter: (structure) => {
				return (structure.structureType == STRUCTURE_STORAGE) &&
					_.sum(structure.store) < structure.storeCapacity;
				}});
			}
			// move to found target
			if(targets.length > 0) {
				if (targets[0].structureType != STRUCTURE_TOWER){
					var target =  creep.pos.findClosestByRange(targets);
					if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
						creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
					}
				} else {
					if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
						creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
					}
				}
			}
			break;
		}
	},


	//**************
	// builder role
	builder: function(creep) {
		// states
		// s == 0 get energy
		// s == 1 find construction site
		// s == 2 construct building
		// s == 8 return unenergy
		// s == 9 init new creep
		switch(creep.memory.sta) {

		}
		if(creep.memory.sta && creep.carry.energy == 0) {
			creep.memory.sta = false;
		}

		if(!creep.memory.sta && creep.carry.energy == creep.carryCapacity) {
			creep.memory.sta = true;
		}

		if(creep.memory.sta) {
			var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
			if(targets.length) {
				if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
					creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
				}
			}
		}
		else {
			var sources = creep.room.find(FIND_SOURCES);
			if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
				creep.moveTo(sources[1], {visualizePathStyle: {stroke: '#ffaa00'}});
			}
		}
	},


	//**************
	// upgrader role
	upgrader: function(creep) {
		if(creep.memory.sta && creep.carry.energy == 0) {
			creep.memory.sta = false;
		}
		if(!creep.memory.sta && creep.carry.energy == creep.carryCapacity) {
			creep.memory.sta = true;
		}
		if(creep.memory.sta) {
			if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
				creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
			}
		} else {
			var sources = creep.room.find(FIND_SOURCES);
			if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
				creep.moveTo(sources[1], {visualizePathStyle: {stroke: '#ffaa00'}});
			}
		}
	},


	//**************
	// repairer role
	repairer: function(creep){
		// states
		// s == 0 get energy
		// s == 1 get new targets
		// s == 2 go repair target
		// s == 9 init new creep
		// t == 9 no target
		// t != 9 target

		// a new creep inits
		if (creep.memory.sta == 9) {
			creep.memory.sta = 0;
			creep.memory.t = 9;
		}
		// check if energy is 0
		if (creep.carry.energy == 0){
			creep.memory.sta = 0;
			creep.memory.t = 9;
		}
		// get energy
		if (creep.memory.sta == 0) {
			var sources = creep.room.find(FIND_SOURCES);
			if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
				creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
			}
			if(creep.carry.energy == creep.carryCapacity){
				creep.memory.sta = 1;
			}
		}
		// check if energy is not 0 and t is 9
		if (creep.memory.sta == 1 && creep.memory.t == 9){
			var targets = creep.room.find(FIND_STRUCTURES, {filter: function(structure) {
				if (structure.hits < structure.hitsMax){return structure;}
			}});
			targets.sort((x,y) => (((x.hits-x.hitsMax)/x.hitsMax)*100) - (((y.hits-y.hitsMax)/y.hitsMax)*100));
			if(targets.length) {
				creep.memory.t = targets[0].id;
				creep.memory.sta = 2;
			}
		}
		// check if energy is not 0 and t is not 9
		if (creep.memory.sta == 2 && creep.memory.t != 9){
			var target = Game.getObjectById(creep.memory.t);
			// check if current target is fully healed
			if (target.hits == target.hitsMax) {
				creep.memory.t = 9;
				creep.memory.sta = 1;
			}else {
				if(creep.repair(target) == ERR_NOT_IN_RANGE) {
					creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
				}
			}
		}
	},


	//**************
	// hauler role
	hauler: function(creep){
		// states
		// s == 0 search for energy deficiency
		// s == 1 find energy buffer
		// s == 2 get energy from buffer
		// s == 3 deliver energy to dst
		// s == 4 return energy to storage
		// s == 9 init new creep
		// Memory
		// rol: role
		// ori: assigned room
		// sta: state
		// src: source of x
		// dst: destination of x
		switch(creep.memory.sta) {

			// state: s == 9
			// init new creep
			case 9:
				creep.memory.sta = 0;
				break;

			// state: s == 0
			// search energy for deficiency
			case 0:
				// extensions and spawns have 1st priority
				var targets = creep.room.find(FIND_STRUCTURES, { filter: (structure) => {
				return (structure.structureType == STRUCTURE_EXTENSION ||
								structure.structureType == STRUCTURE_SPAWN) &&
								structure.energy < structure.energyCapacity;
				}});
				if (targets.length == 0){
					// towers have 2nd priority
					var targets = creep.room.find(FIND_STRUCTURES, { filter: (structure) => {
					return (structure.structureType == STRUCTURE_TOWER) &&
									structure.energy < (structure.energyCapacity-creep.carryCapacity);
					}});
				}
				// found a target, store in memory.dst and change state
				if(targets.length > 0) {
					creep.memory.dst = targets[0].id;
					if (creep.carry.energy == 0) {
						creep.memory.sta = 1;
					} else {
						creep.memory.sta = 3;
					}
				} else {
					creep.memory.dst = 9;
					if (creep.carry.energy == 0) {
						creep.memory.sta = 0;
					} else {
						creep.memory.sta = 4;
					}
				}
				break;

			// state: s == 1
			// find buffer with energy
			case 1:
				var targets = creep.room.find(FIND_STRUCTURES, { filter: (structure) => {
				return (structure.structureType == STRUCTURE_CONTAINER) &&
					(structure.store[RESOURCE_ENERGY] >= 200);
				}});
				if(targets.length > 0){
					creep.memory.src = targets[0].id;
					creep.memory.sta = 2;
				} else {
					creep.memory.sta = 0; // no energy in storage
				}
				break;

			// state: s == 2
			// get energy form buffer
			case 2:
				var target = Game.getObjectById(creep.memory.src);
				if(creep.withdraw(target,RESOURCE_ENERGY,creep.carryCapacity) == ERR_NOT_IN_RANGE) {
					creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
				}
				if (creep.carry.energy == creep.carryCapacity){
					creep.memory.sta = 3;
					creep.memory.src = 9;
				}
				break;

			// state: s = 3
			// deliver energy to destination
			case 3:
				if (creep.carry.energy != 0){
					var target = Game.getObjectById(creep.memory.dst);

					if (target.energy == target.energyCapacity){
						creep.memory.dst = 9;
						creep.memory.sta = 0;
					} else {
						if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
							creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
						}
					}
				} else {
					creep.memory.dst = 9;
					creep.memory.sta = 0;
				}
				break;

				// state: s = 4
				// return energy
				case 4:
					var targets = creep.room.find(FIND_STRUCTURES, { filter: (structure) => {
					return (structure.structureType == STRUCTURE_CONTAINER) &&
						_.sum(structure.store) < structure.storeCapacity;
						console.log(_.sum(structure.store) < structure.storeCapacity);
					}});
					if (targets.length > 0){
						creep.memory.dst = targets[0].id;
						creep.memory.sta = 3;
					} else {
						creep.memory.sta = 0;
					}
					break;
		}
	}


}; // var exp
module.exports = exp;
