import React, { createContext, useState } from 'react';
import useInitialAppData from '../hooks/useInitialAppData';

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [apps, setApps] = useState([]);
  const [productApps, setProductApps] = useState([]);
  const { loading, error, reload } = useInitialAppData({
    setProducts,
    setApps,
    setProductApps,
  });

  const addApp = (app) => {
    setApps(prev => [...prev, app]);
  };

  const value = {
    products,
    setProducts,
    apps,
    setApps,
    productApps,
    setProductApps,
    loading,
    error,
    reload,
    addApp,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export default AppContext;
