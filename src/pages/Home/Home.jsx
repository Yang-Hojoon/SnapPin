import { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AdjustmentsHorizontalIcon, XMarkIcon,
  MagnifyingGlassIcon, ArrowLeftIcon, BellIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import BottomNav from '../../components/BottomNav/BottomNav';
import SideNav from '../../components/SideNav/SideNav';
import PhotoCard from '../../components/PhotoCard/PhotoCard';
import Masonry from 'react-masonry-css';
import mockPhotos from '../../data/mockData';

// localStorage에서 사용자 업로드 사진 불러오기
function getUserPhotos() {
  try {
    return JSON.parse(localStorage.getItem('snappin_user_photos') || '[]');
  } catch { return []; }
}
import useGeolocation, { calcDistance, formatDistance } from '../../hooks/useGeolocation';
import './Home.css';

// 크로스헤어 아이콘 (Heroicons에 없어서 직접 구현)
function CrosshairIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="22" y1="12" x2="18" y2="12"/>
      <line x1="6" y1="12" x2="2" y2="12"/>
      <line x1="12" y1="6" x2="12" y2="2"/>
      <line x1="12" y1="22" x2="12" y2="18"/>
    </svg>
  );
}


const CATEGORIES = ['카페', '공원', '야경', '거리', '바다', '해외', '맛집', '건축'];

