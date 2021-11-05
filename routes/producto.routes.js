'use strict'

var express = require('express');
var productoController = require('../controllers/producto.controllers');

var api = express.Router();
var auth = require('../middleware/autheticate.middleware');
var multiparty = require('connect-multiparty');
var path = multiparty({ uploadDir: './uploads/productos' });

//productos
api.post('/registro_producto_admin', [auth.auth, path], productoController.registro_producto_admin);
api.get('/listar_productos_admin/:filtro?', auth.auth, productoController.listar_productos_admin);
api.get('/obtener_portada/:img', productoController.obtener_portada);
api.get('/obtener_producto_admin/:id', auth.auth, productoController.obtener_producto_admin);
api.put('/actualizar_producto_admin/:id', [auth.auth, path], productoController.actualizar_producto_admin);
api.delete('/eliminar_producto_admin/:id', auth.auth, productoController.eliminar_producto_admin);
api.put('/actualizar_producto_variedades_admin/:id', auth.auth, productoController.actualizar_producto_variedades_admin);
api.put('/agregar_imagen_galeria_admin/:id', [auth.auth, path], productoController.agregar_imagen_galeria_admin);
api.put('/eliminar_imagen_galeria_admin/:id', auth.auth, productoController.eliminar_imagen_galeria_admin);

// inventario
api.get('/listar_inventario_producto_admin/:id', auth.auth, productoController.listar_inventario_producto_admin);
api.delete('/eliminar_inventario_producto_admin/:id', auth.auth, productoController.eliminar_inventario_producto_admin);
api.post('/registro_inventario_producto_admin', auth.auth, productoController.registro_inventario_producto_admin);

//publicos
// api.get('/listar_productos_publico/:id', auth.auth, productoController.listar_productos_publico);

module.exports = api;