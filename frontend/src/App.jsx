import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { useSelector } from "react-redux";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from "./components/Header";
import Login from "./components/Login";
import Register from "./components/Register";
import Sidebar from "./components/Sidebar";

// Clinic Dashboard & Management Components
import ClinicDashboard from "./components/ClinicDashboard";
import PatientList from "./components/PatientList";
import PatientForm from "./components/PatientForm";
import PatientDetails from "./components/PatientDetails";
import AppointmentList from "./components/AppointmentList";
import AppointmentForm from "./components/AppointmentForm";
import TreatmentList from "./components/TreatmentList";
import TreatmentForm from "./components/TreatmentForm";

// Original Components (kept for backward compatibility)
import Dashboard from "./components/Dashboard";
import TaskList from "./components/TaskList";

import './styles/app.css';

// Protected Route Component
const ProtectedRoute = ({ element }) => {
  const user = useSelector(state => state.user);
  return user ? element : <Navigate to="/login" />;
};

function App() {
  const user = useSelector(state => state.user);

  return (
    <>
      <BrowserRouter>
        <div className="app-wrapper">
          {user && <Sidebar />}
          <div className={`app-content ${user ? 'with-sidebar' : ''}`}>
            <Header />
            <Routes>
              {/* Auth Routes */}
              <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
              <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />

              {/* Clinic Management Routes */}
              <Route path="/" element={<ProtectedRoute element={<ClinicDashboard />} />} />
              
              {/* Patient Routes */}
              <Route path="/patients" element={<ProtectedRoute element={<PatientList />} />} />
              <Route path="/patients/new" element={<ProtectedRoute element={<PatientForm />} />} />
              <Route path="/patients/:id" element={<ProtectedRoute element={<PatientDetails />} />} />
              <Route path="/patients/:id/edit" element={<ProtectedRoute element={<PatientForm isEdit={true} />} />} />

              {/* Appointment Routes */}
              <Route path="/appointments" element={<ProtectedRoute element={<AppointmentList />} />} />
              <Route path="/appointments/new" element={<ProtectedRoute element={<AppointmentForm />} />} />
              <Route path="/appointments/:id/edit" element={<ProtectedRoute element={<AppointmentForm isEdit={true} />} />} />

              {/* Treatment Routes */}
              <Route path="/treatments" element={<ProtectedRoute element={<TreatmentList />} />} />
              <Route path="/treatments/new" element={<ProtectedRoute element={<TreatmentForm />} />} />
              <Route path="/treatments/:id/edit" element={<ProtectedRoute element={<TreatmentForm isEdit={true} />} />} />

              {/* Original Routes (for backward compatibility) */}
              <Route path="/alltasks" element={<ProtectedRoute element={<TaskList />} />} />
              <Route path="/old-dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>

      <ToastContainer />
    </>
  );
}

export default App;