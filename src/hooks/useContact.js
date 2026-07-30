import { useState, useEffect } from 'react';
import { API_BASE } from '../services/api';

// Fallback data in case backend is not ready
const fallbackContactData = {
  title: "Hubungi Kami",
  description: "Silakan hubungi kami untuk informasi lebih lanjut mengenai paket wisata, akomodasi, atau reservasi.",
  address: "Jl. Raya Sibetan, Kecamatan Bebandem, Kabupaten Karangasem, Bali 80861",
  phone: "+62 812-3456-7890",
  website: "sibetan.desa.id",
  mapEmbedUrl: "https://maps.google.com/maps?q=Desa%20Sibetan%2C%20Bebandem%2C%20Karangasem%2C%20Bali(Kantor%20Desa%20Sibetan)&hl=id&z=15&output=embed",
  mapLink: "https://www.google.com/maps/search/?api=1&query=Desa+Sibetan+Karangasem+Bali",
  copyright: "\u00a9 2026 Desa Sibetan. Dikembangkan oleh UGM."
};

const sanitizeMapEmbedUrl = (rawUrl) => {
  let source = String(rawUrl || '').trim();
  if (!source) return fallbackContactData.mapEmbedUrl;

  if (source.includes('<iframe')) {
    const match = source.match(/src=["']([^"']+)["']/);
    if (match && match[1]) return match[1];
  }

  if (source.includes('maps/embed')) return source;

  if (source.includes('google.com/maps') || source.includes('maps.google') || source.includes('goo.gl')) {
    const atMatch = source.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (atMatch) return `https://maps.google.com/maps?q=${atMatch[1]},${atMatch[2]}(Kantor%20Desa%20Sibetan)&hl=id&z=15&output=embed`;
    const pbMatch = source.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
    if (pbMatch) return `https://maps.google.com/maps?q=${pbMatch[1]},${pbMatch[2]}(Kantor%20Desa%20Sibetan)&hl=id&z=15&output=embed`;
    const qCoordMatch = source.match(/[?&](?:q|ll|query)=(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (qCoordMatch) return `https://maps.google.com/maps?q=${qCoordMatch[1]},${qCoordMatch[2]}(Kantor%20Desa%20Sibetan)&hl=id&z=15&output=embed`;
  }

  if (source.startsWith('http') && !source.includes('output=embed')) {
    return fallbackContactData.mapEmbedUrl;
  }

  return source;
};

let contactCache = null;
let contactPromise = null;

export const useContact = () => {
  const [contact, setContact] = useState(contactCache || fallbackContactData);
  const [loading, setLoading] = useState(!contactCache);
  const [error, setError] = useState(null);

  const fetchContact = async (force = false) => {
    if (!force && contactCache) {
      setContact(contactCache);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      if (force || !contactPromise) {
        contactPromise = fetch(`${API_BASE}/contact`)
          .then(async (response) => {
            if (!response.ok) {
              throw new Error('Failed to fetch contact data');
            }
            return response.json();
          })
          .finally(() => {
            contactPromise = null;
          });
      }

      const data = await contactPromise;
      if (data && data.data) {
        const isDataEmpty = !data.data.title && !data.data.address && !data.data.phone;
        const rawObj = isDataEmpty ? fallbackContactData : data.data;
        const finalData = {
          ...rawObj,
          mapEmbedUrl: sanitizeMapEmbedUrl(rawObj.mapEmbedUrl)
        };
        contactCache = finalData;
        setContact(finalData);
      }
    } catch (err) {
      console.warn('Backend for contact not ready or failed, using fallback data.', err.message);
      setError(err.message);
      setContact(fallbackContactData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContact();
  }, []);

  return { contact, loading, error, refetch: () => fetchContact(true) };
};
