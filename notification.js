var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.set('view engine','ejs');

io.use(function(socket, next){
	console.log("socket created");
	console.log(socket.handshake.query.current_user_id);
	socket.self_room = "self_room" +socket.handshake.query.current_user_id;
	socket.join(socket.self_room);
	console.log(socket.self_room + " is the self_room");
	next();
})

io.on('connection', function(socket){

	console.log("someone connected");

	socket.on('group_opened',function(data){
		var room = data.group_id;
		socket.join(room);
		socket.room = room;
		console.log("joined the group");
	});

	socket.on('push_notification',function(data){
		console.log("this is push_notification");
		console.log(data);
		for(var i = 0; i < data.group_member.length ;i++){
			var room = "self_room"+data.group_member[i];
			console.log("sent to " + room)
			io.to(room).emit("pushed_notification",{ group_id: data.group_id, group_poll_id: data.group_poll_id, group_poll_name: data.group_poll_name });
		}
	});

	socket.on('group_poll_created',function(data){
		console.log("this is the group_poll_created_socket")
		console.log(data);
		var room = data.group_id;
		socket.join(room);
		socket.room = room;
		console.log("joined the group");
		io.to(socket.room).emit("emit_group_poll",{ group_id: data.group_id, group_poll_id: data.group_poll_id, group_poll_name: data.group_poll_name });
	});


});



server.listen(8000,function(){
	console.log("i am listening to port *8000");
});