const prompt = require('prompt');

const MissionControl = require('./service/missionControl');
const Rover = require('./model/rover');
const Terrain = require('./model/terrain');

let input_attributes = [
  {
    description: 'Please enter the terrain size. Ex: 20 35',
    name: 'boundaries',
    pattern: /^\d+\s\d+$/,
    message: 'For the upper right terrain boundary, please enter two positive integers separated by a single space'
  },
  {
    description: 'Please enter the rovers starting position and optional instructions. Ex: 1 2 N LMMRM 5 6 E',
    name: 'rovers',
    pattern: /^\d+\s\d+\s[NEWS](\s[LRM]+)?(\s\d+\s\d+\s[NEWS](\s[LRM]+)?)*$/,
    message: 'For the rovers, enter the starting position and direction (two integers and one of N-E-W-S, separated by spaces), and an optional set of instructions. At least one rover is required; for more, simply add a space and pass in the new instructions'
  }
]

prompt.start();

prompt.get(input_attributes, (err, input) => {
  if (err) {
    console.log(err);
    return 1;
  }

  let terrain = new Terrain(...input.boundaries.split(' ').map(each => parseInt(each)));
  console.log(JSON.stringify(terrain));

  let rovers = input.rovers.match(/\d+\s\d+\s[NEWS](\s[LRM]+)?/g).map(each => {
    let inputs = each.split(' ');
    return new Rover(parseInt(inputs[0]), parseInt(inputs[1]), inputs[2], inputs[3] || '');
  });

  let missionControl = new MissionControl(terrain, rovers);
  missionControl.startMission().then(() => {
    missionControl.printMissionStatus('All rovers finished the mission. Their final positions are:');
  }).catch(err => {
    console.log(err);
    missionControl.printMissionStatus('Not all rovers finished the mission. Their final positions are:');
  });

  return 0;
});
