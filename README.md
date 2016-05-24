# __Adapting GazeboJS for End-to-End Reinforcement Learning__ 

Javascript server for connecting machine learning algorithms to [Gazebo Robot Simulator](http://gazebosim.org/).

## __Requirements__ 

#### NodeJS Server 
* GazeboJS

#### Experiments 
* Torch7
* DeepQLearning - [https://github.com/blakeMilner/DeepQLearning/](https://github.com/blakeMilner/DeepQLearning/)
* rlenvs - Reinforcement Learning Environments - [https://github.com/Kaixhin/rlenvs](https://github.com/Kaixhin/rlenvs)


## __Progress__ 
###__Core__
####RLI_v1.js

* Javascript server using NodeJS. 
* Takes input in the form of HTTP POST/GET requests. Outputs JSON messages to Gazebo server via publishing to topics based on commands in specs.json.
* Queries used to specify inputs. Current queries are `type` and `select` 
* Available commands are:
 * Reset world state `http://localhost:8124/?type=reset`
 * Pause `http://localhost:8124/?type=pause&select=1`, `select=0` to unpause
 * Request state `http://localhost:8124/?type=state&select=0`. The state is then sent as a response string which can be parsed in JSON.
 * Send action 1 `http://localhost:8124/?type=state&select=0`


#### specs.json
* Contains commands used by RLI. At this point, includes only state extraction and action commands. Action 0 used as the reset or default action. 
* To be configured per experiment
* Each state has 2 fields `type` and `topic`. 
* Each action has 2 fields `type`, `topic` and `msg`
* `type`: Type of message to send. Examples are PosesStamped, JointCmd. Can be found in the [Gazebo transport library](https://bitbucket.org/osrf/gazebo/src/8b0c2de0886a/gazebo/msgs/?at=gazebo_1.9).
* `topic`: Gazebo topic to publish to. Available topics can be found using `gz topic -l`. Examples are `~/my_robot/joint_cmd`
* `msg`: Message to be published. Examples are `{ "name": "my_robot::left_wheel_hinge", "force": 0 }`. Messages are usually JSON objects.
* `type`, `topic` and `msg` must match, i.e. the joint_cmd topic can only receive a JointCmd message.
* Each action can have multiple commands. 

###__Tests__
####MountainCar.th
* Simple demonstration of a car undergoing random walk around a grid. 
* Shows ability to extract state and give action commands

####MountainCarDQN.th
* Attempt to apply DQN to 2D mountain car experiment.
* Mountain car environment taken from [https://github.com/Kaixhin/rlenvs](https://github.com/Kaixhin/rlenvs)
* DQN adapted from [https://github.com/blakeMilner/DeepQLearning](https://github.com/blakeMilner/DeepQLearning)
* Seems to show convergence, but unable to test learned network. Results seem to degrade after switching off learning.

####3DMountainCar.th
* Kind of misnamed, will rename eventually.
* GridWorld 3D adaptation, not mountain car.
* Aim is for car to drive towards a target position (3,3)
* Constrained within a 9x9 box around the origin (0, 0)
* Rewards -ve manhattan distance to target (3,3) - the closer the better
* DQN adapted from [https://github.com/blakeMilner/DeepQLearning](https://github.com/blakeMilner/DeepQLearning)
* WIP - Getting errors regarding DQN which occurs after some time. Not present in 2d Mountain Car test.

####my_mesh.world / ValleyRamp.dae
* ValleyRamp.dae - Ramp created in SketchUp and implemented in Gazebo.
* my_mesh.world - Gazebo world containing ramp.
* Attempting to model a 3D Mountain Car adaptation to be used for tests.