import React, { useState, useContext } from 'react';
import { Card, Table, Button, Alert, Breadcrumb } from 'react-bootstrap';
import { useParams, useHistory } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { useUser } from '../context/UserContext';
import useProducts from '../hooks/useProducts';
import PageLayout from '../components/layout/PageLayout';
import AddAppModal from '../components/products/AddAppModal';
import ConfirmModal from '../components/common/ConfirmModal';
import TablePagination from '../components/common/TablePagination';
import { usePagination } from '../hooks/usePagination';
import { reposApi, backlogsApi, docsApi, appsApi } from '../services/api';

function ProductDetail() {
  const { id } = useParams();
  const history = useHistory();
  const { apps, addApp } = useContext(AppContext);
  const { isLoggedIn } = useUser();
  const {
    getProductById,
    getAppsForProduct,
    addAppToProduct,
    removeAppFromProduct,
    error
  } = useProducts();

  const [showAddModal, setShowAddModal] = useState(false);
  const [removeConfirm, setRemoveConfirm] = useState(null);

  const product = getProductById(id);
  const productAppIds = getAppsForProduct(id);
  const productApps = apps.filter(app => productAppIds.includes(app.id));

  // Pagination for product apps
  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData: paginatedApps,
    startIndex,
    endIndex,
    totalItems,
    showPagination
  } = usePagination(productApps, 10);

  const handleAddApps = async (selectedApps, metadata = {}) => {
    for (const app of selectedApps) {
      // Onboard the app and get the internal app ID
      // Use productId from wizard metadata, not from URL
      const productId = metadata.productId || id;
      const association = await addAppToProduct(productId, app.cmdbId || app.id, metadata);
      const appId = association?.appId;

      if (appId) {
        // Save repos
        if (metadata.repos?.length > 0) {
          for (const repo of metadata.repos) {
            await reposApi.create(appId, {
              name: repo.name,
              url: repo.url,
              gitlabId: repo.repoId,
              defaultBranch: repo.defaultBranch || 'main',
              isMonorepo: false,
            }).catch(console.error);
          }
        }

        // Save Jira projects
        if (metadata.jiraProjects?.length > 0) {
          for (const jira of metadata.jiraProjects) {
            await backlogsApi.create(appId, {
              projectKey: jira.projectKey,
              projectName: jira.projectName,
              projectUrl: jira.url,
            }).catch(console.error);
          }
        }

        // Save documentation
        if (metadata.documentation?.length > 0) {
          for (const doc of metadata.documentation) {
            await docsApi.create(appId, {
              title: doc.type,
              url: doc.url,
              type: doc.type,
            }).catch(console.error);
          }
        }

        // Fetch and add the new app to context
        const cmdbId = app.cmdbId || app.id;
        const newApp = await appsApi.getById(cmdbId);
        if (newApp) {
          addApp(newApp);
        }
      }
    }
    setShowAddModal(false);
  };

  const handleRemoveApp = async () => {
    if (removeConfirm) {
      await removeAppFromProduct(id, removeConfirm.id);
      setRemoveConfirm(null);
    }
  };

  const tierColors = {
    gold: 'warning',
    silver: 'secondary',
    bronze: 'info',
  };

  const statusColors = {
    active: 'success',
    maintenance: 'warning',
    deprecated: 'danger',
  };

  // Count apps by tier
  const goldApps = productApps.filter(a => a.tier === 'gold').length;
  const silverApps = productApps.filter(a => a.tier === 'silver').length;
  const bronzeApps = productApps.filter(a => a.tier === 'bronze').length;

  if (!product) {
    return (
      <PageLayout>
        <Alert variant="warning">
          Product not found.{' '}
          <Button variant="link" onClick={() => history.push('/products')}>
            Back to Products
          </Button>
        </Alert>
      </PageLayout>
    );
  }

  // Get initial letter for avatar
  const initial = product.name.charAt(0).toUpperCase();

  return (
    <PageLayout>
      {/* Breadcrumb Navigation */}
      <Breadcrumb>
        <Breadcrumb.Item onClick={() => history.push('/')}>Home</Breadcrumb.Item>
        <Breadcrumb.Item onClick={() => history.push(`/products?stack=${product.stack}`)}>{product.stack}</Breadcrumb.Item>
        <Breadcrumb.Item active>{product.name}</Breadcrumb.Item>
      </Breadcrumb>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Product Header */}
      <div className="d-flex align-items-center mb-4">
        <div
          className="d-flex align-items-center justify-content-center mr-3"
          style={{
            width: '64px',
            height: '64px',
            backgroundColor: '#6c5ce7',
            borderRadius: '8px',
            color: 'white',
            fontSize: '28px',
            fontWeight: 'bold',
          }}
        >
          {initial}
        </div>
        <div className="flex-grow-1">
          <h2 className="mb-1">{product.name}</h2>
          <span className="text-muted">{product.description || 'No description'}</span>
        </div>
        {isLoggedIn && (
          <Button variant="outline-primary" size="sm" onClick={() => setShowAddModal(true)}>
            Add Application
          </Button>
        )}
      </div>


      {/* Applications Section */}
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Applications</h5>
      </div>

      {productApps.length === 0 ? (
        <Card className="text-center py-5">
          <Card.Body>
            <p className="text-muted mb-3">No applications added to this product yet</p>
            {isLoggedIn && (
              <Button variant="primary" size="sm" onClick={() => setShowAddModal(true)}>
                Add Application
              </Button>
            )}
          </Card.Body>
        </Card>
      ) : (
        <>
          <Card>
            <Table hover className="mb-0" size="sm" style={{ whiteSpace: 'nowrap' }}>
              <thead className="bg-light">
                <tr>
                  <th>App ID</th>
                  <th>Name</th>
                  <th>Parent</th>
                  <th>ResCat</th>
                  <th className="text-center">Repos</th>
                  <th className="text-center">Backlogs</th>
                  <th className="text-center">Open Risks</th>
                </tr>
              </thead>
              <tbody>
                {paginatedApps.map(app => (
                  <tr
                    key={app.id}
                    style={{ cursor: 'pointer' }}
                    onClick={() => history.push(`/apps/${app.id}`)}
                  >
                    <td>{app.cmdbId}</td>
                    <td style={{ fontWeight: 500 }}>{app.name}</td>
                    <td>{app.parent || '-'}</td>
                    <td>{app.resCat || '-'}</td>
                    <td className="text-center">{app.repoCount || 0}</td>
                    <td className="text-center">{app.backlogCount || 0}</td>
                    <td className="text-center">{app.openRisks || 0}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>

          {showPagination && (
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              startIndex={startIndex}
              endIndex={endIndex}
              totalItems={totalItems}
              itemLabel="apps"
            />
          )}
        </>
      )}

      <AddAppModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        onAdd={handleAddApps}
        existingAppIds={productAppIds}
      />

      <ConfirmModal
        show={!!removeConfirm}
        onHide={() => setRemoveConfirm(null)}
        onConfirm={handleRemoveApp}
        title="Remove App"
        message={`Are you sure you want to remove "${removeConfirm?.name}" from this product?`}
        confirmText="Remove"
      />
    </PageLayout>
  );
}

export default ProductDetail;
