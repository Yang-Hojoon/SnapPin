import { useState } from 'react';
import { PaperAirplaneIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Header from '../../components/Header/Header';
import BottomNav from '../../components/BottomNav/BottomNav';
import SideNav from '../../components/SideNav/SideNav';
import { mockMessages } from '../../data/mockData';
import './MessagePage.css';

const FRIENDS = mockMessages.map(m => ({
  id: m.id, user: m.user,
  avatarColor: m.avatarColor, avatarText: m.avatarText,
}));

function FriendBubble({ friend, onClick }) {
  return (
    <button className="friends__bubble" onClick={() => onClick(friend.id)}>
      <div className="friends__circle" style={{ background: friend.avatarColor, color: friend.avatarText }}>
        {friend.user[0].toUpperCase()}
      </div>
      <span className="friends__name">{friend.user}</span>
    </button>
  );
}

function FriendsSection({ friends, friendSearch, onSearchChange, onSelect, vertical = false }) {
  return (
    <div className="friends__section">
      <div className="friends__search">
        <MagnifyingGlassIcon style={{ width: '13px', height: '13px', color: 'var(--color-text-sub)', flexShrink: 0 }} />
        <input
          className="friends__search-input"
          placeholder="친구 검색"
          value={friendSearch}
          onChange={e => onSearchChange(e.target.value)}
        />
      </div>
      <div className={`friends__wrap ${vertical ? 'vertical' : 'horizontal'}`}>
        {friends.length > 0
          ? friends.map(f => <FriendBubble key={f.id} friend={f} onClick={onSelect} />)
          : <p className="friends__empty">검색 결과가 없어요</p>
        }
      </div>
    </div>
  );
}

function ConversationList({ selected, onSelect }) {
  return (
    <div className="message__list">
      {mockMessages.map((msg) => (
        <div
          key={msg.id}
          className={`message__item ${selected?.id === msg.id ? 'active' : ''}`}
          onClick={() => onSelect(msg)}
        >
          <div className="message__avatar" style={{ background: msg.avatarColor, color: msg.avatarText }}>
            {msg.user[0].toUpperCase()}
          </div>
          <div className="message__info">
            <p className="message__name">{msg.user}</p>
            <p className={`message__last ${msg.unread > 0 ? 'unread' : ''}`}>{msg.lastMsg}</p>
          </div>
          <div className="message__meta">
            <span className="message__time">{msg.time}</span>
            {msg.unread > 0 && <span className="message__badge">{msg.unread}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

function ChatView({ selected, messages, input, onInput, onSend, onKey }) {
  if (!selected) return (
    <div className="message__empty"><p>대화를 선택해주세요</p></div>
  );
  return (
    <div className="message__chat">
      <div className="message__chat-header">
        <div className="message__avatar" style={{ background: selected.avatarColor, color: selected.avatarText }}>
          {selected.user[0].toUpperCase()}
        </div>
        <span className="message__chat-name">{selected.user}</span>
      </div>
      <div className="message__chat-body">
        {messages.map((msg, i) => (
          <div key={i} className={`message__bubble-wrap ${msg.from === 'me' ? 'me' : 'other'}`}>
            <div className={`message__bubble ${msg.from === 'me' ? 'me' : 'other'}`}>
              <p>{msg.text}</p>
            </div>
            <span className="message__bubble-time">{msg.time}</span>
          </div>
        ))}
      </div>
      <div className="message__chat-input">
        <input
          className="message__chat-input-field"
          placeholder="메시지 입력..."
          value={input}
          onChange={e => onInput(e.target.value)}
          onKeyDown={onKey}
        />
        <button className="message__chat-send" onClick={onSend}>
          <PaperAirplaneIcon style={{ width: '20px', height: '20px' }} />
        </button>
      </div>
    </div>
  );
}

function MessagePage() {
  const [selected, setSelected] = useState(null);
  const [input, setInput] = useState('');
  const [friendSearch, setFriendSearch] = useState('');
  const [chats, setChats] = useState(
    mockMessages.reduce((acc, m) => ({ ...acc, [m.id]: m.messages || [] }), {})
  );

  const filteredFriends = FRIENDS.filter(f =>
    f.user.toLowerCase().includes(friendSearch.toLowerCase())
  );

  const handleSelectFriend = (id) => {
    const msg = mockMessages.find(m => m.id === id);
    setSelected(msg || null);
  };

  const sendMessage = () => {
    if (!input.trim() || !selected) return;
    setChats(prev => ({
      ...prev,
      [selected.id]: [...(prev[selected.id] || []), { from: 'me', text: input, time: '방금' }]
    }));
    setInput('');
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const currentMessages = selected ? (chats[selected.id] || []) : [];

  return (
    <>
      <SideNav activeTab="message" />
      <Header />

      <main className="message">
        {/* 모바일 */}
        <div className="message__mobile">
          {selected ? (
            <div className="message__mobile-chat">
              <div className="message__mobile-chat-topbar">
                <button className="message__mobile-back" onClick={() => setSelected(null)}>←</button>
                <div className="message__avatar" style={{ background: selected.avatarColor, color: selected.avatarText }}>
                  {selected.user[0].toUpperCase()}
                </div>
                <span className="message__chat-name">{selected.user}</span>
              </div>
              <ChatView
                selected={selected}
                messages={currentMessages}
                input={input}
                onInput={setInput}
                onSend={sendMessage}
                onKey={handleKey}
              />
            </div>
          ) : (
            <>
              <FriendsSection
                friends={filteredFriends}
                friendSearch={friendSearch}
                onSearchChange={setFriendSearch}
                onSelect={handleSelectFriend}
              />
              <div className="message__section-title">대화</div>
              <ConversationList selected={selected} onSelect={setSelected} />
            </>
          )}
        </div>

        {/* 태블릿 */}
        <div className="message__tablet">
          <FriendsSection
            friends={filteredFriends}
            friendSearch={friendSearch}
            onSearchChange={setFriendSearch}
            onSelect={handleSelectFriend}
          />
          <div className="message__section-title">대화</div>
          <div className="message__tablet-body">
            <div className="message__desktop-left">
              <ConversationList selected={selected} onSelect={setSelected} />
            </div>
            <div className="message__desktop-right">
              <ChatView
                selected={selected}
                messages={currentMessages}
                input={input}
                onInput={setInput}
                onSend={sendMessage}
                onKey={handleKey}
              />
            </div>
          </div>
        </div>

        {/* PC */}
        <div className="message__desktop">
          <div className="message__desktop-left">
            <div className="message__left-section-title">친구</div>
            <FriendsSection
              friends={filteredFriends}
              friendSearch={friendSearch}
              onSearchChange={setFriendSearch}
              onSelect={handleSelectFriend}
              vertical
            />
            <div className="message__left-section-title">대화</div>
            <ConversationList selected={selected} onSelect={setSelected} />
          </div>
          <div className="message__desktop-right">
            <ChatView
              selected={selected}
              messages={currentMessages}
              input={input}
              onInput={setInput}
              onSend={sendMessage}
              onKey={handleKey}
            />
          </div>
        </div>
      </main>

      <BottomNav activeTab="message" />
    </>
  );
}

export default MessagePage;
