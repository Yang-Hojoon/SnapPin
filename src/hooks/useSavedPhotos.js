import { useState } from 'react';

// localStorage로 저장 목록 관리
function useSavedPhotos() {
  const [savedIds, setSavedIds] = useState(() => {
    try {
      const stored = localStorage.getItem('snappin_saved');
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });

  const toggleSave = (photoId) => {
    setSavedIds(prev => {
      const next = prev.includes(photoId)
        ? prev.filter(id => id !== photoId)
        : [...prev, photoId];
      localStorage.setItem('snappin_saved', JSON.stringify(next));
      return next;
    });
  };

  const isSaved = (photoId) => savedIds.includes(photoId);

  return { savedIds, toggleSave, isSaved };
}

export default useSavedPhotos;
