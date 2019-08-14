class Rover {
    constructor(xStart, yStart, facingStart, instructions) {
        this.nextX = xStart;
        this.nextY = yStart;
        this.facingDirection = facingStart;
        this.instructions = instructions.reverse();
        this.previousInstructions = [];
        this.isDeployed = false;
    }

    calculateNextInstruction() {
        let nextMove = this.instructions.pop();

        switch (nextMove) {
            case 'N':
                this.nextY += 1;
                break;
            case 'E':
                this.nextX += 1;
                break;
            case 'W':
                this.nextX -= 1;
                break;
            case 'S':
                this.nextY -= 1;
                break;
            default:
                throw Error('Can\'t really go there, mate...');
        }

        this.facingDirection = nextMove;
        this.previousInstructions.push(nextMove);
    }

    rollbackPreviousInstruction() {
        let previousMove = this.previousInstructions.pop();

        switch (previousMove) {
            case 'N':
                this.nextY -= 1;
                break;
            case 'E':
                this.nextX -= 1;
                break;
            case 'W':
                this.nextX += 1;
                break;
            case 'S':
                this.nextY += 1;
                break;
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
    }

    hasConcludedMission() {
        return this.isDeployed && this.instructions.length === 0;
    }

    toJSON() {
        let preface = this.isDeployed
            ? this.instructions.length === 0 ? 'Mission done.' : 'Mission incomplete.'
            : 'Failed to deploy.';
        return `${preface}` + (this.isDeployed ? `Currently at ${this.xPosition} East, ${this.yPosition} North` : '');
    }
}

module.exports = Rover;