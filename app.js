'use strict'

// Setup basic express server
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser');

var port = process.env.PORT || 8000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(express.static('public'));

/*
app.get('/', function (req, res) {
    res.status(200).send({ Fichero: 'Recibido' });
});
*/

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/pages/login.html'));
});

server.listen(port, () => {
    console.log(`Servidor activo na porta ${port}`);
});