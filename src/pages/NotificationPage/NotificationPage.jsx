import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import BottomNav from '../../components/BottomNav/BottomNav';
import SideNav from '../../components/SideNav/SideNav';
import Header from '../../components/Header/Header';
import { mockNotifications } from '../../data/mockData';
import './NotificationPage.css';

const FILTER_TABS = [
  { id: 'all',     label: '전체' },
  { id: 'like',    label: '좋아요' },
  { id: 'comment', label: '댓글' },
  { id: 'follow',  label: '팔로우' },
];

function NotificationItem({ item }) {
  return (
    <div className="notification__item">
      <div className="notification__avatar">
        {item.user[0].toUpperCase()}
      </div>
      <div className="notification__text-wrap">
        <p className="notification__text">
          <strong>{item.user}</strong> {item.text}
        </p>
        <p className="notification__time">{item.time}</p>
      </div>
      {item.imageUrl && <img className="notification__thumb" src={item.imageUrl} alt="" />}
    </div>
  );
}

function NotificationPage() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [pendingFilter, setPendingFilter] = useState('all');

  const filtered = activeFilter === 'all'
    ? mockNotifications
    : mockNotifications.filter(n => n.type === activeFilter);

  const TODAY = filtered.filter((_, i) => i < 4);
  const WEEK  = filtered.filter((_, i) => i >= 4);

  return (
    <>
      <SideNav />
      <Header
        showBack
        onFilterClick={() => { setPendingFilter(activeFilter); setFilterOpen(true); }}
      />

      {/* 알림 필터 패널 */}
      {filterOpen && (
        <div className="filter-overlay" onClick={() => setFilterOpen(false)}>
          <div className="filter-panel" onClick={e => e.stopPropagation()}>
            <div className="filter-panel__header">
              <span className="filter-panel__title">알림 필터</span>
              <button onClick={() => setFilterOpen(false)} style={{ background:'none', border:'none', cursor:'pointer', display:'flex' }}>
                <XMarkIcon style={{ width:'20px', height:'20px' }} />
              </button>
            </div>
            <div className="filter-panel__section">
              <p className="filter-panel__label">알림 종류</p>
              <div className="filter-panel__options">
                {FILTER_TABS.map(f => (
                  <button key={f.id}
                    className={`filter-panel__option ${pendingFilter === f.id ? 'active' : ''}`}
                    onClick={() => setPendingFilter(f.id)}>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            <button className="filter-panel__apply" onClick={() => {
              setActiveFilter(pendingFilter);
              setFilterOpen(false);
            }}>적용</button>
          </div>
        </div>
      )}

      <main className="notification">
        {TODAY.length > 0 && (
          <>
            <p className="notification__section-title">오늘</p>
            {TODAY.map(n => <NotificationItem key={n.id} item={n} />)}
          </>
        )}
        {WEEK.length > 0 && (
          <>
            <p className="notification__section-title">이번 주</p>
            {WEEK.map(n => <NotificationItem key={n.id} item={n} />)}
          </>
        )}
        {filtered.length === 0 && (
          <p style={{ textAlign:'center', color:'var(--color-text-sub)', padding:'60px 20px', fontSize:'14px' }}>
            알림이 없어요
          </p>
        )}
      </main>

      <BottomNav activeTab="notification" />
    </>
  );
}

export default NotificationPage;
