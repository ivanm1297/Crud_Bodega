// Requiere el módulo 'express' para crear el enrutador.
const express = require('express');
const requireAuth = require('./middlewares/requireAuth');

// Crea un enrutador utilizando la función Router de Express.
const router = express.Router();

// Exporta una función que recibe un controlador 'mainController' como argumento.
module.exports = (mainController) => {

  // Define una ruta GET para la URL raíz '/' y le asigna la función 'getIndex' del controlador.
  router.get('/', mainController.getIndex);

  // Define una ruta POST para la URL '/admin' y le asigna la función 'postLogin' del controlador.
  router.post('/admin', mainController.postLogin);

  //Definir el esquema para recargar pagina
  router.get('/admin', requireAuth, mainController.getadmin);

   //Ruta para obtener los usuarios en formato JSON
   router.get('/getEmpleados', mainController.getEmpleados);

   //ruta para registrar un nuevo usuario
   router.post('/registro', mainController.postRegistro);

   router.delete('/eliminar_admin/:id', mainController.postEliminar);

   router.post('/actualizarEmpleado', mainController.postActualizar);
  
  //Cierre de sesion
  router.post('/logout', mainController.postlogout);

  router.post('/postEmpleadoById', mainController.postEmpleadoById);
  
  // Retorna el enrutador configurado con las rutas y funciones asignadas.
  

  /* -------------------------- MODULO DE LOTES ---------------------------- */

  router.get('/getLotes', mainController.getLotes);

  router.post('/registroLote', mainController.RegistrarLote);

  router.delete('/eliminar_lote/:id', mainController.postEliminarLote);

  return router;
  
};
