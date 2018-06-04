'use strict'

// Setup basic express server
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser');
var moment = require('moment');
var request = require('request');

var port = process.env.PORT || 80;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(express.static('public'));

/*
app.get('/', function (req, res) {
    res.status(200).send({ Fichero: 'Recibido' });
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/pages/login.html'));
});

servicos: <%- JSON.stringify(servicos) %>
https://latitudeapp.herokuapp.com/webhooks/whatsapp
*/

app.post('/webHooks/whatsapp', function (req, res) {

    //console.log(req.headers);
    //console.log(req.body);
    let agora = moment().format('HH:mm:ss DD/MM/YYYY');
    var text = req.body.data.split('\\');

    console.log(text);

    /*text = text.replace('/\\','');
        var s = text.replace(/\\n/g, "\\n")
            .replace(/\\'/g, "\\'")
            .replace(/\\"/g, '\\"')
            .replace(/\\&/g, "\\&")
            .replace(/\\r/g, "\\r")
            .replace(/\\t/g, "\\t")
            .replace(/\\b/g, "\\b")
            .replace(/\\f/g, "\\f");
        // remove non-printable and other non-valid JSON chars
        s = s.replace(/[\u0000-\u0019]+/g, "");
    */
    /*
        let bodyPost = JSON.parse(text);
    
        console.log(bodyPost);
    
        console.log(text);
    
        
    */
    /*io.emit('mensagem', {
        dataChegada: agora,
        origem: post.from,
        texto: post.text,
        inbound: true
    });*/

    //res.end(`${agora} - ${bodyPost.from} - ${bodyPost.text}`);
    res.end(`${agora}`);
});

io.on('connection', (socket) => {
    console.log(`Cliente ${socket.client.id} conectado.`);

    socket.on('enviarMsg', (data) => {
        var headers = {
            'User-Agent': 'Super Agent/0.0.1',
            'Content-Type': 'application/x-www-form-urlencoded'
        }

        var options = {
            url: 'http://panel.apiwha.com/send_message.php',
            method: 'GET',
            headers: headers,
            qs: {
                'apikey': 'WHB921DDXRUE1WQK8MPG',
                'number': data.contact,
                'text': data.texto
            }
        }

        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                // Print out the response body

                io.emit('mensagem', {
                    dataChegada: moment().format('hh:mm:ss dd-MM-YYYY'),
                    origem: 'Agente',
                    texto: data.texto,
                    inbound: false
                });

                console.log(body)
            }

            console.log(response);
        })

        /*io.emit('mensagem', {
            dataChegada: moment().format('hh:mm:ss dd-MM-YYYY'),
            origem: 'Agente',
            texto: data.texto,
            inbound: false
        });*/

        console.log(data);
    });
});

app.get('/', function (req, res) {
    try {
        res.render('index', {
            titulo: 'Pagina de Inicio',
            subtitulo: 'Seja bem vindo',
            servicos: [{
                nome: 'Facebook',
                icon: 'fa fa-facebook',
                estado: true
            },
            {
                nome: 'Whatsapp',
                icon: 'fa fa-whatsapp',
                estado: true
            },
            {
                nome: 'Twitter',
                icon: 'fa fa-twitter',
                estado: true
            },
            {
                nome: 'LinkedIn',
                icon: 'fa fa-linkedin',
                estado: true
            },
            {
                nome: 'Telegram',
                icon: 'fa fa-telegram',
                estado: true
            },
            {
                nome: 'Skype',
                icon: 'fa fa-skype',
                Estado: false
            },
            ]
        });
    } catch (error) {
        res.send(error);
    }
});

server.listen(port, () => {
    console.log(`Servidor activo na porta ${port}`);
});

setInterval(() => {
    var headers = {
        'User-Agent': 'Super Agent/0.0.1',
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    var options = {
        url: 'http://panel.apiwha.com/get_messages.php',
        method: 'GET',
        headers: headers,
        qs: {
            'apikey': 'WHB921DDXRUE1WQK8MPG',
            //'type': 'IN',
            'markaspulled': '1',
            //'getnotpulledonly': '1'
        }
    }

    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // Print out the response body
            /*
                io.emit('mensagem', {
                    dataChegada: moment().format('hh:mm:ss dd-MM-YYYY'),
                    origem: 'Agente',
                    texto: data.texto,
                    inbound: false
                });
            */

            //if()

            var msg = JSON.parse(body);

            //console.log(msg);
            //console.log(msg.length);

            msg.forEach(function (m) {
                //console.log(`Resto ${m.id % 3 === 0 ? false : true}`)
                /**/io.emit('mensagem', {
                    dataChegada: moment().format('hh:mm:ss dd-MM-YYYY'),
                    origem: 'Agente',
                    texto: m.text,
                    inbound: m.id % 3 === 0 ? false : true
                });
            });

            //console.log(body)


        }

        //console.log(response);
    })

    /*io.emit('mensagem', {
        dataChegada: moment().format('hh:mm:ss dd-MM-YYYY'),
        origem: 'Agente',
        texto: data.texto,
        inbound: false
    });*/

    //console.log(data);
    console.log(`${moment().format('HH:mm:ss DD/MM/YYYY')} - Consulta realizada.`)
}, 5000);