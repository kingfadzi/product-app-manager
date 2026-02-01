import React, { useContext, useState, useEffect, useMemo } from 'react';
import { Spinner, Alert } from 'react-bootstrap';
import { useHistory, useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import PageLayout from '../components/layout/PageLayout';
import { usePagination } from '../hooks/usePagination';
import SearchBar from '../components/search/SearchBar';
import SearchResultsEmptyState from '../components/search/SearchResultsEmptyState';
import SearchResultsTable from '../components/search/SearchResultsTable';

const RESULTS_PER_PAGE = 20;

function SearchResults() {
  const history = useHistory();
  const location = useLocation();
  const { apps, loading, error } = useContext(AppContext);

  // Parse query params
  const params = new URLSearchParams(location.search);
  const initialQuery = params.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);

  // Update search from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchQuery(params.get('q') || '');
  }, [location.search]);

  // Filter apps
  const filteredApps = useMemo(() => {
    if (!initialQuery) return [];
    const lowerQuery = initialQuery.toLowerCase();
    return apps.filter(app =>
      app.name.toLowerCase().includes(lowerQuery) ||
      app.cmdbId.toLowerCase().includes(lowerQuery) ||
      (app.description && app.description.toLowerCase().includes(lowerQuery))
    );
  }, [apps, initialQuery]);

  // Use pagination hook
  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData,
    startIndex,
    endIndex,
    totalItems,
    showPagination,
    resetPage
  } = usePagination(filteredApps, RESULTS_PER_PAGE);

  // Reset pagination when query changes
  useEffect(() => {
    resetPage();
  }, [initialQuery, resetPage]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      history.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="text-center py-5">
          <Spinner animation="border" />
          <p className="mt-2">Loading...</p>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <Alert variant="danger">Error loading data: {error}</Alert>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <SearchBar
        searchQuery={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onSubmit={handleSearchSubmit}
      />

      {initialQuery ? (
        <>
          <div className="mb-3" style={{ fontSize: '0.9375rem', color: '#6c757d' }}>
            {filteredApps.length} app{filteredApps.length !== 1 ? 's' : ''} found for "{initialQuery}"
          </div>

          {filteredApps.length === 0 ? (
            <SearchResultsEmptyState
              message={`No apps found matching "${initialQuery}"`}
              subMessage="Try different search terms"
            />
          ) : (
            <SearchResultsTable
              apps={filteredApps}
              pagination={{
                currentPage,
                totalPages,
                paginatedData,
                startIndex,
                endIndex,
                totalItems,
                showPagination,
                setCurrentPage,
              }}
              onRowClick={(app) => history.push(`/apps/${app.id}`)}
            />
          )}
        </>
      ) : (
        <SearchResultsEmptyState message="Enter a search term to find apps" />
      )}
    </PageLayout>
  );
}

export default SearchResults;
