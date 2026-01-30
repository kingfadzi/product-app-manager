// Application configuration
// Set via REACT_APP_* environment variables or use defaults
// Note: public/index.html title is set at build time via %REACT_APP_NAME%

export const APP_NAME = process.env.REACT_APP_NAME || 'Lean Control';
export const APP_TITLE = process.env.REACT_APP_NAME || 'Lean Control';
export const APP_DESCRIPTION = process.env.REACT_APP_DESCRIPTION || 'Application and Product Management Platform';

// Backend API URL (for non-proxied requests)
export const API_URL = process.env.REACT_APP_API_URL || '';
