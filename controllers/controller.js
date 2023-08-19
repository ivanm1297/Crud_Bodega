// Requiere el módulo '../models/models' y lo asigna a la variable mainModel
const mainModel = require('../models/modelouser');
const mainLotes = require('../models/modeloLotes');
const fs = require('fs');
const ejs = require('ejs');
const path = require('path');

// Exporta una función que recibe un objeto 'db' como argumento
module.exports = function (db) {

  // Dentro de la función exportada, se define un objeto con dos métodos: getIndex y postLogin.
  return {
    // getIndex es una función asíncrona que maneja una solicitud GET en la ruta raíz '/'.
    getIndex: async (req, res) => {
      try {
        // Renderiza una vista llamada 'index'
        res.render('home');
      } catch (err) {
        // Si ocurre un error, responde con un estado 500 y un mensaje de error.
        //res.status(500).send('Error al obtener el index');
        alert('Error al obtener el index');
      }
    },
    getadmin: async (req, res) => {
      try {
        const responsables = await mainModel.find();
        res.render('dashboard', { user: req.session.user, responsables});
      } catch (err) {
        console.error(err);
        console.log('Error al obtener empleados');
        //res.status(500).send('Error al obtener empleados');
      }
    },
    // postLogin es una función asíncrona que maneja una solicitud POST para iniciar sesión.
    postLogin: async (req, res) => {
      try {
        // Obtiene las propiedades 'username' y 'pass' del cuerpo de la solicitud (req.body)
        const { username, pass } = req.body;

        // Obtiene una colección de usuarios del objeto 'db', que se supone que es una base de datos MongoDB
        const empleadosCollection = db.collection('empleados');

        // Utiliza await para esperar a que se complete la consulta para encontrar un usuario en la colección
        const user = await empleadosCollection.findOne({ "correo": username });

        // Comprueba si se encontró un usuario
        if (user) {
          // Si se encontró un usuario, compara la contraseña enviada con la contraseña almacenada en el usuario
          if (pass === user.psw) {
            try {
              const responsables = await mainModel.find();
              req.session.user = user;
              return res.render('dashboard', { user: req.session.user, responsables });

            } catch (err) {
              console.error(err);
            }
            // Si las contraseñas coinciden, establece el objeto 'user' en la sesión y renderiza la vista 'dashboard'

          } else {
            // Si las contraseñas no coinciden, muestra un mensaje de error en la vista 'index'
            return res.render('home', { error: 'Contraseña incorrecta. Inténtalo de nuevo.' });
          }
        } else {
          // Si no se encontró un usuario, muestra un mensaje de error en la vista 'home'
          return res.render('home', { error: 'Usuario no encontrado. Inténtalo de nuevo.' });
        }
      } catch (err) {
        // Si ocurre un error en el proceso, muestra un mensaje de error en la consola y responde con un estado 500.
        console.error('Error al buscar el usuario:', err);
        res.status(500).send('Error al acceder al login');
      }
    },


    /*------------- MODULO EMPLEADOS-------------------*/
    getEmpleados: async (req, res) => {
      try {
        //Realiza la consulta a la base de datos para obtener los usuarios
        const empleados = await mainModel.find();

        //Lee el contenido del archivo admin-reg.ejs
        const adminRegPath = path.join(__dirname, '../views/empleados-reg.ejs');
        const adminRegContent = fs.readFileSync(adminRegPath, 'utf8');

        //Responde con el contenido renderizado en formato HTML
        const renderedContent = ejs.render(adminRegContent, { empleados });

        res.send(renderedContent);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener los usuarios.' });
      }
    },
    postRegistro: async (req, res) => {
      try {
        const { nombre_empleado, apellidos_empleado, domicilio_empleado, correo_empleado, psw_empleado, telefono_empleado} = req.body;

        //verificar si el numero ya esta registrado
        const usuarioExistenteTelefono = await mainModel.findOne({ telefono: telefono_empleado });
        if (usuarioExistenteTelefono) {
          return res.status(400).json({ error: 'El número de teléfono ya está registrado.' });
        }

        const usuarioExistenteCorreo = await mainModel.findOne({ correo: correo_empleado });
        if (usuarioExistenteCorreo) {
          return res.status(400).json({ error: 'El correo electrónico ya está registrado.' });
        }

        const nuevoUsuario = new mainModel({
          nombre_empleado: nombre_empleado,
          aps_empleado: apellidos_empleado,
          domicilio_empleado: domicilio_empleado,
          correo: correo_empleado,
          telefono: telefono_empleado,
          psw: psw_empleado
        });
        await nuevoUsuario.save();

        res.json({ message: 'Usuario registrado exitosamente' });
      } catch (err) {
        res.status(500).json({ error: 'Error al registrar el usuario. Inténtalo de nuevo.' });
      }
    },
    postEliminar: async (req, res) => {
      try {
        const userId = req.params.id; // Obtener el ID del usuario a eliminar desde los parámetros de la URL

        // Realizar la eliminación del usuario en la base de datos
        const result = await mainModel.deleteOne({ _id: userId });

        if (result.deletedCount === 1) {
          // Si se eliminó un registro correctamente, envía una respuesta de éxito
          res.json({ message: 'Empleado eliminado correctamente' });
        } else {
          // Si no se pudo eliminar un registro, envía una respuesta de error
          res.status(404).json({ error: 'Empleado no encontrado. No se pudo eliminar.' });
        }
      } catch (err) {
        console.error('Error al eliminar el empleado:', err);
        res.status(500).json({ error: 'Error al eliminar el empleado. Inténtalo de nuevo.' });
      }
    },
    postEmpleadoById: async (req, res) => {
      const userId = req.body.userId;
      try {
        const usuario = await mainModel.findById(userId);
        if (!usuario) {
          return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        return res.status(200).json(usuario);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
      }
    },
    postActualizar: async (req, res) => {
      try {
        const usuarioId = req.body.empleadoId_act;
        const nombre = req.body.nombre_empleado_act;
        const apellidos = req.body.apellidos_empleado_act;
        const domicilio = req.body.domicilio_empleado_act;
        const correo = req.body.correo_empleado_act;
        const telefon = req.body.telefono_empleado_act;


        const usuarioActualizado = await mainModel.findByIdAndUpdate(
          usuarioId,
          {
            nombre_empleado: nombre,
            aps_empleado: apellidos,
            domicilio_empleado: domicilio,
            correo: correo,
            telefono: telefon
          },
          { new: true }
        );
        res.status(200).json({
          message:
            'Usuario actualizado correctamente (sin cambios en la foto)',
          usuario: usuarioActualizado,
        });
      } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        res.status(500).json({ error: 'Error al actualizar el usuario' });
      }
    },

    /* --------------- MODULO LOTES ----------------- */

    getLotes: async (req, res) => {
      try {
        //Realiza la consulta a la base de datos para obtener los usuarios
        const lotes = await mainLotes.find();

        //Lee el contenido del archivo admin-reg.ejs
        const loteRegPath = path.join(__dirname, '../views/lotes-reg.ejs');
        const loteRegContent = fs.readFileSync(loteRegPath, 'utf8');

        //Responde con el contenido renderizado en formato HTML
        const renderedContent = ejs.render(loteRegContent, { lotes });

        res.send(renderedContent);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener los lotes.' });
      }
    },
    RegistrarLote: async (req, res) => {
      try {
        const {fecha_expiracion, hora_expiracion, responsable, observaciones} = req.body;

        const nuevo_lote = new mainLotes({
          fecha_expiracion: new Date(fecha_expiracion),
          hora_expiracion: hora_expiracion,
          responsable: responsable,
          observaciones: observaciones
        });
        await nuevo_lote.save();

        res.json({ message: 'Lote registrado exitosamente' });

      } catch (error) {
        res.status(500).json({ error: 'Error al registrar el lote. Inténtalo de nuevo.' });
      }
    },
    postEliminarLote: async (req, res) => {
      try {
        const loteId = req.params.id; // Obtener el ID del usuario a eliminar desde los parámetros de la URL

        // Realizar la eliminación del usuario en la base de datos
        const result = await mainLotes.deleteOne({ _id: loteId });

        if (result.deletedCount === 1) {
          // Si se eliminó un registro correctamente, envía una respuesta de éxito
          res.json({ message: 'lote eliminado correctamente' });
        } else {
          // Si no se pudo eliminar un registro, envía una respuesta de error
          res.status(404).json({ error: 'lote no encontrado. No se pudo eliminar.' });
        }
      } catch (err) {
        console.error('Error al eliminar lote:', err);
        res.status(500).json({ error: 'Error al eliminar el lote. Inténtalo de nuevo.' });
      }
    },


    postlogout: (req, res) => {
      //DEstruye la sesion del usuario
      req.session.destroy((err) => {
        if (err) {
          console.error('Error al cerrar sesion:', err);
        }
        // Redirige a la ppagina de inicio de sesion despues de cerrar sesion
        res.redirect('/');
      });
    }

  }
}

