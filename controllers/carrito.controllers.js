let Carrito = require('../models/carrito.models');


const agregar_carrito_cliente = async function (req, res) {
    if (req.user) {

        let data = req.body;
        let carritoCliente = await Carrito.find({ cliente: data.cliente, producto: data.producto });
        // console.log(carritoCliente.length);
        if (carritoCliente.length == 0) {
            let reg = await Carrito.create(data);
            res.status(200).send({ message: 'Se agrego el producto al carrito', data: reg });
        } else if (carritoCliente.length >= 1) {
            res.status(200).send({ message: 'Ya tienes este producto en el carrito de compras registrado', data: undefined });
        }
    } else {
        res.status(500).send({ message: 'NoAccess' });
    }
}

module.exports = {
    agregar_carrito_cliente
}