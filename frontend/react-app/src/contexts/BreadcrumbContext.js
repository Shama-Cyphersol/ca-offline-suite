import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BreadcrumbContext = createContext();

export const useBreadcrumb = () => {
  
  const context = useContext(BreadcrumbContext);
  if (!context) {
    throw new Error('useBreadcrumb must be used within a BreadcrumbProvider');
  }
  return context;
};

export const BreadcrumbProvider = ({ children }) => {
  const navigate = useNavigate();

  const [breadcrumbs, setBreadcrumbs] = useState([
    { label: 'Home', path: '/' }
  ]);

  // Store last values in state instead of variables
  const [lastStates, setLastStates] = useState({
    mainDashboard: [],
    caseDashboard: [],
    individualDashboard: []
  });

  const updateBreadcrumbs = (newBreadcrumbs) => {
    setBreadcrumbs(newBreadcrumbs);
  };

  const addBreadcrumb = (newBreadcrumb) => {
    setBreadcrumbs(prev => [...prev, newBreadcrumb]);
  };

  const removeBreadcrumb = () => {
    setBreadcrumbs(prev => prev.slice(0, -1));
  };

  const resetBreadcrumbs = () => {
    setBreadcrumbs([{ label: 'Home', path: '/' }]);
    setLastStates({
      mainDashboard: [],
      caseDashboard: [],
      individualDashboard: []
    });

    navigate('/');

  };

  const navigateTo = (path) => {
    navigate(path);
  };

  // Utility function to set breadcrumbs for main dashboard
  const setMainDashboard = (section,path) => {
    const newMainDashboard = [
      { label: 'Home', path: '/' },
      { label: section,path, isCurrentPage: true }
    ];
    
    setLastStates(prev => ({
      ...prev,
      mainDashboard: newMainDashboard
    }));
    setBreadcrumbs(newMainDashboard);
    navigate(path);
  };

 // Utility function to set breadcrumbs for case dashboard
 const setCaseDashboard = (section, path) => {
  
  let lastMainDashboard = lastStates.mainDashboard;
  if (lastMainDashboard.length === 0) {
    setMainDashboard('Home', '/');
    lastMainDashboard = [{ label: 'Home', path: '/', isCurrentPage: true }];
  }
  const newCaseDashboard = [
    ...lastMainDashboard.map(item => ({ ...item, isCurrentPage: false })),
    { label: section, path: path, isCurrentPage: true }
  ];
  
  setLastStates(prev => ({
    ...prev,
    caseDashboard: newCaseDashboard
  }));
  setBreadcrumbs(newCaseDashboard);
  navigate(path);
};

// Utility function to set breadcrumbs for individual dashboard
const setIndividualDashboard = (section, path) => {

  let lastCaseDashboard = lastStates.caseDashboard;

  if (lastStates.caseDashboard.length === 0) {
    setCaseDashboard('Home', '/');
    lastCaseDashboard = [{ label: 'Home', path: '/', isCurrentPage: true }];
  }

  const newIndividualDashboard = [
    ...lastCaseDashboard.map(item => ({ ...item, isCurrentPage: false })),
    { label: section, path: path, isCurrentPage: true }
  ];
  
  setLastStates(prev => ({
    ...prev,
    individualDashboard: newIndividualDashboard
  }));
  setBreadcrumbs(newIndividualDashboard);
  navigate(path);
};

return (
  <BreadcrumbContext.Provider value={{
    breadcrumbs,
    lastStates,
    updateBreadcrumbs,
    addBreadcrumb,
    removeBreadcrumb,
    resetBreadcrumbs,
    setMainDashboard,
    setCaseDashboard,
    setIndividualDashboard,
    navigateTo
  }}>
    {children}
  </BreadcrumbContext.Provider>
);
};