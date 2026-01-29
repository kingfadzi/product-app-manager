import React from 'react';
import { Card, Tab, Nav, Table } from 'react-bootstrap';

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

function ReposTab({ repos }) {
  if (repos.length === 0) {
    return <p className="text-muted mb-0">No repositories added</p>;
  }

  return (
    <Table size="sm" className="mb-0" borderless>
      <tbody>
        {repos.map(repo => (
          <tr key={repo.id}>
            <td>
              <a href={`https://gitlab.com/${repo.repoPath}`} target="_blank" rel="noopener noreferrer">
                {repo.repoName}
              </a>
            </td>
            <td>{repo.role}</td>
            <td className="text-muted">{repo.platform || 'GitLab'}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

function BacklogsTab({ backlogs }) {
  if (backlogs.length === 0) {
    return <p className="text-muted mb-0">No backlogs added</p>;
  }

  return (
    <Table size="sm" className="mb-0" borderless>
      <tbody>
        {backlogs.map(backlog => (
          <tr key={backlog.id}>
            <td>
              <a href={`https://jira.example.com/browse/${backlog.projectKey}`} target="_blank" rel="noopener noreferrer">
                {backlog.projectKey}
              </a>
            </td>
            <td>{backlog.projectName}</td>
            <td className="text-muted">{backlog.purpose}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default SourceCodeCard;
