import { useNavigate } from 'react-router-dom';
import {
  HomeIcon, MapIcon, PlusIcon,
  ChatBubbleOvalLeftIcon, UserIcon,
} from '@heroicons/react/24/outline';
import './SideNav.css';

function SideNav({ activeTab = 'home' }) {
  const navigate = useNavigate();
  const iconStyle = { width: '22px', height: '22px' };

  return (
    <nav className="side-nav">
      {/* 로고 — 버튼으로 변경, 클릭 시 홈 이동 */}
      <button className="side-nav__logo" onClick={() => navigate('/')}>
        Snap<span>Pin</span>
      </button>

      <div className="side-nav__menu">
        <button className={`side-nav__item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => navigate('/')}>
          <HomeIcon style={iconStyle} />홈
        </button>
        <button className={`side-nav__item ${activeTab === 'map' ? 'active' : ''}`} onClick={() => navigate('/map')}>
          <MapIcon style={iconStyle} />지도
        </button>
        <button className={`side-nav__item ${activeTab === 'message' ? 'active' : ''}`} onClick={() => navigate('/message')}>
          <ChatBubbleOvalLeftIcon style={iconStyle} />메시지
        </button>
        <button className={`side-nav__item ${activeTab === 'mypage' ? 'active' : ''}`} onClick={() => navigate('/mypage')}>
          <UserIcon style={iconStyle} />마이페이지
        </button>
      </div>

      <button className="side-nav__upload" onClick={() => navigate('/upload')}>
        <PlusIcon style={{ width: '18px', height: '18px', flexShrink: 0, display: 'block', strokeWidth: 2.8 }} />
        <span style={{ display: 'block', lineHeight: 1 }}>게시하기</span>
      </button>
    </nav>
  );
}

export default SideNav;
