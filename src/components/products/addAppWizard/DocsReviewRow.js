import React from 'react';

function DocsReviewRow({ docs }) {
  return (
    <tr>
      <th className="bg-light align-top">Documentation ({docs.length})</th>
      <td>
        {docs.length > 0 ? (
          docs.map((doc, idx) => (
            <span key={doc.type}>
              <strong>{doc.type}</strong>
              {idx < docs.length - 1 && <br />}
            </span>
          ))
        ) : (
          <span className="text-muted">None added</span>
        )}
      </td>
    </tr>
  );
}

export default DocsReviewRow;
