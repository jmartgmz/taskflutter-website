export function backendFetcher<T>(endpoint: string): () => Promise<T> {
  return () => {
    const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
    const fullUrl = baseUrl + endpoint;

    // Only log in development mode
    if (import.meta.env.DEV) {
      console.log(`API Request: ${endpoint} -> ${fullUrl}`);
    }

    return fetch(fullUrl)
      .then((res) => {
        if (import.meta.env.DEV) {
          console.log(`API Response: ${endpoint} (${res.status})`);
        }

        if (!res.ok) {
          const errorMsg = `HTTP error! status: ${res.status} for ${endpoint}`;
          console.error(`API Error: ${errorMsg}`);
          throw new Error(errorMsg);
        }
        return res.json();
      })
      .catch((error) => {
        console.error(`API Fetch Error for ${endpoint}:`, error.message);
        throw error;
      });
  };
}
