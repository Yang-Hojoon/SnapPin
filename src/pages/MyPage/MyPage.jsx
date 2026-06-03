import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Squares2X2Icon, BookmarkIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Header from '../../components/Header/Header';
import BottomNav from '../../components/BottomNav/BottomNav';
import SideNav from '../../components/SideNav/SideNav';
import mockPhotos from '../../data/mockData';
import useSavedPhotos from '../../hooks/useSavedPhotos';
import './MyPage.css';

const MY_PHOTOS = mockPhotos.slice(0, 9);

const SETTINGS = [
  { label: '프로필 편집' },
  { label: '알림 설정' },
  { label: '위치 정보 설정' },
  { label: '개인정보 처리방침' },
  { label: '로그아웃', danger: true },
];

function MyPage() {
  const navigate = useNavigate();
  const { savedIds } = useSavedPhotos();
  const SAVED_PHOTOS = mockPhotos.filter(p => savedIds.includes(p.id));
  const [activeTab, setActiveTab] = useState('posts');

  const photos = activeTab === 'posts' ? MY_PHOTOS : SAVED_PHOTOS;

  // 프로필 + 설정 (PC 사이드바 / 모바일 상단)
  const ProfileSection = () => (
    <>
      <div className="mypage__profile">
        <div className="mypage__profile-top">
          <div className="mypage__avatar">H</div>
          <div className="mypage__stats">
            <div className="mypage__stat">
              <span className="mypage__stat-num">{MY_PHOTOS.length}</span>
              <span className="mypage__stat-label">게시물</span>
            </div>
            <div className="mypage__stat">
              <span className="mypage__stat-num">312</span>
              <span className="mypage__stat-label">팔로워</span>
            </div>
            <div className="mypage__stat">
              <span className="mypage__stat-num">187</span>
              <span className="mypage__stat-label">팔로잉</span>
            </div>
          </div>
        </div>
        <p className="mypage__username">hyunji.log</p>
        <p className="mypage__bio">좋은 장소 발견하면 올려요</p>
        <button className="mypage__edit-btn">프로필 편집</button>
      </div>

      <div className="mypage__settings">
        {SETTINGS.map((item) => (
          <button key={item.label} className={`mypage__settings-item ${item.danger ? 'danger' : ''}`}>
            <span>{item.label}</span>
            {!item.danger && <ChevronRightIcon style={{ width: '16px', height: '16px', color: 'var(--color-text-sub)' }} />}
          </button>
        ))}
      </div>
    </>
  );

  // 탭 + 그리드
  const GridSection = () => (
    <>
      <div className="mypage__tabs">
        <button className={`mypage__tab ${activeTab === 'posts' ? 'active' : ''}`} onClick={() => setActiveTab('posts')}>
          <Squares2X2Icon style={{ width: '22px', height: '22px' }} />
        </button>
        <button className={`mypage__tab ${activeTab === 'saved' ? 'active' : ''}`} onClick={() => setActiveTab('saved')}>
          <BookmarkIcon style={{ width: '22px', height: '22px' }} />
        </button>
      </div>

      {photos.length > 0 ? (
        <div className="mypage__grid">
          {photos.map((photo) => (
            <div key={photo.id} style={{ position:'relative', cursor:'pointer' }}
              onClick={() => navigate(`/photo/${photo.id}`)}>
              <img src={photo.imageUrl} alt={photo.title}
                style={{ width:'100%', aspectRatio:'1/1', objectFit:'cover', display:'block' }} />
            </div>
          ))}
        </div>
      ) : (
        <div className="mypage__empty">
          <BookmarkIcon style={{ width: '40px', height: '40px' }} />
          <p>저장한 장소가 없습니다</p>
        </div>
      )}
    </>
  );

  return (
    <>
      <SideNav activeTab="mypage" />
      <Header />

      <main className="mypage">
        {/* 모바일/태블릿: 세로 레이아웃 */}
        <div className="mypage__mobile-layout">
          <ProfileSection />
          <GridSection />
        </div>

        {/* PC: 좌측 프로필 + 우측 그리드 */}
        <div className="mypage__desktop-layout">
          <div className="mypage__desktop-sidebar">
            <ProfileSection />
          </div>
          <div className="mypage__desktop-content">
            <GridSection />
          </div>
        </div>
      </main>

      <BottomNav activeTab="mypage" />
    </>
  );
}

export default MyPage;
