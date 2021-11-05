'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = '28@@@@@jvl.@@@';

exports.auth = function (req, res, next) {
    // console.log(req.headers);
    if (!req.headers.authorization) {
        return res.status(403).send({ message: 'NoHeadersError' });
    }

    var token = req.headers.authorization.replace(/['"]+/g, '');
    var segment = token.split('.');


    if (segment.length != 3) {
        return res.status(403).send({ message: 'InvalitToken' });
    }
    else {
        try {
            var payload = jwt.decode(token, secret);
            // console.log(payload)
            if (payload.exp <= moment().unix()) {
                return res.status(403).send({ message: 'TokenExpirado' });
            }
        } catch (error) {
            return res.status(403).send({ message: 'InvalitToken' });
        }
    }
    req.user = payload;

    next();
}
