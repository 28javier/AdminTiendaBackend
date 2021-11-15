'use strict'

var express = require('express');
var carritoController = require('../controllers/carrito.controllers');
var api = express.Router();
var auth = require('../middleware/autheticate.middleware');


api.post('/agregar_carrito_cliente', [auth.auth], carritoController.agregar_carrito_cliente);
// abtener_carrito_cliente
api.get('/abtener_carrito_cliente/:id', [auth.auth], carritoController.abtener_carrito_cliente);
api.delete('/eliminar_carrito_cliente/:id', [auth.auth], carritoController.eliminar_carrito_cliente);

module.exports = api;
