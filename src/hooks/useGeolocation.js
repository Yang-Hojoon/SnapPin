import { useState, useEffect } from 'react';

export function calcDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function formatDistance(km) {
  if (km < 0.1) return '100m 이내';
  if (km < 1)   return `${Math.round(km * 1000)}m`;
  if (km < 10)  return `${km.toFixed(1)}km`;
  return `${Math.round(km)}km`;
}

async function reverseGeocode(lat, lng) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=ko`,
      { headers: { 'User-Agent': 'SnapPin/1.0' } }
    );
    const data = await res.json();
    const addr = data.address || {};

    const rawCity = (addr.city || addr.state || '').replace('특별시','').replace('광역시','').replace('시','').trim();
    const district = addr.city_district || addr.county || addr.borough || '';
    const dong = addr.suburb || addr.neighbourhood || '';

    // 상세 주소: 서울 마포구 서교동
    const detail = [rawCity, district, dong].filter(Boolean).join(' ');
    // 짧은 주소: 마포구
    const short = district || rawCity;

    return { detail, short };
  } catch {
    return null;
  }
}

function useGeolocation() {
  const [location, setLocation] = useState(null);
  const [locationName, setLocationName] = useState(null); // { detail, short }
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    if (!navigator.geolocation) { setStatus('denied'); return; }
    setStatus('loading');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setLocation({ lat, lng });
        setStatus('success');
        const names = await reverseGeocode(lat, lng);
        if (names) setLocationName(names);
      },
      () => setStatus('denied'),
      { timeout: 8000, maximumAge: 60000 }
    );
  }, []);

  return { location, locationName, status };
}

export default useGeolocation;
