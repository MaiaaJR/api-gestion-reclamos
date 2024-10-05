const express = require('express');
const { verifyToken } = require('../config/jwtMiddleware');
const clientesController = require('../controllers/clientesController');

const router = express.Router();

router.post('/registro', clientesController.registrarCliente); 
router.post('/login', clientesController.login); 
router.post('/reclamos', verifyToken([3]), clientesController.crearReclamo); 
router.get('/reclamos/:id', verifyToken([3]), clientesController.consultarReclamo); 
router.put('/reclamos/:id/cancelar', verifyToken([3]), clientesController.cancelarReclamo); 
router.put('/perfil', verifyToken([3]), clientesController.actualizarPerfil); 

module.exports = router;

