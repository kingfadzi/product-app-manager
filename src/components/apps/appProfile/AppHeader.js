import React from 'react';

function AppHeader({ app }) {
  const initial = app.name.charAt(0).toUpperCase();

  return (
    <div className="d-flex align-items-center mb-4">
      <Avatar initial={initial} />
      <AppInfo app={app} />
    </div>
  );
}

function Avatar({ initial }) {
  return (
    <div
      className="d-flex align-items-center justify-content-center mr-3"
      style={{
        width: '64px',
        height: '64px',
        backgroundColor: '#00b894',
        borderRadius: '8px',
        color: 'white',
        fontSize: '28px',
        fontWeight: 'bold',
      }}
    >
      {initial}
    </div>
  );
}

function AppInfo({ app }) {
  return (
    <div className="flex-grow-1">
      <h2 className="mb-1">{app.name}</h2>
      <div className="text-muted">
        <span className="mr-3">{app.cmdbId}</span>
        {app.parent && <span className="mr-3">Parent: {app.parent}</span>}
        {app.resCat && <span className="mr-3">ResCat: {app.resCat}</span>}
      </div>
    </div>
  );
}

export default AppHeader;
