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
* Takes input in the form of HTTP POST/GET requests. Outputs JSON messages to Gazebo server based on commands in specs.json
* Completed. Additional features may still be added if required.

#### specs.json
* Contains commands used by RLI. At this point, includes only state extraction and action commands. Action 0 used as the reset or default action. 
* To be configured per experiment

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