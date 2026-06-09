import { HeartIcon, MapPinIcon, TrashIcon } from '@heroicons/react/24/outline';
import { formatLikes } from '../../data/mockData';
import './PhotoCard.css';

function PhotoCard({ photo, onClick, distance, onDelete }) {
  return (
    <div className="photo-card" onClick={() => onClick(photo)}>
      <img
        className="photo-card__image"
        src={photo.imageUrl}
        alt={photo.title}
        loading="lazy"
      />
      <div className="photo-card__overlay">
        <p className="photo-card__title">{photo.title}</p>
        <div className="photo-card__meta">
          <span className="photo-card__location">
            <MapPinIcon style={{ width: '10px', height: '10px', strokeWidth: 2.5 }} />
            {distance ?? photo.city}
          </span>
          <span className="photo-card__likes">
            <HeartIcon style={{ width: '10px', height: '10px', strokeWidth: 2.5 }} />
            {formatLikes(photo.likes)}
          </span>
        </div>
      </div>
      {photo.isUserPhoto && onDelete && (
        <button
          className="photo-card__delete-btn"
          onClick={(e) => { e.stopPropagation(); onDelete(photo.id); }}
          aria-label="삭제"
        >
          <TrashIcon style={{ width: '13px', height: '13px' }} />
        </button>
      )}
    </div>
  );
}

export default PhotoCard;
