import React, { useContext } from 'react';
import { Button, Spinner, Alert, Breadcrumb } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import PageLayout from '../components/layout/PageLayout';
import EmptyState from '../components/common/EmptyState';
import { usePagination } from '../hooks/usePagination';
import useTransactionCycles from '../hooks/useTransactionCycles';
import useStackSummaries from '../hooks/useStackSummaries';
import StacksTable from '../components/dashboard/StacksTable';

function Dashboard() {
  const { products, apps, productApps, loading, error } = useContext(AppContext);
  const history = useHistory();
  const {
    transactionCycles: tcList,
    error: tcError,
    loading: tcLoading,
  } = useTransactionCycles();

  const { stacks, getTcName } = useStackSummaries({ products, apps, productApps, tcList });

  // Pagination
  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData: paginatedStacks,
    startIndex,
    endIndex,
    totalItems,
    showPagination
  } = usePagination(stacks, 10);

  if (loading || tcLoading) {
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
      <Breadcrumb>
        <Breadcrumb.Item onClick={() => history.push('/')}>Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Stacks</Breadcrumb.Item>
      </Breadcrumb>

      {tcError && <Alert variant="warning">Transaction cycles failed to load: {tcError}</Alert>}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Stacks</h1>
        <Button size="sm" onClick={() => history.push('/products/new')}>
          New Stack
        </Button>
      </div>

      {stacks.length === 0 ? (
        <EmptyState
          title="No stacks yet"
          description="Create your first product to get started."
          actionLabel="Create Product"
          onAction={() => history.push('/products/new')}
        />
      ) : (
        <StacksTable
          stacks={stacks}
          getTcName={getTcName}
          onRowClick={(stack) => history.push(`/products?stack=${encodeURIComponent(stack.name)}`)}
          pagination={{
            currentPage,
            totalPages,
            paginatedData: paginatedStacks,
            startIndex,
            endIndex,
            totalItems,
            showPagination,
            onPageChange: setCurrentPage,
          }}
        />
      )}
    </PageLayout>
  );
}

export default Dashboard;
