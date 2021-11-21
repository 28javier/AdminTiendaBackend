'use strict'

var express = require('express');
var adminController = require('../controllers/admin.controllers');
var auth = require('../middleware/autheticate.middleware');

var api = express.Router();



api.post('/registro_admin', adminController.registro_admin);
api.post('/login_admin', adminController.login_admin);
// obtener_ventas_admin
api.get('/obtener_ventas_admin/:desde?/:hasta?', [auth.auth], adminController.obtener_ventas_admin);
api.get('/kpi_ganancias_mensuales_admin', [auth.auth], adminController.kpi_ganancias_mensuales_admin)


module.exports = api;
