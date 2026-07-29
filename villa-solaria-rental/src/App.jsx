import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GuestPage from './pages/GuestPage';
import AdminPage from './pages/AdminPage';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Main Guest Website Route */}
        <Route path="/" element={<GuestPage />} />

        {/* Dedicated Host Admin Page Route */}
        <Route path="/admin" element={<AdminPage />} />

        {/* Catch-all Fallback Route */}
        <Route path="*" element={<GuestPage />} />
      </Routes>
    </Router>
  );
}
