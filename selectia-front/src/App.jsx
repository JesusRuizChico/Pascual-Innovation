// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { ThemeProvider } from './context/ThemeContext'; // Ajusta la ruta

// --- LAYOUTS ---
import CandidateLayout from './layouts/CandidateLayout';
import RecruiterLayout from './layouts/RecruiterLayout'; // Asegúrate de tener este archivo
import AdminLayout from './layouts/AdminLayout';       // Asegúrate de tener este archivo

// --- PAGES PÚBLICAS ---
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPassPage from './pages/ForgotPassPage';
import NotFoundPage from './pages/NotFoundPage';

// --- PAGES CANDIDATO ---
import DashboardHome from './pages/candidate/DashboardHome'; // Asegúrate de tener este o usa un placeholder
import CvPage from './pages/candidate/CvPage';
import SearchPage from './pages/candidate/SearchPage';
import NotificationsPageCandidate from './pages/candidate/NotificationsPage'; 
import ProfilePage from './pages/candidate/ProfilePage'; // <--- DESCOMENTADO (IMPORTANTE)
import HelpPage from './pages/candidate/HelpPage';

// --- PAGES RECLUTADOR ---
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import MyVacancies from './pages/recruiter/MyVacancies';
import CandidatesPage from './pages/recruiter/CandidatesPage'; // Kanban
import PostJobPage from './pages/recruiter/PostJobPage';
// import CompanySettingsPage from './pages/recruiter/CompanySettingsPage';
// import BillingPage from './pages/recruiter/BillingPage';
// import UserManagementPage from './pages/recruiter/UserManagementPage';
// import NotificationsPageRecruiter from './pages/recruiter/NotificationsPage';

// --- PAGES ADMIN ---
import AdminDashboard from './pages/admin/AdminDashboard';
import ValidateCompaniesPage from './pages/admin/ValidateCompaniesPage';
import RevenuePage from './pages/admin/RevenuePage';
import UsersGlobalPage from './pages/admin/UsersGlobalPage';
import AdminNotificationsPage from './pages/admin/AdminNotificationsPage';

// src/App.jsx
import NotificationsPageRecruiter from './pages/recruiter/NotificationsPage'; // <--- IMPORTAR

// ... dentro de las rutas de /recruiter ...
import RecruiterHelpPage from './pages/recruiter/RecruiterHelpPage';

import CompanySettingsPage from './pages/recruiter/CompanySettingsPage';

function App() {
  return (
    // ¡AQUÍ ESTÁ LA MAGIA! Envolvemos el Router con el ThemeProvider
    <ThemeProvider>
      <Router>
        <Routes>
          
          {/* === RUTAS PÚBLICAS === */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPassPage />} />

          {/* === RUTAS CANDIDATO === */}
          <Route path="/candidate" element={<CandidateLayout />}>
             <Route index element={<Navigate to="dashboard" replace />} />
             
             {/* Si no tienes DashboardHome, usa SearchPage temporalmente */}
             <Route path="dashboard" element={<DashboardHome />} /> 
             
             <Route path="cv" element={<CvPage />} />
             <Route path="search" element={<SearchPage />} />
             <Route path="notifications" element={<NotificationsPageCandidate />} />
             
             <Route path="profile" element={<ProfilePage />} />
             <Route path="help" element={<HelpPage />} />
          </Route>

          {/* === RUTAS RECLUTADOR === */}
          <Route path="/recruiter" element={<RecruiterLayout />}>
             <Route index element={<Navigate to="dashboard" replace />} />
             <Route path="dashboard" element={<RecruiterDashboard />} />
             <Route path="vacancies" element={<MyVacancies />} />
             <Route path="candidates" element={<CandidatesPage />} />
             <Route path="post-job" element={<PostJobPage />} />
             <Route path="help" element={<RecruiterHelpPage />} />
            <Route path="settings" element={<CompanySettingsPage />} />
             {/* <Route path="billing" element={<BillingPage />} /> */}
             {/* <Route path="users" element={<UserManagementPage />} /> */}
             <Route path="notifications" element={<NotificationsPageRecruiter />} />
          </Route>

          {/* === RUTAS ADMIN === */}
          <Route path="/admin" element={<AdminLayout />}>
             <Route index element={<Navigate to="dashboard" replace />} />
             <Route path="dashboard" element={<AdminDashboard />} />
             
             <Route path="validate" element={<ValidateCompaniesPage />} />
             <Route path="revenue" element={<RevenuePage />} />
             <Route path="users" element={<UsersGlobalPage />} />
             <Route path="notifications" element={<AdminNotificationsPage />} />
          </Route>

          {/* === 404 NOT FOUND === */}
          <Route path="*" element={<NotFoundPage />} />

        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;