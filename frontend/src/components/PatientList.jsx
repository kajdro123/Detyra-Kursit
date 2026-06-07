import React, { useState, useMemo } from 'react';
import { useGetPatientsQuery, useDeletePatientMutation } from '../store/apis/patientApi';
import { Link } from 'react-router';
import { toast } from 'react-toastify';
import '../styles/list.css';

const PatientList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterField, setFilterField] = useState('name');
    const { data: patients = [], isLoading } = useGetPatientsQuery();
    const [deletePatient] = useDeletePatientMutation();

    const filteredPatients = useMemo(() => {
        return patients.filter(patient => {
            if (filterField === 'name') {
                return patient.fullName.toLowerCase().includes(searchTerm.toLowerCase());
            } else if (filterField === 'phone') {
                return patient.phone.includes(searchTerm);
            }
            return true;
        });
    }, [patients, searchTerm, filterField]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this patient? This action cannot be undone.')) {
            try {
                await deletePatient(id).unwrap();
                toast.success('Patient deleted successfully');
            } catch (error) {
                toast.error('Failed to delete patient');
            }
        }
    };

    if (isLoading) {
        return <div className="loading">Loading patients...</div>;
    }

    return (
        <div className="list-container">
            <div className="list-header">
                <h2>Patient Management</h2>
                <Link to="/patients/new" className="btn btn-primary">+ Add New Patient</Link>
            </div>

            <div className="search-filter">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder={`Search by ${filterField}...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
                <div className="filter-box">
                    <label>Filter by:</label>
                    <select value={filterField} onChange={(e) => setFilterField(e.target.value)} className="filter-select">
                        <option value="name">Name</option>
                        <option value="phone">Phone</option>
                    </select>
                </div>
            </div>

            {filteredPatients.length === 0 ? (
                <div className="no-data">No patients found</div>
            ) : (
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Full Name</th>
                                <th>Phone</th>
                                <th>Email</th>
                                <th>Age</th>
                                <th>Gender</th>
                                <th>Registration Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPatients.map(patient => (
                                <tr key={patient._id}>
                                    <td>{patient.fullName}</td>
                                    <td>{patient.phone}</td>
                                    <td>{patient.email}</td>
                                    <td>{patient.age}</td>
                                    <td>{patient.gender}</td>
                                    <td>{new Date(patient.registrationDate).toLocaleDateString()}</td>
                                    <td className="actions">
                                        <Link to={`/patients/${patient._id}`} className="btn-action edit">View</Link>
                                        <Link to={`/patients/${patient._id}/edit`} className="btn-action edit">Edit</Link>
                                        <button onClick={() => handleDelete(patient._id)} className="btn-action delete">Delete</button>
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

export default PatientList;
