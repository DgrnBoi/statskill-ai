import React, { useState } from 'react';
import Dashboard from './pages/Dashboard';
import LoginPage, { DemoOfficer } from './pages/LoginPage';

function App() {
  const [isLoginRoute, setIsLoginRoute] = useState(() => window.location.pathname === '/login');

  const handleDemoLogin = async (officer: DemoOfficer, method: 'parichay-id' | 'mobile-otp') => {
    const response = await fetch('http://localhost:5000/api/auth/demo-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ officerId: officer.id, method }),
    });
    const data = await response.json();

    if (!response.ok || !data.token) {
      throw new Error(data.error || 'Jan Parichay authentication could not be completed.');
    }

    window.localStorage.setItem('auth_token', data.token);
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
