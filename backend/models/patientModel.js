const mongoose = require('mongoose');

const patientSchema = mongoose.Schema(
    {
        fullName: {
            type: String,
            required: [true, 'Full name is required'],
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
        },
        age: {
            type: Number,
            required: [true, 'Age is required'],
        },
        gender: {
            type: String,
            enum: ['Male', 'Female', 'Other'],
            required: [true, 'Gender is required'],
        },
        address: {
            type: String,
            required: [true, 'Address is required'],
        },
        registrationDate: {
            type: Date,
            default: Date.now,
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

module.exports = mongoose.model('Patient', patientSchema);
