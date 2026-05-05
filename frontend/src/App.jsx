import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Overview from './pages/Overview';
import TrackAnalysis from './pages/TrackAnalysis';
import DefectLogs from './pages/DefectLogs';
import Maintenance from './pages/Maintenance';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="overview" element={<Overview />} />
          <Route path="track-analysis" element={<TrackAnalysis />} />
          <Route path="defect-logs" element={<DefectLogs />} />
          <Route path="maintenance" element={<Maintenance />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
