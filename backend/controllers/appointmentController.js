const asyncHandler = require('express-async-handler');
const Appointment = require('../models/appointmentModel');

const getAppointments = asyncHandler(async (req, res) => {
    const appointments = await Appointment.find({ user: req.user.id })
        .populate('patient', 'fullName phone email');
    res.status(200).json(appointments);
});

const getAppointmentById = asyncHandler(async (req, res) => {
    const appointment = await Appointment.findById(req.params.id)
        .populate('patient', 'fullName phone email');
    if (!appointment) {
        res.status(400);
        throw new Error('Appointment not found');
    }
    if (appointment.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User is not authorized');
    }
    res.status(200).json(appointment);
});

const createAppointment = asyncHandler(async (req, res) => {
    if (!req.body.patient || !req.body.appointmentDate || !req.body.appointmentTime) {
        res.status(400);
        throw new Error('Please provide patient, appointmentDate, and appointmentTime');
    }
    const appointment = await Appointment.create({
        ...req.body,
        user: req.user.id
    });
    await appointment.populate('patient', 'fullName phone email');
    res.status(201).json(appointment);
});

const updateAppointment = asyncHandler(async (req, res) => {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
        res.status(400);
        throw new Error('Appointment not found');
    }
    if (appointment.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User is not authorized');
    }
    const updatedAppointment = await Appointment.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    ).populate('patient', 'fullName phone email');
    res.status(200).json(updatedAppointment);
});

const deleteAppointment = asyncHandler(async (req, res) => {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
        res.status(400);
        throw new Error('Appointment not found');
    }
    if (appointment.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User is not authorized to delete');
    }
    await Appointment.findByIdAndDelete(req.params.id);
    res.status(200).json({ id: req.params.id });
});

module.exports = { getAppointments, getAppointmentById, createAppointment, updateAppointment, deleteAppointment };
