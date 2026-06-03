import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { XMarkIcon, MapPinIcon, PhotoIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import exifr from 'exifr';
import SideNav from '../../components/SideNav/SideNav';
import BottomNav from '../../components/BottomNav/BottomNav';
import './UploadPage.css';

const CATEGORIES = ['카페', '공원', '야경', '거리', '바다', '해외', '맛집', '건축'];

function Toggle({ on, onToggle }) {
  return (
    <button className={`upload__toggle ${on ? 'on' : 'off'}`} onClick={onToggle}>
      <div className="upload__toggle-thumb" />
    </button>
  );
}

function UploadPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [placeName, setPlaceName] = useState('');     // 장소명 (피드 제목)
  const [caption, setCaption] = useState('');          // 설명 (상세 페이지)
  const [category, setCategory] = useState(null);
  const [isPublic, setIsPublic] = useState(true);
  const [location, setLocation] = useState(null);      // { lat, lng, city, address }

  // 위치 검색
  const [locationSearch, setLocationSearch] = useState('');
  const [locationResults, setLocationResults] = useState([]);
  const [searchingLocation, setSearchingLocation] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));

    // EXIF GPS 자동 추출
    try {
      const gps = await exifr.gps(file);
      if (gps?.latitude && gps?.longitude) {
        await fetchLocationName(gps.latitude, gps.longitude);
        return;
      }
    } catch {}

    // GPS 자동 감지
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => { await fetchLocationName(pos.coords.latitude, pos.coords.longitude); },
        () => {}
      );
    }
  };

  const fetchLocationName = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=ko`,
        { headers: { 'User-Agent': 'SnapPin/1.0' } }
      );
      const data = await res.json();
      const addr = data.address || {};
      const city = (addr.city || addr.state || '').replace('특별시','').replace('광역시','').replace('도','').trim();
      const district = addr.city_district || addr.county || '';
      setLocation({ lat, lng, city, address: district ? `${city} ${district}` : city });
    } catch {
      setLocation({ lat, lng, city: '알 수 없음', address: '위치 감지됨' });
    }
  };

  const searchLocation = async (query) => {
    if (!query.trim()) { setLocationResults([]); return; }
    setSearchingLocation(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&accept-language=ko&limit=4&countrycodes=kr,cn,jp,us,fr`,
        { headers: { 'User-Agent': 'SnapPin/1.0' } }
      );
      const data = await res.json();
      setLocationResults(data);
    } catch { setLocationResults([]); }
    setSearchingLocation(false);
  };

  const selectLocation = async (result) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    const parts = result.display_name.split(',');
    const city = parts[parts.length - 1]?.trim() || parts[0];
    const address = parts.slice(0, 2).join(', ');
    setLocation({ lat, lng, city, address });
    setLocationSearch('');
    setLocationResults([]);
  };

  const handlePost = () => {
    if (!previewUrl || !placeName.trim()) return;

    // localStorage에 새 게시물 저장
    const newPhoto = {
      id: Date.now(),
      title: placeName.trim(),
      city: location?.city || '알 수 없음',
      likes: 0,
      imageUrl: previewUrl,
      lat: location?.lat || 37.5665,
      lng: location?.lng || 126.9780,
      caption,
      category,
      isPublic,
      isUserPhoto: true,
      createdAt: new Date().toISOString(),
    };

    try {
      const existing = JSON.parse(localStorage.getItem('snappin_user_photos') || '[]');
      localStorage.setItem('snappin_user_photos', JSON.stringify([newPhoto, ...existing]));
    } catch {}

    navigate('/');
  };

  const canPost = previewUrl && placeName.trim();

  const Settings = () => (
    <>
      {/* 장소명 */}
      <div className="upload__section">
        <p className="upload__section-label">장소명 <span style={{color:'var(--color-primary)'}}>*</span></p>
        <input
          className="upload__place-input"
          placeholder="어디서 찍었나요? (예: 북촌 한옥 골목)"
          value={placeName}
          onChange={e => setPlaceName(e.target.value)}
          maxLength={40}
        />
      </div>

      {/* 위치 */}
      <div className="upload__section">
        <p className="upload__section-label">위치</p>
        {location && (
          <div className="upload__location">
            <MapPinIcon style={{ width:'14px', height:'14px', color:'var(--color-primary)', flexShrink:0 }} />
            <span className="upload__location-address">{location.address}</span>
          </div>
        )}
        <div className="upload__location-search">
          <MagnifyingGlassIcon style={{ width:'13px', height:'13px', color:'var(--color-text-sub)', flexShrink:0 }} />
          <input
            className="upload__location-search-input"
            placeholder="위치 직접 검색..."
            value={locationSearch}
            onChange={e => { setLocationSearch(e.target.value); searchLocation(e.target.value); }}
          />
        </div>
        {locationResults.length > 0 && (
          <div className="upload__location-results">
            {locationResults.map((r, i) => (
              <button key={i} className="upload__location-result" onClick={() => selectLocation(r)}>
                <MapPinIcon style={{ width:'11px', height:'11px', color:'var(--color-primary)', flexShrink:0 }} />
                <span>{r.display_name.split(',').slice(0, 3).join(', ')}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 카테고리 */}
      <div className="upload__section">
        <p className="upload__section-label">카테고리</p>
        <div className="upload__tags">
          {CATEGORIES.map(cat => (
            <button key={cat} className={`upload__tag ${category === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat === category ? null : cat)}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 공개 범위 */}
      <div className="upload__section">
        <div className="upload__toggle-row">
          <div className="upload__toggle-info">
            <p className="upload__toggle-title">공개 범위</p>
            <p className="upload__toggle-sub">{isPublic ? '전체에게 공개됩니다' : '나만 볼 수 있습니다'}</p>
          </div>
          <Toggle on={isPublic} onToggle={() => setIsPublic(p => !p)} />
        </div>
      </div>
    </>
  );

  return (
    <>
      <SideNav />
      <input ref={fileInputRef} type="file" accept="image/*" className="upload__file-input" onChange={handleFileChange} />

      <header className="upload-header">
        <button className="upload-header__close" onClick={() => navigate(-1)}>
          <XMarkIcon style={{ width:'22px', height:'22px' }} />
        </button>
        <h2 className="upload-header__title">새 게시물</h2>
        <button className="upload-header__post-btn" onClick={handlePost} disabled={!canPost}>게시</button>
      </header>

      <main className="upload">
        <div className="upload__left-col">
          <div className="upload__photo-area" onClick={() => fileInputRef.current?.click()}>
            {previewUrl
              ? <img className="upload__photo-preview" src={previewUrl} alt="선택된 사진" />
              : <div className="upload__photo-placeholder">
                  <PhotoIcon style={{ width:'48px', height:'48px' }} />
                  <span>탭하여 사진 선택</span>
                </div>
            }
          </div>
          <div className="upload__caption-wrap">
            <textarea className="upload__caption" placeholder="이 장소에 대해 설명해주세요..."
              value={caption} onChange={e => setCaption(e.target.value)} maxLength={300} />
          </div>
        </div>
        <div className="upload__right-col">
          <Settings />
        </div>
      </main>
      <BottomNav />
    </>
  );
}

export default UploadPage;
