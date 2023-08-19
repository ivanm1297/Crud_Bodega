// Requiere los módulos necesarios para la aplicación
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3001;
const mongoose = require('mongoose');
const session = require('express-session');
const fileUpload = require('express-fileupload');
const routes = require('./routes');

// Configuración del middleware para parsear datos en formato JSON y URL-encoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configuración del motor de plantillas EJS y la carpeta donde se encuentran las vistas
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');


// Configuración para servir archivos estáticos desde la carpeta 'public'
app.use(express.static(__dirname + '/public'));
app.use(fileUpload());

// Conexión a la base de datos MongoDB 'UMB' en localhost
mongoose.connect('mongodb://localhost:27017/Bodega', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Obtiene la referencia a la conexión a la base de datos y maneja errores y éxito
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error de conexión con MongoDB:'));
db.once('open', () => {
  console.log('Conexión exitosa con MongoDB');

  // Pasar la conexión a la base de datos al controlador
  const mainController = require('./controllers/controller')(db);

  // Pasar el controlador con la conexión de la base de datos a las rutas
  app.use(routes(mainController));
});

// Inicia el servidor de Express para escuchar en el puerto 3000
app.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});

// Configurar el middleware de sesión utilizando express-session
app.use(session({
  secret: 'UMBSANJOSE',  // Clave secreta para la firma de la cookie de sesión
  resave: false,         // Evita guardar la sesión si no hay cambios
  saveUninitialized: true  // Guarda una sesión nueva aunque no se haya inicializado
}));
