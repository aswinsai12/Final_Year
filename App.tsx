
import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import CaregiverDashboard from './components/CaregiverDashboard';
import useSmartCompartment from './hooks/useSmartCompartment';
import { NotificationProvider } from './context/NotificationContext';
import NotificationContainer from './components/notifications/NotificationContainer';

// This component can use hooks that need the context
const MainApp: React.FC = () => {
  const [currentView, setCurrentView] = useState<'patient' | 'caregiver'>('patient');
  const smartCompartmentData = useSmartCompartment();

  return (
    <>
      <Header 
        currentView={currentView}
        onToggleView={() => setCurrentView(v => v === 'patient' ? 'caregiver' : 'patient')}
      />
      <main className="p-4 sm:p-6 lg:p-8">
        {currentView === 'patient' ? (
          <Dashboard {...smartCompartmentData} />
        ) : (
          <CaregiverDashboard {...smartCompartmentData} />
        )}
      </main>
    </>
  );
}

// The top-level component that sets up providers
const App: React.FC = () => {
  return (
    <NotificationProvider>
      <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
        <MainApp />
        <NotificationContainer />
      </div>
    </NotificationProvider>
  );
};

export default App;
