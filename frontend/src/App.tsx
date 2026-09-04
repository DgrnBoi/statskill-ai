import React, { useState } from 'react';
import Dashboard from './pages/Dashboard';
import LoginPage, { DemoOfficer } from './pages/LoginPage';

function App() {
  const [isLoginRoute, setIsLoginRoute] = useState(() => window.location.pathname === '/login');

  const handleDemoLogin = (officer: DemoOfficer, method: 'parichay-id' | 'mobile-otp') => {
    window.localStorage.setItem('statskill_demo_login', JSON.stringify({ officer, method }));
    window.history.replaceState({}, '', '/');
    setIsLoginRoute(false);
  };

  if (isLoginRoute) {
    return <LoginPage onAuthenticate={handleDemoLogin} />;
  }

  return (
    <div className="App">
      <Dashboard />
    </div>
  );
}

export default App;
