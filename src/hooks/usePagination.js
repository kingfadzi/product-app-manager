import { useState, useMemo, useCallback } from 'react';

/**
 * Custom hook for handling table pagination
 * @param {Array} data - The array of items to paginate
 * @param {number} itemsPerPage - Number of items per page (default: 10)
 * @returns {Object} Pagination state and helpers
 */
export function usePagination(data, itemsPerPage = 10) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Ensure current page is valid when data changes
  const validCurrentPage = Math.min(Math.max(1, currentPage), Math.max(1, totalPages));

  const startIndex = (validCurrentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  const paginatedData = useMemo(() => {
    return data.slice(startIndex, endIndex);
  }, [data, startIndex, endIndex]);

  const resetPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  const goToPage = useCallback((page) => {
    const targetPage = Math.min(Math.max(1, page), Math.max(1, totalPages));
    setCurrentPage(targetPage);
  }, [totalPages]);

  const nextPage = useCallback(() => {
    if (validCurrentPage < totalPages) {
      setCurrentPage(validCurrentPage + 1);
    }
  }, [validCurrentPage, totalPages]);

  const prevPage = useCallback(() => {
    if (validCurrentPage > 1) {
      setCurrentPage(validCurrentPage - 1);
    }
  }, [validCurrentPage]);

  return {
    // Current state
    currentPage: validCurrentPage,
    totalPages,
    totalItems,

    // Indices (1-based for display)
    startIndex: totalItems > 0 ? startIndex + 1 : 0,
    endIndex,

    // Data
    paginatedData,

    // Actions
    setCurrentPage: goToPage,
    resetPage,
    nextPage,
    prevPage,

    // Flags
    hasNextPage: validCurrentPage < totalPages,
    hasPrevPage: validCurrentPage > 1,
    isEmpty: totalItems === 0,
    showPagination: totalPages > 1
  };
}

export default usePagination;
