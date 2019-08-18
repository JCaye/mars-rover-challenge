class Rover {
    constructor(xStart, yStart, facingStart, instructions) {
        this.nextX = xStart;
        this.nextY = yStart;
        this.nextOrientation = facingStart;
        this.instructions = instructions.split('').reverse();
        this.previousInstructions = [];
        this.isDeployed = false;
    }

    calculateNextInstruction() {
        let nextMove = this.instructions.pop();

        switch (nextMove) {
            case 'L':
                this.turnLeft();
                break;
            case 'R':
                this.turnRight();
                break;
            case 'M':
                this.move(1);
                break;
            default:
                throw Error('Can\'t really go there, mate...');
        }

        this.previousInstructions.push(nextMove);
    }

    turnLeft() {
        switch (this.nextOrientation) {
            case 'N':
                this.nextOrientation = 'W';
                break;
            case 'E':
                this.nextOrientation = 'N';
                break;
            case 'W':
                this.nextOrientation = 'S';
                break;
            case 'S':
                this.nextOrientation = 'E';
                break;
        }
    }

    turnRight() {
        switch (this.nextOrientation) {
            case 'N':
                this.nextOrientation = 'E';
                break;
            case 'E':
                this.nextOrientation = 'S';
                break;
            case 'W':
                this.nextOrientation = 'N';
                break;
            case 'S':
                this.nextOrientation = 'W';
                break;
        }
    }

    move(distance) {
        switch (this.nextOrientation) {
            case 'N':
                this.nextY += distance;
                break;
            case 'E':
                this.nextX += distance;
                break;
            case 'W':
                this.nextX -= distance;
                break;
            case 'S':
                this.nextY -= distance;
                break;
        }
    }

    rollbackPreviousInstruction() {
        let previousMove = this.previousInstructions.pop();

        switch (previousMove) {
            case 'L':
                this.turnRight();
                break;
            case 'R':
                this.turnLeft();
                break;
            case 'M':
                this.move(-1);
                break;
            default:
                throw Error('Can\'t really go there, mate...');
        }

        this.instructions.push(previousMove);
    }

    deploy() {
        this.commitMove();
        this.isDeployed = true;
    }

    commitMove() {
        this.xPosition = this.nextX;
        this.yPosition = this.nextY;
        this.orientation = this.nextOrientation;
    }

    hasConcludedMission() {
        return this.isDeployed && this.instructions.length === 0;
    }

    getCoordinates() {
        return [this.nextX, this.nextY];
    }

    toJSON() {
        return !this.isDeployed ?
            'Failed to deploy.' :
            `Currently at ${this.xPosition} East, ${this.yPosition} North.` + (
                this.hasConcludedMission() ?
                ' Mission done.' :
                ' Mission incomplete.'
            );
    }
}

module.exports = Rover;