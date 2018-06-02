'use strict'

// Setup basic express server
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser');

var port = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function (req, res) {
    res.status(200).send({ Fichero: 'Recibido' });
});

server.listen(port, () => {
    console.log(`Servidor activo na porta ${port}`);
});