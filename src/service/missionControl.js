const Terrain = require('../model/terrain');
const Rover = require('../model/rover');

class MissionControl {
    constructor(terrain, rovers) {
        if (!(terrain instanceof Terrain)) {
            throw Error('The mission must happen somewhere! (no terrain specified)')
        }

        if (!(rovers instanceof Array) || rovers.filter(each => !(each instanceof Rover)).length > 0) {
            throw Error('Only rovers are allowed!')
        }

        this.terrain = terrain;
        this.rovers = rovers;
    }

    startMission() {
        return Promise.all(
            this.rovers.map(each => { 
                return this.launchRover(each);
            })
        );
    }

    printMissionStatus(message) {
        console.log(message);
        this.rovers.forEach(each => {
            console.log(JSON.stringify(each));
        });
    }

    launchRover(rover) {
        return new Promise((resolve, reject) => {
            if (!(this.roverIsWithinBounds(rover))) {
                reject('Rover can\'t be deployed outside of target area');
            } else {
                rover.deploy();
                while (!rover.hasConcludedMission()) {
                    rover.calculateNextInstruction();
    
                    if (!this.roverIsWithinBounds(rover)) {
                        rover.rollbackPreviousInstruction();
                        break;
                    }
                }
    
                rover.commitMove();
                if (rover.hasConcludedMission()) {
                    resolve();
                } else {
                    reject('Rover could not finish mission (risked leaving target area)');
                }
            }
        });
    }

    roverIsWithinBounds(rover) {
        let roverPosition = rover.getCoordinates();
        return this.terrain.containsCoordinates(...roverPosition);
    }
}

module.exports = MissionControl;