const prompt = require('prompt');

const MissionControl = require('./missionControl');
const Rover = require('../model/rover');
const Terrain = require('../model/terrain');

class MissionPlan {
    constructor() {
    }

    setUpMission() {
        return new Promise((resolve, reject) => {
            prompt.start();
            this.createTerrain().then(terrain => {
                this.createRovers().then(rovers => {
                    resolve(new MissionControl(terrain, rovers));
                }).catch(err => {
                    console.log(err);
                    reject('Failed to initialize rovers');
                });
            }).catch(err => {
                console.log(err);
                reject('Failed to initialize terrain');
            });
        });
    }

    createTerrain() {
        return new Promise((resolve, reject) => {
            const terrainProperties = {
                description: 'Enter the terrain size (E-W width first, N-S height second). Ex: 20 35',
                name: 'boundaries',
                pattern: /^\d+\s\d+$/,
                message: 'For the upper right terrain boundary, please enter two positive integers separated by a single space',
                required: true
            };

            prompt.get(terrainProperties, (err, input) => {
                if (err) {
                    console.log(err);
                    reject('Failed to fetch terrain data.');
                }

                resolve(new Terrain(...input.boundaries.split(' ').map(each => parseInt(each))));
            });
        });
    }

    createRovers() {
        return new Promise((resolve, reject) => {
            const roverValidator = /(\d+\s){2}[NEWS](\s[LRM]+)?/g;
            const roverProperties = {
                description: 'Enter the rovers\' starting position and optional instructions. For extra rovers, just add it at the end after a space. Ex: 1 2 N LMMRM 5 6 E',
                name: 'rovers',
                pattern: new RegExp('^' + roverValidator.source + '(\\s' +  roverValidator.source + ')*$'),
                message: 'For the rovers, enter the starting position and direction (two integers and one of N-E-W-S, separated by spaces), and an optional set of instructions. At least one rover is required; for more, simply add a space and pass in the new instructions',
                required: true
            };

            prompt.get(roverProperties, (err, input) => {
                if (err) {
                    console.log(err);
                    reject('Failed to fetch rover data.');
                }
                resolve(input.rovers.match(roverValidator).map(each => {
                    let inputs = each.split(' ');
                    return new Rover(parseInt(inputs[0]), parseInt(inputs[1]), inputs[2], inputs[3] || '');
                }));
            });
        });
    }
}

module.exports = MissionPlan;