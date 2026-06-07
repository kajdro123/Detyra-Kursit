const mongoose = require('mongoose');

const appointmentSchema = mongoose.Schema(
    {
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Patient'
        },
        appointmentDate: {
            type: Date,
            required: [true, 'Appointment date is required'],
        },
        appointmentTime: {
            type: String,
            required: [true, 'Appointment time is required'],
        },
        dentistName: {
            type: String,
            required: [true, 'Dentist name is required'],
        },
        treatmentType: {
            type: String,
            required: [true, 'Treatment type is required'],
        },
        status: {
            type: String,
            enum: ['Scheduled', 'Completed', 'Cancelled', 'No Show'],
            default: 'Scheduled',
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
