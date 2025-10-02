import { BrowserRouter, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Reports from './pages/Reports';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { getToken } from './lib/auth';

function PrivateRoute({ children }) {
  const token = getToken();
  return token ? children : <Navigate to="/login" replace />;
}

function App() {
  const location = useLocation();
  const hideNav = location.pathname === '/login' || location.pathname === '/register';
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {!hideNav && <Navbar />}
      <div className={hideNav ? "max-w-7xl mx-auto" : "max-w-7xl mx-auto p-4 sm:p-6 lg:p-8"}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/tasks"
              element={
                <PrivateRoute>
                  <Tasks />
                </PrivateRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <PrivateRoute>
                  <Reports />
                </PrivateRoute>
              }
            />
          </Routes>
      </div>
      {!hideNav && <Footer />}
    </div>
  );
}

export default App;
