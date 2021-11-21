'use strict'

var express = require('express');
var ventaController = require('../controllers/venta.controllers');
var api = express.Router();
var auth = require('../middleware/autheticate.middleware');


api.post('/registro_compra_cliente', [auth.auth], ventaController.registro_compra_cliente);
// enviar_correo_compra_cliente
api.get('/enviar_correo_compra_cliente/:id', [auth.auth], ventaController.enviar_correo_compra_cliente);

module.exports = api;
