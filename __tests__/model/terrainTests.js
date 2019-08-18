const Terrain = require('../../src/model/terrain');


const xSize = 25
const ySize = 42;
const terrain = new Terrain(xSize, ySize);

test('Creates terrain with correct size', () => {
    expect(terrain.maxX).toEqual(xSize);
    expect(terrain.maxY).toEqual(ySize);
});

test('Asserts terrain contains coordinates', () => {
    let conditions =  [
        {coordinates: [10, 20], isContained: true},
        {coordinates: [25, 42], isContained: true},
        {coordinates: [0, 0], isContained: true},
        {coordinates: [25, 50], isContained: false},
        {coordinates: [30, 40], isContained: false},
        {coordinates: [-10, 20], isContained: false},
        {coordinates: [10, -10], isContained: false}
    ];

    conditions.forEach(condition => {
        expect(terrain.containsCoordinates(...condition.coordinates)).toEqual(condition.isContained);
    });
});

test('Jsonified message is correct', () => {
    expect(terrain.toJSON()).toEqual(`The terrain is ${xSize} by ${ySize}`);
});