import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function MiniMap({ lat, lng, photoId }) {
  const mapRef     = useRef(null);
  const instanceRef = useRef(null);
  const navigate   = useNavigate();

  useEffect(() => {
    if (instanceRef.current || !mapRef.current || !lat || !lng) return;

    const init = async () => {
      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');

      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const map = L.map(mapRef.current, {
        center: [lat, lng],
        zoom: 15,
        zoomControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        touchZoom: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '',
        maxZoom: 19,
      }).addTo(map);

      L.marker([lat, lng]).addTo(map);
      instanceRef.current = map;
    };

    init();

    return () => {
      if (instanceRef.current) {
        instanceRef.current.remove();
        instanceRef.current = null;
      }
    };
  }, [lat, lng]);

  const handleClick = () => {
    // state로 좌표 전달 → MapPage에서 해당 위치로 이동
    navigate('/map', { state: { lat, lng, photoId } });
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: 'inherit', cursor: 'pointer' }}
         onClick={handleClick}>
      <div ref={mapRef} style={{ width: '100%', height: '100%', borderRadius: 'inherit', pointerEvents: 'none' }} />
      {/* 클릭 유도 오버레이 */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 'inherit',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end',
        padding: '8px',
        background: 'linear-gradient(to top, rgba(0,0,0,0.18) 0%, transparent 50%)',
      }}>
        <span style={{
          fontSize: '11px', fontWeight: 600, color: '#fff',
          background: 'rgba(0,0,0,0.42)', borderRadius: '6px',
          padding: '3px 8px', backdropFilter: 'blur(4px)',
        }}>지도에서 보기</span>
      </div>
    </div>
  );
}

export default MiniMap;
