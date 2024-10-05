const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bd = require('../config/bd');
const secretKey = 'clave_secreta_357'; 

const login = async (req, res) => {
    const { correoElectronico, contrasenia } = req.body;

    try {
        const [user] = await bd.query('SELECT * FROM usuarios WHERE correoElectronico = ? AND idTipoUsuario = 2', [correoElectronico]);

        if (!user || user.length === 0) {
            return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
        }

        const hashedPassword = user.contrasenia;
        
        const isMatch = await bcrypt.compare(contrasenia, hashedPassword);
        
        if (!isMatch) {
            return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
        }

        const token = jwt.sign({ idUsuario: user.idUsuario, idTipoUsuario: user.idTipoUsuario }, secretKey, { expiresIn: '1h' });
        
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Error en el inicio de sesión', error: error.message });
    }
};

module.exports = { login };

const atenderReclamo = async (req, res) => {
    const { id } = req.params;
    const { nuevoEstado } = req.body;

    try {
        const reclamo = await bd.query('SELECT * FROM reclamos WHERE idReclamo = ?', [id]);
        if (reclamo.length === 0 || reclamo[0].idOficina !== req.user.idOficina) {
            return res.status(403).json({ message: 'Acceso denegado: este reclamo no pertenece a su oficina.' });
        }
        const result = await bd.query('UPDATE reclamos SET idReclamoEstado = ? WHERE idReclamo = ?', [nuevoEstado, id]);
        res.status(200).json({ message: 'Reclamo atendido con éxito' });
    } catch (error) {
        res.status(500).json({ message: 'Error al atender el reclamo', error: error.message });
    }
};

const listarReclamos = async (req, res) => {
    try {
        const reclamos = await bd.query('SELECT * FROM reclamos WHERE idOficina = ?', [req.user.idOficina]);
        res.status(200).json({ reclamos }); 
    } catch (error) {
        res.status(500).json({ message: 'Error al listar reclamos', error: error.message });
    }
};

module.exports = {
    login,
    atenderReclamo,
    listarReclamos,
};
