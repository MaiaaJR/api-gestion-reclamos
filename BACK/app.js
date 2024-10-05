const express = require('express');
const bodyParser = require('body-parser');
const administradoresRoutes = require('./routes/administradoresRoutes');
const clientesRoutes = require('./routes/clientesRoutes');
const empleadoRoutes = require('./routes/empleadoRoutes');

const app = express();

// Middleware para parsear el cuerpo de las solicitudes
app.use(bodyParser.json());

// Rutas de administradores
app.use('/api/administradores', administradoresRoutes);

// Ruta Clientes
app.use('/api/clientes', clientesRoutes);

//Ruta empleados
app.use('/api/empleados', empleadoRoutes);

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: 'Error interno del servidor' });
});

// Configuración del puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
