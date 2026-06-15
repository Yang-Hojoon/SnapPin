import { useState } from 'react';

// localStorage로 좋아요 목록 관리
function useLikedPhotos() {
  const [likedIds, setLikedIds] = useState(() => {
    try {
      const stored = localStorage.getItem('snappin_liked');
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });

  const toggleLike = (photoId) => {
    setLikedIds(prev => {
      const next = prev.includes(photoId)
        ? prev.filter(id => id !== photoId)
        : [...prev, photoId];
      localStorage.setItem('snappin_liked', JSON.stringify(next));
      return next;
    });
  };

  const isLiked = (photoId) => likedIds.includes(photoId);

  return { likedIds, toggleLike, isLiked };
}

export default useLikedPhotos;
