const mongoose = require('mongoose');

const treatmentSchema = mongoose.Schema(
    {
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Patient'
        },
        treatmentName: {
            type: String,
            required: [true, 'Treatment name is required'],
        },
        treatmentType: {
            type: String,
            enum: ['Dental Cleaning', 'Filling', 'Root Canal', 'Tooth Extraction', 'Whitening', 'Crown Placement'],
            required: [true, 'Treatment type is required'],
        },
        cost: {
            type: Number,
            required: [true, 'Cost is required'],
        },
        treatmentDate: {
            type: Date,
            required: [true, 'Treatment date is required'],
        },
        notes: {
            type: String,
            default: '',
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

module.exports = mongoose.model('Treatment', treatmentSchema);
