import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useGetPatientByIdQuery, useCreatePatientMutation, useUpdatePatientMutation } from '../store/apis/patientApi';
import { toast } from 'react-toastify';
import '../styles/form.css';

const PatientForm = ({ isEdit = false }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: '',
        age: '',
        gender: 'Male',
        address: ''
    });
    const [errors, setErrors] = useState({});

    const { data: patient, isLoading } = useGetPatientByIdQuery(id, { skip: !isEdit });
    const [createPatient] = useCreatePatientMutation();
    const [updatePatient] = useUpdatePatientMutation();

    useEffect(() => {
        if (isEdit && patient) {
            setFormData({
                fullName: patient.fullName || '',
                phone: patient.phone || '',
                email: patient.email || '',
                age: patient.age || '',
                gender: patient.gender || 'Male',
                address: patient.address || ''
            });
        }
    }, [patient, isEdit]);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!formData.age) newErrors.age = 'Age is required';
        if (!formData.address.trim()) newErrors.address = 'Address is required';
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
                await updatePatient({ id, ...formData }).unwrap();
                toast.success('Patient updated successfully');
            } else {
                await createPatient(formData).unwrap();
                toast.success('Patient created successfully');
            }
            navigate('/patients');
        } catch (error) {
            toast.error(error.data?.message || 'Failed to save patient');
        }
    };

    if (isEdit && isLoading) {
        return <div className="loading">Loading patient data...</div>;
    }

    return (
        <div className="form-container">
            <h2>{isEdit ? 'Edit Patient' : 'Add New Patient'}</h2>
            <form onSubmit={handleSubmit} className="clinic-form">
                <div className="form-group">
                    <label htmlFor="fullName">Full Name *</label>
                    <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className={`form-input ${errors.fullName ? 'error' : ''}`}
                        placeholder="Enter full name"
                    />
                    {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="phone">Phone Number *</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className={`form-input ${errors.phone ? 'error' : ''}`}
                            placeholder="Enter phone number"
                        />
                        {errors.phone && <span className="error-message">{errors.phone}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email *</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`form-input ${errors.email ? 'error' : ''}`}
                            placeholder="Enter email"
                        />
                        {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="age">Age *</label>
                        <input
                            type="number"
                            id="age"
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                            className={`form-input ${errors.age ? 'error' : ''}`}
                            placeholder="Enter age"
                            min="0"
                            max="120"
                        />
                        {errors.age && <span className="error-message">{errors.age}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="gender">Gender *</label>
                        <select
                            id="gender"
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="form-input"
                        >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="address">Address *</label>
                    <textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className={`form-input ${errors.address ? 'error' : ''}`}
                        placeholder="Enter address"
                        rows="3"
                    />
                    {errors.address && <span className="error-message">{errors.address}</span>}
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn btn-primary">
                        {isEdit ? 'Update Patient' : 'Create Patient'}
                    </button>
                    <button type="button" onClick={() => navigate('/patients')} className="btn btn-secondary">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PatientForm;
