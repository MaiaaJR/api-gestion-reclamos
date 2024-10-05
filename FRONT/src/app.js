function cambiarContenido(contenido) {
    const main = document.getElementById('content');
    main.innerHTML = contenido;
}

///////// INICIAMOS SESIÓN:
async function login(email, password) {
    try {
        const response = await fetch('http://localhost:3000/api/clientes/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ correoElectronico: email, contrasenia: password })
        });

        const data = await response.json();

        if (response.ok) {
            ///////// GUARDAR TOKEN:
            localStorage.setItem('token', data.token);
            alert('Inicio de sesión exitoso');
            cambiarContenido('<h2>Bienvenido</h2><p>Has iniciado sesión correctamente.</p>');
        } else {
            alert('Error: ' + data.message);
        }
    } catch (error) {
        console.error('Error en el inicio de sesión:', error);
        alert('Error al intentar iniciar sesión!');
    }
}

     ///////// CARGAR FORM DE LOGIN:
document.querySelector('a[href="#login"]').addEventListener('click', () => {
    cambiarContenido(`
        <h2>Iniciar Sesión</h2>
        <form id="loginForm">
            <label for="email">Correo electrónico:</label>
            <input type="email" id="email" name="email" required><br><br>
            <label for="password">Contraseña:</label>
            <input type="password" id="password" name="password" required><br><br>
            <button type="submit">Iniciar Sesión</button>
        </form>
    `);

     ///////// ENVIAMOS FORM:
    document.getElementById('loginForm').addEventListener('submit', function (event) {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
             ///////// FUCION LOGIN:
        login(email, password);
    });
});

           ///////// CREAMOS FORM RECLAMOS://///////

// Función para crear un nuevo reclamo
async function crearReclamo(asunto, descripcion) {
    const token = localStorage.getItem('token'); // Obtenemos el token almacenado
    try {
        const response = await fetch('http://localhost:3000/api/clientes/reclamos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Añadimos el token para autorización
            },
            body: JSON.stringify({ asunto, descripcion })
        });

        const data = await response.json();
        
        if (response.ok) {
            alert('Reclamo creado exitosamente');
            cambiarContenido('<h2>Reclamo creado</h2><p>Tu reclamo ha sido enviado.</p>');
        } else {
            alert('Error: ' + data.message);
        }
    } catch (error) {
        console.error('Error al crear el reclamo:', error);
        alert('Hubo un error al intentar crear el reclamo.');
    }
}

// Evento para cargar el formulario de crear reclamo
document.querySelector('a[href="#crear-reclamo"]').addEventListener('click', () => {
    cambiarContenido(`
        <h2>Crear Reclamo</h2>
        <form id="reclamoForm">
            <label for="asunto">Asunto:</label>
            <input type="text" id="asunto" name="asunto" required><br><br>
            <label for="descripcion">Descripción:</label>
            <textarea id="descripcion" name="descripcion" required></textarea><br><br>
            <button type="submit">Enviar Reclamo</button>
        </form>
    `);

    // Capturar el evento de envío del formulario de reclamo
    document.getElementById('reclamoForm').addEventListener('submit', function (event) {
        event.preventDefault();
        const asunto = document.getElementById('asunto').value;
        const descripcion = document.getElementById('descripcion').value;

        // Llamamos a la función crearReclamo con los datos ingresados
        crearReclamo(asunto, descripcion);
    });
});

           ///////// CONSULTAMOS  RECLAMOS://///////

// Función para listar los reclamos del cliente
async function listarReclamos() {
    const token = localStorage.getItem('token'); // Obtenemos el token almacenado
    try {
        const response = await fetch('http://localhost:3000/api/clientes/reclamos', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}` // Añadimos el token para autorización
            }
        });

        const data = await response.json();
        
        if (response.ok) {
            // Generar HTML para mostrar los reclamos
            let reclamosHtml = '<h2>Mis Reclamos</h2><ul>';
            data.forEach(reclamo => {
                reclamosHtml += `<li>ID: ${reclamo.idReclamo} - Asunto: ${reclamo.asunto} - Estado: ${reclamo.idReclamoEstado}</li>`;
            });
            reclamosHtml += '</ul>';
            cambiarContenido(reclamosHtml); // Cambiamos el contenido para mostrar los reclamos
        } else {
            alert('Error al obtener reclamos: ' + data.message);
        }
    } catch (error) {
        console.error('Error al listar reclamos:', error);
        alert('Hubo un error al intentar listar los reclamos.');
    }
}

// Evento para cargar la lista de reclamos
document.querySelector('a[href="#mis-reclamos"]').addEventListener('click', listarReclamos);


