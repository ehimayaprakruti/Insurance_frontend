import React, { useState } from 'react';
import LoginForm from './LoginForm';
import PremiumForm from './PremiumForm';
import './App.css';

function App() {

  const [role, setRole] = useState(localStorage.getItem('token') ? 'user' : null);

  return (
    <div className="App">
      {!role ? <LoginForm onLogin={setRole} /> : <PremiumForm />}
    </div>
  );
}

export default App;
