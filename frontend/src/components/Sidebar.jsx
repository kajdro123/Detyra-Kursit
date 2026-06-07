import React, { useState } from 'react';
import { Link } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { logoutAndReset } from '../store/slices/userSlice';
import '../styles/sidebar.css';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logoutAndReset());
    };

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const menuItems = [
        { path: '/', label: 'Dashboard', icon: '📊' },
        { path: '/patients', label: 'Patients', icon: '👥' },
        { path: '/appointments', label: 'Appointments', icon: '📅' },
        { path: '/treatments', label: 'Treatments', icon: '🏥' },
    ];

    return (
        <>
            <button className="sidebar-toggle" onClick={toggleSidebar}>
                {isOpen ? '✕' : '☰'}
            </button>

            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <h1>🦷 Clinic</h1>
                    <button className="close-btn" onClick={toggleSidebar}>✕</button>
                </div>

                <nav className="sidebar-nav">
                    <div className="nav-section">
                        <h3 className="section-title">Main Menu</h3>
                        <ul>
                            {menuItems.map(item => (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        className="nav-link"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <span className="nav-icon">{item.icon}</span>
                                        <span className="nav-label">{item.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="nav-section">
                        <h3 className="section-title">Quick Add</h3>
                        <ul>
                            <li>
                                <Link
                                    to="/patients/new"
                                    className="nav-link"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <span className="nav-icon">➕</span>
                                    <span className="nav-label">New Patient</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/appointments/new"
                                    className="nav-link"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <span className="nav-icon">➕</span>
                                    <span className="nav-label">New Appointment</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/treatments/new"
                                    className="nav-link"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <span className="nav-icon">➕</span>
                                    <span className="nav-label">New Treatment</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </nav>

                <div className="sidebar-footer">
                    <div className="user-info">
                        <div className="user-avatar">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                            <p className="user-name">{user?.name || 'User'}</p>
                            <p className="user-email">{user?.email}</p>
                        </div>
                    </div>
                    <button className="logout-btn" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </aside>

            {isOpen && (
                <div className="sidebar-overlay" onClick={toggleSidebar}></div>
            )}
        </>
    );
};

export default Sidebar;
