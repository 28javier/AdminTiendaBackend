let Venta = require('../models/venta.models');
let Dventa = require('../models/dventa.models');
let Producto = require('../models/producto.models');
let Carrito = require('../models/carrito.models');

// archivos de email envio
var fs = require('fs');
var handlebars = require('handlebars');
var ejs = require('ejs');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var path = require('path');


const registro_compra_cliente = async function (req, res) {
    if (req.user) {

        // proceso y validacion del pago se debe dar en el front
        let data = req.body;
        let detalles = data.detalles;
        // let d_detalles = [];
        // console.log(data);
        let venta_last = await Venta.find().sort({ createdAt: -1 });
        let serie;
        let correlativo;
        let n_venta;
        if (venta_last.length == 0) {
            serie = '001';
            correlativo = '000001';
            n_venta = serie + '-' + correlativo
        } else {
            // >=1 registro en ventas
            var last_nventa = venta_last[0].nventa;
            var arr_nventa = last_nventa.split('-');
            // console.log(last_nventa);
            // console.log(arr_nventa);
            if (arr_nventa[1] != '999999') {
                var new_correlativo = zfill(parseInt(arr_nventa[1]) + 1, 6);
                // console.log(new_correlativo);
                n_venta = arr_nventa[0] + '-' + new_correlativo;
                // console.log(data);
            } else if (arr_nventa[1] == '999999') {
                var new_serie = zfill(parseInt(arr_nventa[0]) + 1, 3);
                // console.log(new_correlativo);
                n_venta = new_serie + '-000001';
                // console.log(data);
            }
        }
        data.nventa = n_venta;
        data.estado = 'Procesando';
        // console.log(data);
        let venta = await Venta.create(data);
        detalles.forEach(async element => {
            element.venta = venta._id;
            await Dventa.create(element);
            // d_detalles.push(element);
            let element_producto = await Producto.findById({ _id: element.producto });
            let new_stock = element_producto.stock - element.cantidad;
            await Producto.findByIdAndUpdate({ _id: element.producto }, {
                stock: new_stock
            });
            // limpiar carrito
            await Carrito.remove({ cliente: data.cliente })
        });
        res.status(200).send({ message: 'Venta Realizada Correctamente', venta: venta });
    } else {
        res.status(500).send({ message: 'NoAccess' });

    }
}

function zfill(number, width) {
    var numberOutput = Math.abs(number);
    var length = number.toString().length;
    var zero = "0";

    if (width <= length) {
        if (number < 0) {
            return ("-" + numberOutput.toString());
        } else {
            return numberOutput.toString();
        }
    } else {
        if (number < 0) {
            return ("-" + (zero.repeat(width - length)) + numberOutput.toString());
        } else {
            return ((zero.repeat(width - length)) + numberOutput.toString());
        }

    }
}
// CONTROLODADOR DEL CORREO
const enviar_correo_compra_cliente = async function (req, res) {
    // enviar parametros al metodo de abajo
    let id = req.params['id'];
    var readHTMLFile = function (path, callback) {
        fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
            if (err) {
                throw err;
                callback(err);
            }
            else {
                callback(null, html);
            }
        });
    };
    var transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
            user: 'javelo2828@gmail.com',
            pass: 'nauzvvixqkmcqxrg'
        }
    }));

    //cliente _id fecha data subtotal
    let venta = await Venta.findById({ _id: id }).populate('cliente');
    let detalles = await Dventa.find({ venta: id }).populate('producto');
    let cliente = venta.cliente.nombres + ' ' + venta.cliente.apellidos;
    let _id = venta._id;
    let fecha = new Date(venta.createdAt);
    let data = detalles;
    let subtotal = venta.subtotal;
    // let precio_envio = venta.envio_precio;
    let envio_precio = venta.envio_precio;
    readHTMLFile(process.cwd() + '/mail.html', (err, html) => {

        let rest_html = ejs.render(html, { data: data, cliente: cliente, _id: _id, fecha: fecha, subtotal: subtotal, envio_precio: envio_precio });
        var template = handlebars.compile(rest_html);
        var htmlToSend = template({ op: true });

        var mailOptions = {
            from: 'javelo2828@gmail.com',
            to: venta.cliente.email,
            subject: 'Gracias por tu compra, Mi Tienda XXX',
            html: htmlToSend
        };
        res.status(200).send({ data: true });
        transporter.sendMail(mailOptions, function (error, info) {
            if (!error) {
                console.log('Email sent: ' + info.response);
            }
        });

    });
}

module.exports = {
    registro_compra_cliente,
    enviar_correo_compra_cliente
}