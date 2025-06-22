// src/scenes/GameScene.jsx

import { Canvas } from '@react-three/fiber';
import useGameStore from '../store/useGameStore';
import { Stage1_Forest } from './stages/Stage1_Forest';
// import { Stage2_Sea } from './stages/Stage2_Sea'; // 다음 스테이지

export function GameScene() {
  const { gameState, stageId } = useGameStore();

  const renderStage = () => {
    switch (stageId) {
      case 1:
        return <Stage1_Forest />;
      // case 2:
      //   return <Stage2_Sea />;
      default:
        return <Stage1_Forest />;
    }
  };

  if (gameState === 'loading') {
    return <div className="loading-screen">여정을 준비하는 중...</div>;
  }

  if (gameState === 'cutscene') {
    // 실제 컷씬 컴포넌트를 만들 수 있습니다. 여기서는 간단히 텍스트로 대체
    return <div className="cutscene-screen">눈을 비비자 숲 속이다...</div>;
  }
  
  return (
    <Canvas camera={{ fov: 75, position: [0, 0, 10] }}>
      {/* 
        ambient_light -> ambientLight 로 수정 
        Three.js의 AmbientLight 클래스에 해당합니다.
      */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      {renderStage()}
    </Canvas>
  );
}