/***server module*****/

import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';

import http from 'http';
import logger from './libs/logger.js';

let normalizePort = val => {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

let onError = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  switch (error.code) {
    case 'EACCES':
      console.error(bind + 'requires elevated privilages');
      process.exit(1);
    case 'EADDRINUSE':
      console.error(bind + 'is already in use');
      process.exit(1);
    default:
      throw error;
  }
};

let onListening = () => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? 'pipe' + addr : 'port ' + addr.port;
  logger.info('[server] Listening on ' + bind);
};

const port = normalizePort(process.env.PORT);
app.set('port', port);

const server = http.createServer(app);

server.on('error', onError);
server.on('listening', onListening);
server.listen(port);
