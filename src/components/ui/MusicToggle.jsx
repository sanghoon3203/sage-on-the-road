import React, { useState } from 'react';

export default function MusicToggle() {
    const [isPlaying, setIsPlaying] = useState(false);

    const toggleMusic = () => {
        setIsPlaying(!isPlaying);
        // 실제로는 <audio> 태그를 제어해야 합니다.
        alert(`배경음악 ${!isPlaying ? 'ON' : 'OFF'}`);
    }

    return (
        <button onClick={toggleMusic} className="music-toggle">
            {isPlaying ? '🎵' : '🚫'}
        </button>
    )
}