import React, { useState } from 'react';
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
import LedgerLanding from './pages/LedgerLanding';
import { initializeSampleData, getProfile } from './store';

initializeSampleData();

function App() {
  const [setupComplete, setSetupComplete] = useState(() => getProfile() !== null);

  if (!setupComplete) {
    return <FirstRunSetup onComplete={() => setSetupComplete(true)} />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/landing" element={<LedgerLanding />} />
        <Route path="*" element={
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/new" element={<NewEvent />} />
              <Route path="/event/:id" element={<EventDetail />} />
              <Route path="/event/:id/reflect" element={<Reflection />} />
              <Route path="/guests" element={<GuestBook />} />
              <Route path="/guest/:id" element={<GuestProfile />} />
              <Route path="/guests/new" element={<NewGuest />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </Router>
  );
}

export default App;
