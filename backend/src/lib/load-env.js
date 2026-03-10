const fs = require('node:fs');
const path = require('node:path');

function stripWrappingQuotes(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }
  return value;
}

function parseEnvFile(contents) {
  const parsed = {};
  const lines = contents.split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex <= 0) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const rawValue = trimmed.slice(separatorIndex + 1).trim();
    parsed[key] = stripWrappingQuotes(rawValue);
  }

  return parsed;
}

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return { loaded: false, path: filePath };
  }

  const contents = fs.readFileSync(filePath, 'utf8');
  const parsed = parseEnvFile(contents);

  for (const [key, value] of Object.entries(parsed)) {
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }

  return { loaded: true, path: filePath };
}

function loadBackendEnv() {
  const envPath = path.resolve(__dirname, '..', '..', '.env');
  return loadEnvFile(envPath);
}

module.exports = {
  loadBackendEnv,
};
