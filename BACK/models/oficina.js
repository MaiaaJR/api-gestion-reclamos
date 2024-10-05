const bd = require('../config/bd');

class Oficina {
    static async crearOficina(datos) {
        const { nombre, idReclamoTipo } = datos;
        const [result] = await bd.query('INSERT INTO oficinas (nombre, idReclamoTipo) VALUES (?, ?)', [nombre, idReclamoTipo]);
        return result.insertId;
    }
}

module.exports = Oficina;
