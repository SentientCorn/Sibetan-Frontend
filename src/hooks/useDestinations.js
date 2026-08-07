import { useState, useEffect } from 'react';
import { API_BASE, formatImagePath } from '../services/api';



export const isValidGoogleMapsLink = (url) => {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (!trimmed.startsWith('http') && !trimmed.includes('<iframe')) return false;
  return (
    trimmed.includes('google.com/maps') ||
    trimmed.includes('maps.google') ||
    trimmed.includes('maps.app.goo.gl') ||
    trimmed.includes('goo.gl/maps')
  );
};

export const getGoogleMapsEmbedUrl = (dest) => {
  if (!dest) return '';
  const source = String(dest.mapsSource || dest.mapEmbedUrl || '').trim();

  // Jika input kosong atau bukan link/iframe Google Maps valid, jangan tampilkan peta sama sekali!
  if (!source || !isValidGoogleMapsLink(source)) {
    return '';
  }

  // 1a. iframe snippet
  if (source.includes('<iframe')) {
    const match = source.match(/src=["']([^"']+)["']/);
    if (match && match[1]) {
      return match[1];
    }
  }

  // 1b. Direct embed URL
  if (source.includes('maps/embed') || source.includes('output=embed')) {
    return source;
  }

  // 1c. Extracted EXACT pin lat/lng from !3d!4d pattern in Google Maps URLs (Prioritas Utama Koordinat Presisi)
  const pbMatch = source.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
  if (pbMatch) {
    const extractedLat = Number(pbMatch[1]);
    const extractedLng = Number(pbMatch[2]);
    if (!isNaN(extractedLat) && !isNaN(extractedLng)) {
      return `https://maps.google.com/maps?q=${extractedLat},${extractedLng}&hl=id&z=16&output=embed`;
    }
  }

  // 1d. Extracted place name from /place/LocationName (Nama Tempat Presisi)
  const placeMatch = source.match(/\/place\/([^/@?]+)/);
  if (placeMatch && placeMatch[1]) {
    const placeName = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
    return `https://maps.google.com/maps?q=${encodeURIComponent(placeName)}&hl=id&z=16&output=embed`;
  }

  // 1e. Extracted lat/lng from Google Maps viewport camera center (@lat,lng)
  const atMatch = source.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (atMatch) {
    const extractedLat = Number(atMatch[1]);
    const extractedLng = Number(atMatch[2]);
    if (!isNaN(extractedLat) && !isNaN(extractedLng)) {
      return `https://maps.google.com/maps?q=${extractedLat},${extractedLng}&hl=id&z=16&output=embed`;
    }
  }

  // 1f. Handling khusus Shortlink Google Maps (maps.app.goo.gl / goo.gl/maps)
  if (source.includes('maps.app.goo.gl') || source.includes('goo.gl/maps')) {
    const searchQuery = [dest.title || '', dest.address || ''].filter(Boolean).join(', ');
    return searchQuery ? `https://maps.google.com/maps?q=${encodeURIComponent(searchQuery)}&hl=id&z=16&output=embed` : '';
  }

  // Jika berupa link biasa tapi tidak mengandung elemen embed valid di atas, kembalikan kosong (peta tidak tampil)
  return '';
};

export const getGoogleMapsLink = (dest) => {
  if (!dest) return '';
  const source = String(dest.mapsSource || dest.mapEmbedUrl || '').trim();

  if (source && isValidGoogleMapsLink(source) && source.startsWith('http') && !source.includes('output=embed') && !source.includes('<iframe')) {
    return source;
  }

  return '';
};

export const useDestinations = (options = {}) => {
  const { onUnauthorized } = options;
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDestinations = async (force = false) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/destinations?t=${Date.now()}`);
      if (response.status === 401 && onUnauthorized) {
        onUnauthorized();
        return;
      }
      if (!response.ok) throw new Error('Failed to fetch destinations');
      const data = await response.json();
      if (!data) return;

      const formattedData = data.map(dest => {
        const images = dest.images ? dest.images.map(img => formatImagePath(img.imageUrl || img)) : [];
        const image = images.length > 0 ? images[0] : formatImagePath(null);

        const contactPerson = dest.contact?.name || dest.contactName || dest.contactPerson || '';
        const contactPhone = dest.contact?.phone || dest.contactPhone || dest.whatsapp || dest.phone || '';
        const contactNote = dest.contact?.note || dest.contactNote || '';

        return {
          ...dest,
          location: dest.address || dest.location || 'Desa Sibetan, Karangasem',
          time: dest.openHours || dest.time || 'Setiap Hari',
          description: dest.description || '-',
          fullDescription: dest.description || dest.fullDescription || '-',
          mapEmbedUrl: getGoogleMapsEmbedUrl(dest),
          mapLink: getGoogleMapsLink(dest),
          originalImages: dest.images ? dest.images.map(img => typeof img === 'object' ? { ...img, imageUrl: formatImagePath(img.imageUrl) } : img) : [],
          images: images.length > 0 ? images : [image],
          image: image,
          photoCount: images.length,
          contactPerson: contactPerson,
          contactName: contactPerson,
          whatsapp: contactPhone,
          contactPhone: contactPhone,
          contactNote: contactNote
        };
      });

      setDestinations(formattedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  return { destinations, loading, error, refetch: () => fetchDestinations(true) };
};
