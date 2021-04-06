const server = require('express')();
const http = require('http').createServer(server);

const deploy = 0   // 0 => FOR LOCAL MODE    1 => FOR PRODUCTION MODE
// FROM https://www.youtube.com/watch?v=rUSjVri4I30&list=PLCbP9KGntfcG3WMcxEvpxlkQ9zZ3C7gRA&index=15
//const path = require('path');
//const serveStatic = require('serve-static');
//server.use(serveStatic(__dirname + '/client/dist'))

//const io = require('socket.io')(http);	
// FROM https://phasertutorials.com/hosting-your-multiplayer-phaser-game-on-heroku/
// FROM https://www.youtube.com/watch?v=rUSjVri4I30&list=PLCbP9KGntfcG3WMcxEvpxlkQ9zZ3C7gRA&index=15
    const PORT = process.env.PORT || 
        require("socket.io")(http, {   // CROSS CONNECTION PROBLEM
    
        cors: {

            origin: "http://localhost:8080",

            methods: ["GET", "POST"]

        }

    });

    let io = PORT

    //console.log("IO  111:", io)


console.log("DEPLOY: ", deploy)
/****************************************************************/
 
if ( deploy === 1 )  {    // FROM https://github.com/heroku-examples/node-socket.io/blob/main/server.js
    
    //const express = require('express');
    //const socketIO = require('socket.io');

    //console.log("process.env.PORT:  ", process.env.PORT)

    //const INDEX = '/index.html';

    //const server = express()

    //let deploy_io = socketIO(server);

    //console.log("IO :", deploy_io)


    // FROM https://stackoverflow.com/questions/25000275/socket-io-error-hooking-into-express-js
    //const express = require('express');
    const app = express();
    const server = app.listen(PORT, () => {
        console.log("Listening on PORT: " + PORT);
    });
    let deploy_io = require('socket.io')(server);

    /************* ALREADY IMPLEMENTED BELOW    
     * 
     *
    deploy_io.on('connection', (socket) => {
    console.log('Client connected');
    socket.on('disconnect', () => console.log('Client disconnected'));
    });
    *
    *****************************************************************/

    io = deploy_io  // MAKE IO DEPLOY VERSION

}    // FROM https://github.com/heroku-examples/node-socket.io/blob/main/server.js

/*************************************************************************************/

//console.log("IO 2222222222222222222222222222222222222222:", io)


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

/**********************************************
// FROM https://www.youtube.com/watch?v=rUSjVri4I30&list=PLCbP9KGntfcG3WMcxEvpxlkQ9zZ3C7gRA&index=15
//http.listen(3000, function () {
if ( deploy == 0 )  {
    http.listen(io, function () {
        console.log('Server started!');
    });
}
**********************************************/


// FROM https://stackoverflow.com/questions/25000275/socket-io-error-hooking-into-express-js
//const express = require('express');
const app = express();
const server = app.listen(PORT, () => {
    console.log("Listening on PORT: " + PORT);
});
let deploy_io = require('socket.io')(server);