import React, { useState } from 'react';
import Dashboard from './pages/Dashboard';
import { ErrorBoundary } from './components/ErrorBoundary';
import LoginPage, { DemoOfficer } from './pages/LoginPage';

function App() {
  const [isLoginRoute, setIsLoginRoute] = useState(() => window.location.pathname === '/login');

  const handleDemoLogin = (officer: DemoOfficer, method: 'parichay-id' | 'mobile-otp') => {
    window.localStorage.setItem('statskill_demo_login', JSON.stringify({ officer, method }));
    window.history.replaceState({}, '', '/');
    setIsLoginRoute(false);
  };

  const handleOpenLogin = () => {
    window.history.pushState({}, '', '/login');
    setIsLoginRoute(true);
  };

  return (
    <ErrorBoundary>
      <div className="App">
        {isLoginRoute ? (
          <LoginPage onAuthenticate={handleDemoLogin} />
        ) : (
          <Dashboard onOpenLogin={handleOpenLogin} />
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;
