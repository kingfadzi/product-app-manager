import { useContext, useCallback } from 'react';
import { AppContext } from '../context/AppContext';
import { productsApi } from '../services/api';
import useApi from './useApi';

export function useProducts() {
  const { products, setProducts, productApps, setProductApps } = useContext(AppContext);
  const { loading, error, execute, clearError } = useApi();

  const fetchProducts = useCallback(async () => {
    const data = await execute(() => productsApi.getAll());
    setProducts(data);
    return data;
  }, [execute, setProducts]);

  const createProduct = useCallback(async (product) => {
    const newProduct = await execute(() => productsApi.create(product));
    setProducts(prev => [...prev, newProduct]);
    return newProduct;
  }, [execute, setProducts]);

  const updateProduct = useCallback(async (id, product) => {
    const updated = await execute(() => productsApi.update(id, product));
    setProducts(prev => prev.map(p => p.id === id ? updated : p));
    return updated;
  }, [execute, setProducts]);

  const deleteProduct = useCallback(async (id) => {
    await execute(() => productsApi.delete(id));
    setProducts(prev => prev.filter(p => p.id !== id));
    setProductApps(prev => prev.filter(pa => pa.productId !== id));
  }, [execute, setProducts, setProductApps]);

  const addAppToProduct = useCallback(async (productId, appId) => {
    const association = await execute(() => productsApi.addApp(productId, appId));
    setProductApps(prev => [...prev, association]);
    return association;
  }, [execute, setProductApps]);

  const removeAppFromProduct = useCallback(async (productId, appId) => {
    await execute(() => productsApi.removeApp(productId, appId));
    setProductApps(prev =>
      prev.filter(pa => !(pa.productId === productId && pa.appId === appId))
    );
  }, [execute, setProductApps]);

  const getProductById = useCallback((id) => {
    return products.find(p => p.id === id);
  }, [products]);

  const getAppsForProduct = useCallback((productId) => {
    return productApps
      .filter(pa => pa.productId === productId)
      .map(pa => pa.appId);
  }, [productApps]);

  return {
    products,
    productApps,
    loading,
    error,
    clearError,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    addAppToProduct,
    removeAppFromProduct,
    getProductById,
    getAppsForProduct,
  };
}

export default useProducts;
