
// FROM https://devcenter.heroku.com/articles/node-websockets
/******************************  ENVIROMENT VARIABLE !!! ****************************/
const ENV_HEROKU = 1
 

const express = require('express');    // FROM https://devcenter.heroku.com/articles/node-websockets
const socketIO = require('socket.io');

/******************************  ENVIROMENT VARIABLE !!! ****************************/
// FROM https://codeburst.io/deploy-your-webpack-apps-to-heroku-in-3-simple-steps-4ae072af93a8

//const express = require('express');    // FROM https://devcenter.heroku.com/articles/node-websockets
//const server = require('express');

//const http = require('http').createServer(server);
const http = require('http').createServer(express);

	//const port = process.env.PORT || 8080;
	const PORT = process.env.PORT ||               // FROM https://codeburst.io/deploy-your-webpack-apps-to-heroku-in-3-simple-steps-4ae072af93a8

	require("socket.io")(http, {      // CROSS CONNECTION PROBLEM
		
		cors: {

			origin: "http://localhost:8080",

			methods: ["GET", "POST"]

		}

	});


		
	if ( ENV_HEROKU == 1)  {     // FROM https://devcenter.heroku.com/articles/node-websockets
		
		const INDEX = '/index.html';

		const server = express()
			.use((req, res) => res.sendFile(INDEX, { root: __dirname }))
			
			console.log( "PORT 555: ", PORT )

			
			server.listen(PORT, () => console.log(`Listening on ${PORT}`));
			
			console.log( "PORT 666: ", server )


			const io = socketIO(server);


	}
	// FROM https://devcenter.heroku.com/articles/node-websockets
	/******************************  ENVIROMENT VARIABLE !!! ****************************/

	else {
		io = PORT
	}




// FROM https://codeburst.io/deploy-your-webpack-apps-to-heroku-in-3-simple-steps-4ae072af93a8
//app.listen(port);
app.listen(io);

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

/************************************/
http.listen(3000, function () {
    console.log('Server started!');
});
/****************************************/

// FROM https://phasertutorials.com/hosting-your-multiplayer-phaser-game-on-heroku/
/***************************************************************
server.listen(port, function () {
    console.log(`Listening on ${server.address().port}`);
  });
********************************************************************/