const server = require('express')();
const http = require('http').createServer(server);

//const io = require('socket.io')(http);	
// FROM https://phasertutorials.com/hosting-your-multiplayer-phaser-game-on-heroku/
const io = process.env.PORT || 
require("socket.io")(http, {   // CROSS CONNECTION PROBLEM
    

    cors: {

        origin: "http://localhost:8080",

        methods: ["GET", "POST"]

    }

});

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