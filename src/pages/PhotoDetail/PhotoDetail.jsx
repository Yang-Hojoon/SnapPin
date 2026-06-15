import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon, EllipsisHorizontalIcon, HeartIcon,
  ChatBubbleOvalLeftIcon, MapPinIcon, PaperAirplaneIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid, BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid';
import { BookmarkIcon } from '@heroicons/react/24/outline';
import SideNav from '../../components/SideNav/SideNav';
import useSavedPhotos from '../../hooks/useSavedPhotos';
import useLikedPhotos from '../../hooks/useLikedPhotos';
import mockPhotos, { mockComments, formatLikes } from '../../data/mockData';
import MiniMap from '../../components/MiniMap/MiniMap';
import './PhotoDetail.css';

const ICON = { width: '22px', height: '22px' };
const ICON_SM = { width: '14px', height: '14px' };

const MOCK_AUTHORS = [
  { name: '김포토',    initial: '김', color: '#EEF2FF', textColor: '#5B5CF6', time: '2시간 전' },
  { name: 'min_daily', initial: 'M', color: '#FEF3C7', textColor: '#92400E', time: '5시간 전' },
  { name: 'park.s',    initial: 'P', color: '#D1FAE5', textColor: '#065F46', time: '1일 전'   },
  { name: 'haneul.log',initial: 'H', color: '#EDE9FE', textColor: '#5B21B6', time: '3시간 전' },
  { name: 'j.explore_',initial: 'J', color: '#FEE2E2', textColor: '#991B1B', time: '어제'     },
  { name: 'soo._.pic', initial: 'S', color: '#DBEAFE', textColor: '#1E40AF', time: '방금'     },
];

function getAuthor(photoId) {
  return MOCK_AUTHORS[photoId % MOCK_AUTHORS.length];
}

function getUserPhotos() {
  try { return JSON.parse(localStorage.getItem('snappin_user_photos') || '[]'); }
  catch { return []; }
}

function PhotoDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const allPhotos = [...getUserPhotos(), ...mockPhotos];
  const photo = allPhotos.find((p) => p.id === Number(id));

  const author = getAuthor(photo?.id ?? 0);
  const { toggleSave, isSaved } = useSavedPhotos();
  const { toggleLike, isLiked } = useLikedPhotos();
  const saved = isSaved(photo?.id);
  const liked = isLiked(photo?.id);
  const [likeCount, setLikeCount] = useState(photo?.likes || 0);
  const [comments, setComments] = useState(mockComments);
  const [newComment, setNewComment] = useState('');

  if (!photo) { navigate('/'); return null; }

  const handleLike = () => {
    setLikeCount((c) => liked ? c - 1 : c + 1);
    toggleLike(photo.id);
  };

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;
    setComments(prev => [...prev, {
      id: Date.now(), user: 'yanghojon', initial: '양',
      comment: newComment, time: '방금',
      color: '#EEF2FF', textColor: '#5B5CF6',
    }]);
    setNewComment('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitComment();
    }
  };

  const InfoPanel = () => (
    <>
      <div className="detail__author">
        <div className="detail__avatar" style={{ background: author.color, color: author.textColor }}>{author.initial}</div>
        <div className="detail__author-info">
          <p className="detail__author-name">{author.name}</p>
          <p className="detail__author-time">{author.time}</p>
        </div>
        <button className="detail__follow-btn">팔로우</button>
      </div>

      <div className="detail__actions">
        <button className={`detail__action-btn ${liked ? 'liked' : ''}`} onClick={handleLike} aria-label="좋아요">
          {liked ? <HeartSolid style={ICON} /> : <HeartIcon style={ICON} />}
          <span className="detail__action-count">{formatLikes(likeCount)}</span>
        </button>
        <button className="detail__action-btn" aria-label="댓글">
          <ChatBubbleOvalLeftIcon style={ICON} />
          <span className="detail__action-count">{comments.length}</span>
        </button>
        <div className="detail__action-spacer" />
        <button className={`detail__action-btn ${saved ? 'saved' : ''}`} onClick={() => toggleSave(photo.id)} aria-label="저장">
          {saved ? <BookmarkSolid style={ICON} /> : <BookmarkIcon style={ICON} />}
        </button>
      </div>

      <div className="detail__content">
        <p className="detail__caption">분위기 너무 좋아서 오래 있었던 카페. 2층 창가 자리 추천합니다</p>
        <div className="detail__location">
          <MapPinIcon style={{ ...ICON_SM, color: 'var(--color-primary)' }} />
          <span className="detail__location-text">{photo.city}</span>
        </div>
        <div className="detail__map">
          <MiniMap lat={photo.lat} lng={photo.lng} photoId={photo.id} />
        </div>
      </div>

      <div className="detail__comments">
        <p className="detail__comments-title">댓글 {comments.length}개</p>
        {comments.map((comment) => (
          <div key={comment.id} className="detail__comment">
            <div className="detail__comment-avatar" style={{ background: comment.color, color: comment.textColor }}>
              {comment.initial}
            </div>
            <div>
              <p className="detail__comment-text">
                <span className="detail__comment-user">{comment.user} </span>
                {comment.comment.startsWith('@')
                  ? <><span className="detail__comment-tag">{comment.comment.split(' ')[0]}</span>{' ' + comment.comment.split(' ').slice(1).join(' ')}</>
                  : comment.comment
                }
              </p>
              <p className="detail__comment-time">{comment.time}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="detail__comment-input">
        <div className="detail__comment-input-avatar">나</div>
        <input
          className="detail__comment-input-field"
          type="text"
          placeholder="댓글 달기..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="detail__comment-send-btn" onClick={handleSubmitComment} aria-label="전송">
          <PaperAirplaneIcon style={{ width: '20px', height: '20px' }} />
        </button>
      </div>
    </>
  );

  return (
    <>
      <SideNav />
      <header className="detail-header">
        <button className="detail-header__btn" onClick={() => navigate(-1)} aria-label="뒤로가기">
          <ArrowLeftIcon style={ICON} />
        </button>
        <h2 className="detail-header__title">{photo.title}</h2>
        <button className="detail-header__btn" aria-label="더보기">
          <EllipsisHorizontalIcon style={ICON} />
        </button>
      </header>

      <main className="detail">
        <div className="detail__photo-col">
          <img className="detail__image" src={photo.imageUrl} alt={photo.title} />
        </div>
        <div className="detail__info-col">
          <InfoPanel />
        </div>
      </main>
    </>
  );
}

export default PhotoDetail;
