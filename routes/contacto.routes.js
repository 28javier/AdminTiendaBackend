'use strict'

var express = require('express');
var contactoController = require('../controllers/contacto.controllers');

var api = express.Router();
var auth = require('../middleware/autheticate.middleware');

api.post('/enviar_mensaje_contacto', contactoController.enviar_mensaje_contacto);
// enviar_mensaje_contacto
api.get('/obtener_mensaje_admin', [auth.auth], contactoController.obtener_mensaje_admin);
// cerrar_mensaje_admin
api.put('/cerrar_mensaje_admin/:id', [auth.auth], contactoController.cerrar_mensaje_admin);

module.exports = api;
