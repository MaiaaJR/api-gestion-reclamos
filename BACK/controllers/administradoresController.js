const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');
const bd = require('../config/bd');
const secretKey = 'clave_secreta_357'; 
const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');

//Login admin

const login = async (req, res) => {
    const { correoElectronico, contrasenia } = req.body;
    const user = await Usuario.obtenerUsuarioPorEmail(correoElectronico);

    if (!user || !(await bcrypt.compare(contrasenia, user.contrasenia))) {
        return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }

    const token = jwt.sign({ idUsuario: user.idUsuario, idTipoUsuario: user.idTipoUsuario }, secretKey, { expiresIn: '1h' });
    res.json({ token });
};

//RECLAMOS 

const crearTipoReclamo = async (req, res) => {
    const { descripcion } = req.body;
    try {
        await bd.query('INSERT INTO reclamos_tipo (descripcion) VALUES (?)', [descripcion]);
        res.status(201).json({ message: 'Tipo de reclamo creado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear tipo de reclamo', error: error.message });
    }
};

const listarTiposReclamos = async (req, res) => {
    try {
        const [rows] = await bd.query('SELECT * FROM reclamos_tipo');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al listar tipos de reclamos', error: error.message });
    }
};

const actualizarTipoReclamo = async (req, res) => {
    const { id } = req.params; 
    const { descripcion } = req.body;

    try {
        const result = await bd.query('UPDATE reclamos_tipo SET descripcion = ? WHERE idReclamosTipo = ?', [descripcion, id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Tipo de reclamo no encontrado' });
        }
        
        res.status(200).json({ message: 'Tipo de reclamo actualizado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar tipo de reclamo', error: error.message });
    }
};

const eliminarTipoReclamo = async (req, res) => {
    const { id } = req.params; 

    try {
        const result = await bd.query('DELETE FROM reclamos_tipo WHERE idReclamosTipo = ?', [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Tipo de reclamo no encontrado' });
        }
        
        res.status(200).json({ message: 'Tipo de reclamo eliminado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar tipo de reclamo', error: error.message });
    }
};

//EMPLEADOS

const crearEmpleado = async (req, res) => {
    const { correoElectronico, password, nombre, apellido } = req.body;
    try {
        if (!password) {
            return res.status(400).json({ message: "La contraseña es requerida" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await bd.query('INSERT INTO usuarios (correoElectronico, contrasenia, nombre, apellido, idTipoUsuario) VALUES (?, ?, ?, ?, ?)', [correoElectronico, hashedPassword, nombre, apellido, 2]);
        res.status(201).json({ message: 'Empleado creado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear empleado', error: error.message });
    }
};


const listarEmpleados = async (req, res) => {
    try {
        const [rows] = await bd.query('SELECT * FROM usuarios WHERE idTipoUsuario = 2');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al listar empleados', error: error.message });
    }
};

const actualizarEmpleado = async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, correoElectronico } = req.body;
    try {
        await bd.query('UPDATE usuarios SET nombre = ?, apellido = ?, correoElectronico = ? WHERE idUsuario = ?', [nombre, apellido, correoElectronico, id]);
        res.status(200).json({ message: 'Empleado actualizado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar empleado', error: error.message });
    }
};

const eliminarEmpleado = async (req, res) => {
    const { id } = req.params;
    try {
        await bd.query('DELETE FROM usuarios WHERE idUsuario = ?', [id]);
        res.status(200).json({ message: 'Empleado eliminado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar empleado', error: error.message });
    }
};

// OFICINAS

const crearOficina = async (req, res) => {
    const { nombre, idReclamoTipo, activo } = req.body; 

    try {
        const [result] = await bd.query('INSERT INTO oficinas (nombre, idReclamoTipo, activo) VALUES (?, ?, ?)', [nombre, idReclamoTipo, activo]);
        res.status(201).json({ message: 'Oficina creada con éxito', idOficina: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear oficina', error: error.message });
    }
};

const listarOficinas = async (req, res) => {
    try {
        const [rows] = await bd.query('SELECT * FROM oficinas');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al listar oficinas', error: error.message });
    }
};


const actualizarOficina = async (req, res) => {
    const { id } = req.params; 
    const { nombre } = req.body;

    try {
        const [result] = await bd.query('UPDATE oficinas SET nombre = ? WHERE idOficina = ?', [nombre, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Oficina no encontrada' });
        }
        res.status(200).json({ message: 'Oficina actualizada con éxito' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar oficina', error: error.message });
    }
};;

const eliminarOficina = async (req, res) => {
    const { id } = req.params; // Asegúrate de que este id es el idOficina
    try {
        // Cambia 'id' por 'idOficina' en la consulta SQL
        await bd.query('DELETE FROM oficinas WHERE idOficina = ?', [id]);
        res.status(200).json({ message: 'Oficina eliminada' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar oficina', error: error.message });
    }
};

//Estadisticas de reclamos 

const obtenerEstadisticasReclamos = async (req, res) => {
    try {
        const [rows] = await bd.query(`
            SELECT 
                COUNT(*) AS total_reclamos,
                SUM(CASE WHEN idReclamoEstado = 1 THEN 1 ELSE 0 END) AS reclamos_pendientes,
                SUM(CASE WHEN idReclamoEstado = 2 THEN 1 ELSE 0 END) AS reclamos_atendidos
            FROM reclamos
        `);
        
        res.status(200).json(rows[0]); 
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener estadísticas', error: error.message });
    }
};

// Descargar reclamos CSV 

const descargarReclamosCSV = async (req, res) => {
    try {
        const [rows] = await bd.query('SELECT * FROM reclamos');
        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(rows);
        
        res.header('Content-Type', 'text/csv');
        res.attachment('reclamos.csv');
        res.send(csv);
    } catch (error) {
        res.status(500).json({ message: 'Error al generar CSV', error: error.message });
    }
};

// Descargar reclamos en PDF

const descargarReclamosPDF = async (req, res) => {
    const doc = new PDFDocument();
    const filename = 'reclamos.pdf';
    res.setHeader('Content-disposition', `attachment; filename=${filename}`);
    res.setHeader('Content-Type', 'application/pdf');

    doc.pipe(res); 

    try {
        const [rows] = await bd.query('SELECT * FROM reclamos');
        
        if (rows.length > 0) {
            doc.fontSize(25).text('Informe de Reclamos', { underline: true });
            doc.moveDown();
            rows.forEach(reclamo => {
                doc.fontSize(12).text(`ID: ${reclamo.idReclamo}`);
                doc.text(`Asunto: ${reclamo.asunto}`);
                doc.text(`Descripción: ${reclamo.descripcion}`);
                doc.text(`Estado: ${reclamo.idReclamoEstado}`);
                doc.moveDown();
            });
        } else {
            doc.fontSize(12).text('No hay reclamos para mostrar.');
        }
    } catch (error) {
        console.error('Error al consultar reclamos:', error);
        doc.fontSize(12).text('Error al generar el informe.');
    }

    doc.end(); 
};


module.exports = {
    login,
    crearTipoReclamo,
    listarTiposReclamos,
    actualizarTipoReclamo,
    eliminarTipoReclamo,
    crearEmpleado,
    listarEmpleados,
    actualizarEmpleado,
    eliminarEmpleado,
    crearOficina,
    listarOficinas,
    actualizarOficina,
    eliminarOficina,
    obtenerEstadisticasReclamos,
    descargarReclamosCSV,
    descargarReclamosPDF,
};
