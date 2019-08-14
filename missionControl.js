const Terrain = require('./terrain');
const Rover = require('./rover');

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
                reject('Rover can\'t be deployed (outside of target area)');
            }

            rover.commitMove();
            console.log(rover);
            while (rover.instructions.length > 0) {
                rover.calculateNextInstruction();

                if (!this.roverIsWithinBounds(rover)) {
                    console.log(rover);
                    rover.rollbackPreviousInstruction();
                    break;
                }
            }

            rover.commitMove();
            if (rover.instructions.length > 0) {
                reject('Rover could not finish mission (risked leaving target area)')
            } else {
                resolve();
            }
        });
    }

    roverIsWithinBounds(rover) {
        return rover.nextX <= this.terrain.maxX
            && rover.nextY <= this.terrain.maxY
            && rover.nextX >= 0
            && rover.nextY >= 0;
    }
}

module.exports = MissionControl;