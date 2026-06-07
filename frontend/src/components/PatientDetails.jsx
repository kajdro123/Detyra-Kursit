import React from 'react';
import { useParams, useNavigate } from 'react-router';
import { useGetPatientByIdQuery } from '../store/apis/patientApi';
import { useGetAppointmentsQuery } from '../store/apis/appointmentApi';
import { useGetTreatmentsQuery } from '../store/apis/treatmentApi';
import { Link } from 'react-router';
import '../styles/details.css';

const PatientDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: patient, isLoading } = useGetPatientByIdQuery(id);
    const { data: allAppointments = [] } = useGetAppointmentsQuery();
    const { data: allTreatments = [] } = useGetTreatmentsQuery();

    const patientAppointments = allAppointments.filter(apt => apt.patient._id === id || apt.patient === id);
    const patientTreatments = allTreatments.filter(t => t.patient._id === id || t.patient === id);

    if (isLoading) {
        return <div className="loading">Loading patient details...</div>;
    }

    if (!patient) {
        return <div className="error">Patient not found</div>;
    }

    return (
        <div className="details-container">
            <div className="details-header">
                <button onClick={() => navigate('/patients')} className="btn-back">← Back</button>
                <h2>Patient Details</h2>
                <Link to={`/patients/${id}/edit`} className="btn btn-primary">Edit</Link>
            </div>

            <div className="details-card">
                <h3>Personal Information</h3>
                <div className="details-grid">
                    <div className="detail-item">
                        <label>Full Name</label>
                        <p>{patient.fullName}</p>
                    </div>
                    <div className="detail-item">
                        <label>Phone</label>
                        <p>{patient.phone}</p>
                    </div>
                    <div className="detail-item">
                        <label>Email</label>
                        <p>{patient.email}</p>
                    </div>
                    <div className="detail-item">
                        <label>Age</label>
                        <p>{patient.age}</p>
                    </div>
                    <div className="detail-item">
                        <label>Gender</label>
                        <p>{patient.gender}</p>
                    </div>
                    <div className="detail-item">
                        <label>Registration Date</label>
                        <p>{new Date(patient.registrationDate).toLocaleDateString()}</p>
                    </div>
                    <div className="detail-item full-width">
                        <label>Address</label>
                        <p>{patient.address}</p>
                    </div>
                </div>
            </div>

            <div className="details-card">
                <div className="card-header">
                    <h3>Appointment History ({patientAppointments.length})</h3>
                    <Link to="/appointments/new" className="btn btn-small">+ New Appointment</Link>
                </div>
                {patientAppointments.length === 0 ? (
                    <p className="no-data">No appointments scheduled</p>
                ) : (
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Dentist</th>
                                    <th>Treatment Type</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {patientAppointments.map(apt => (
                                    <tr key={apt._id}>
                                        <td>{new Date(apt.appointmentDate).toLocaleDateString()}</td>
                                        <td>{apt.appointmentTime}</td>
                                        <td>{apt.dentistName}</td>
                                        <td>{apt.treatmentType}</td>
                                        <td><span className={`status ${apt.status.toLowerCase()}`}>{apt.status}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div className="details-card">
                <div className="card-header">
                    <h3>Treatment History ({patientTreatments.length})</h3>
                    <Link to="/treatments/new" className="btn btn-small">+ New Treatment</Link>
                </div>
                {patientTreatments.length === 0 ? (
                    <p className="no-data">No treatments recorded</p>
                ) : (
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Treatment Name</th>
                                    <th>Type</th>
                                    <th>Cost</th>
                                    <th>Date</th>
                                    <th>Notes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {patientTreatments.map(treatment => (
                                    <tr key={treatment._id}>
                                        <td>{treatment.treatmentName}</td>
                                        <td>{treatment.treatmentType}</td>
                                        <td>${treatment.cost.toFixed(2)}</td>
                                        <td>{new Date(treatment.treatmentDate).toLocaleDateString()}</td>
                                        <td>{treatment.notes || '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientDetails;
