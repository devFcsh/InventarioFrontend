import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NotFound from './pages/NotFound';
import Equipos from './pages/Equipos';
import Activos from './pages/Activos';
import Bajas from './pages/Bajas';
import Login from './pages/Login';
import Layout from './components/Layout';

const App: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<string>('Equipos');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/equipos"
          element={
            <Layout currentSection={currentSection} setCurrentSection={setCurrentSection}>
              <Equipos />
            </Layout>
          }
        />
        <Route
          path="/activos"
          element={
            <Layout currentSection={currentSection} setCurrentSection={setCurrentSection}>
              <Activos />
            </Layout>
          }
        />
        <Route
          path="/bajas"
          element={
            <Layout currentSection={currentSection} setCurrentSection={setCurrentSection}>
              <Bajas />
            </Layout>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;