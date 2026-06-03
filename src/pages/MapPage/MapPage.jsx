import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapPinIcon, XMarkIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import SideNav from '../../components/SideNav/SideNav';
import BottomNav from '../../components/BottomNav/BottomNav';
import Header from '../../components/Header/Header';
import mockPhotos from '../../data/mockData';
import './MapPage.css';

// 도시 필터 목록 (데이터 기준)
const CITIES = ['전체', '서울', '부산', '제주', '강원', '인천', '경주', '전주', '여수', '수원', '대전', '경남', '경북', '충북', '전남', '일본', '중국'];

function MapPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const fromPhoto = location.state; // { lat, lng, photoId } from MiniMap click
  const mapRef         = useRef(null);
  const mapInstanceRef = useRef(null);
  const clusterRef     = useRef(null);
  const initializedRef = useRef(false);
  const LRef           = useRef(null);

  const [selected, setSelected]           = useState(null);
  const [clusterPhotos, setClusterPhotos] = useState(null);
  const [ready, setReady]                 = useState(false);
  const [showFilter, setShowFilter]       = useState(false);
  const [activeCity, setActiveCity]       = useState('전체');

  // 도시 필터 변경 → 마커 재렌더
  const applyFilter = useCallback((city) => {
    setActiveCity(city);
    setShowFilter(false);
    setSelected(null);
    setClusterPhotos(null);

    const L = LRef.current;
    const map = mapInstanceRef.current;
    const cluster = clusterRef.current;
    if (!L || !map || !cluster) return;

    cluster.clearLayers();
    const filtered = city === '전체' ? mockPhotos : mockPhotos.filter(p => p.city === city);

    filtered.forEach((photo) => {
      const icon = L.divIcon({
        className: '',
        html: `
          <div style="width:62px;text-align:center;pointer-events:auto;">
            <div style="width:56px;height:56px;border-radius:12px;overflow:hidden;
              border:3px solid #fff;box-shadow:0 3px 10px rgba(0,0,0,0.28);
              background:#ddd;margin:0 auto;">
              <img src="${photo.imageUrl}" style="width:100%;height:100%;object-fit:cover;display:block;" draggable="false"/>
            </div>
            <div style="width:0;height:0;margin:0 auto;
              border-left:9px solid transparent;border-right:9px solid transparent;
              border-top:12px solid #fff;filter:drop-shadow(0 2px 1px rgba(0,0,0,0.2));"></div>
          </div>`,
        iconSize: [62, 74],
        iconAnchor: [31, 74],
      });
      const marker = L.marker([photo.lat, photo.lng], { icon, photoData: photo });
      marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        setClusterPhotos(null);
        setSelected(photo);
        map.panTo([photo.lat, photo.lng]);
      });
      cluster.addLayer(marker);
    });

    // 필터된 마커들이 있으면 범위 맞춤
    if (filtered.length > 0 && city !== '전체') {
      const bounds = L.latLngBounds(filtered.map(p => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 13 });
    }
  }, []);

  // 주소 검색 결과 클릭 → 지도 이동
  const handleMapSearch = useCallback((lat, lng) => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.setView([lat, lng], 14);
  }, []);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const init = async () => {
      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');
      await import('leaflet.markercluster');
      await import('leaflet.markercluster/dist/MarkerCluster.css');
      await import('leaflet.markercluster/dist/MarkerCluster.Default.css');

      if (!mapRef.current) return;

      LRef.current = L;

      const map = L.map(mapRef.current, {
        center: [36.5, 127.9],
        zoom: 7,
        zoomControl: true,
        markerZoomAnimation: false,
        fadeAnimation: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;

      const clusterGroup = L.markerClusterGroup({
        maxClusterRadius: 60,
        animate: false,
        animateAddingMarkers: false,
        spiderfyOnMaxZoom: false,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
        iconCreateFunction(cluster) {
          const markers = cluster.getAllChildMarkers();
          const rep = markers[0].options.photoData;
          const count = markers.length;
          // count 크기에 따라 인디고 색상 단계적으로 진해짐
          const badgeColor = count >= 20 ? '#1e1b6e'   // 매우 핫 (20개+): 아주 진한 인디고
                           : count >= 10 ? '#3730a3'   // 핫 (10~19개): 진한 인디고
                           : count >= 5  ? '#4f46e5'   // 보통 (5~9개): 중간 인디고
                           :               '#818cf8';  // 적음 (2~4개): 연한 인디고
          // 테두리도 같이 진해지면 더 뚜렷하게 보임
          const borderColor = count >= 10 ? 'rgba(255,255,255,0.9)' : '#fff';
          return L.divIcon({
            className: '',
            html: `
              <div style="position:relative;width:62px;text-align:center;">
                <div style="width:56px;height:56px;border-radius:12px;overflow:hidden;
                  border:3px solid #fff;box-shadow:0 3px 14px rgba(0,0,0,0.32);
                  background:#ddd;margin:0 auto;">
                  <img src="${rep.imageUrl}" style="width:100%;height:100%;object-fit:cover;display:block;" draggable="false"/>
                </div>
                <div style="position:absolute;top:-6px;right:0px;
                  background:${badgeColor};color:#fff;font-size:11px;font-weight:700;
                  min-width:20px;height:20px;border-radius:10px;
                  display:flex;align-items:center;justify-content:center;
                  padding:0 5px;border:2px solid ${borderColor};box-shadow:0 1px 4px rgba(0,0,0,0.2);">
                  +${count}
                </div>
                <div style="width:0;height:0;margin:0 auto;
                  border-left:9px solid transparent;border-right:9px solid transparent;
                  border-top:12px solid #fff;filter:drop-shadow(0 2px 1px rgba(0,0,0,0.2));"></div>
              </div>`,
            iconSize: [62, 74],
            iconAnchor: [31, 74],
          });
        },
      });

      clusterGroup.on('clusterclick', (e) => {
        const cluster = e.layer;
        if (map.getZoom() >= map.getMaxZoom() - 1) {
          L.DomEvent.stopPropagation(e);
          const photos = cluster.getAllChildMarkers().map(m => m.options.photoData);
          setClusterPhotos(photos);
          setSelected(null);
          map.panTo(cluster.getLatLng());
        }
      });

      mockPhotos.forEach((photo) => {
        const icon = L.divIcon({
          className: '',
          html: `
            <div style="width:62px;text-align:center;pointer-events:auto;">
              <div style="width:56px;height:56px;border-radius:12px;overflow:hidden;
                border:3px solid #fff;box-shadow:0 3px 10px rgba(0,0,0,0.28);
                background:#ddd;margin:0 auto;">
                <img src="${photo.imageUrl}" style="width:100%;height:100%;object-fit:cover;display:block;" draggable="false"/>
              </div>
              <div style="width:0;height:0;margin:0 auto;
                border-left:9px solid transparent;border-right:9px solid transparent;
                border-top:12px solid #fff;filter:drop-shadow(0 2px 1px rgba(0,0,0,0.2));"></div>
            </div>`,
          iconSize: [62, 74],
          iconAnchor: [31, 74],
        });
        const marker = L.marker([photo.lat, photo.lng], { icon, photoData: photo });
        marker.on('click', (e) => {
          L.DomEvent.stopPropagation(e);
          setClusterPhotos(null);
          setSelected(photo);
          map.panTo([photo.lat, photo.lng]);
        });
        clusterGroup.addLayer(marker);
      });

      clusterRef.current = clusterGroup;
      map.addLayer(clusterGroup);
      setReady(true);

      // MiniMap 클릭으로 진입한 경우 해당 위치로 이동 + 마커 선택
      if (fromPhoto?.lat && fromPhoto?.lng) {
        map.setView([fromPhoto.lat, fromPhoto.lng], 16);
        if (fromPhoto.photoId) {
          const target = mockPhotos.find(p => p.id === fromPhoto.photoId);
          if (target) setSelected(target);
        }
      }

      let zooming = false;
      map.on('zoomstart', () => { zooming = true; });
      map.on('zoomend',   () => { setTimeout(() => { zooming = false; }, 150); });
      map.on('click', () => {
        if (!zooming) { setSelected(null); setClusterPhotos(null); }
      });
    };

    init();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        clusterRef.current = null;
        LRef.current = null;
        initializedRef.current = false;
      }
    };
  }, []);

  const moveToMyLocation = () => {
    if (!mapInstanceRef.current || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      mapInstanceRef.current.setView([pos.coords.latitude, pos.coords.longitude], 13);
    });
  };

  return (
    <>
      <SideNav activeTab="map" />
      <Header
        onFilterClick={() => setShowFilter(v => !v)}
        onMapSearch={handleMapSearch}
      />
      <main className="map-page">
        {!ready && (
          <div className="map-page__status">
            <div className="map-page__spinner" />
            <p>지도를 불러오는 중...</p>
          </div>
        )}

        <div ref={mapRef} className="map-page__map" />

        {/* 도시 필터 패널 */}
        {showFilter && (
          <div className="map-page__filter-panel">
            <div className="map-page__filter-header">
              <span className="map-page__filter-title">지역 필터</span>
              <button className="map-page__preview-close" onClick={() => setShowFilter(false)}>
                <XMarkIcon style={{ width: '16px', height: '16px' }} />
              </button>
            </div>
            <div className="map-page__filter-chips">
              {CITIES.map(city => (
                <button
                  key={city}
                  className={`map-page__filter-chip ${activeCity === city ? 'map-page__filter-chip--active' : ''}`}
                  onClick={() => applyFilter(city)}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        )}

        {ready && (
          <button className="map-page__location-btn" onClick={moveToMyLocation} aria-label="내 위치">
            <MapPinIcon style={{ width: '22px', height: '22px' }} />
          </button>
        )}

        {/* 활성 필터 뱃지 */}
        {activeCity !== '전체' && (
          <div className="map-page__active-filter">
            <MapPinIcon style={{ width: '12px', height: '12px' }} />
            {activeCity}
            <button onClick={() => applyFilter('전체')}>
              <XMarkIcon style={{ width: '11px', height: '11px' }} />
            </button>
          </div>
        )}

        {selected && !clusterPhotos && (
          <div className="map-page__preview">
            <img className="map-page__preview-img" src={selected.imageUrl} alt={selected.title} />
            <div className="map-page__preview-info">
              <p className="map-page__preview-title">{selected.title}</p>
              <p className="map-page__preview-city">
                <MapPinIcon style={{ width: '11px', height: '11px', color: 'var(--color-primary)' }} />
                {selected.city}
              </p>
              <button className="map-page__preview-btn" onClick={() => navigate(`/photo/${selected.id}`)}>
                자세히 보기
              </button>
            </div>
            <button className="map-page__preview-close" onClick={() => setSelected(null)}>
              <XMarkIcon style={{ width: '16px', height: '16px' }} />
            </button>
          </div>
        )}

        {clusterPhotos && (
          <div className="map-page__cluster-panel">
            <div className="map-page__cluster-header">
              <span className="map-page__cluster-title">이 위치의 사진 {clusterPhotos.length}개</span>
              <button className="map-page__preview-close" onClick={() => setClusterPhotos(null)}>
                <XMarkIcon style={{ width: '16px', height: '16px' }} />
              </button>
            </div>
            <div className="map-page__cluster-scroll">
              {clusterPhotos.map(photo => (
                <button key={photo.id} className="map-page__cluster-item"
                  onClick={() => { setClusterPhotos(null); setSelected(photo); }}>
                  <img src={photo.imageUrl} alt={photo.title} />
                  <p>{photo.title}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
      <BottomNav activeTab="map" />
    </>
  );
}

export default MapPage;
