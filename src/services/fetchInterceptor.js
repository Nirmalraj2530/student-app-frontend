let requestCount = 0;

const originalFetch = window.fetch;

window.fetch = async function (...args) {
  requestCount++;
  if (requestCount === 1) {
    window.dispatchEvent(new Event('showLoader'));
  }

  try {
    const response = await originalFetch.apply(this, args);
    return response;
  } catch (error) {
    throw error;
  } finally {
    requestCount--;
    if (requestCount === 0) {
      window.dispatchEvent(new Event('hideLoader'));
    }
  }
};
