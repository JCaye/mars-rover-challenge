const Rover = require('../../src/model/rover');



const instructions = 'LRMM';
const initialConditions = {
    xStart: 10,
    yStart: 20,
    facingStart: 'N',
    instructions: instructions.split('').reverse(),
    previousInstructions: [],
    isDeployed: false,
    xPosition: undefined,
    yPosition: undefined,
    orientation: undefined
};
const rover = new Rover(
    initialConditions.xStart,
    initialConditions.yStart,
    initialConditions.facingStart,
    instructions
);

test('Creates undeployed rover', () => {
    let actual = {
        xStart: rover.nextX,
        yStart: rover.nextY,
        facingStart: rover.nextOrientation,
        instructions: rover.instructions,
        previousInstructions: rover.previousInstructions,
        isDeployed: rover.isDeployed,
        xPosition: rover.xPosition,
        yPosition: rover.yPosition,
        orientation: rover.orientation
    };
    expect(actual).toEqual(initialConditions);
});

test('Deploys properly', () => {
    const spy = jest.spyOn(rover, 'commitMove');

    rover.deploy();
    expect(spy).toHaveBeenCalled();
    expect(rover.isDeployed).toBeTruthy();
    expect(rover.xPosition).toEqual(initialConditions.xStart);
    expect(rover.yPosition).toEqual(initialConditions.yStart);
    expect(rover.orientation).toEqual(initialConditions.facingStart);
});

test('Calculates next move properly', () => {
    const leftSpy = jest.spyOn(rover, 'turnLeft');
    const rightSpy = jest.spyOn(rover, 'turnRight');
    const moveSpy = jest.spyOn(rover, 'move');

    let conditions = [
        {
            spy: leftSpy,
            remainingInstructions: initialConditions.instructions.slice(0, 3),
            previousInstructions: initialConditions.instructions.slice(3, 4).reverse()
        },
        {
            spy: rightSpy,
            remainingInstructions: initialConditions.instructions.slice(0, 2),
            previousInstructions: initialConditions.instructions.slice(2, 4).reverse()
        },
        {
            spy: moveSpy,
            remainingInstructions: initialConditions.instructions.slice(0, 1),
            previousInstructions: initialConditions.instructions.slice(1, 4).reverse()
        }
    ];

    conditions.forEach(condition => {
        rover.calculateNextInstruction();

        expect(condition.spy).toHaveBeenCalled();
        expect(rover.instructions).toEqual(condition.remainingInstructions);
        expect(rover.previousInstructions).toEqual(condition.previousInstructions);
    });
});

test('Rollsback instructions properly', () => {
    const leftSpy = jest.spyOn(rover, 'turnLeft');
    const rightSpy = jest.spyOn(rover, 'turnRight');
    const moveSpy = jest.spyOn(rover, 'move');

    let conditions = [
        {
            spy: rightSpy,
            remainingInstructions: initialConditions.instructions.slice(0, 2),
            previousInstructions: initialConditions.instructions.slice(2, 4).reverse()
        },
        {
            spy: leftSpy,
            remainingInstructions: initialConditions.instructions.slice(0, 3),
            previousInstructions: initialConditions.instructions.slice(3, 4).reverse()
        },
        {
            spy: moveSpy,
            remainingInstructions: initialConditions.instructions.slice(0, 4),
            previousInstructions: initialConditions.instructions.slice(4, 4).reverse()
        }
    ];

    conditions.forEach(condition => {
        rover.rollbackPreviousInstruction();

        expect(condition.spy).toHaveBeenCalled();
        expect(rover.instructions).toEqual(condition.remainingInstructions);
        expect(rover.previousInstructions).toEqual(condition.previousInstructions);
    });
});

test('Turns left', () => {
    rover.nextOrientation = 'N';

    let orientations = ['W', 'S', 'E', 'N'];
    orientations.forEach(orientation => {
        rover.turnLeft();
        expect(rover.nextOrientation).toEqual(orientation);
    });
});

test('Turns right', () => {
    rover.nextOrientation = 'N';

    let orientations = ['E', 'S', 'W', 'N'];
    orientations.forEach(orientation => {
        rover.turnRight();
        expect(rover.nextOrientation).toEqual(orientation);
    });
});

test('Moves a towards direction', () => {
    let conditions = [
        {
            orientation: 'N',
            distance: 3,
            finalX: 0,
            finalY: 3
        },
        {
            orientation: 'E',
            distance: -1,
            finalX: -1,
            finalY: 0
        },
        {
            orientation: 'W',
            distance: 10,
            finalX: -10,
            finalY: 0
        },
        {
            orientation: 'S',
            distance: -2,
            finalX: 0,
            finalY: 2
        }
    ];

    conditions.forEach(condition => {
        rover.nextX = 0;
        rover.nextY = 0;
        rover.nextOrientation = condition.orientation;

        rover.move(condition.distance);

        expect(rover.nextX).toEqual(condition.finalX);
        expect(rover.nextY).toEqual(condition.finalY);
        expect(rover.nextOrientation).toEqual(condition.orientation);
    });
});

test('Commits move', () => {
    let nextX = 10;
    let nextY = -2;
    let nextOrientation = 'E';

    rover.nextX = nextX;
    rover.nextY = nextY;
    rover.nextOrientation = nextOrientation;
    rover.xPosition = null;
    rover.yPosition = null;
    rover.orientation = null;

    rover.commitMove();

    expect(rover.xPosition).toEqual(nextX);
    expect(rover.yPosition).toEqual(nextY);
    expect(rover.orientation).toEqual(nextOrientation);
});

test('Has concluded mission when deployed and followed all instructions', () => {
    rover.isDeployed = true;
    rover.instructions = [];

    expect(rover.hasConcludedMission()).toBeTruthy();
});

test('Has not concluded mission when not deployed', () => {
    rover.isDeployed = false;
    rover.instructions = null;

    expect(rover.hasConcludedMission()).toBeFalsy();
});

test('Has not concluded mission when deployed but instructions remain', () => {
    rover.isDeployed = true;
    rover.instructions = ['N', 'S'];

    expect(rover.hasConcludedMission()).toBeFalsy();
});

test('Returns coordinates for next landing spot', () => {
    let coordinates = [240, 123];
    
    rover.nextX = coordinates[0];
    rover.nextY = coordinates[1];

    expect(rover.getCoordinates()).toEqual(coordinates);
});

test('Jsonifies correctly when not deployed', () => {
    let conditions = [
        {
            isDeployed: false,
            instructions: null,
            xPosition: null,
            yPosition: null,
            message: 'Failed to deploy.'
        },
        {
            isDeployed: true,
            instructions: ['M', 'R', 'M'],
            xPosition: 20,
            yPosition: 8,
            message: 'Currently at 20 East, 8 North. Mission incomplete.'
        },
        {
            isDeployed: true,
            instructions: [],
            xPosition: 15,
            yPosition: 74,
            message: 'Currently at 15 East, 74 North. Mission done.'
        }
    ];

    conditions.forEach(condition => {
        rover.isDeployed = condition.isDeployed;
        rover.instructions = condition.instructions;
        rover.xPosition = condition.xPosition;
        rover.yPosition = condition.yPosition;

        expect(rover.toJSON()).toEqual(condition.message);
    });
});
