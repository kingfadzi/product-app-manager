import { useState, useEffect, useMemo, useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

function useAppListFilters(apps, resetPage) {
  const history = useHistory();
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState('');
  const [resCatFilter, setResCatFilter] = useState('');
  const [stackFilter, setStackFilter] = useState('');
  const [productFilter, setProductFilter] = useState('');
  const [tcFilter, setTcFilter] = useState('');
  const [tierFilter, setTierFilter] = useState('');

  // Sync filters from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchTerm(params.get('search') || '');
    setResCatFilter(params.get('resCat') || '');
    setStackFilter(params.get('stack') || '');
    setProductFilter(params.get('product') || '');
    setTcFilter(params.get('tc') || '');
    setTierFilter(params.get('tier') || '');
    resetPage();
  }, [location.search, resetPage]);

  // Update URL with filter
  const updateFilter = useCallback((filterName, value) => {
    const params = new URLSearchParams(location.search);
    if (value) {
      params.set(filterName, value);
    } else {
      params.delete(filterName);
    }
    history.push(`/apps?${params.toString()}`);
  }, [history, location.search]);

  // Unique stacks
  const stacks = useMemo(() => {
    const unique = [...new Set(apps.map(app => app.stack).filter(Boolean))];
    return unique.sort();
  }, [apps]);

  // Unique products
  const productOptions = useMemo(() => {
    const unique = apps
      .filter(app => app.productId && app.productName)
      .reduce((acc, app) => {
        if (!acc.find(p => p.id === app.productId)) {
          acc.push({ id: app.productId, name: app.productName });
        }
        return acc;
      }, []);
    return unique.sort((a, b) => a.name.localeCompare(b.name));
  }, [apps]);

  // Unique TCs
  const tcOptions = useMemo(() => {
    const unique = apps
      .filter(app => app.tc && app.tcName)
      .reduce((acc, app) => {
        if (!acc.find(t => t.id === app.tc)) {
          acc.push({ id: app.tc, name: app.tcName });
        }
        return acc;
      }, []);
    return unique.sort((a, b) => a.name.localeCompare(b.name));
  }, [apps]);

  // Unique tiers
  const tierOptions = useMemo(() => {
    const unique = [...new Set(apps.map(app => app.tier).filter(Boolean))];
    return unique.sort();
  }, [apps]);

  // Filtered apps
  const filteredApps = useMemo(() => {
    return apps.filter(app => {
      const matchesSearch = !searchTerm ||
        app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.cmdbId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (app.description && app.description.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesResCat = !resCatFilter || app.resCat === resCatFilter;
      const matchesStack = !stackFilter || app.stack === stackFilter;
      const matchesProduct = !productFilter || app.productId === productFilter;
      const matchesTc = !tcFilter || app.tc === tcFilter;
      const matchesTier = !tierFilter || app.tier === tierFilter;

      return matchesSearch && matchesResCat && matchesStack && matchesProduct && matchesTc && matchesTier;
    });
  }, [apps, searchTerm, resCatFilter, stackFilter, productFilter, tcFilter, tierFilter]);

  const hasActiveFilters = searchTerm || resCatFilter || stackFilter || productFilter || tcFilter || tierFilter;

  return {
    searchTerm,
    resCatFilter,
    stackFilter,
    productFilter,
    tcFilter,
    tierFilter,
    stacks,
    productOptions,
    tcOptions,
    tierOptions,
    filteredApps,
    hasActiveFilters,
    updateFilter,
  };
}

export default useAppListFilters;
