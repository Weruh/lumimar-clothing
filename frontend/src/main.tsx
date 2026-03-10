import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './globals.css';

function restoreGitHubPagesRedirect() {
  if (typeof window === 'undefined') {
    return;
  }

  const url = new URL(window.location.href);
  const redirectPath = url.searchParams.get('__gh_redirect');
  if (!redirectPath) {
    return;
  }

  url.searchParams.delete('__gh_redirect');
  const nextSearch = url.searchParams.toString();
  const nextLocation = `${redirectPath}${nextSearch ? `?${nextSearch}` : ''}`;

  window.history.replaceState({}, '', nextLocation);
}

restoreGitHubPagesRedirect();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
