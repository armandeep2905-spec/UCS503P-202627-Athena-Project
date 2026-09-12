import { useState, useEffect, useCallback } from 'react';
import { unwrapPaginated } from '../api/client';

/**
 * Generic data-fetching hook.
 * @param {() => Promise<{ data?: any, error?: any }>} fetchFn — API function to call
 * @param {{ immediate?: boolean, paginated?: boolean }} options
 */
export function useFetch(fetchFn, options = {}) {
  const { immediate = true, paginated = true } = options;

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(immediate);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFn(...args);
      if (result.error) {
        setError(result.error);
        setData(null);
      } else {
        setData(paginated ? unwrapPaginated(result.data) : result.data);
        setError(null);
      }
    } catch (err) {
      setError({ detail: err.message });
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [fetchFn, paginated]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return { data, error, loading, execute, setData };
}
