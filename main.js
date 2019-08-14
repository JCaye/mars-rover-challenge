const prompt = require('prompt');

const MissionControl = require('./missionControl');
const Rover = require('./rover');
const Terrain = require('./terrain');

let input_attributes = [
  {
    name: 'boundaries',
    validator: /^\d+\s\d+$/,
    warning: 'For the upper right terrain boundary, please enter two integers separated by a single space'
  },
  {
    name: 'rovers',
    validator: /^\d+\s\d+\s[NEWS]{1}(\s[NEWS]{1})*?(\s\d+\s\d+\s[NEWS]{1}(\s[NEWS]{1})*?)*?$/,
    warning: 'For the rovers, enter its starting position and direction (two integers and one of N-E-W-S, separated by spaces), and an optional set of instructions. At least one rover is required; for more, simply add a space and pass in the new instructions'
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

  let rovers = input.rovers.match(/\d+\s\d+\s[NEWS]{1}(\s[NEWS]{1})*/g).map(each => {
    console.log(each);
    let inputs = each.split(' ');
    return new Rover(parseInt(inputs[0]), parseInt(inputs[1]), inputs[2], inputs.slice(3))
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
