var express = require('express');
var socket = require('socket.io');

var app = express();

app.use(express.static('public'));

var port = process.env.PORT || 5000;
var server = app.listen(port, function(){
    console.log('server started on port '+port);
});

var io = socket(server);
var allClients = [];
io.sockets.on('connection', function(socket){
    console.log('new connection '+socket.id);

    allClients.push(socket);
    broadcastPresence(socket);
    emitConnectedClients(socket);
    emitMe(socket);
    
    socket.on('mouse', function(data){
        socket.broadcast.emit('mouse', data);
        //io.sockets.emit
    });

    socket.on('disconnect', function(){
        
        /*console.log(allClients.map(function(client){
            return client.id;
        }));

        */
        console.log('disconnected',socket.id)
        socket.broadcast.emit('disconnected',socket.id);

        allClients = allClients.filter(function(actual){
            return actual.id !== socket.id;
        })
    });
})

function emitMe(socket){
    socket.emit('me', socket.id);
}

function broadcastPresence(socket){
    socket.broadcast.emit('presence', socket.id);
}

function emitConnectedClients(socket){
    var others = allClients.filter(function(actual){
        return actual.id !== socket.id;
    })

    others = others.map(function(client){
        return client.id;
    })

    socket.emit('connected_clients',others);
}