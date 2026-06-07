import React, { useMemo } from 'react';
import { useGetPatientsQuery } from '../store/apis/patientApi';
import { useGetAppointmentsQuery } from '../store/apis/appointmentApi';
import { useGetTreatmentsQuery } from '../store/apis/treatmentApi';
import { useSelector } from 'react-redux';
import { Link } from 'react-router';
import '../styles/dashboard.css';

const ClinicDashboard = () => {
    const { data: patients = [], isLoading: patientsLoading } = useGetPatientsQuery();
    const { data: appointments = [], isLoading: appointmentsLoading } = useGetAppointmentsQuery();
    const { data: treatments = [], isLoading: treatmentsLoading } = useGetTreatmentsQuery();
    const user = useSelector(state => state.user);

    const stats = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayAppointments = appointments.filter(apt => {
            const aptDate = new Date(apt.appointmentDate);
            aptDate.setHours(0, 0, 0, 0);
            return aptDate.getTime() === today.getTime();
        });

        const completedTreatments = treatments.filter(t => {
            const aptDate = new Date(t.treatmentDate);
            aptDate.setHours(0, 0, 0, 0);
            return aptDate.getTime() === today.getTime();
        });

        const totalRevenue = treatments.reduce((sum, treatment) => sum + (treatment.cost || 0), 0);

        const appointmentsByMonth = {};
        appointments.forEach(apt => {
            const date = new Date(apt.appointmentDate);
            const month = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            appointmentsByMonth[month] = (appointmentsByMonth[month] || 0) + 1;
        });

        const treatmentsByMonth = {};
        treatments.forEach(t => {
            const date = new Date(t.treatmentDate);
            const month = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            treatmentsByMonth[month] = (treatmentsByMonth[month] || 0) + 1;
        });

        return {
            totalPatients: patients.length,
            totalAppointments: appointments.length,
            todayAppointments: todayAppointments.length,
            completedTreatments: completedTreatments.length,
            totalRevenue,
            appointmentsByMonth,
            treatmentsByMonth
        };
    }, [patients, appointments, treatments]);

    if (patientsLoading || appointmentsLoading || treatmentsLoading) {
        return <div className="dashboard-loading">Loading clinic data...</div>;
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Dental Clinic Management System</h1>
                <p>Welcome back, {user?.name || 'Clinic Admin'}</p>
            </div>

            <div className="dashboard-stats">
                <div className="stat-card">
                    <div className="stat-icon patients">👥</div>
                    <div className="stat-content">
                        <h3>Total Patients</h3>
                        <p className="stat-number">{stats.totalPatients}</p>
                        <Link to="/patients" className="stat-link">View All</Link>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon appointments">📅</div>
                    <div className="stat-content">
                        <h3>Total Appointments</h3>
                        <p className="stat-number">{stats.totalAppointments}</p>
                        <Link to="/appointments" className="stat-link">View All</Link>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon today">⏰</div>
                    <div className="stat-content">
                        <h3>Today's Appointments</h3>
                        <p className="stat-number">{stats.todayAppointments}</p>
                        <Link to="/appointments" className="stat-link">View Schedule</Link>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon treatments">✓</div>
                    <div className="stat-content">
                        <h3>Completed Today</h3>
                        <p className="stat-number">{stats.completedTreatments}</p>
                        <Link to="/treatments" className="stat-link">View Treatments</Link>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon revenue">💰</div>
                    <div className="stat-content">
                        <h3>Estimated Revenue</h3>
                        <p className="stat-number">${stats.totalRevenue.toFixed(2)}</p>
                        <Link to="/treatments" className="stat-link">View Details</Link>
                    </div>
                </div>
            </div>

            <div className="dashboard-quick-actions">
                <h2>Quick Actions</h2>
                <div className="quick-action-buttons">
                    <Link to="/patients/new" className="btn btn-primary">+ New Patient</Link>
                    <Link to="/appointments/new" className="btn btn-primary">+ New Appointment</Link>
                    <Link to="/treatments/new" className="btn btn-primary">+ New Treatment</Link>
                </div>
            </div>

            <div className="dashboard-charts">
                <div className="chart-container">
                    <h3>Appointments by Month</h3>
                    <div className="chart-data">
                        {Object.entries(stats.appointmentsByMonth).map(([month, count]) => (
                            <div key={month} className="chart-bar-wrapper">
                                <div className="chart-bar" style={{ height: `${(count / Math.max(...Object.values(stats.appointmentsByMonth), 1)) * 100}px` }}></div>
                                <p>{month}</p>
                                <span>{count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="chart-container">
                    <h3>Treatments by Month</h3>
                    <div className="chart-data">
                        {Object.entries(stats.treatmentsByMonth).map(([month, count]) => (
                            <div key={month} className="chart-bar-wrapper">
                                <div className="chart-bar" style={{ height: `${(count / Math.max(...Object.values(stats.treatmentsByMonth), 1)) * 100}px` }}></div>
                                <p>{month}</p>
                                <span>{count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClinicDashboard;
