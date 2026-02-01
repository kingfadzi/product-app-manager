import React from 'react';
import { Card, Tab, Nav, Table } from 'react-bootstrap';
import { JIRA_BASE_URL } from '../../../constants/config';

function SourceCodeCard({ repos, backlogs }) {
  return (
    <Card className="mb-4 tabbed-card">
      <Tab.Container defaultActiveKey="repos">
        <Card.Header>
          <strong>Source Code & Backlogs</strong>
          <Nav variant="tabs" className="mt-2">
            <Nav.Item><Nav.Link eventKey="repos">Repositories</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link eventKey="jira">Backlogs</Nav.Link></Nav.Item>
          </Nav>
        </Card.Header>
        <Card.Body>
          <Tab.Content>
            <Tab.Pane eventKey="repos">
              <ReposTab repos={repos} />
            </Tab.Pane>
            <Tab.Pane eventKey="jira">
              <BacklogsTab backlogs={backlogs} />
            </Tab.Pane>
          </Tab.Content>
        </Card.Body>
      </Tab.Container>
    </Card>
  );
}

function ReposTab({ repos = [] }) {
  const items = Array.isArray(repos) ? repos : [];
  if (items.length === 0) {
    return <p className="text-muted mb-0">No repositories added</p>;
  }

  // Extract slug from URL (e.g., "https://gitlab.example.com/group/repo" -> "group/repo")
  const getSlug = (url) => {
    if (!url) return '';
    try {
      const urlObj = new URL(url);
      return urlObj.pathname.replace(/^\//, '');
    } catch {
      return url;
    }
  };

  return (
    <Table size="sm" className="mb-0" borderless>
      <tbody>
        {items.map(repo => (
          <tr key={repo.id}>
            <td>
              <a href={repo.url} target="_blank" rel="noopener noreferrer">
                {getSlug(repo.url) || repo.name}
              </a>
            </td>
            <td className="text-muted">GitLab</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

function BacklogsTab({ backlogs = [] }) {
  const items = Array.isArray(backlogs) ? backlogs : [];
  if (items.length === 0) {
    return <p className="text-muted mb-0">No backlogs added</p>;
  }

  return (
    <Table size="sm" className="mb-0" borderless>
      <tbody>
        {items.map(backlog => (
          <tr key={backlog.id}>
            <td>
              <a href={backlog.projectUrl || `${JIRA_BASE_URL}/browse/${backlog.projectKey}`} target="_blank" rel="noopener noreferrer">
                {backlog.projectKey}
              </a>
            </td>
            <td>{backlog.projectName}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default SourceCodeCard;
