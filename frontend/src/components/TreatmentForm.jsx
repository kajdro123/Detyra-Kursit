import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useCreateTreatmentMutation, useUpdateTreatmentMutation, useGetTreatmentByIdQuery } from '../store/apis/treatmentApi';
import { useGetPatientsQuery } from '../store/apis/patientApi';
import { toast } from 'react-toastify';
import '../styles/form.css';

const TreatmentForm = ({ isEdit = false }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        patient: '',
        treatmentName: '',
        treatmentType: 'Dental Cleaning',
        cost: '',
        treatmentDate: '',
        notes: ''
    });
    const [errors, setErrors] = useState({});

    const { data: treatment, isLoading } = useGetTreatmentByIdQuery(id, { skip: !isEdit });
    const { data: patients = [] } = useGetPatientsQuery();
    const [createTreatment] = useCreateTreatmentMutation();
    const [updateTreatment] = useUpdateTreatmentMutation();

    useEffect(() => {
        if (isEdit && treatment) {
            const dateStr = new Date(treatment.treatmentDate).toISOString().split('T')[0];
            setFormData({
                patient: treatment.patient._id || treatment.patient,
                treatmentName: treatment.treatmentName || '',
                treatmentType: treatment.treatmentType || 'Dental Cleaning',
                cost: treatment.cost || '',
                treatmentDate: dateStr,
                notes: treatment.notes || ''
            });
        }
    }, [treatment, isEdit]);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.patient) newErrors.patient = 'Patient is required';
        if (!formData.treatmentName.trim()) newErrors.treatmentName = 'Treatment name is required';
        if (!formData.treatmentType) newErrors.treatmentType = 'Treatment type is required';
        if (!formData.cost) newErrors.cost = 'Cost is required';
        if (formData.cost < 0) newErrors.cost = 'Cost must be positive';
        if (!formData.treatmentDate) newErrors.treatmentDate = 'Date is required';
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
            toast.error('Please fill all required fields correctly');
            return;
        }

        try {
            const submitData = {
                ...formData,
                cost: parseFloat(formData.cost)
            };

            if (isEdit) {
                await updateTreatment({ id, ...submitData }).unwrap();
                toast.success('Treatment updated successfully');
            } else {
                await createTreatment(submitData).unwrap();
                toast.success('Treatment recorded successfully');
            }
            navigate('/treatments');
        } catch (error) {
            toast.error(error.data?.message || 'Failed to save treatment');
        }
    };

    if (isEdit && isLoading) {
        return <div className="loading">Loading treatment...</div>;
    }

    return (
        <div className="form-container">
            <h2>{isEdit ? 'Edit Treatment' : 'Record New Treatment'}</h2>
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

                <div className="form-group">
                    <label htmlFor="treatmentName">Treatment Name *</label>
                    <input
                        type="text"
                        id="treatmentName"
                        name="treatmentName"
                        value={formData.treatmentName}
                        onChange={handleChange}
                        className={`form-input ${errors.treatmentName ? 'error' : ''}`}
                        placeholder="e.g., Root Canal Treatment"
                    />
                    {errors.treatmentName && <span className="error-message">{errors.treatmentName}</span>}
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
                        <label htmlFor="cost">Cost ($) *</label>
                        <input
                            type="number"
                            id="cost"
                            name="cost"
                            value={formData.cost}
                            onChange={handleChange}
                            className={`form-input ${errors.cost ? 'error' : ''}`}
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                        />
                        {errors.cost && <span className="error-message">{errors.cost}</span>}
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="treatmentDate">Treatment Date *</label>
                    <input
                        type="date"
                        id="treatmentDate"
                        name="treatmentDate"
                        value={formData.treatmentDate}
                        onChange={handleChange}
                        className={`form-input ${errors.treatmentDate ? 'error' : ''}`}
                    />
                    {errors.treatmentDate && <span className="error-message">{errors.treatmentDate}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="notes">Notes</label>
                    <textarea
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Add any notes about the treatment"
                        rows="3"
                    />
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn btn-primary">
                        {isEdit ? 'Update Treatment' : 'Record Treatment'}
                    </button>
                    <button type="button" onClick={() => navigate('/treatments')} className="btn btn-secondary">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TreatmentForm;
