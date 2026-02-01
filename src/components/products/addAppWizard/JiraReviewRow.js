import React from 'react';

function JiraReviewRow({ projects }) {
  return (
    <tr>
      <th className="bg-light align-top">Jira Projects ({projects.length})</th>
      <td>
        {projects.length > 0 ? (
          projects.map((project, idx) => (
            <span key={project.projectKey}>
              <strong>{project.projectKey}</strong> - {project.projectName}
              {idx < projects.length - 1 && <br />}
            </span>
          ))
        ) : (
          <span className="text-muted">None selected</span>
        )}
      </td>
    </tr>
  );
}

export default JiraReviewRow;
