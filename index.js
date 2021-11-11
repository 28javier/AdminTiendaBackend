'use strict'

var express = require('express');
var app = express();
// var bodyparser = require('body-parser');
var mongoose = require('mongoose');
var port = process.env.PORT || 4201;


var cliente_route = require('./routes/cliente.routes');
var admin_route = require('./routes/admin.routes');
var producto_route = require('./routes/producto.routes');
var cupon_route = require('./routes/cupon.routes');
var config_route = require('./routes/config.routes');
var carrito_route = require('./routes/carrito.routes');

mongoose.connect('mongodb+srv://root:oMMqFF38QYV6yRax@ecommerce.fzfvu.mongodb.net/tienda', { useUnifiedTopology: true, useNewUrlParser: true }, (err, res) => {
    if (err) {
        console.log(err);
    } else {
        app.listen(port, function () {
            console.log('Servidor corriendo en el puerto' + port);
        });
    }
});

// app.use(bodyparser.urlencoded({ extended: true }));
// app.use(bodyparser.json({limit: '50mb' ,extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '50mb', extended: true }));


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Allow', 'GET, PUT, POST, DELETE, OPTIONS');
    next();
});

app.use('/api', cliente_route);
app.use('/api', admin_route);
app.use('/api', producto_route);
app.use('/api', cupon_route);
app.use('/api', config_route);
app.use('/api', carrito_route);


module.exports = app;
