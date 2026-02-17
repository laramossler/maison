import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import NewEvent from './pages/NewEvent';
import EventDetail from './pages/EventDetail';
import Reflection from './pages/Reflection';
import GuestBook from './pages/GuestBook';
import GuestProfile from './pages/GuestProfile';
import NewGuest from './pages/NewGuest';
import Settings from './pages/Settings';
import FirstRunSetup from './pages/FirstRunSetup';
import WeeklyMenuList from './pages/WeeklyMenuList';
import WeeklyMenuView from './pages/WeeklyMenuView';
import WeeklyMenuEdit from './pages/WeeklyMenuEdit';
import KitchenBrief from './pages/KitchenBrief';
import Login from './pages/Login';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { initializeSampleData, getProfile } from './store';
import { syncFromSupabase } from './store/supabaseSync';

function AppContent() {
  const { user, loading, isDemo } = useAuth();
  const [dataLoaded, setDataLoaded] = useState(isDemo);
  const [setupComplete, setSetupComplete] = useState(false);

  // In demo mode, initialize sample data
  useEffect(() => {
    if (isDemo) {
      initializeSampleData();
      setSetupComplete(getProfile() !== null);
      setDataLoaded(true);
    }
  }, [isDemo]);

  // In auth mode, sync data from Supabase after login
  useEffect(() => {
    if (!isDemo && user) {
      syncFromSupabase().then(() => {
        setSetupComplete(getProfile() !== null);
        setDataLoaded(true);
      });
    }
  }, [isDemo, user]);

  // Auth mode: show loading while checking session
  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="font-body text-sm text-warm-gray/50 italic">Opening your ledger...</p>
      </div>
    );
  }

  // Auth mode: show login if not authenticated
  if (!isDemo && !user) {
    return <Login />;
  }

  // Loading data from Supabase
  if (!dataLoaded) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="font-body text-sm text-warm-gray/50 italic">Loading your gatherings...</p>
      </div>
    );
  }

  // First run setup (both modes)
  if (!setupComplete) {
    return <FirstRunSetup onComplete={() => setSetupComplete(true)} />;
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/new" element={<NewEvent />} />
          <Route path="/event/:id" element={<EventDetail />} />
          <Route path="/event/:id/reflect" element={<Reflection />} />
          <Route path="/event/:id/brief" element={<KitchenBrief />} />
          <Route path="/guests" element={<GuestBook />} />
          <Route path="/guest/:id" element={<GuestProfile />} />
          <Route path="/guests/new" element={<NewGuest />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/menu" element={<WeeklyMenuList />} />
          <Route path="/menu/:id" element={<WeeklyMenuView />} />
          <Route path="/menu/:id/edit" element={<WeeklyMenuEdit />} />
        </Routes>
      </Layout>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
