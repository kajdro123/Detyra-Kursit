import React, { useState, useMemo } from 'react';
import { useGetTreatmentsQuery, useDeleteTreatmentMutation } from '../store/apis/treatmentApi';
import { Link } from 'react-router';
import { toast } from 'react-toastify';
import '../styles/list.css';

const TreatmentList = () => {
    const [filterType, setFilterType] = useState('');
    const { data: treatments = [], isLoading } = useGetTreatmentsQuery();
    const [deleteTreatment] = useDeleteTreatmentMutation();

    const filteredTreatments = useMemo(() => {
        return treatments.filter(treatment => {
            if (filterType && treatment.treatmentType !== filterType) {
                return false;
            }
            return true;
        }).sort((a, b) => new Date(b.treatmentDate) - new Date(a.treatmentDate));
    }, [treatments, filterType]);

    const totalCost = filteredTreatments.reduce((sum, t) => sum + (t.cost || 0), 0);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this treatment record?')) {
            try {
                await deleteTreatment(id).unwrap();
                toast.success('Treatment deleted successfully');
            } catch (error) {
                toast.error('Failed to delete treatment');
            }
        }
    };

    if (isLoading) {
        return <div className="loading">Loading treatments...</div>;
    }

    return (
        <div className="list-container">
            <div className="list-header">
                <h2>Treatment Management</h2>
                <Link to="/treatments/new" className="btn btn-primary">+ Add New Treatment</Link>
            </div>

            <div className="search-filter">
                <div className="filter-box">
                    <label>Filter by Treatment Type:</label>
                    <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="filter-select">
                        <option value="">All Treatments</option>
                        <option value="Dental Cleaning">Dental Cleaning</option>
                        <option value="Filling">Filling</option>
                        <option value="Root Canal">Root Canal</option>
                        <option value="Tooth Extraction">Tooth Extraction</option>
                        <option value="Whitening">Whitening</option>
                        <option value="Crown Placement">Crown Placement</option>
                    </select>
                </div>

                {filterType && (
                    <div className="filter-info">
                        <p>Total Cost: <strong>${totalCost.toFixed(2)}</strong></p>
                    </div>
                )}
            </div>

            {filteredTreatments.length === 0 ? (
                <div className="no-data">No treatments found</div>
            ) : (
                <>
                    <div className="summary-info">
                        <p>Total Records: <strong>{filteredTreatments.length}</strong> | Total Cost: <strong>${totalCost.toFixed(2)}</strong></p>
                    </div>
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Patient</th>
                                    <th>Treatment Name</th>
                                    <th>Type</th>
                                    <th>Cost</th>
                                    <th>Date</th>
                                    <th>Notes</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTreatments.map(treatment => (
                                    <tr key={treatment._id}>
                                        <td className="patient-name">
                                            <Link to={`/patients/${treatment.patient._id || treatment.patient}`} className="link">
                                                {treatment.patient?.fullName || 'Unknown'}
                                            </Link>
                                        </td>
                                        <td>{treatment.treatmentName}</td>
                                        <td>{treatment.treatmentType}</td>
                                        <td className="cost">${treatment.cost.toFixed(2)}</td>
                                        <td>{new Date(treatment.treatmentDate).toLocaleDateString()}</td>
                                        <td className="notes">{treatment.notes || '-'}</td>
                                        <td className="actions">
                                            <Link to={`/treatments/${treatment._id}/edit`} className="btn-action edit">Edit</Link>
                                            <button onClick={() => handleDelete(treatment._id)} className="btn-action delete">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};

export default TreatmentList;
