// src/components/ui/AuthForm.jsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Firebase에서 필요한 모든 함수를 이 파일로 가져옵니다.
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signInWithPopup
} from 'firebase/auth';
import { auth, googleProvider } from '../../firebase/config'; // 수정됨: googleProvider를 이름 내보내기로 가져옴


export function AuthForm({ mode, onBack }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // 이메일/비밀번호 로그인/회원가입 핸들러 (기존과 동일)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (mode === 'register') {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Google 로그인 핸들러
  const handleGoogleLogin = async () => {
    setError('');
    try {
      await signInWithPopup(auth, googleProvider);
      // 성공하면 onAuthStateChanged가 감지하여 자동으로 폼이 닫힙니다.
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>{mode === 'login' ? '로그인' : '회원가입'}</h2>
        
        {/* 이메일, 비밀번호 입력 필드 */}
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="이메일" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호" required />
        
        {error && <p className="error-message">{error}</p>}
        
        {/* 이메일/비밀번호 제출 버튼 */}
        <button type="submit" className="title-button">{mode === 'login' ? '이메일로 로그인' : '이메일로 회원가입'}</button>
        
        {/* 구분선 */}
        <div className="divider">또는</div>

        {/* Google 로그인 버튼 */}
        <button type="button" className="title-button google-button" onClick={handleGoogleLogin}>
          Google로 {mode === 'login' ? '로그인' : '계속하기'}
        </button>

        {/* 뒤로가기 버튼 */}
        <button type="button" className="title-button secondary" onClick={onBack}>뒤로가기</button>
      </form>
    </motion.div>
  );
}