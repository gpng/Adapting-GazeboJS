var http = require('http')
, fs = require('fs')
, gazebojs = require('gazebojs')
, url = require('url');

var gazebo = new gazebojs.Gazebo();

options = {format:'jpeg', encoding:'binary'}

http.createServer(function(req, res)
{
	var request = url.parse(req.url, true);
	var action = request.pathname;
	console.log('Requested' + action);
	if (action == '/image') 
	{
		console.log('Requested Image');
		
		gazebo.subscribeToImageTopic('~/camera/link/camera/image', function(err, img)
		{
			console.log('Saving');
			if (err)
			{
				console.log('error: ' + err);
				return;
			}
			fs.writeFile('image.jpeg', img, {encoding:'binary'}, function(err)
			{
				if (err) console.log('ERROR: ' + err);
				else console.log('Saved');
			});
			fs.readFile('image.jpeg', function(err,data) 
			{
				if (err) console.log('ERROR: ' + err);
				else
				{
					res.writeHead(200, {'Content-Type': 'image/jpeg'});
					res.end(data);
				}
			});
			gazebo.unsubscribe('~/camera/link/camera/image');
		}, options);
		
	}
	else if (action == '/move/forward')
	{
		gazebo.publish('gazebo.msgs.JointCmd', '~/my_robot/joint_cmd', { name: "my_robot::left_wheel_hinge", velocity: { target: 1 }});
		gazebo.publish('gazebo.msgs.JointCmd', '~/my_robot/joint_cmd', { name: "my_robot::right_wheel_hinge", velocity: { target: 1 }});
		console.log('Moving forward');
	}
	else if (action == '/move/stop')
	{
		gazebo.publish('gazebo.msgs.JointCmd', '~/my_robot/joint_cmd', { name: "my_robot::left_wheel_hinge", velocity: { target: 0 }});
		gazebo.publish('gazebo.msgs.JointCmd', '~/my_robot/joint_cmd', { name: "my_robot::right_wheel_hinge", velocity: { target: 0 }});
		console.log('Stopping');
	}
	else if (action == '/turn/right')
	{
		gazebo.publish('gazebo.msgs.JointCmd', '~/my_robot/joint_cmd', { name: "my_robot::left_wheel_hinge", velocity: { target: 1 }});
		gazebo.publish('gazebo.msgs.JointCmd', '~/my_robot/joint_cmd', { name: "my_robot::right_wheel_hinge", velocity: { target: -1 }});
		console.log('Turning Right');
	}
	else if (action == '/turn/left')
	{
		gazebo.publish('gazebo.msgs.JointCmd', '~/my_robot/joint_cmd', { name: "my_robot::left_wheel_hinge", velocity: { target: -1 }});
		gazebo.publish('gazebo.msgs.JointCmd', '~/my_robot/joint_cmd', { name: "my_robot::right_wheel_hinge", velocity: { target: 1 }});
		console.log('Turning Left');
	}
	else if (action == '/favicon.ico')
	{
		console.log('favicon.ico requested -> ignore');
	}
	else
	{
		console.log('Err: pathway - ' + action);
	}
}).listen(8124);
console.log('Server running at http://localhost:8124/');
Gerald Png
