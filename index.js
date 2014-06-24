var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendfile('index.html');
});





var clients = {};

var drawinginstructions = {};

//io is a global that you can emit or listen to, that everyone 
io.on('connection', function(socket){
	//socket is the local instance for each user. 

	clients[socket.id]=socket;
	console.log('############# NEW CONNECTION #############');


	socket.on('room',function(room) {
		socket.join(room);

		if (typeof drawinginstructions[room] !== "undefined") {
			drawinginstructions[room].forEach(function(point) {
				socket.emit('draw',point);
			});
		}

	});


	// add user to the global clients-object

/*
	
	for (var key in clients) {
		var id = clients[key].id;
		var client = clients[key];
		io.emit('test',id); //broadcast to all


		socket.emit('test2',id); //send to own socket



		client.emit('test3',id); //send to specific socket
		socket.broadcast.to(id).emit('test3',id); //another way to send to a specific socket //cant send to self this way
	}
*/


	socket.on('draw',function(point) {
		var room = socket.rooms[1];
		io.to(room).emit('draw',point);
		if (typeof drawinginstructions[room] == "undefined") {
			drawinginstructions[room] = [];
		}
		drawinginstructions[room].push(point);
	});
	socket.on('clear',function() {
		var room = socket.rooms[1];
		io.to(room).emit('clear',{});
		drawinginstructions[room] = [];
	});
	//console.log(io.eio.clients);

	socket.on('disconnect', function(){
		console.log('### user disconnected ###');
		delete clients[socket.id];
	});




	// socket.on('chat message', function(msg){
	// 	socket.broadcast.emit('chat message', msg);
	// });

	// console.log('############# NEW CONNECTION #############');


//	for (var key in io.eio.clients) {
//		var client = io.eio.clients[key].id;
//		io.emit('test',client);
//		socket.emit('test3',client);
	//	io.sockets.socket(client).emit('test2',client);
		//console.log(client);
		//emit to all users 
//	}


});

http.listen(3000, function(){
	console.log('Server running on port 3000');
});