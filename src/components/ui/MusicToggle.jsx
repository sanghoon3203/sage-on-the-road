import React, { useState, useRef, useEffect } from 'react';

export default function MusicToggle() {
  const [isPlaying, setIsPlaying] = useState(true); // 기본값 true로 변경
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio('/assets/music/Whispering_Winds.mp3');
    audioRef.current.loop = true;

    // 자동 재생 시도
    audioRef.current.play().catch((error) => {
      console.warn("자동 재생 실패. 사용자가 인터랙션해야 할 수도 있음.", error);
      setIsPlaying(false); // 실패했을 경우 false로 바꿔줌
    });

    return () => {
      audioRef.current.pause();
    };
  }, []);

  const toggleMusic = () => {
    if (!isPlaying) {
      audioRef.current.play().catch(error => {
        console.error("Audio play error:", error);
      });
    } else {
      audioRef.current.pause();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <button
      onClick={toggleMusic}
      className="music-toggle"
      style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        zIndex: 9999,
      }}
    >
      {isPlaying ? '🎵' : '🚫'}
    </button>
  );
}
