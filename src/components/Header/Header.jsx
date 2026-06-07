import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  MagnifyingGlassIcon, AdjustmentsHorizontalIcon,
  BellIcon, ArrowLeftIcon, XMarkIcon, MapPinIcon
} from '@heroicons/react/24/outline';
import { BellIcon as BellSolid } from '@heroicons/react/24/solid';
import './Header.css';

function Header({ showBack = false, onFilterClick, onMapSearch = null }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isNotification = location.pathname === '/notification';
  const isMapPage = location.pathname === '/map';
  const isMessage = location.pathname === '/message';
  const isMyPage = location.pathname === '/mypage';
  const isTitlePage = isNotification || isMessage || isMyPage;

  const [query, setQuery]       = useState('');
  const [results, setResults]   = useState([]);
  const [loading, setLoading]   = useState(false);
  const [open, setOpen]         = useState(false);
  const inputRef  = useRef(null);
  const wrapRef   = useRef(null);
  const timerRef  = useRef(null);

  // 외부 클릭 → 드롭다운 닫기
  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // 입력 → 300ms 디바운스 → Nominatim 주소 검색
  const handleChange = (e) => {
    const q = e.target.value;
    setQuery(q);
    clearTimeout(timerRef.current);
    if (!q.trim()) { setResults([]); setOpen(false); return; }

    timerRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5&accept-language=ko`,
          { headers: { 'Accept-Language': 'ko' } }
        );
        const data = await res.json();
        setResults(data);
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  const handleSelect = (item) => {
    setQuery(item.display_name.split(',')[0]); // 첫 번째 파트만 입력창에
    setOpen(false);
    if (onMapSearch) onMapSearch(parseFloat(item.lat), parseFloat(item.lon), item.display_name);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setOpen(false);
    inputRef.current?.focus();
  };

  return (
    <header className="header">
      {showBack ? (
        <button className="header__icon-btn" onClick={() => navigate(-1)} aria-label="뒤로가기">
          <ArrowLeftIcon style={{ width: '22px', height: '22px' }} />
        </button>
      ) : (
        <button className="header__logo" onClick={() => navigate('/')} aria-label="홈으로">
          <span>Snap</span>Pin
        </button>
      )}

      <div className="header__search-wrap" ref={wrapRef}>
        {isMapPage ? (
          /* 지도 페이지: 실제 주소 검색 input */
          <>
            <div className={`header__search header__search--active${open ? ' header__search--focused' : ''}`}>
              <MagnifyingGlassIcon style={{ width: '15px', height: '15px', color: 'var(--color-text-sub)', flexShrink: 0 }} />
              <input
                ref={inputRef}
                className="header__search-input"
                type="text"
                placeholder="주소, 장소명 검색"
                value={query}
                onChange={handleChange}
                onFocus={() => results.length > 0 && setOpen(true)}
              />
              {loading && <span className="header__search-spinner" />}
              {query && !loading && (
                <button className="header__search-clear" onClick={clearSearch}>
                  <XMarkIcon style={{ width: '13px', height: '13px' }} />
                </button>
              )}
            </div>

            {open && (
              <ul className="header__search-results">
                {results.length > 0 ? results.map((item) => (
                  <li key={item.place_id}>
                    <button className="header__search-result-item" onClick={() => handleSelect(item)}>
                      <MapPinIcon style={{ width: '16px', height: '16px', color: 'var(--color-primary)', flexShrink: 0 }} />
                      <div>
                        <p className="header__result-title">{item.display_name.split(',')[0]}</p>
                        <p className="header__result-addr">{item.display_name}</p>
                      </div>
                    </button>
                  </li>
                )) : (
                  <li className="header__search-empty">검색 결과가 없습니다</li>
                )}
              </ul>
            )}
          </>
        ) : !isTitlePage ? (
          /* 그 외: 장식용 검색창 */
          <div className="header__search" onClick={() => navigate('/')}>
            <MagnifyingGlassIcon style={{ width: '15px', height: '15px', color: 'var(--color-text-sub)', flexShrink: 0 }} />
            <span className="header__search-text">장소, 카테고리 검색</span>
          </div>
        ) : null}
      </div>

      {/* 알림·메시지·마이페이지: 헤더 기준 정중앙 고정 */}
      {isTitlePage && (
        <span className="header__page-title">
          {isNotification ? '알림' : isMessage ? '메시지' : '마이페이지'}
        </span>
      )}

      {!isMessage && !isMyPage && (
        <button className="header__icon-btn" onClick={onFilterClick} aria-label="필터">
          <AdjustmentsHorizontalIcon style={{ width: '22px', height: '22px' }} />
        </button>
      )}

      {!isMessage && (
        <button
          className={`header__icon-btn ${isNotification ? 'header__icon-btn--active' : ''}`}
          onClick={() => navigate('/notification')}
          aria-label="알림"
        >
          {isNotification
            ? <BellSolid style={{ width: '22px', height: '22px', color: 'var(--color-primary)' }} />
            : <BellIcon style={{ width: '22px', height: '22px' }} />
          }
        </button>
      )}

      {/* 메시지: 오른쪽 뒤로가기 버튼과 균형 맞추는 빈 공간 */}
      {isMessage && <div style={{ width: '36px', flexShrink: 0 }} />}
    </header>
  );
}

export default Header;
