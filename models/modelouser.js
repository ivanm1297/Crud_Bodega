const mongoose = require('mongoose');

const empleadosSchema = new mongoose.Schema({
    nombre_empleado: {
        type: String,
        required: true,
    },
    aps_empleado: {
        type: String,
        required: true,
    },
    domicilio_empleado:{
        type: String,
        required: true,
    },
    correo: {
        type: String,
        required: true,
        inique: true,
    },
    telefono: {
        type: String,
        required: true,
        inique: true,
    },
    psw: {
        type: String,
        required: true,
    }
});

const empleados = mongoose.model('empleados', empleadosSchema);

module.exports = empleados;