import { useState, useEffect } from 'react';
import { API_BASE, formatImagePath } from '../services/api';

let kknWorksCache = null;
let kknWorksPromise = null;

export const useKknWorks = (options = {}) => {
  const { onUnauthorized } = options;
  const [kknWorks, setKknWorks] = useState(kknWorksCache || []);
  const [loading, setLoading] = useState(!kknWorksCache);
  const [error, setError] = useState(null);

  const fetchKknWorks = async (force = false) => {
    if (!force && kknWorksCache) {
      setKknWorks(kknWorksCache);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      if (force || !kknWorksPromise) {
        kknWorksPromise = fetch(`${API_BASE}/kkn-works`)
          .then(async (response) => {
            if (response.status === 401 && onUnauthorized) {
              onUnauthorized();
              return null;
            }
            if (!response.ok) throw new Error('Failed to fetch KKN works');
            return response.json();
          })
          .finally(() => {
            kknWorksPromise = null;
          });
      }

      const data = await kknWorksPromise;
      if (!data) return;

      const sortedData = data.sort((a, b) => (a.order || 0) - (b.order || 0));

      const formattedData = sortedData.map(item => ({
        ...item,
        webpUrl: formatImagePath(item.webpUrl),
        originalUrl: formatImagePath(item.originalUrl),
        downloadUrl: `${API_BASE}/kkn-works/${item.id}/download`,
      }));

      kknWorksCache = formattedData;
      setKknWorks(formattedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKknWorks();
  }, []);

  return { kknWorks, loading, error, refetch: () => fetchKknWorks(true) };
};
