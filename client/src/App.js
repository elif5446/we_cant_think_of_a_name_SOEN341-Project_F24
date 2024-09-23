import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import LoginPage from './LoginPage';  // Import LoginPage (exact spelling)
import Dashboard from './Dashboard'; 

function App() {
  return (
    <div>
      <h1>Welcome to My App</h1>
      <p>This is the custom content that should replace the default template.</p>

      {/* Set up the Router and Routes */}
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />  {/* Main login page */}
          <Route path="/dashboard" element={<Dashboard />} />  {/* Dashboard page */}
        </Routes>
      </Router>
      {/* Without this part, everything works fine */}
    </div>
  );
}

export default App;
