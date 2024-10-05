const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bd = require('../config/bd');
const secretKey = 'clave_secreta_357'; 

const registrarCliente = async (req, res) => {
    const { nombre, apellido, correoElectronico, contrasenia } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(contrasenia, 10);
        await bd.query('INSERT INTO usuarios (nombre, apellido, correoElectronico, contrasenia, idTipoUsuario) VALUES (?, ?, ?, ?, ?)', 
            [nombre, apellido, correoElectronico, hashedPassword, 3]);
        res.status(201).json({ message: 'Cliente registrado con éxito' });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar el cliente', error: error.message });
    }
};

const login = async (req, res) => {
    const { correoElectronico, contrasenia } = req.body;

    try {
        const [user] = await bd.query('SELECT * FROM usuarios WHERE correoElectronico = ? AND idTipoUsuario = 3', [correoElectronico]);
        
        if (!user || user.length === 0) {
            return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
        }

        const hashedPassword = user[0].contrasenia;

        const isMatch = await bcrypt.compare(contrasenia, hashedPassword);

        if (!isMatch) {
            return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
        }

        const token = jwt.sign({ idUsuario: user[0].idUsuario, idTipoUsuario: user[0].idTipoUsuario }, secretKey, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Error en el inicio de sesión', error: error.message });
    }
};

const crearReclamo = async (req, res) => {
    const { asunto, descripcion } = req.body;
    const idUsuarioCreador = req.user.idUsuario;

    try {
        const fechaCreado = new Date();
        const idReclamoEstado = 1; 
        const idReclamoTipo = 1; 

        await bd.query('INSERT INTO reclamos (asunto, descripcion, fechaCreado, idReclamoEstado, idReclamoTipo, idUsuarioCreador) VALUES (?, ?, ?, ?, ?, ?)', 
            [asunto, descripcion, fechaCreado, idReclamoEstado, idReclamoTipo, idUsuarioCreador]);
        res.status(201).json({ message: 'Reclamo creado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear reclamo', error: error.message });
    }
};

const consultarReclamo = async (req, res) => {
    const { id } = req.params;

    try {
        const [reclamo] = await bd.query('SELECT * FROM reclamos WHERE idReclamo = ? AND idUsuarioCreador = ?', [id, req.user.idUsuario]);
           console.log(reclamo);

        if (!reclamo || reclamo.length === 0) {
            return res.status(404).json({ message: 'Reclamo no encontrado' });
        }
        res.status(200).json(reclamo);
    } catch (error) {
        res.status(500).json({ message: 'Error al consultar reclamo', error: error.message });
    }
};

const cancelarReclamo = async (req, res) => {
    const { id } = req.params;

    try {
        const reclamo = await bd.query('SELECT idReclamoEstado FROM reclamos WHERE idReclamo = ?', [id]);

        if (reclamo.length === 0) {
            return res.status(404).json({ message: 'Reclamo no encontrado' });
        }

        if (reclamo[0].idReclamoEstado === 3) { 
            return res.status(400).json({ message: 'Reclamo ya está cancelado' });
        }

        const result = await bd.query('UPDATE reclamos SET idReclamoEstado = 3 WHERE idReclamo = ? AND idUsuarioCreador = ?', [id, req.user.idUsuario]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Reclamo no encontrado o ya cancelado' });
        }

        res.status(200).json({ message: 'Reclamo cancelado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al cancelar reclamo', error: error.message });
    }
};

const actualizarPerfil = async (req, res) => {
    const { nombre, apellido, correoElectronico } = req.body;
    const idUsuario = req.user.idUsuario;

    try {
        const result = await bd.query('UPDATE usuarios SET nombre = ?, apellido = ?, correoElectronico = ? WHERE idUsuario = ?', [nombre, apellido, correoElectronico, idUsuario]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json({ message: 'Perfil actualizado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar perfil', error: error.message });
    }
};

module.exports = {
    registrarCliente,
    login,
    crearReclamo,
    consultarReclamo,
    cancelarReclamo,
    actualizarPerfil,
};
