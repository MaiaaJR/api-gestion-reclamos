const express = require('express');
const { verifyToken } = require('../config/jwtMiddleware');
const administradoresController = require('../controllers/administradoresController');

const router = express.Router();

router.post('/login', administradoresController.login); 
router.post('/tipos-reclamos', verifyToken([1]), administradoresController.crearTipoReclamo); 
router.get('/tipos-reclamos', verifyToken([1]), administradoresController.listarTiposReclamos); 
router.put('/tipos-reclamos/:id', verifyToken([1]), administradoresController.actualizarTipoReclamo); 
router.delete('/tipos-reclamos/:id', verifyToken([1]), administradoresController.eliminarTipoReclamo); 
router.post('/empleados', verifyToken([1]), administradoresController.crearEmpleado); 
router.get('/empleados', verifyToken([1]), administradoresController.listarEmpleados); 
router.put('/empleados/:id', verifyToken([1]), administradoresController.actualizarEmpleado); 
router.delete('/empleados/:id', verifyToken([1]), administradoresController.eliminarEmpleado); 
router.post('/oficinas', verifyToken([1]), administradoresController.crearOficina); 
router.get('/oficinas', verifyToken([1]), administradoresController.listarOficinas); 
router.put('/oficinas/:id', verifyToken([1]), administradoresController.actualizarOficina); 
router.delete('/oficinas/:id', verifyToken([1]), administradoresController.eliminarOficina); 
router.get('/estadisticas-reclamos', verifyToken([1]), administradoresController.obtenerEstadisticasReclamos);
router.get('/reclamos/descargar/csv', verifyToken([1]), administradoresController.descargarReclamosCSV);
router.get('/reclamos/descargar/pdf', verifyToken([1]), administradoresController.descargarReclamosPDF);


module.exports = router;
