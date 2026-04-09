import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ProfileSetup from './pages/ProfileSetup';
import Weather from './pages/Weather';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import Identify from './pages/Identify';
import GardenPlanner from './pages/GardenPlanner';
import CultivationGuide from './pages/CultivationGuide';
import PlantCareGuide from './pages/PlantCareGuide';
import CropRecommendations from './pages/CropRecommendations';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Sidebar from './components/Sidebar';
import ForgotPassword from './pages/ForgotPassword';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const hideSidebar = ['/', '/login', '/signup', '/profile-setup', '/forgot-password'].includes(location.pathname);

  return (
    <div style={{ display: 'flex' }}>
      {!hideSidebar && <Sidebar />}
      <div style={{ flex: 1 }}>
        {children}
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/profile-setup" element={<ProfileSetup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/identify" element={<Identify />} />
          <Route path="/planner" element={<GardenPlanner />} />
          <Route path="/guides/cultivation" element={<CultivationGuide />} />
          <Route path="/guides/care" element={<PlantCareGuide />} />
          <Route path="/crops" element={<CropRecommendations />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
        </Routes>
      </AppLayout>
    </Router>
  )
}

export default App
