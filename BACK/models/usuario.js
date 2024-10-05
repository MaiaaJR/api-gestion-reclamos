const bd = require('../config/bd');

class Usuario {
    static async crearUsuario(datos) {
        const { nombre, apellido, correoElectronico, contrasenia, idTipoUsuario } = datos;
        const [result] = await bd.query('INSERT INTO usuarios (nombre, apellido, correoElectronico, contrasenia, idTipoUsuario) VALUES (?, ?, ?, ?, ?)', [nombre, apellido, correoElectronico, contrasenia, idTipoUsuario]);
        return result.insertId;
    }

    static async obtenerUsuarioPorEmail(correoElectronico) {
        const [rows] = await bd.query('SELECT * FROM usuarios WHERE correoElectronico = ?', [correoElectronico]);
        return rows[0];
    }

  
}

module.exports = Usuario;

