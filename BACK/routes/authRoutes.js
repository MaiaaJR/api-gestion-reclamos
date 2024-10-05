const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const router = express.Router();
const saltRounds = 10;
const secretKey = 'clave_secreta_357'; 

router.post('/login', async (req, res) => {
    const { correoElectronico, contrasenia } = req.body;
    const user = await Usuario.obtenerUsuarioPorEmail(correoElectronico);

    if (!user || !(await bcrypt.compare(contrasenia, user.contrasenia))) {
        return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }

    const token = jwt.sign({ idUsuario: user.idUsuario, idTipoUsuario: user.idTipoUsuario }, secretKey, { expiresIn: '1h' });
    res.json({ token });
});


module.exports = router;
