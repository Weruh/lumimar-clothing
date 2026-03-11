import { getApiBaseUrl } from '@/lib/runtime';

const DEFAULT_API_TIMEOUT_MS = 15000;

function joinUrl(baseUrl: string, path: string) {
  if (!path.startsWith('/')) {
    return `${baseUrl}/${path}`;
  }

  return `${baseUrl}${path}`;
}

function buildUnavailableMessage(action: string, serviceLabel = 'payment service') {
  return `We couldn't reach the ${serviceLabel} to ${action}. It may be waking up or temporarily unavailable. Please wait a moment and try again.`;
}

export function isServiceUnavailableError(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message.trim().toLowerCase();
  return (
    message.includes("couldn't reach") ||
    message.includes('temporarily unavailable') ||
    message.includes('waking up')
  );
}

export function describeApiError(error: unknown, action: string, serviceLabel = 'payment service') {
  if (error instanceof Error) {
    if (error.name === 'AbortError') {
      return buildUnavailableMessage(action, serviceLabel);
    }

    const message = error.message.trim();
    if (message === 'Failed to fetch') {
      return buildUnavailableMessage(action, serviceLabel);
    }

    return message || buildUnavailableMessage(action, serviceLabel);
  }

  return buildUnavailableMessage(action, serviceLabel);
}

export async function fetchJson<T>(
  path: string,
  init: RequestInit,
  action: string,
  timeoutMs = DEFAULT_API_TIMEOUT_MS,
  serviceLabel = 'payment service'
): Promise<T> {
  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timeoutId = controller
    ? window.setTimeout(() => controller.abort(), timeoutMs)
    : null;

  try {
    const response = await fetch(joinUrl(getApiBaseUrl(), path), {
      ...init,
      signal: controller?.signal,
    });

    let data: unknown = null;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      const apiMessage = data && typeof data === 'object' && 'error' in data ? data.error : null;
      throw new Error(
        typeof apiMessage === 'string' && apiMessage.trim()
          ? apiMessage
          : buildUnavailableMessage(action, serviceLabel)
      );
    }

    return data as T;
  } catch (error) {
    throw new Error(describeApiError(error, action, serviceLabel));
  } finally {
    if (timeoutId !== null) {
      window.clearTimeout(timeoutId);
    }
  }
}
