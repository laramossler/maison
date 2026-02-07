import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import NewEvent from './pages/NewEvent';
import EventDetail from './pages/EventDetail';
import Reflection from './pages/Reflection';
import { initializeSampleData } from './store';

initializeSampleData();

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/new" element={<NewEvent />} />
          <Route path="/event/:id" element={<EventDetail />} />
          <Route path="/event/:id/reflect" element={<Reflection />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
