import React, { useState, useMemo } from 'react';
import { useGetAppointmentsQuery, useDeleteAppointmentMutation } from '../store/apis/appointmentApi';
import { Link } from 'react-router';
import { toast } from 'react-toastify';
import '../styles/list.css';

const AppointmentList = () => {
    const [filterStatus, setFilterStatus] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const { data: appointments = [], isLoading } = useGetAppointmentsQuery();
    const [deleteAppointment] = useDeleteAppointmentMutation();

    const filteredAppointments = useMemo(() => {
        return appointments.filter(apt => {
            let matches = true;

            if (filterStatus && apt.status !== filterStatus) {
                matches = false;
            }

            if (filterDate) {
                const aptDate = new Date(apt.appointmentDate).toISOString().split('T')[0];
                if (aptDate !== filterDate) {
                    matches = false;
                }
            }

            return matches;
        }).sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));
    }, [appointments, filterStatus, filterDate]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this appointment?')) {
            try {
                await deleteAppointment(id).unwrap();
                toast.success('Appointment deleted successfully');
            } catch (error) {
                toast.error('Failed to delete appointment');
            }
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Scheduled': return '#FFC107';
            case 'Completed': return '#28A745';
            case 'Cancelled': return '#DC3545';
            case 'No Show': return '#6C757D';
            default: return '#007BFF';
        }
    };

    if (isLoading) {
        return <div className="loading">Loading appointments...</div>;
    }

    return (
        <div className="list-container">
            <div className="list-header">
                <h2>Appointment Management</h2>
                <Link to="/appointments/new" className="btn btn-primary">+ Schedule Appointment</Link>
            </div>

            <div className="search-filter">
                <div className="filter-box">
                    <label>Filter by Status:</label>
                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="filter-select">
                        <option value="">All Status</option>
                        <option value="Scheduled">Scheduled</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="No Show">No Show</option>
                    </select>
                </div>

                <div className="filter-box">
                    <label>Filter by Date:</label>
                    <input
                        type="date"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                        className="filter-input"
                    />
                </div>
            </div>

            {filteredAppointments.length === 0 ? (
                <div className="no-data">No appointments found</div>
            ) : (
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Patient</th>
                                <th>Date & Time</th>
                                <th>Dentist</th>
                                <th>Treatment Type</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAppointments.map(apt => (
                                <tr key={apt._id}>
                                    <td className="patient-name">
                                        <Link to={`/patients/${apt.patient._id || apt.patient}`} className="link">
                                            {apt.patient?.fullName || 'Unknown'}
                                        </Link>
                                    </td>
                                    <td>
                                        {new Date(apt.appointmentDate).toLocaleDateString()} {apt.appointmentTime}
                                    </td>
                                    <td>{apt.dentistName}</td>
                                    <td>{apt.treatmentType}</td>
                                    <td>
                                        <span className="status-badge" style={{ backgroundColor: getStatusColor(apt.status) }}>
                                            {apt.status}
                                        </span>
                                    </td>
                                    <td className="actions">
                                        <Link to={`/appointments/${apt._id}/edit`} className="btn-action edit">Edit</Link>
                                        <button onClick={() => handleDelete(apt._id)} className="btn-action delete">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AppointmentList;
