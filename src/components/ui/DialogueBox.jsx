import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useGameStore from '../../store/useGameStore';

export function DialogueBox() {
  const { gameState, dialogue, submitAnswer, finishCutscene } = useGameStore();
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [answer, setAnswer] = useState('');

  useEffect(() => {
    setCurrentLineIndex(0); // 대화가 바뀌면 처음부터
  }, [dialogue]);

  const handleNext = () => {
    if (gameState === 'cutscene') {
      finishCutscene();
      return;
    }
    if (currentLineIndex < dialogue.length - 1) {
      setCurrentLineIndex(prev => prev + 1);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if(answer.trim()){
        submitAnswer(answer);
        setAnswer('');
    }
  }

  useEffect(() => {
    const keyHandler = (e) => {
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', keyHandler);
    return () => window.removeEventListener('keydown', keyHandler);
  }, [currentLineIndex, dialogue, gameState]);

  if (gameState !== 'talking' && gameState !== 'feedback' && gameState !== 'cutscene') {
    return null;
  }
  
  if (gameState === 'cutscene') {
    return (
        <div className="dialogue-box" onClick={handleNext}>
            <div className="dialogue-content">
                <p><strong>나:</strong> (여긴 어디지...?) <span className="next-indicator">▶</span></p>
            </div>
        </div>
    )
  }

  const currentDialogueToShow = dialogue.slice(0, currentLineIndex + 1);
  const isWaitingForAnswer = currentLineIndex === dialogue.length -1 && gameState === 'talking';

  return (
    <div className="dialogue-box" onClick={isWaitingForAnswer ? null : handleNext}>
      <div className="dialogue-content">
        {currentDialogueToShow.map((line, index) => (
          <p key={index}><strong>{line.speaker}:</strong> {line.text}</p>
        ))}

        {isWaitingForAnswer && (
          <form onSubmit={handleSubmit} className="answer-form">
            <textarea value={answer} onChange={e => setAnswer(e.target.value)} placeholder="생각을 입력하세요..." />
            <button type="submit">답변하기</button>
          </form>
        )}
        
        {gameState === 'feedback' && <p className="system-message">현자가 당신의 답변을 숙고하고 있습니다...</p>}

        {!isWaitingForAnswer && gameState !== 'feedback' && <span className="next-indicator">▶</span>}
      </div>
    </div>
  );
}