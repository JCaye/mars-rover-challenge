# Mars Rovers Challenge

Send and monitor you own rovers into mars!

## How
Fire up the mission by running `npm run-script run`. You will be prompted for the *target terrain boundaries* and the *rovers* to be sent.

* Terrain: the input must be two positive integers separated by a space. The first number is the East to West terrain width; the second is the North to South terrai height;
* Rovers: At least one rover must be sent, with as many as necessary optional ones. For deploying a rover, enter is starting coordinates (two positive integers, space separated, for the E-W and N-S position) along with the direction it starts facing separated by another space (one of **N-E-W-S**); this can be optionally followed with a set of instructions for the rover to explore the target terrain (one of **N-E-W-S** for each instruction, space separated). For the optional rovers, just add another space at the end and enter its deployment information.

## What
After terrain configuration and rover preparation, all rovers will be simultaneously deployed and start following their instructions. Rovers which attempt to leave the area will stop at the edge and be prevented from finishing their mission.