import React from 'react';
import { Pagination } from 'react-bootstrap';

/**
 * Reusable pagination component for tables
 *
 * @param {Object} props
 * @param {number} props.currentPage - Current active page (1-based)
 * @param {number} props.totalPages - Total number of pages
 * @param {function} props.onPageChange - Callback when page changes
 * @param {number} props.startIndex - Start index of current page items (1-based, for display)
 * @param {number} props.endIndex - End index of current page items
 * @param {number} props.totalItems - Total number of items
 * @param {string} props.size - Pagination size: 'sm' for modals/compact views, undefined for default
 * @param {boolean} props.showInfo - Whether to show "Showing X-Y of Z" text (default: true)
 * @param {string} props.itemLabel - Label for items (e.g., "apps", "products") (default: "items")
 */
function TablePagination({
  currentPage,
  totalPages,
  onPageChange,
  startIndex,
  endIndex,
  totalItems,
  size,
  showInfo = true,
  itemLabel = 'items'
}) {
  // Don't render if there's only one page or no items
  if (totalPages <= 1) {
    return null;
  }

  // Generate page numbers with smart ellipsis
  const getPageNumbers = () => {
    const pages = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push({ type: 'page', number: i });
      }
    } else {
      // Always show first page
      pages.push({ type: 'page', number: 1 });

      // Calculate range around current page
      let rangeStart = Math.max(2, currentPage - 1);
      let rangeEnd = Math.min(totalPages - 1, currentPage + 1);

      // Adjust range to show at least 3 pages in the middle
      if (currentPage <= 3) {
        rangeEnd = Math.min(4, totalPages - 1);
      }
      if (currentPage >= totalPages - 2) {
        rangeStart = Math.max(2, totalPages - 3);
      }

      // Add ellipsis before range if needed
      if (rangeStart > 2) {
        pages.push({ type: 'ellipsis', key: 'ellipsis-start' });
      }

      // Add range pages
      for (let i = rangeStart; i <= rangeEnd; i++) {
        pages.push({ type: 'page', number: i });
      }

      // Add ellipsis after range if needed
      if (rangeEnd < totalPages - 1) {
        pages.push({ type: 'ellipsis', key: 'ellipsis-end' });
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push({ type: 'page', number: totalPages });
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();
  const showFirstLast = totalPages >= 5;

  return (
    <div className="d-flex justify-content-between align-items-center mt-3">
      {showInfo ? (
        <div style={{ fontSize: '0.875rem', color: '#6c757d' }}>
          Showing {startIndex}-{endIndex} of {totalItems} {itemLabel}
        </div>
      ) : (
        <div />
      )}

      <Pagination size={size} className="mb-0">
        {showFirstLast && (
          <Pagination.First
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
          />
        )}

        <Pagination.Prev
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        />

        {pageNumbers.map((item) => {
          if (item.type === 'ellipsis') {
            return <Pagination.Ellipsis key={item.key} disabled />;
          }
          return (
            <Pagination.Item
              key={item.number}
              active={item.number === currentPage}
              onClick={() => onPageChange(item.number)}
            >
              {item.number}
            </Pagination.Item>
          );
        })}

        <Pagination.Next
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        />

        {showFirstLast && (
          <Pagination.Last
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
          />
        )}
      </Pagination>
    </div>
  );
}

export default TablePagination;
