// FROM https://www.youtube.com/watch?v=rUSjVri4I30&t=1706s
// FROM https://stackoverflow.com/questions/25000275/socket-io-error-hooking-into-express-js

const express = require('express')
const server = express()

const cors = require('cors')
const path = require('path')
const serveStatic = require('serve-static')



	// FROM https://stackoverflow.com/questions/25000275/socket-io-error-hooking-into-express-js
	//const port = 3000,
	//app = require('express')(),


	// PRODUCTION MODE FROM https://github.com/heroku-examples/node-socket.io/blob/main/server.js
	// DEPLOY MODE = 1
	server.use(express.json())
	server.use(cors())
	server.use(serveStatic(__dirname + '/client/dist'))
	//let deploy_io = require('socket.io')(server);

	io = require('socket.io')();

	// Your normal express routes go here...

	// Launching app
	const PORT = process.env.PORT || 3000

	const serverInstance = server.listen(PORT, () => {
		console.log('SERVER STARTED RUNNING AT PORT ' + PORT);
	});

	// Initializing socket.io
	io.attach(serverInstance);

	let players = [];


io.on('connection', function (socket) {
    console.log('A user connected: ' + socket.id);


    players.push(socket.id);

    if (players.length === 1) {
        io.emit('isPlayerA');
    };
	
	
    socket.on('flipfromclient', function (cardIdx, sprite) {  
        console.log('SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSIN SERVER FLIP-CARD ',  cardIdx, sprite.textureKey)
        io.emit('flipfromserver', cardIdx, sprite);
    });
	
    socket.on('flipByAnimFramesFromClient', function (cardIdx, sprite) {  
        io.emit('flipByAnimFramesFromServer', cardIdx, sprite);
    });

    socket.on('flipMyCardFromClient', function ( cardIdx ) { 
        console.log('IN SERVER flipMyCardFromClient ', cardIdx)
        io.emit('flipMyCardFromServer', cardIdx);
    });

    socket.on('flipLeftFromClient', function ( cardIdx ) { 
        console.log('IN SERVER flipLeftFromClient ', cardIdx)
        io.emit('flipLeftFromServer', cardIdx);
    });

    socket.on('flipRightFromClient', function ( cardIdx ) { 
        console.log('IN SERVER flipRightFromClient', cardIdx)
        io.emit('flipRightFromServer', cardIdx);
    });
	
    
    socket.on('setCardss', function () {  
        io.emit('setCardss');
    });

    socket.on('cardPlayed', function (gameObject, isPlayerA) {
        io.emit('cardPlayed', gameObject, isPlayerA);
    });

    socket.on('disconnect', function () {
        console.log('A user disconnected: ' + socket.id);
        players = players.filter(player => player !== socket.id);
    });


});