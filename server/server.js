#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('../app');
var debug = require('debug')('dgscs-back:server');
var https = require('https');
var fs = require('fs');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTPS server.
 */

var server = https.createServer({
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
}, app)

/**
 * Listen to socket.io.
 */

 var io = require('socket.io').listen(server);

 var nsptask = io.of('/task')
 nsptask.on('connection', (socket) => {


  console.log('Nouvelle connexion à socket.io!');

  socket.on('JOIN_ROOM', function(data){

    socket.join(data.room);

  })

  socket.on('SEND_MESSAGE',function(data){
    nsp.to(data.room).emit('RECEIVE_MESSAGE',data.data);
  })

  socket.on('LEAVE_ROOM', function(data){
    socket.leave(data.room);
  }) 


 })

 var nsp = io.of('/workpackage')
 nsp.on('connection', (socket) => {


  console.log('Nouvelle connexion à socket.io!');

  socket.on('JOIN_ROOM', function(data){

    socket.join(data.room);

  })

  socket.on('SEND_MESSAGE',function(data){
    nsp.to(data.room).emit('RECEIVE_MESSAGE',data.data);
  })

  socket.on('LEAVE_ROOM', function(data){
    socket.leave(data.room);
  }) 


 })



/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
