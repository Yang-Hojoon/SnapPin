import { useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  MapIcon,
  PlusIcon,
  ChatBubbleOvalLeftIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import './BottomNav.css';

function BottomNav({ activeTab = 'home' }) {
  const navigate = useNavigate();
  const iconStyle = { width: '22px', height: '22px' };

  return (
    <nav className="bottom-nav">
      <button
        className={`bottom-nav__item ${activeTab === 'home' ? 'active' : ''}`}
        onClick={() => navigate('/')}
      >
        <HomeIcon style={iconStyle} />
        <span>홈</span>
      </button>

      <button
        className={`bottom-nav__item ${activeTab === 'map' ? 'active' : ''}`}
        onClick={() => navigate('/map')}
      >
        <MapIcon style={iconStyle} />
        <span>지도</span>
      </button>

      <button className="bottom-nav__item" onClick={() => navigate('/upload')}>
        <div className="bottom-nav__plus">
          <PlusIcon style={{ width: '20px', height: '20px' }} />
        </div>
      </button>

      <button
        className={`bottom-nav__item ${activeTab === 'message' ? 'active' : ''}`}
        onClick={() => navigate('/message')}
      >
        <ChatBubbleOvalLeftIcon style={iconStyle} />
        <span>메시지</span>
      </button>

      <button
        className={`bottom-nav__item ${activeTab === 'mypage' ? 'active' : ''}`}
        onClick={() => navigate('/mypage')}
      >
        <UserIcon style={iconStyle} />
        <span>마이</span>
      </button>
    </nav>
  );
}

export default BottomNav;
