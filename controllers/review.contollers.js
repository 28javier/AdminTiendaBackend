const Review = require('../models/review.models');

const emitir_review_producto_cliente = async function (req, res) {
    if (req.user) {
        let data = req.body;
        let reg = await Review.create(data);
        res.status(200).send({ message: 'Se emitio correctamente la reseña.', data: reg })
    } else {
        res.status(500).send({ message: 'NoAccess' });
    }
}

const obtener_review_producto_cliente = async function (req, res) {

    let id = req.params['id'];
    let reg = await Review.find({ producto: id }).sort({ createdAt: -1 });
    res.status(200).send({ data: reg })
}

const obtener_reviews_cliente = async function (req, res) {
    let id = req.params['id'];
    let reg = await Review.find({ cliente: id }).populate('cliente');
    res.status(200).send({ data: reg })
}

module.exports = {
    emitir_review_producto_cliente,
    obtener_review_producto_cliente,
    obtener_reviews_cliente,

}