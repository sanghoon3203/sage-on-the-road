import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AuthForm } from '../components/ui/AuthForm';
import useGameStore from '../store/useGameStore';

export default function TitleScene() {
  const [authMode, setAuthMode] = useState(null); // 'login' or 'register'
  const startGame = useGameStore(state => state.startGame);
  const user = useGameStore(state => state.user);

  if (user && !authMode) {
    return (
      <div className="title-screen">
        <div className="title-overlay">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="logo">길 위의 현자</h1>
            <p className="welcome-message">{user.email}님, 다시 오셨군요.</p>
            <button className="title-button" onClick={startGame}>이어하기</button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="title-screen">
      <div className="title-overlay">
        {!authMode ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="logo">길 위의 현자</h1>
            <button className="title-button" onClick={() => setAuthMode('login')}>로그인</button>
            <button className="title-button" onClick={() => setAuthMode('register')}>회원가입</button>
            <button className="title-button" onClick={() => alert('옵션 기능은 여기에 구현됩니다.')}>옵션</button>
          </motion.div>
        ) : (
          <AuthForm mode={authMode} onBack={() => setAuthMode(null)} />
        )}
      </div>
    </div>
  );
}