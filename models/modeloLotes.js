const mongoose = require('mongoose');

const lotesSchema = new mongoose.Schema({
    fecha_expiracion: {
        type: Date,
        required: true,
    },
    hora_expiracion: {
        type: String,
        required: true,
    },
    responsable:{
        type: String,
        required: true,
    },
    observaciones: {
        type: String,
        required: true,
        inique: true,
    }
});

const lotes = mongoose.model('lotes', lotesSchema);

module.exports = lotes;