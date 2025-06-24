import React, { useState, useEffect, useRef } from 'react';
import { Html } from '@react-three/drei'; // 이 import가 필요합니다
import { useGameStore } from '../../store/useGameStore';
import '../../components/ui/DialogueBox.css';
import './Stage1_Forest.css';

const npcsData = [
  {
    id: 'npc_sage1',
    x: 800,
    initialDialogue: [
      "현자: 어서 오게, 길을 걷는 자여.",
      "현자: 이 숲은 깊은 지혜를 품고 있지.",
      "현자: 무엇을 찾고 있는가?",
    ],
    encounterRange: 100,
  },
  {
    id: 'npc_wanderer1',
    x: 2000,
    initialDialogue: [
      "방랑자: 흐음... 여기는 오랜만에 오는군.",
      "방랑자: 길은 언제나 새로운 것을 보여주지.",
      "방랑자: 자네는 어떤 길을 택할 텐가?",
    ],
    encounterRange: 100,
  },
];

const Stage1_Forest = () => {
  const {
    gameState,
    setGameState,
    setDialogue,
    setActiveNpc,
    completedNpcs,
    addCompletedNpc,
    activeNpc,
  } = useGameStore();

  const [playerPositionX, setPlayerPositionX] = useState(0);
  const [backgroundOffset, setBackgroundOffset] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [isFacingRight, setIsFacingRight] = useState(true);
  const [currentNpcEncountered, setCurrentNpcEncountered] = useState(null);

  const stageWidth = 3000;
  const playerSpeed = 5;
  const gameLoopRef = useRef(null);
  const keysPressed = useRef({});

  // 키보드 이벤트 핸들러
  useEffect(() => {
    const handleKeyDown = (e) => {
      keysPressed.current[e.key] = true;
      setIsMoving(true);
    };

    const handleKeyUp = (e) => {
      delete keysPressed.current[e.key];
      if (!keysPressed.current['ArrowLeft'] && !keysPressed.current['ArrowRight']) {
        setIsMoving(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // 게임 루프
  useEffect(() => {
    if (gameState !== 'playing') {
      cancelAnimationFrame(gameLoopRef.current);
      return;
    }

    const gameLoop = () => {
      setPlayerPositionX((prevX) => {
        let newX = prevX;
        let moved = false;

        if (keysPressed.current['ArrowLeft']) {
          newX = Math.max(0, prevX - playerSpeed);
          setIsFacingRight(false);
          moved = true;
        }
        if (keysPressed.current['ArrowRight']) {
          newX = Math.min(stageWidth, prevX + playerSpeed);
          setIsFacingRight(true);
          moved = true;
        }

        if (moved) {
          const viewportWidth = window.innerWidth * 0.5;
          setBackgroundOffset(-(newX - viewportWidth));
          
          npcsData.forEach((npc) => {
            if (!completedNpcs.includes(npc.id) && currentNpcEncountered !== npc.id) {
              const distance = Math.abs(newX - npc.x);
              if (distance < npc.encounterRange) {
                setDialogue(npc.initialDialogue);
                setActiveNpc(npc.id);
                setCurrentNpcEncountered(npc.id);
                setGameState('talking');
                cancelAnimationFrame(gameLoopRef.current);
              }
            }
          });
        }
        return newX;
      });
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameState, setDialogue, setActiveNpc, completedNpcs, currentNpcEncountered, setGameState]);

  return (
    <Html>
      <div className="stage1-forest-container" style={{ backgroundPositionX: `${backgroundOffset}px` }}>
        <div
          className={`player ${isMoving ? 'moving' : ''} ${isFacingRight ? 'face-right' : 'face-left'}`}
        ></div>

        {npcsData.map((npc) => (
          <div
            key={npc.id}
            className={`npc-character ${completedNpcs.includes(npc.id) ? 'completed' : ''}`}
            style={{
              left: `${npc.x + backgroundOffset}px`,
            }}
          >
            <img src={`/images/${npc.id}.png`} alt={npc.id} />
            {gameState === 'playing' && Math.abs(playerPositionX - npc.x) < 200 && !completedNpcs.includes(npc.id) && (
              <div className="npc-name-tag">{npc.id.split('_')[1]}</div>
            )}
          </div>
        ))}
      </div>
    </Html>
  );
};

export default Stage1_Forest;