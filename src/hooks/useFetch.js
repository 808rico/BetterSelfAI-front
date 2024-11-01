// src/hooks/useFetch.js
import { useAuth } from '@clerk/clerk-react';

export default function useFetch() {
  const { getToken } = useAuth();

  const authenticatedFetch = async (url, options = {}) => {
    const token = await getToken();
    const headers = token
      ? { ...options.headers, Authorization: `Bearer ${token}` }
      : options.headers;

    return fetch(url, { ...options, headers })
      .then((res) => res)
      .catch(error => console.error('Fetch error:', error));
  };

  return authenticatedFetch;
}
