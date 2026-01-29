import React from 'react';

/**
 * Remediation box for data correction guidance
 * @param {Object} props
 * @param {string} props.dataSource - Description of the data source
 * @param {string} props.contactEmail - Contact email for issues
 * @param {string} props.linkUrl - URL for more info
 * @param {string} props.linkText - Text for the link
 */
function RemediationBox({ dataSource, contactEmail, linkUrl, linkText }) {
  return (
    <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '0.25rem', marginTop: '1rem' }}>
      <strong>Something missing or incorrect?</strong>
      <p className="mb-1 small text-muted">{dataSource}</p>
      <p className="mb-0 small">
        <strong>Contact:</strong> {contactEmail}<br />
        <a href={linkUrl} target="_blank" rel="noopener noreferrer">{linkText} &rarr;</a>
      </p>
    </div>
  );
}

export default RemediationBox;
