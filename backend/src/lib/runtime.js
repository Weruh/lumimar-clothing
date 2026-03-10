function getFrontendAppUrl() {
  const appUrl = process.env.FRONTEND_APP_URL || process.env.APP_URL;
  if (appUrl) {
    return appUrl.replace(/\/+$/, '');
  }
  return 'http://localhost:5173';
}

module.exports = {
  getFrontendAppUrl,
};
