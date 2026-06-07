const asyncHandler = require('express-async-handler');
const Patient = require('../models/patientModel');

const getPatients = asyncHandler(async (req, res) => {
    const patients = await Patient.find({ user: req.user.id });
    res.status(200).json(patients);
});

const getPatientById = asyncHandler(async (req, res) => {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
        res.status(400);
        throw new Error('Patient not found');
    }
    if (patient.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User is not authorized');
    }
    res.status(200).json(patient);
});

const createPatient = asyncHandler(async (req, res) => {
    if (!req.body.fullName || !req.body.phone || !req.body.email) {
        res.status(400);
        throw new Error('Please provide fullName, phone, and email');
    }
    const patient = await Patient.create({
        ...req.body,
        user: req.user.id
    });
    res.status(201).json(patient);
});

const updatePatient = asyncHandler(async (req, res) => {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
        res.status(400);
        throw new Error('Patient not found');
    }
    if (patient.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User is not authorized');
    }
    const updatedPatient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedPatient);
});

const deletePatient = asyncHandler(async (req, res) => {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
        res.status(400);
        throw new Error('Patient not found');
    }
    if (patient.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User is not authorized to delete');
    }
    await Patient.findByIdAndDelete(req.params.id);
    res.status(200).json({ id: req.params.id });
});

module.exports = { getPatients, getPatientById, createPatient, updatePatient, deletePatient };
