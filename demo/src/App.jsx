import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AgentProvider } from './contexts/AgentContext';
import NavigationBar from './components/layout/NavigationBar';
import Login from './screens/Login';
import Dashboard from './screens/Dashboard';
import FoundationSpace from './screens/FoundationSpace';
import Analysis from './screens/Analysis';
import TrilinearCoupling from './screens/TrilinearCoupling';
import CalibrationResults from './screens/CalibrationResults';
import SolarConfirmation from './screens/SolarConfirmation';
import MemberHeatmap from './screens/MemberHeatmap';
import Timeline from './screens/Timeline';
import DocsPage from './docs/DocsPage';
import { ROUTES } from './utils/constants';

function App() {
  return (
    <AgentProvider>
      <BrowserRouter>
        <Routes>
          {/* Login route - no navigation bar */}
          <Route path={ROUTES.LOGIN} element={<Login />} />
          
          {/* Main app routes - with navigation bar */}
          <Route path="/*" element={
            <>
              <NavigationBar />
              <Routes>
                <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
                <Route path={ROUTES.FOUNDATION} element={<FoundationSpace />} />
                <Route path={ROUTES.ANALYSIS} element={<Analysis />} />
                <Route path={`${ROUTES.ANALYSIS}/trilinear`} element={<TrilinearCoupling />} />
                <Route path={ROUTES.CALIBRATION} element={<CalibrationResults />} />
                <Route path={ROUTES.SOLAR} element={<SolarConfirmation />} />
                <Route path={ROUTES.MEMBERS} element={<MemberHeatmap />} />
                <Route path={ROUTES.TIMELINE} element={<Timeline />} />
                <Route path={ROUTES.DOCS} element={<DocsPage />} />
                <Route path={`${ROUTES.DOCS}/:docId`} element={<DocsPage />} />
                
                {/* Redirect root to login */}
                <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />
              </Routes>
            </>
          } />
        </Routes>
      </BrowserRouter>
    </AgentProvider>
  );
}

export default App;

