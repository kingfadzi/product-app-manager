import React, { useState } from 'react';
import { Modal, Table, Pagination } from 'react-bootstrap';
import { formatShortDate } from './helpers';

const ITEMS_PER_PAGE = 5;

function RiskOutcomesModal({ show, type, data = [], onHide, onOutcomeClick }) {
  const [currentPage, setCurrentPage] = useState(1);

  // Ensure data is an array
  const items = Array.isArray(data) ? data : [];
  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = items.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleItemClick = (item) => {
    if (type === 'outcomes') {
      onHide();
      onOutcomeClick(item);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {type === 'risks' ? 'Risk Stories' : 'Business Outcomes'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ItemsTable
          items={paginatedData}
          type={type}
          onItemClick={handleItemClick}
        />
        {totalPages > 1 && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </Modal.Body>
    </Modal>
  );
}

function ItemsTable({ items, type, onItemClick }) {
  return (
    <Table size="sm" borderless>
      <tbody>
        {items.map(item => (
          <tr
            key={item.id}
            style={type === 'outcomes' ? { cursor: 'pointer' } : {}}
            onClick={() => onItemClick(item)}
          >
            <td style={{ width: '100px' }}>
              {type === 'risks' ? (
                <a href={`https://jira.example.com/browse/${item.id}`} target="_blank" rel="noopener noreferrer">
                  {item.id}
                </a>
              ) : (
                <span className="text-primary">{item.id}</span>
              )}
            </td>
            <td>{item.summary}</td>
            <td className="text-muted" style={{ width: '100px' }}>{item.status}</td>
            <td className="text-muted" style={{ width: '120px', whiteSpace: 'nowrap' }}>
              {formatShortDate(item.updated)}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

function PaginationControls({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="d-flex justify-content-center mt-3">
      <Pagination size="sm">
        <Pagination.Prev
          disabled={currentPage === 1}
          onClick={() => onPageChange(p => p - 1)}
        />
        {[...Array(totalPages)].map((_, i) => (
          <Pagination.Item
            key={i + 1}
            active={currentPage === i + 1}
            onClick={() => onPageChange(i + 1)}
          >
            {i + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(p => p + 1)}
        />
      </Pagination>
    </div>
  );
}

export default RiskOutcomesModal;
