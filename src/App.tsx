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
import WeeklyMenuList from './pages/WeeklyMenuList';
import WeeklyMenuView from './pages/WeeklyMenuView';
import WeeklyMenuEdit from './pages/WeeklyMenuEdit';
import KitchenBrief from './pages/KitchenBrief';
import { initializeSampleData, getProfile } from './store';

initializeSampleData();

function App() {
  const [setupComplete, setSetupComplete] = useState(() => getProfile() !== null);

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

export default App;
