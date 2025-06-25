import React, { useState, useEffect, useRef } from 'react';
import { Html } from '@react-three/drei';
import { useGameStore } from '../../store/useGameStore';
import DialogueBox from '../../components/ui/DialogueBox'; // DialogueBox import 추가
import '../../components/ui/DialogueBox.css';
import './Stage1_Forest.css';
import MusicToggle from '../../components/ui/MusicToggle';


const mapsData = [
  {
    id: 'forest',
    backgroundImage: '/assets/background_image/stage1_forest_bg.png',
    width: 1000,
    npcs: [{
    id: 'npc_sage1',
    x: 800,
    initialDialogue: [
      "현자: 어서 오게, 길을 걷는 자여.",
      "현자: 이 숲은 깊은 지혜를 품고 있지.",
      "현자: 네 발걸음이 이곳까지 닿은 데는 이유가 있으리라 생각하네.",
      "현자: 혹시 길을 잃은 것은 아닌가?",
      "현자: 아니면, 찾고 있는 것이 있는가?",
      "현자: 삶에서 가장 중요한 것이 무엇이라 생각하는가?",
      "현자: 이 숲 어딘가엔 과거의 나 또한 길을 잃고 방황했지.",
      "현자: 나에게 묻고 싶은 것이 있다면 주저하지 말게나.",
      "현자: 만약 힘든 일이 있다면 언제든 다시 이곳으로 오게.",
      "현자: 자, 이제 네가 나아갈 길을 선택해 보게나.",
    ],
    encounterRange: 100,
  }]
  },
  {
    id: 'river',
    backgroundImage: '/assets/background_image/stage1_forest_bg.png',
    width: 1000,
    npcs: [{
      id: 'npc_sage3',
      x: 800,
      initialDialogue: [
        "현자: 어서 오게, 길을 걷는 자여.",
        "현자: 이 숲은 깊은 지혜를 품고 있지.",
        "현자: 네 발걸음이 이곳까지 닿은 데는 이유가 있으리라 생각하네.",
        "현자: 혹시 길을 잃은 것은 아닌가?",
        "현자: 아니면, 찾고 있는 것이 있는가?",
        "현자: 삶에서 가장 중요한 것이 무엇이라 생각하는가?",
        "현자: 이 숲 어딘가엔 과거의 나 또한 길을 잃고 방황했지.",
        "현자: 나에게 묻고 싶은 것이 있다면 주저하지 말게나.",
        "현자: 만약 힘든 일이 있다면 언제든 다시 이곳으로 오게.",
        "현자: 자, 이제 네가 나아갈 길을 선택해 보게나.",
      ],
      encounterRange: 100,
    }]
  },
  {
    id: 'forest',
    backgroundImage: '/assets/background_image/stage1_forest_bg.png',
    width: 1000,
    npcs: [{
    id: 'npc_sage4',
    x: 800,
    initialDialogue: [
      "현자: 어서 오게, 길을 걷는 자여.",
      "현자: 이 숲은 깊은 지혜를 품고 있지.",
      "현자: 네 발걸음이 이곳까지 닿은 데는 이유가 있으리라 생각하네.",
      "현자: 혹시 길을 잃은 것은 아닌가?",
      "현자: 아니면, 찾고 있는 것이 있는가?",
      "현자: 삶에서 가장 중요한 것이 무엇이라 생각하는가?",
      "현자: 이 숲 어딘가엔 과거의 나 또한 길을 잃고 방황했지.",
      "현자: 나에게 묻고 싶은 것이 있다면 주저하지 말게나.",
      "현자: 만약 힘든 일이 있다면 언제든 다시 이곳으로 오게.",
      "현자: 자, 이제 네가 나아갈 길을 선택해 보게나.",
    ],
    encounterRange: 100,
  }]
  },
  {
    id: 'forest',
    backgroundImage: '/assets/background_image/stage1_forest_bg.png',
    width: 1000,
    npcs: [{
    id: 'npc_sage5',
    x: 800,
    initialDialogue: [
      "현자: 어서 오게, 길을 걷는 자여.",
      "현자: 이 숲은 깊은 지혜를 품고 있지.",
      "현자: 네 발걸음이 이곳까지 닿은 데는 이유가 있으리라 생각하네.",
      "현자: 혹시 길을 잃은 것은 아닌가?",
      "현자: 아니면, 찾고 있는 것이 있는가?",
      "현자: 삶에서 가장 중요한 것이 무엇이라 생각하는가?",
      "현자: 이 숲 어딘가엔 과거의 나 또한 길을 잃고 방황했지.",
      "현자: 나에게 묻고 싶은 것이 있다면 주저하지 말게나.",
      "현자: 만약 힘든 일이 있다면 언제든 다시 이곳으로 오게.",
      "현자: 자, 이제 네가 나아갈 길을 선택해 보게나.",
    ],
    encounterRange: 100,
  }]
  },
  
  // ... 추가 스테이지
];
const totalWidth = mapsData.reduce((sum, map) => sum + map.width, 0);

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
          newX = Math.min(totalWidth, prevX + playerSpeed);
          setIsFacingRight(true);
          moved = true;
        }
  
        if (moved) {
          setBackgroundOffset(-(newX - window.innerWidth / 2));
          // mapOffset 계산해서 npc 충돌 체크
          mapsData.forEach((map, mapIdx) => {
            const mapOffset = mapsData.slice(0, mapIdx).reduce((sum, m) => sum + m.width, 0);
            map.npcs.forEach((npc) => {
              const npcWorldX = mapOffset + npc.x;
              if (!completedNpcs.includes(npc.id) && currentNpcEncountered !== npc.id) {
                const distance = Math.abs(newX - npcWorldX);
                if (distance < npc.encounterRange) {
                  setDialogue(npc.initialDialogue);
                  setActiveNpc(npc.id);
                  setCurrentNpcEncountered(npc.id);
                  setGameState('talking');
                  cancelAnimationFrame(gameLoopRef.current);
                }
              }
            });
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
    <>
      {/* 게임 스테이지 화면 */}
      <Html fullscreen>
        <div
          className="world-container"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: `${totalWidth}px`,
            height: '100vh',
            overflow: 'hidden',
          }}
        >
          <MusicToggle />

          {/* 구간별로 map 반복 */}
          {mapsData.reduce((acc, map, idx) => {
            const leftOffset = mapsData.slice(0, idx).reduce((sum, m) => sum + m.width, 0);
            acc.push(
              <div
                key={map.id}
                className="map-section"
                style={{
                  position: 'absolute',
                  left: `${leftOffset + backgroundOffset}px`,
                  top: 0,
                  width: `${map.width}px`,
                  height: '100vh',
                  backgroundImage: `url(${map.backgroundImage})`,
                  backgroundRepeat: 'repeat-x',
                  backgroundSize: 'cover',
                  zIndex: 1,
                }}
              >
                {/* NPC들도 map 반복 */}
                {map.npcs.map(npc => (
                  <div
                    key={npc.id}
                    className={`npc-character`}
                    style={{ left: `${npc.x}px`, bottom: '50px' }}
                  >
                    <img src={`/images/${npc.id}.png`} alt={npc.id} />
                    {/* 이름 태그 등 추가 */}
                  </div>
                ))}
              </div>
            );
            return acc;
          }, [])}

          {/* 플레이어 캐릭터 */}
          <div
            className={`player ${isMoving ? 'moving' : ''} ${isFacingRight ? 'face-right' : 'face-left'}`}
            style={{
              position: 'absolute',
              left: `${playerPositionX + backgroundOffset}px`,
              bottom: '50px',
              zIndex: 10,
            }}
          />

          {/* DialogueBox 등 */}
          {(gameState === 'talking' || gameState === 'answering') && <DialogueBox />}
        </div>
      </Html>

    </>
  );
};

export default Stage1_Forest;