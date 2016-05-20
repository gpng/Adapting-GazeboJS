var http = require('http'), fs = require('fs'), gazebojs = require('gazebojs'), url = require('url');
var gazebo = new gazebojs.Gazebo();

// Read JSON specs file into obj
var obj = JSON.parse(fs.readFileSync('specs.json', 'utf8'));
gazebo.publish(obj.actions[1][0].type, obj.actions[1][0].topic, obj.actions[1][0].msg);	
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
	}

	if (action == '/favicon.ico')
	{
		console.log('favicon.ico requested -> ignore');
	}
}).listen(8124);
console.log('Server running at http://localhost:8124/');
