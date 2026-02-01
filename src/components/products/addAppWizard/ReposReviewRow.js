import React from 'react';
import { Badge } from 'react-bootstrap';
import { getRepoTypeBadgeColor } from './helpers';

function ReposReviewRow({ repos }) {
  return (
    <tr>
      <th className="bg-light align-top">Repositories ({repos.length})</th>
      <td>
        {repos.length > 0 ? (
          repos.map((repo, idx) => (
            <span key={repo.repoId}>
              <Badge bg={getRepoTypeBadgeColor(repo.type)} className="me-1">
                {repo.type}
              </Badge>
              {repo.slug || repo.name}
              {idx < repos.length - 1 && <br />}
            </span>
          ))
        ) : (
          <span className="text-muted">None selected</span>
        )}
      </td>
    </tr>
  );
}

export default ReposReviewRow;
