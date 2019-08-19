
const MissionControl = require('../../src/service/missionControl');
const Rover = require('../../src/model/rover');
const Terrain = require('../../src/model/terrain');

const terrain = new Terrain(20, 20);
const missionControl = new MissionControl(terrain, []);


test('Creates proper mission control', () => {
    expect(missionControl.terrain).toEqual(terrain);
    expect(missionControl.rovers).toEqual([]);
});

test('Rovers are correctly identified as in and out of bounds', () => {
    let rover = new Rover(26, 34, 'W', 'LRMR');
    rover.getCoordinates = jest.fn(() => []);
    
    let conditions = [
        {
            inside: true
        },
        {
            inside: false
        }
    ];

    conditions.forEach(condition => {
        terrain.containsCoordinates = jest.fn(() => condition.inside);
        expect(missionControl.roverIsWithinBounds(rover)).toEqual(condition.inside);
    });
});

test('Launched rover concludes its mission when possible', () => {
    let conditions = [
        {
            rover: new Rover(5, 5, 'W', 'MMMMMMMM'),
            deploys: true,
            concludes: false,
            message: 'Rover could not finish mission (risked leaving target area)'
        },
        {
            rover: new Rover(5, 5, 'W', 'MMLLMLMM'),
            deploys: true,
            concludes: true
        },
        {
            rover: new Rover(5, 5, 'W', 'MMMMMMMM'),
            deploys: false,
            concludes: null,
            message: 'Rover can\'t be deployed outside of target area'
        }
    ];

    conditions.forEach(async condition => {
        missionControl.roverIsWithinBounds = jest.fn()
            .mockImplementationOnce(rover => condition.deploys)
            .mockImplementationOnce(rover => condition.concludes);
        
        condition.rover.calculateNextInstruction = jest.fn();
        condition.rover.rollbackPreviousInstruction = jest.fn();
        condition.rover.deploy = jest.fn();
        condition.rover.hasConcludedMission = jest.fn()
            .mockImplementationOnce(() => false)
            .mockImplementationOnce(() => condition.concludes)
            .mockImplementationOnce(() => condition.concludes);
        
        if (condition.deploys && condition.concludes) {
            await expect(missionControl.launchRover(condition.rover)).resolves.toBe();
        } else {
            await expect(missionControl.launchRover(condition.rover)).rejects.toBe(condition.message);
        }
    })
});

test('Starting mission launches all rovers', async () => {
    let fakeRovers = ['fakerover1', 'fakerover2', 'fakerover3']
    missionControl.rovers = fakeRovers;
    missionControl.launchRover = jest.fn((rover) => {
        return new Promise((resolve, reject) => {
            resolve();
        });
    });;

    await missionControl.startMission();
    expect(missionControl.launchRover.mock.calls.length).toEqual(fakeRovers.length);
});

test('Mission status gets printed to console', () => {
    let consoleSpy = jest.spyOn(global.console, 'log');
    let fakeRovers = ['fakerover1', 'fakerover2', 'fakerover3'];
    missionControl.rovers = fakeRovers;

    let statusMessage = 'Houston, we have a problem';
    missionControl.printMissionStatus(statusMessage);

    expect(consoleSpy).toHaveBeenNthCalledWith(1, statusMessage);
    expect(consoleSpy).toHaveBeenNthCalledWith(2, JSON.stringify(fakeRovers[0]));
    expect(consoleSpy).toHaveBeenNthCalledWith(3, JSON.stringify(fakeRovers[1]));
    expect(consoleSpy).toHaveBeenNthCalledWith(4, JSON.stringify(fakeRovers[2]));
});