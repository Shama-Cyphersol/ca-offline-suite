import React from 'react';
import './App.css';
import Dashboard from './Pages/Home';
import { ThemeProvider } from './components/theme-provider';
import { HashRouter, Routes, Route } from "react-router-dom";
import CaseDashboard from './Pages/CaseDashboard';
import IndividualDashboard from './Pages/IndividualDashboard';
import ElectronIntro from './components/ElectronIntro';
import { useState } from 'react';
import { SidebarProvider } from './components/ui/sidebar';
import {ScrollArea} from './components/ui/scroll-area';
import { Hash } from 'lucide-react';

function App() {
    const [showIntro, setShowIntro] = useState(true);  
    console.log('isDev', process.env.NODE_ENV);
  
  return (
    <ThemeProvider defaultTheme="system" storageKey="app-theme">
      {showIntro && <ElectronIntro onComplete={() => setShowIntro(false)} />}
      <SidebarProvider>

        <HashRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/case-dashboard/:caseId" element={<CaseDashboard />} />
            <Route path="/individual-dashboard/:caseId/:individualId" element={<IndividualDashboard />} />
          </Routes>
        </HashRouter>
      </SidebarProvider>
    </ThemeProvider>
  );
}

export default App;
