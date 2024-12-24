import { useState, useEffect } from 'react';
import axios from 'axios';
import Dashboard from './pages/MainDashboard';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CaseDashboard from './pages/CaseDashboard';
import IndividualDashboard from './pages/IndividualDashboard';

function App() {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    axios.get('http://localhost:5000/api/hello')
      .then(response => setMessage(response.data.message))
      .catch(error => setMessage('Error connecting to Flask backend'));
  }, []);

  return (
    <div className="App">
      {/* <h1>Cyphersol ATS</h1>
      <p>Backend message: {message}</p> */}
      {/* <Dashboard/> */}
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/case-dashboard/:caseId" element={<CaseDashboard />} />
        <Route path="/individual-dashboard/:caseId/:individualId" element={<IndividualDashboard />} />
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;