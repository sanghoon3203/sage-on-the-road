import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/config';
import { useGameStore } from './store/useGameStore';
import TitleScene from './scenes/TitleScene';
import GameScene from './scenes/GameScene'; // 수정됨: GameScene을 기본 내보내기로 가져옴
import DialogueBox from './components/ui/DialogueBox'; // 수정됨: DialogueBox를 기본 내보내기로 가져옴
import MusicToggle from './components/ui/MusicToggle';

export default function App() {
  const { user, setUser, gameState } = useGameStore();
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, [setUser]);

  if (loadingAuth) {
    return <div>Loading...</div>; // 인증 상태 확인 중...
  }

  return (
    <div className="app-container">
      {!user || gameState === 'title' ? (
        <TitleScene />
      ) : (
        <GameScene />
      )}
      
      <DialogueBox />
      <MusicToggle />
    </div>
  );
}