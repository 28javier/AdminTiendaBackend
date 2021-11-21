'use strict'

var Admin = require('../models/admin.models');
var Venta = require('../models/venta.models');
var Dventa = require('../models/dventa.models');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../helpers/jwt.helpers');


const registro_admin = async function (req, res) {
    var data = req.body;
    var admin_arr = [];
    admin_arr = await Admin.find({ email: data.email })
    if (admin_arr.length == 0) {
        if (data.password) {
            bcrypt.hash(data.password, null, null, async function (err, hash) {
                if (hash) {
                    data.password = hash;
                    var reg = await Admin.create(data);
                    res.status(200).send({ data: reg });
                } else {
                    res.status(200).send({ message: 'ErrorServer', data: undefined });
                }
            })
        } else {
            res.status(200).send({ message: 'No hay una contraseña', data: undefined });
        }
        console.log(reg)
    } else {
        res.status(200).send({ message: 'El correo ya existe', data: undefined });
    }
}

const login_admin = async function (req, res) {
    var data = req.body;
    var admin_arr = [];
    admin_arr = await Admin.find({ email: data.email });
    if (admin_arr.length == 0) {
        res.status(400).json({ message: 'No se encontro el correo', data: undefined });
    } else {
        let user = admin_arr[0];
        bcrypt.compare(data.password, user.password, async function (error, check) {
            if (check) {
                res.status(200).json({
                    message: 'Login Correcto',
                    data: user,
                    token: jwt.createToken(user)
                });
            } else {
                res.status(400).json({ message: 'La contraseña no coincide', data: undefined });
            }
        });
    }
}

// ventas
const obtener_ventas_admin = async function (req, res) {
    if (req.user) {
        if (req.user.rol == 'Admin-Rol') {
            let ventas = [];
            let desde = req.params['desde'];
            let hasta = req.params['hasta'];

            if (desde == 'undefined' && hasta == 'undefined') {
                // console.log('hay filtro');
                ventas = await Venta.find().populate('cliente').populate('direccion').sort({ createdAt: -1 });
                res.status(200).send({ data: ventas });
            } else {
                // console.log('no hay filtro');
                let tt_desde = Date.parse(new Date(desde + 'T00:00:00')) / 1000;
                let tt_hasta = Date.parse(new Date(hasta + 'T00:00:00')) / 1000;
                // console.log(tt_desde + '---' + tt_hasta);
                let tem_ventas = await Venta.find().populate('cliente').populate('direccion').sort({ createdAt: -1 });

                for (var item of tem_ventas) {
                    var tt_created = Date.parse(new Date(item.createdAt)) / 1000;
                    // console.log(tt_created);
                    if (tt_created >= tt_desde && tt_created <= tt_hasta) {
                        ventas.push(item);
                    }
                }
                res.status(200).send({ data: ventas });

            }


        } else {
            res.status(500).send({ message: 'NoAccess' });
        }
    } else {
        res.status(500).send({ message: 'NoAccess' });
    }
}

// KPI
const kpi_ganancias_mensuales_admin = async function (req, res) {
    if (req.user) {
        if (req.user.rol == 'Admin-Rol') {
            let enero = 0;
            let febrero = 0;
            let marzo = 0;
            let abril = 0;
            let mayo = 0;
            let junio = 0;
            let julio = 0;
            let agosto = 0;
            let septiembre = 0;
            let octubre = 0;
            let noviembre = 0;
            let diciembre = 0;

            let total_ganancia = 0;
            let total_mes = 0;
            let count_ventas = 0;
            let total_mes_anterior = 0;

            let reg = await Venta.find();
            let current_date = new Date();
            let current_year = current_date.getFullYear();
            let current_month = current_date.getMonth() + 1;
            for (var item of reg) {
                let createdAt_date = new Date(item.createdAt);
                let mes = createdAt_date.getMonth() + 1;
                if (createdAt_date.getFullYear() == current_year) {

                    total_ganancia = total_ganancia + item.subtotal;
                    if (mes == current_month) {
                        total_mes = total_mes + item.subtotal;
                        count_ventas = count_ventas + 1;
                    }

                    if (mes == current_month - 1) {
                        total_mes_anterior = total_mes_anterior + item.subtotal;

                    }

                    if (mes == 1) {
                        enero = enero + item.subtotal;
                    } else if (mes == 2) {
                        febrero = febrero + item.subtotal;
                    } else if (mes == 3) {
                        marzo = marzo + item.subtotal;
                    } else if (mes == 4) {
                        abril = abril + item.subtotal;
                    } else if (mes == 5) {
                        mayo = mayo + item.subtotal;
                    } else if (mes == 6) {
                        junio = junio + item.subtotal;
                    } else if (mes == 7) {
                        julio = julio + item.subtotal;
                    } else if (mes == 8) {
                        agosto = agosto + item.subtotal;
                    } else if (mes == 9) {
                        septiembre = septiembre + item.subtotal;
                    } else if (mes == 10) {
                        octubre = octubre + item.subtotal;
                    } else if (mes == 11) {
                        noviembre = noviembre + item.subtotal;
                    } else if (mes == 12) {
                        diciembre = diciembre + item.subtotal;
                    }
                }
            }
            res.status(200).send({
                enero: enero,
                febrero: febrero,
                marzo: marzo,
                abril: abril,
                mayo: mayo,
                junio: junio,
                julio: julio,
                agosto: agosto,
                septiembre: septiembre,
                octubre: octubre,
                noviembre: noviembre,
                diciembre: diciembre,
                total_ganancia: total_ganancia,
                total_mes: total_mes,
                count_ventas: count_ventas,
                total_mes_anterior: total_mes_anterior
            });
        } else {
            res.status(500).send({ message: 'NoAccess' });
        }
    } else {
        res.status(500).send({ message: 'NoAccess' });
    }
}

module.exports = {
    registro_admin,
    login_admin,
    obtener_ventas_admin,
    kpi_ganancias_mensuales_admin
}
