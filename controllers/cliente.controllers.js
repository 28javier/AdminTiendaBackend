'use strict'
const Cliente = require('../models/cliente.models');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../helpers/jwt.helpers');
const Direccion = require('../models/direccion.model');
const Venta = require('../models/venta.models');
const Dventa = require('../models/dventa.models');

const registro_cliente = async function (req, res) {
    var data = req.body;
    var clientes_arr = [];
    clientes_arr = await Cliente.find({ email: data.email })
    if (clientes_arr.length == 0) {

        if (data.password) {
            bcrypt.hash(data.password, null, null, async function (err, hash) {
                if (hash) {
                    data.password = hash;
                    var reg = await Cliente.create(data);
                    res.status(200).send({ data: reg });
                } else {
                    res.status(200).send({ message: 'ErrorServer', data: undefined });
                }
            })
        } else {
            res.status(200).send({ message: 'no hay una contrasena', data: undefined });
        }
        // var reg = await Cliente.create(data);
        // res.status(200).send({ data:reg });
        console.log(reg)
    } else {
        res.status(200).send({ message: 'el correo ya existe', data: undefined });
    }
    res.status(200).send({ message: reg });

}

const login_cliente = async function (req, res) {
    var data = req.body;
    var cliente_arr = [];

    cliente_arr = await Cliente.find({ email: data.email });

    if (cliente_arr.length == 0) {
        res.status(400).send({ message: 'No se encontro el correo', data: undefined });
    } else {
        let user = cliente_arr[0];
        bcrypt.compare(data.password, user.password, async function (error, check) {
            if (check) {
                res.status(200).send({
                    message: 'Login Correctamente',
                    data: user,
                    token: jwt.createToken(user)
                });
            } else {
                res.status(400).send({ message: 'La contraseña no coincide', data: undefined });
            }
        });

    }

}

const listar_clientes_filtro_admin = async function (req, res) {

    // console.log(req.user);
    if (req.user) {
        if (req.user.rol == 'Admin-Rol') {
            let tipo = req.params['tipo'];
            let filtro = req.params['filtro'];

            console.log(tipo);

            if (tipo == null | tipo == 'null') {
                let reg = await Cliente.find();
                res.status(200).send({ clientes: reg });
            } else {
                if (tipo == 'apellidos') {
                    let reg = await Cliente.find({ apellidos: new RegExp(filtro, 'i') });
                    res.status(200).send({ clientes: reg });
                } else if (tipo == 'correo') {
                    let reg = await Cliente.find({ email: new RegExp(filtro, 'i') });
                    res.status(200).send({ clientes: reg });
                }
            }
        } else {
            res.status(500).send({ message: 'NoAccessD' });
        }
    } else {
        res.status(500).send({ message: 'NoAccessXDDD' });
    }


}

const regitro_cliente_admin = async function (req, res) {
    if (req.user) {
        if (req.user.rol == 'Admin-Rol') {
            var data = req.body;
            let { cedula, email } = req.body;
            const existeCedula = await Cliente.findOne({ cedula: cedula });
            const existeEmail = await Cliente.findOne({ email: email });
            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
                    message: 'El email ya existe registrado'
                });
            } else if (existeCedula) {
                return res.status(400).json({
                    ok: false,
                    message: 'La cedula ya esta registrada'
                });
            }
            bcrypt.hash('123456', null, null, async function (err, hash) {
                if (hash) {
                    data.password = hash;
                    let reg = await Cliente.create(data);
                    console.log(reg);
                    res.status(200).send({ message: 'Cliente creado correctamente', data: reg })
                } else {
                    res.status(200).send({ message: 'Hubo un error en el servidor', data: undefined });
                }
            })
        } else {
            res.status(500).send({ message: 'NoAccess' });
        };

    } else {
        res.status(500).send({ message: 'NoAccess' });
    }
}

const obtener_cliente_admin = async function (req, res) {
    if (req.user) {
        if (req.user.rol == 'Admin-Rol') {
            var id = req.params['id'];
            try {
                var reg = await Cliente.findById({ _id: id });
                res.status(200).send({ data: reg });//con el res se envia la data al frontend
            } catch (error) {
                res.status(200).send({ data: undefined });
            }
        } else {
            res.status(500).send({ message: 'NoAccess' });
        }
    } else {
        res.status(500).send({ message: 'NoAccess' });
    }
}

const actualizar_cliente_admin = async function (req, res) {
    if (req.user) {
        if (req.user.rol == 'Admin-Rol') {
            var id = req.params['id'];
            var data = req.body;//esta linea captura los datos del formulario y las pone en la variable data
            var reg = await Cliente.findByIdAndUpdate({ _id: id }, {
                nombres: data.nombres,
                apellidos: data.apellidos,
                email: data.email,
                telefono: data.telefono,
                f_nacimiento: data.f_nacimiento,
                dni: data.dni,
                genero: data.genero
            })
            res.status(200).send({ message: 'Cliente Actualizado Correctamente', data: reg });

        } else {
            res.status(500).send({ message: 'NoAccess' });
        }
    } else {
        res.status(500).send({ message: 'NoAccess' });
    }
}

const eliminar_cliente_admin = async (req, res) => {
    if (req.user) {
        if (req.user.rol = 'Admin-Rol') {
            var id = req.params['id'];

            let reg = await Cliente.findByIdAndRemove({ _id: id });
            res.status(200).send({ message: 'Cliente elminado Correctamente', data: reg });//linea que pinta lo eliminado

        } else {
            res.status(500).send({ message: 'NoAccess' });
        }
    } else {
        res.status(500).send({ message: 'NoAccess' });

    }
}

