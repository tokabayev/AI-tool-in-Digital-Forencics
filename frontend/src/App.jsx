import { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate
} from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import NavBar from './components/Header';
import Footer from './components/Footer';
import About from './pages/About';
import FAQ from './pages/FAQ';
import Register from './pages/Register';
import Login from './pages/Login';
import Upload from './pages/Upload';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import { isAuthenticated } from './api/api';
import PageTransitionLoader from './components/PageTransitionLoader';

const SessionExpiredModal = ({ onClose }) => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg border border-gray-300 p-6 max-w-md w-full mx-4">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="text-red-500 w-6 h-6" />
          <h2 className="text-xl font-semibold">Session Expired</h2>
        </div>
        <p className="text-gray-600 mb-6">
          Your session has expired. Please log in again to continue.
        </p>
        <div className="flex justify-end">
          <button
            onClick={() => {
              onClose();
              navigate('/login');
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors cursor-pointer"
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
};

const AppRoutes = ({ user, setUser, handleLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [pendingPath, setPendingPath] = useState(null);
  const [showSessionModal, setShowSessionModal] = useState(false);

  useEffect(() => {
    if (location.pathname !== pendingPath) {
      setLoading(true);
      setPendingPath(location.pathname);
    }
  }, [location.pathname, pendingPath]);

  useEffect(() => {
    const checkSessionExpiration = () => {
      if (location.pathname === '/login') return;
      
      if (!isAuthenticated()) {
        const wasAuthenticated = localStorage.getItem('token') !== null;
        handleLogout();
        if (wasAuthenticated) {
          setShowSessionModal(true);
        }
      }
    };

    const timeout = setTimeout(checkSessionExpiration, 100);
    const interval = setInterval(checkSessionExpiration, 60000);
    
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [handleLogout, location.pathname]);

  if (loading) {
    return (
      <PageTransitionLoader
        onFinish={() => setLoading(false)}
      />
    );
  }

  const ProtectedRoute = ({ children }) => {
    return isAuthenticated() ? children : <Login setUser={setUser} />;
  };

  return (
    <>
      <NavBar user={user} handleLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/register" element={<Register setUser={setUser} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
      {showSessionModal && (
        <SessionExpiredModal onClose={() => setShowSessionModal(false)} />
      )}
    </>
  );
};

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUser(localStorage.getItem('username'));
    }
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('loginTime');
  };

  return (
    <Router>
      <AppRoutes user={user} setUser={setUser} handleLogout={handleLogout} />
    </Router>
  );
}

export default App;