function Home() {
  const navigate = useNavigate();
  const { location, locationName, status } = useGeolocation();

  // 뒤로 왔을 때 스크롤 위치 복원
  useEffect(() => {
    const savedY = sessionStorage.getItem('homeScrollY');
    if (savedY) {
      // 이미지 로드 후 복원 (requestAnimationFrame x2로 레이아웃 완성 후 실행)
      const restore = () => requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          window.scrollTo({ top: parseInt(savedY), behavior: 'instant' });
          sessionStorage.removeItem('homeScrollY');
        })
      );
      restore();
    }
  }, []);
  const [userPhotos] = useState(getUserPhotos);
  const allPhotos = [...userPhotos, ...mockPhotos];

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const [sortBy, setSortBy] = useState('popular');
  const [scope, setScope] = useState('nearby');
  const [distanceLimit, setDistanceLimit] = useState(null);

  // 필터 패널 임시 상태 — 적용 버튼 누를 때만 실제 반영
  // 위치 설정 패널
  const [locationPanelOpen, setLocationPanelOpen] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');
  const [locationResults, setLocationResults] = useState([]);
  const [searching, setSearching] = useState(false);
  // 사용자가 직접 설정한 위치 (null이면 GPS 사용)
  const [customLocation, setCustomLocation] = useState(null); // { lat, lng, name }

  const [pendingSort, setPendingSort] = useState('popular');
  const [pendingScope, setPendingScope] = useState('nearby');
  const [pendingDistance, setPendingDistance] = useState(null);

  // 각 사진까지 거리 계산
  const photoDistances = useMemo(() => {
    const activeLocation = customLocation || location;
    if (!activeLocation) return {};
    return allPhotos.reduce((acc, photo) => {
      acc[photo.id] = formatDistance(calcDistance(activeLocation.lat, activeLocation.lng, photo.lat, photo.lng));
      return acc;
    }, {});
  }, [location, customLocation]);

  const filteredPhotos = useMemo(() => {
    let photos = [...allPhotos];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      photos = photos.filter(p => p.title.toLowerCase().includes(q) || p.city.toLowerCase().includes(q));
    }
    if (selectedCategory) {
      photos = photos.filter(p => p.title.includes(selectedCategory) || p.city.includes(selectedCategory));
    }
    const activeLocation = customLocation || location;
    if (scope === 'nearby' && activeLocation) {
      // 거리 제한 필터
      if (distanceLimit) {
        photos = photos.filter(p => calcDistance(activeLocation.lat, activeLocation.lng, p.lat, p.lng) <= distanceLimit);
      }
      photos.sort((a, b) => calcDistance(activeLocation.lat, activeLocation.lng, a.lat, a.lng) - calcDistance(activeLocation.lat, activeLocation.lng, b.lat, b.lng));
    } else if (sortBy === 'popular') {
      photos.sort((a, b) => b.likes - a.likes);
    } else {
      photos.sort((a, b) => b.id - a.id);
    }
    return photos;
  }, [searchQuery, selectedCategory, sortBy, scope, location, distanceLimit]);

  // 주소 검색 (Nominatim)
  const searchAddress = useCallback(async (query) => {
    if (!query.trim()) { setLocationResults([]); return; }
    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&accept-language=ko&limit=5&countrycodes=kr,cn,jp,us,fr`,
        { headers: { 'User-Agent': 'SnapPin/1.0' } }
      );
      const data = await res.json();
      setLocationResults(data.slice(0, 5));
    } catch { setLocationResults([]); }
    setSearching(false);
  }, []);

  const useGPSLocation = () => {
    setCustomLocation(null); // GPS 모드로 복귀
    setLocationPanelOpen(false);
  };

  const selectLocation = (result) => {
    setCustomLocation({
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      name: result.display_name.split(',').slice(0, 2).join(', '),
    });
    setLocationPanelOpen(false);
    setLocationSearch('');
    setLocationResults([]);
  };

  // 칩에 표시할 텍스트 — PC(1200px+)는 JS로 감지 불가, CSS로 처리
  const chipShort = customLocation
    ? customLocation.name.split(' ').slice(-1)[0]
    : (locationName?.short || '내 위치');
  const chipDetail = customLocation
    ? customLocation.name
    : (locationName?.detail || '현재 위치');

  return (
    <>
      <SideNav activeTab="home" />

      {/* 헤더 */}
      <header className="header header--home">
        <button className="header__logo" onClick={() => navigate('/')}>
          Snap<span>Pin</span>
        </button>

        {/* 현재 위치 칩 (모바일 1번) */}
        {status === 'success' && (
          <button className="header__location-chip" onClick={() => {
            setLocationSearch('');
            setLocationResults([]);
            setLocationPanelOpen(true);
          }}>
            <span className="header__location-dot" />
            <span className="header__location-text chip-short">{chipShort}</span>
            <span className="header__location-text chip-detail">{chipDetail}</span>
          </button>
        )}

        <div className="header__search" onClick={() => setSearchOpen(true)}>
          <MagnifyingGlassIcon style={{ width: '15px', height: '15px', color: 'var(--color-text-sub)', flexShrink: 0 }} />
          <span className="header__search-text">
            {searchQuery || selectedCategory || '장소, 카테고리 검색'}
          </span>
        </div>

        {/* 모바일 전용 검색 아이콘 버튼 (모바일 4번) */}
        <button className="header__icon-btn header__search-icon-btn" onClick={() => setSearchOpen(true)} aria-label="검색">
          <MagnifyingGlassIcon style={{ width: '22px', height: '22px' }} />
        </button>

        {/* 필터 (모바일 2번) */}
        <button className="header__icon-btn header__filter-btn" onClick={() => {
          setPendingSort(sortBy);
          setPendingScope(scope);
          setPendingDistance(distanceLimit);
          setFilterOpen(true);
        }}>
          <AdjustmentsHorizontalIcon style={{ width: '22px', height: '22px' }} />
        </button>
        {/* 알림 (모바일 5번) */}
        <button className="header__icon-btn header__bell-btn" onClick={() => navigate('/notification')}>
          <BellIcon style={{ width: '22px', height: '22px' }} />
        </button>
      </header>

      {/* 위치 설정 패널 */}
      {locationPanelOpen && (
        <div className="filter-overlay" onClick={() => setLocationPanelOpen(false)}>
          <div className="filter-panel" onClick={e => e.stopPropagation()}>
            <div className="filter-panel__header">
              <span className="filter-panel__title">위치 설정</span>
              <button onClick={() => setLocationPanelOpen(false)} style={{ background:'none', border:'none', cursor:'pointer', display:'flex' }}>
                <XMarkIcon style={{ width:'20px', height:'20px' }} />
              </button>
            </div>

            {/* 현재 위치 표시 + GPS 버튼 */}
            <div className="filter-panel__section">
              <p className="filter-panel__label">현재 위치</p>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:'10px', padding:'8px 0' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'8px', flex:1, minWidth:0 }}>
                  <MapPinIcon style={{ width:'16px', height:'16px', color:'var(--color-primary)', flexShrink:0 }} />
                  <span style={{ fontSize:'13px', color:'var(--color-text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    {customLocation ? customLocation.name : (locationName?.detail || '위치 감지 중...')}
                  </span>
                </div>
                {/* 크로스헤어 — GPS 자동 감지 */}
                <button
                  className="location-gps-btn"
                  onClick={useGPSLocation}
                  title="GPS로 현재 위치 사용"
                  disabled={status !== 'success'}
                  style={{ opacity: status !== 'success' ? 0.4 : 1 }}
                >
                  <CrosshairIcon />
                  <span>GPS 사용</span>
                </button>
              </div>
            </div>

            {/* 주소 검색 */}
            <div className="filter-panel__section">
              <p className="filter-panel__label">위치 검색</p>
              <div className="location-search-wrap">
                <MagnifyingGlassIcon style={{ width:'14px', height:'14px', color:'var(--color-text-sub)', flexShrink:0 }} />
                <input
                  className="location-search-input"
                  placeholder="도시, 동네, 장소 이름..."
                  value={locationSearch}
                  onChange={e => { setLocationSearch(e.target.value); searchAddress(e.target.value); }}
                />
                {searching && <span style={{ fontSize:'11px', color:'var(--color-text-sub)' }}>검색 중</span>}
              </div>

              {locationResults.length > 0 && (
                <div className="location-results">
                  {locationResults.map((r, i) => (
                    <button key={i} className="location-result-item" onClick={() => selectLocation(r)}>
                      <MapPinIcon style={{ width:'13px', height:'13px', color:'var(--color-primary)', flexShrink:0 }} />
                      <span>{r.display_name.split(',').slice(0, 3).join(', ')}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 검색 오버레이 */}
      {searchOpen && (
        <div className="search-overlay">
          <div className="search-overlay__header">
            <button className="search-overlay__back" onClick={() => setSearchOpen(false)}>
              <ArrowLeftIcon style={{ width:'20px', height:'20px' }} />
            </button>
            <div className="search-overlay__input-wrap">
              <MagnifyingGlassIcon style={{ width:'16px', height:'16px', color:'var(--color-text-sub)', flexShrink:0 }} />
              <input
                autoFocus
                className="search-overlay__input"
                placeholder="장소, 카테고리 검색"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--color-text-sub)', padding:0, display:'flex' }}>
                  <XMarkIcon style={{ width:'16px', height:'16px' }} />
                </button>
              )}
            </div>
            <button className="search-overlay__cancel" onClick={() => setSearchOpen(false)}>취소</button>
          </div>

          {!searchQuery && (
            <div className="search-overlay__categories">
              <p className="search-overlay__label">카테고리</p>
              <div className="search-overlay__tags">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    className={`search-overlay__tag ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => { setSelectedCategory(cat === selectedCategory ? null : cat); setSearchOpen(false); }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}

          {searchQuery && (
            <div className="search-overlay__results">
              {filteredPhotos.length > 0 ? filteredPhotos.map(photo => (
                <div key={photo.id} className="search-overlay__result-item" onClick={() => { navigate(`/photo/${photo.id}`); setSearchOpen(false); }}>
                  <img src={photo.imageUrl} alt={photo.title} style={{ width:'44px', height:'44px', objectFit:'cover', borderRadius:'6px', flexShrink:0 }} />
                  <div>
                    <p style={{ fontSize:'13px', fontWeight:'500', color:'var(--color-text)', margin:0 }}>{photo.title}</p>
                    <p style={{ fontSize:'11px', color:'var(--color-text-sub)', margin:'2px 0 0' }}>
                      {photo.city}{photoDistances[photo.id] && ` · ${photoDistances[photo.id]}`}
                    </p>
                  </div>
                </div>
              )) : <p className="search-overlay__empty">검색 결과가 없어요</p>}
            </div>
          )}
        </div>
      )}

      {/* 필터 패널 */}
      {filterOpen && (
        <div className="filter-overlay" onClick={() => setFilterOpen(false)}>
          <div className="filter-panel" onClick={e => e.stopPropagation()}>
            <div className="filter-panel__header">
              <span className="filter-panel__title">필터</span>
              <button onClick={() => setFilterOpen(false)} style={{ background:'none', border:'none', cursor:'pointer', display:'flex' }}>
                <XMarkIcon style={{ width:'20px', height:'20px' }} />
              </button>
            </div>

            {/* 정렬 */}
            <div className="filter-panel__section">
              <p className="filter-panel__label">정렬</p>
              <div className="filter-panel__options">
                <button className={`filter-panel__option ${pendingSort === 'popular' ? 'active' : ''}`} onClick={() => setPendingSort('popular')}>인기순</button>
                <button className={`filter-panel__option ${pendingSort === 'recent' ? 'active' : ''}`} onClick={() => setPendingSort('recent')}>최신순</button>
              </div>
            </div>

            {/* 탐색 범위 */}
            <div className="filter-panel__section">
              <p className="filter-panel__label">탐색 범위</p>
              <div className="filter-panel__options">
                <button className={`filter-panel__option ${pendingScope === 'nearby' ? 'active' : ''}`}
                  onClick={() => setPendingScope('nearby')}
                  disabled={status !== 'success'}
                  style={{ opacity: status !== 'success' ? 0.4 : 1 }}>
                  내 주변
                </button>
                <button className={`filter-panel__option ${pendingScope === 'domestic' ? 'active' : ''}`} onClick={() => setPendingScope('nearby')}>국내 전체</button>
                <button className={`filter-panel__option ${pendingScope === 'global' ? 'active' : ''}`} onClick={() => setPendingScope('global')}>해외</button>
              </div>
            </div>

            {/* 거리 범위 — 내 주변 선택시만 */}
            {pendingScope === 'nearby' && status === 'success' && (
              <div className="filter-panel__section">
                <p className="filter-panel__label">거리 범위</p>
                <div className="filter-panel__options" style={{ flexWrap: 'wrap', gap: '6px' }}>
                  {[null, 1, 5, 10, 30].map((km) => (
                    <button key={km ?? 'all'}
                      className={`filter-panel__option ${pendingDistance === km ? 'active' : ''}`}
                      onClick={() => setPendingDistance(km)}>
                      {km === null ? '전체' : `${km}km`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button className="filter-panel__apply" onClick={() => {
              setSortBy(pendingSort);
              setScope(pendingScope);
              setDistanceLimit(pendingDistance);
              setFilterOpen(false);
            }}>적용</button>
          </div>
        </div>
      )}

      <main className="home">
        {(selectedCategory || searchQuery) && (
          <div className="home__filter-badge">
            <span>{selectedCategory || `"${searchQuery}"`} 검색 결과</span>
            <button onClick={() => { setSelectedCategory(null); setSearchQuery(''); }}>
              <XMarkIcon style={{ width:'14px', height:'14px' }} />
            </button>
          </div>
        )}
        <Masonry
          breakpointCols={{ default: 5, 1599: 5, 1199: 4, 767: 3, 479: 2 }}
          className="home__masonry"
          columnClassName="home__masonry-col"
        >
          {filteredPhotos.map(photo => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              onClick={p => { sessionStorage.setItem('homeScrollY', window.scrollY); navigate(`/photo/${p.id}`); }}
              distance={photoDistances[photo.id]}
            />
          ))}
        </Masonry>
      </main>

      <BottomNav activeTab="home" />
    </>
  );
}

export default Home;
