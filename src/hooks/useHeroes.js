import { useState, useEffect } from 'react';
import { API_BASE, formatImagePath } from '../services/api';

let heroesCache = null;
let heroesPromise = null;

export const useHeroes = (options = {}) => {
  const { onUnauthorized } = options;
  const [heroes, setHeroes] = useState(heroesCache || []);
  const [loading, setLoading] = useState(!heroesCache);
  const [error, setError] = useState(null);

  const fetchHeroes = async (force = false) => {
    if (!force && heroesCache) {
      setHeroes(heroesCache);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      if (force || !heroesPromise) {
        heroesPromise = fetch(`${API_BASE}/heroes`)
          .then(async (response) => {
            if (response.status === 401 && onUnauthorized) {
              onUnauthorized();
              return null;
            }
            if (!response.ok) throw new Error('Failed to fetch heroes');
            return response.json();
          })
          .finally(() => {
            heroesPromise = null;
          });
      }

      const data = await heroesPromise;
      if (!data) return;

      const sortedData = data.sort((a, b) => (a.order || 0) - (b.order || 0));

      const formattedData = sortedData.map(hero => {
        const mainImageUrl = hero.imageUrl ? formatImagePath(hero.imageUrl) : null;
        const imagesList = hero.images && hero.images.length > 0
          ? hero.images.map(img => formatImagePath(typeof img === 'object' ? (img.imageUrl || img) : img))
          : (mainImageUrl ? [mainImageUrl] : []);

        return {
          ...hero,
          imageUrl: mainImageUrl,
          originalImages: hero.images ? hero.images.map(img => typeof img === 'object' ? { ...img, imageUrl: formatImagePath(img.imageUrl) } : img) : [],
          images: imagesList,
          image: mainImageUrl || (imagesList.length > 0 ? imagesList[0] : null)
        };
      });

      heroesCache = formattedData;
      setHeroes(formattedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeroes();
  }, []);

  return { heroes, loading, error, refetch: () => fetchHeroes(true) };
};
