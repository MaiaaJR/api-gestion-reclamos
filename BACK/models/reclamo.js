const pool = require('../config/bd');

const crearReclamo = async ({ asunto, descripcion, idUsuarioCreador, idReclamoTipo }) => {
    const [result] = await pool.execute('INSERT INTO reclamos (asunto, descripcion, fechaCreado, idReclamoTipo, idUsuarioCreador) VALUES (?, ?, NOW(), ?, ?)', [asunto, descripcion, idReclamoTipo, idUsuarioCreador]);
    return result.insertId;
};


const obtenerReclamo = async (idReclamo, idUsuario) => {
    const [result] = await pool.execute('SELECT * FROM reclamos WHERE idReclamo = ? AND idUsuarioCreador = ?', [idReclamo, idUsuario]);
    return result[0]; 
};

const cancelarReclamo = async (idReclamo, idUsuario) => {
    const [result] = await pool.execute('UPDATE reclamos SET fechaCancelado = NOW() WHERE idReclamo = ? AND idUsuarioCreador = ? AND fechaCancelado IS NULL', [idReclamo, idUsuario]);
    return result.affectedRows > 0; 
};

module.exports = {
    crearReclamo,
    obtenerReclamo,
    cancelarReclamo,
};
