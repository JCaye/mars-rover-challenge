const MissionPlan = require('./service/missionPlan');

const missionPlan = new MissionPlan();
missionPlan.setUpMission().then(missionControl => {
  missionControl.startMission().then(() => {
    missionControl.printMissionStatus('All rovers finished the mission. Their final satus are:');
  }).catch(err => {
    console.log(err);
    missionControl.printMissionStatus('Not all rovers finished the mission. Their final satus are:');
  });
}).catch(err => {
  console.log(err);
});