'use strict'

var express = require('express');
var carritoController = require('../controllers/carrito.controllers');
var api = express.Router();
var auth = require('../middleware/autheticate.middleware');


api.post('/agregar_carrito_cliente', [auth.auth], carritoController.agregar_carrito_cliente);

module.exports = api;
