import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useCreateAppointmentMutation, useUpdateAppointmentMutation, useGetAppointmentByIdQuery } from '../store/apis/appointmentApi';
import { useGetPatientsQuery } from '../store/apis/patientApi';
import { toast } from 'react-toastify';
import '../styles/form.css';

const AppointmentForm = ({ isEdit = false }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        patient: '',
        appointmentDate: '',
        appointmentTime: '',
        dentistName: '',
        treatmentType: 'Dental Cleaning',
        status: 'Scheduled'
    });
    const [errors, setErrors] = useState({});

    const { data: appointment, isLoading } = useGetAppointmentByIdQuery(id, { skip: !isEdit });
    const { data: patients = [] } = useGetPatientsQuery();
    const [createAppointment] = useCreateAppointmentMutation();
    const [updateAppointment] = useUpdateAppointmentMutation();

    useEffect(() => {
        if (isEdit && appointment) {
            const dateStr = new Date(appointment.appointmentDate).toISOString().split('T')[0];
            setFormData({
                patient: appointment.patient._id || appointment.patient,
                appointmentDate: dateStr,
                appointmentTime: appointment.appointmentTime || '',
                dentistName: appointment.dentistName || '',
                treatmentType: appointment.treatmentType || 'Dental Cleaning',
                status: appointment.status || 'Scheduled'
            });
        }
    }, [appointment, isEdit]);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.patient) newErrors.patient = 'Patient is required';
        if (!formData.appointmentDate) newErrors.appointmentDate = 'Date is required';
        if (!formData.appointmentTime) newErrors.appointmentTime = 'Time is required';
        if (!formData.dentistName.trim()) newErrors.dentistName = 'Dentist name is required';
        if (!formData.treatmentType) newErrors.treatmentType = 'Treatment type is required';
        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validateForm();

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            toast.error('Please fill all required fields');
            return;
        }

        try {
            if (isEdit) {
                await updateAppointment({ id, ...formData }).unwrap();
                toast.success('Appointment updated successfully');
            } else {
                await createAppointment(formData).unwrap();
                toast.success('Appointment scheduled successfully');
            }
            navigate('/appointments');
        } catch (error) {
            toast.error(error.data?.message || 'Failed to save appointment');
        }
    };

    if (isEdit && isLoading) {
        return <div className="loading">Loading appointment...</div>;
    }

    return (
        <div className="form-container">
            <h2>{isEdit ? 'Edit Appointment' : 'Schedule New Appointment'}</h2>
            <form onSubmit={handleSubmit} className="clinic-form">
                <div className="form-group">
                    <label htmlFor="patient">Select Patient *</label>
                    <select
                        id="patient"
                        name="patient"
                        value={formData.patient}
                        onChange={handleChange}
                        className={`form-input ${errors.patient ? 'error' : ''}`}
                    >
                        <option value="">-- Select a patient --</option>
                        {patients.map(p => (
                            <option key={p._id} value={p._id}>
                                {p.fullName} ({p.phone})
                            </option>
                        ))}
                    </select>
                    {errors.patient && <span className="error-message">{errors.patient}</span>}
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="appointmentDate">Appointment Date *</label>
                        <input
                            type="date"
                            id="appointmentDate"
                            name="appointmentDate"
                            value={formData.appointmentDate}
                            onChange={handleChange}
                            className={`form-input ${errors.appointmentDate ? 'error' : ''}`}
                        />
                        {errors.appointmentDate && <span className="error-message">{errors.appointmentDate}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="appointmentTime">Appointment Time *</label>
                        <input
                            type="time"
                            id="appointmentTime"
                            name="appointmentTime"
                            value={formData.appointmentTime}
                            onChange={handleChange}
                            className={`form-input ${errors.appointmentTime ? 'error' : ''}`}
                        />
                        {errors.appointmentTime && <span className="error-message">{errors.appointmentTime}</span>}
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="dentistName">Dentist Name *</label>
                    <input
                        type="text"
                        id="dentistName"
                        name="dentistName"
                        value={formData.dentistName}
                        onChange={handleChange}
                        className={`form-input ${errors.dentistName ? 'error' : ''}`}
                        placeholder="e.g., Dr. James Mitchell"
                    />
                    {errors.dentistName && <span className="error-message">{errors.dentistName}</span>}
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="treatmentType">Treatment Type *</label>
                        <select
                            id="treatmentType"
                            name="treatmentType"
                            value={formData.treatmentType}
                            onChange={handleChange}
                            className={`form-input ${errors.treatmentType ? 'error' : ''}`}
                        >
                            <option value="Dental Cleaning">Dental Cleaning</option>
                            <option value="Filling">Filling</option>
                            <option value="Root Canal">Root Canal</option>
                            <option value="Tooth Extraction">Tooth Extraction</option>
                            <option value="Whitening">Whitening</option>
                            <option value="Crown Placement">Crown Placement</option>
                        </select>
                        {errors.treatmentType && <span className="error-message">{errors.treatmentType}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="status">Status</label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="form-input"
                        >
                            <option value="Scheduled">Scheduled</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                            <option value="No Show">No Show</option>
                        </select>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn btn-primary">
                        {isEdit ? 'Update Appointment' : 'Schedule Appointment'}
                    </button>
                    <button type="button" onClick={() => navigate('/appointments')} className="btn btn-secondary">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AppointmentForm;
