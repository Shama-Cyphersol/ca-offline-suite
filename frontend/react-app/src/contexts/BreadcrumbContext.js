import React, { createContext, useContext, useState, useCallback } from 'react';
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
  // const location = useLocation();

  const [breadcrumbs, setBreadcrumbs] = useState([
    { label: 'Home', path: '/' }
  ]);

  const [navigationStack, setNavigationStack] = useState(['/']);
  const [lastStates, setLastStates] = useState({
    mainDashboard: [],
    caseDashboard: [],
    individualDashboard: []
  });

  const updateBreadcrumbs = useCallback((newBreadcrumbs) => {
    setBreadcrumbs(newBreadcrumbs.map(crumb => ({
      ...crumb,
      onClick: crumb.label === 'Home' ? () => navigate('/') : undefined
    })));
    setNavigationStack(prev => [...prev, newBreadcrumbs[newBreadcrumbs.length - 1].path]);
  }, [navigate]);

  const navigateWithTransition = useCallback(async (path) => {
    try {
      await navigate(path);
    } catch (error) {
      console.error('Navigation failed:', error);
    }
  }, [navigate]);

  const setMainDashboard = useCallback(async (section, path) => {
    const newMainDashboard = [
      { label: 'Home', path: '/' },
      { label: section, path, isCurrentPage: true }
    ];
    
    setLastStates(prev => ({
      ...prev,
      mainDashboard: newMainDashboard
    }));
    updateBreadcrumbs(newMainDashboard);
    await navigateWithTransition(path);
  }, [navigateWithTransition, updateBreadcrumbs]);

  const setCaseDashboard = useCallback(async (section, path) => {
    let lastMainDashboard = lastStates.mainDashboard;
    if (lastMainDashboard.length === 0) {
      await setMainDashboard('Home', '/');
      lastMainDashboard = [{ label: 'Home', path: '/', isCurrentPage: true }];
    }
    
    const newCaseDashboard = [
      ...lastMainDashboard.map(item => ({ ...item, isCurrentPage: false })),
      { label: section, path, isCurrentPage: true }
    ];
    
    setLastStates(prev => ({
      ...prev,
      caseDashboard: newCaseDashboard
    }));
    updateBreadcrumbs(newCaseDashboard);
    await navigateWithTransition(path);
  }, [lastStates.mainDashboard, setMainDashboard, navigateWithTransition, updateBreadcrumbs]);

  const setIndividualDashboard = useCallback(async (section, path) => {
    let lastCaseDashboard = lastStates.caseDashboard;
    if (lastCaseDashboard.length === 0) {
      await setCaseDashboard('Home', '/');
      lastCaseDashboard = [{ label: 'Home', path: '/', isCurrentPage: true }];
    }

    const newIndividualDashboard = [
      ...lastCaseDashboard.map(item => ({ ...item, isCurrentPage: false })),
      { label: section, path, isCurrentPage: true }
    ];
    
    setLastStates(prev => ({
      ...prev,
      individualDashboard: newIndividualDashboard
    }));
    updateBreadcrumbs(newIndividualDashboard);
    await navigateWithTransition(path);
  }, [lastStates.caseDashboard, setCaseDashboard, navigateWithTransition, updateBreadcrumbs]);

  const resetBreadcrumbs = useCallback(async () => {
    const homeBreadcrumb = { label: 'Home', path: '/', onClick: () => navigate('/') };
    setBreadcrumbs([homeBreadcrumb]);
    setLastStates({
      mainDashboard: [],
      caseDashboard: [],
      individualDashboard: []
    });
    setNavigationStack(['/']);
    await navigateWithTransition('/');
  }, [navigateWithTransition, navigate]);

  return (
    <BreadcrumbContext.Provider value={{
      breadcrumbs,
      lastStates,
      updateBreadcrumbs,
      setMainDashboard,
      setCaseDashboard,
      setIndividualDashboard,
      resetBreadcrumbs,
      navigationStack
    }}>
      {children}
    </BreadcrumbContext.Provider>
  );
};
