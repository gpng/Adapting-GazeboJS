var http = require('http'), fs = require('fs'), gazebojs = require('gazebojs'), url = require('url');
var gazebo = new gazebojs.Gazebo();

// Read JSON specs file into obj
var obj = JSON.parse(fs.readFileSync('specs.json', 'utf8'));
gazebo.publish(obj.actions[1][0].type, obj.actions[1][0].topic, obj.actions[1][0].msg);	
gazebo.publish('gazebo.msgs.Physics', '~/physics', { real_time_update_rate: 1});
console.log("Dummy action");

// Creating http server on port 8124
http.createServer(function(req, res)
{
	// Parsing url request
	var request = url.parse(req.url, true);
	var action = request.pathname;
	var type = request.query.type;
	var select = request.query.select;
	console.log('Requested: ' + type + ' ' + select);
	if (type == "state")
	{
		gazebo.subscribe(obj.states[select].type,  obj.states[select].topic, function(err, msg)   // msg is a JSON object
		{
			if (err)
			{
				console.log('Error: ' + err);
				return;
			}
			res.setHeader('Content-Type',  'text/html');
			res.end(JSON.stringify(msg));
			gazebo.unsubscribe(obj.states[select].topic);	
		})
	}
	if (type == "action")

	{
		// Take actions
		for (var i = 0; i < obj.actions[select].length; i++)
		{
			gazebo.publish(obj.actions[select][i].type, obj.actions[select][i].topic, obj.actions[select][i].msg);
		}
		res.end("Response end");
	}
	if (type == "reset")
	{
		// Reset world
		gazebo.publish("gazebo.msgs.WorldControl", "~/world_control", { reset: { all: true } });
		// Default action (set as 0 velocity -- car not moving)
		for (var i = 0; i < obj.actions[0].length; i++)
		{
			gazebo.publish(obj.actions[0][i].type, obj.actions[0][i].topic, obj.actions[0][i].msg);
		}
		res.end("Response end");
	}

	if (type == "pause")
	{
		if (select == 1)
			gazebo.publish('gazebo.msgs.WorldControl', '~/world_control', { pause: true});
		else
		{
			gazebo.publish('gazebo.msgs.WorldControl', '~/world_control', { pause: false});
		}
		res.end("Response end");
	}
	if (action == '/favicon.ico')
	{
		console.log('favicon.ico requested -> ignore');
		res.end("Response end");
	}
	if (type == "real_time_factor")
	{	
		console.log('helloworld')
		gazebo.publish('gazebo.msgs.Physics', '~/physics', { real_time_update_rate: select/0.001});
		res.end('Real time factor')
	}
}).listen(8124);
console.log('Server running at http://localhost:8124/');
