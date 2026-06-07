const asyncHandler = require('express-async-handler');
const Treatment = require('../models/treatmentModel');

const getTreatments = asyncHandler(async (req, res) => {
    const treatments = await Treatment.find({ user: req.user.id })
        .populate('patient', 'fullName phone email');
    res.status(200).json(treatments);
});

const getTreatmentById = asyncHandler(async (req, res) => {
    const treatment = await Treatment.findById(req.params.id)
        .populate('patient', 'fullName phone email');
    if (!treatment) {
        res.status(400);
        throw new Error('Treatment not found');
    }
    if (treatment.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User is not authorized');
    }
    res.status(200).json(treatment);
});

const createTreatment = asyncHandler(async (req, res) => {
    if (!req.body.patient || !req.body.treatmentName || !req.body.treatmentType) {
        res.status(400);
        throw new Error('Please provide patient, treatmentName, and treatmentType');
    }
    const treatment = await Treatment.create({
        ...req.body,
        user: req.user.id
    });
    await treatment.populate('patient', 'fullName phone email');
    res.status(201).json(treatment);
});

const updateTreatment = asyncHandler(async (req, res) => {
    const treatment = await Treatment.findById(req.params.id);
    if (!treatment) {
        res.status(400);
        throw new Error('Treatment not found');
    }
    if (treatment.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User is not authorized');
    }
    const updatedTreatment = await Treatment.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    ).populate('patient', 'fullName phone email');
    res.status(200).json(updatedTreatment);
});

const deleteTreatment = asyncHandler(async (req, res) => {
    const treatment = await Treatment.findById(req.params.id);
    if (!treatment) {
        res.status(400);
        throw new Error('Treatment not found');
    }
    if (treatment.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User is not authorized to delete');
    }
    await Treatment.findByIdAndDelete(req.params.id);
    res.status(200).json({ id: req.params.id });
});

module.exports = { getTreatments, getTreatmentById, createTreatment, updateTreatment, deleteTreatment };
