import { useState, useEffect } from 'react';

export const usePlayerControls = () => {
  const [movement, setMovement] = useState({ left: false, right: false });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') setMovement(m => ({ ...m, left: true }));
      if (e.key === 'ArrowRight') setMovement(m => ({ ...m, right: true }));
    };

    const handleKeyUp = (e) => {
      if (e.key === 'ArrowLeft') setMovement(m => ({ ...m, left: false }));
      if (e.key === 'ArrowRight') setMovement(m => ({ ...m, right: false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return { movement };
};