const obtener_cliente_guest = async function (req, res) {
    if (req.user) {
        var id = req.params['id'];
        try {
            var reg = await Cliente.findById({ _id: id });
            res.status(200).send({ data: reg });//con el res se envia la data al frontend
        } catch (error) {
            res.status(200).send({ data: undefined });
        }

    } else {
        res.status(500).send({ message: 'NoAccess' });
    }
}

const actualizar_perfil_cliente_guest = async function (req, res) {
    if (req.user) {
        var id = req.params['id'];
        var data = req.body;
        console.log(data.password);
        if (data.password) {
            console.log('con contraseña');
            bcrypt.hash(data.password, null, null, async function (err, hash) {
                var reg = await Cliente.findByIdAndUpdate({ _id: id }, {
                    nombres: data.nombres,
                    apellidos: data.apellidos,
                    telefono: data.telefono,
                    f_nacimiento: data.f_nacimiento,
                    cedula: data.cedula,
                    genero: data.genero,
                    pais: data.pais,
                    password: hash,
                });
                res.status(200).send({ message: 'Datos Actualizados Correctamente', data: reg });
            });
        } else {
            console.log('sin contraseña');
            var reg = await Cliente.findByIdAndUpdate({ _id: id }, {
                nombres: data.nombres,
                apellidos: data.apellidos,
                telefono: data.telefono,
                f_nacimiento: data.f_nacimiento,
                cedula: data.cedula,
                genero: data.genero,
                pais: data.pais,
            });
        }
    } else {
        res.status(200).send({ message: 'Datos Actualizados Correctamente', data: reg });
    }


}


// direcciones de los clientes
const registro_direccion_cliente = async function (req, res) {
    if (req.user) {
        let data = req.body;
        if (data.principal) {
            let direcciones = await Direccion.find({ cliente: data.cliente });
            direcciones.forEach(async element => {
                await Direccion.findByIdAndUpdate({ _id: element._id }, { principal: false })
            })
        }
        let reg = await Direccion.create(data);
        res.status(200).send({ message: 'Dirección registrada correctamente', data: reg });
    } else {
        res.status(500).send({ message: 'NoAccess' });
    }
}

const obtener_direccion_todos_cliente = async function (req, res) {
    if (req.user) {
        let id = req.params['id'];
        let direcciones = await Direccion.find({ cliente: id }).populate('cliente').sort({ createdAt: -1 });
        res.status(200).send({ data: direcciones });
    } else {
        res.status(500).send({ message: 'NoAccess' });
    }

}

const cambiar_direccion_principal_cliente = async function (req, res) {
    if (req.user) {
        let id = req.params['id'];
        let cliente = req.params['cliente'];
        let direcciones = await Direccion.find({ cliente: cliente });
        direcciones.forEach(async element => {
            await Direccion.findByIdAndUpdate({ _id: element._id }, { principal: false });
        });
        await Direccion.findByIdAndUpdate({ _id: id }, { principal: true });
        res.status(200).send({ message: 'Dirección del cliente cambiada correctmente', data: true });
    } else {
        res.status(500).send({ message: 'NoAccess' });
    }
}

const obtener_direccion_principal_cliente = async function (req, res) {
    if (req.user) {
        var id = req.params['id'];
        var direccion = undefined;
        direccion = await Direccion.findOne({ cliente: id, principal: true });
        if (direccion == undefined) {
            res.status(200).send({ data: undefined });
        } else {
            res.status(200).send({ data: direccion });
        }
    } else {
        res.status(500).send({ message: 'NoAccess' });
    }
}

const eliminar_direccion_cliente = async (req, res) => {
    if (req.user) {
        var id = req.params['id'];
        let reg = await Direccion.findByIdAndRemove({ _id: id });
        res.status(200).send({ message: 'Dirección elminado Correctamente', data: reg });//linea que pinta lo eliminado
    } else {
        res.status(500).send({ message: 'NoAccess' });

    }
}
// fin direcciones de los clientes


// ordenes del los cliente
const obtener_ordenes_cliente = async function (req, res) {
    if (req.user) {
        let id = req.params['id'];
        let reg = await Venta.find({ cliente: id }).sort({ createdAt: -1 });
        if (reg.length >= 1) {
            res.status(200).send({ data: reg });
        } else if (reg.length == 0) {
            res.status(200).send({ data: undefined });
        }
    } else {
        res.status(500).send({ message: 'NoAccess' });
    }
}

const obtener_detalles_ordenes_cliente = async function (req, res) {
    if (req.user) {
        let id = req.params['id'];
        try {
            let venta = await Venta.findById({ _id: id }).populate('direccion').populate('cliente');
            let detalles = await Dventa.find({ venta: id }).populate('producto');
            res.status(200).send({ data: venta, detalles: detalles })
        } catch (error) {
            res.status(200).send({ data: undefined })
        }
    } else {
        res.status(500).send({ message: 'NoAccess' });
    }
}


// fin de ordenes de los clientes


module.exports = {
    registro_cliente,
    login_cliente,
    listar_clientes_filtro_admin,
    regitro_cliente_admin,
    obtener_cliente_admin,
    actualizar_cliente_admin,
    eliminar_cliente_admin,
    obtener_cliente_guest,
    actualizar_perfil_cliente_guest,
    registro_direccion_cliente,
    obtener_direccion_todos_cliente,
    cambiar_direccion_principal_cliente,
    obtener_direccion_principal_cliente,
    eliminar_direccion_cliente,
    obtener_ordenes_cliente,
    obtener_detalles_ordenes_cliente
}
