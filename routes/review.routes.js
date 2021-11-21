
'use strict'

var express = require('express');
var reviewController = require('../controllers/review.contollers');
var api = express.Router();
var auth = require('../middleware/autheticate.middleware');


// emitir_review_producto_cliente
api.post('/emitir_review_producto_cliente', [auth.auth], reviewController.emitir_review_producto_cliente);
// obtener_review_producto_cliente
api.get('/obtener_review_producto_cliente/:id', reviewController.obtener_review_producto_cliente);
// obtener_reviews_cliente
api.get('/obtener_reviews_cliente/:id', [auth.auth], reviewController.obtener_reviews_cliente);

module.exports = api;








