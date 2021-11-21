const Contacto = require('../models/contacto.models');


const enviar_mensaje_contacto = async (req, res) => {
    const data = req.body;
    data.estado = 'Abierto';
    let reg = await Contacto.create(data);
    res.status(200).send({ message: 'El mensaje fue enviado Correctamente', data: reg })
}

const obtener_mensaje_admin = async (req, res) => {
    if (req.user) {
        if (req.user.rol == 'Admin-Rol') {
            let reg = await Contacto.find().sort({ createdAt: -1 });
            res.status(200).send({ data: reg });
        } else {
            res.status(500).send({ message: 'NoAccess' });
        }
    } else {
        res.status(500).send({ message: 'NoAccess' });
    }
}

const cerrar_mensaje_admin = async (req, res) => {
    if (req.user) {
        if (req.user.rol == 'Admin-Rol') {
            let id = req.params['id']
            let reg = await Contacto.findByIdAndUpdate({ _id: id }, { estado: 'Cerrado' });
            res.status(200).send({ data: reg });
        } else {
            res.status(500).send({ message: 'NoAccess' });
        }
    } else {
        res.status(500).send({ message: 'NoAccess' });
    }
}

module.exports = {
    enviar_mensaje_contacto,
    obtener_mensaje_admin,
    cerrar_mensaje_admin
}