import React, { createContext, useState, useEffect } from 'react';
import { productsApi, appsApi } from '../services/api';

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [apps, setApps] = useState([]);
  const [productApps, setProductApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadInitialData() {
      try {
        setLoading(true);
        const [productsData, appsData] = await Promise.all([
          productsApi.getAll(),
          appsApi.getAll(),
        ]);

        // Load product-app associations
        const associations = [];
        for (const product of productsData) {
          const productAppsData = await productsApi.getApps(product.id);
          productAppsData.forEach(app => {
            associations.push({
              productId: product.id,
              appId: app.id,
            });
          });
        }

        setProducts(productsData);
        setApps(appsData);
        setProductApps(associations);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadInitialData();
  }, []);

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
    addApp,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export default AppContext;
