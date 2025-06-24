// src/scenes/TitleScene.jsx
import React, { useState, useRef } from 'react'; // useRef 추가
import { useGameStore } from '../store/useGameStore';
import { AuthForm } from '../components/ui/AuthForm';
import { Canvas, useFrame, useThree } from '@react-three/fiber'; // useFrame, useThree 추가
import './TitleScene.css';
import { Stars, Plane } from '@react-three/drei'; // OrbitControls 제거
import * as THREE from 'three';
import { motion } from 'framer-motion';

const TitleScene = () => {
  const { user, setGameState } = useGameStore();
  const [authMode, setAuthMode] = useState(null);

  const handleStartGame = () => {
    setGameState('playing');
  };

  // 3D 배경을 위한 요소들
  const BackgroundScene = () => {
    const { camera } = useThree(); // 현재 카메라 인스턴스 가져오기
    const pointsRef = useRef(); // 바닥의 점들을 위한 참조

    // 카메라 자동 회전 로직
    useFrame(() => {
      // 카메라를 Y축 기준으로 서서히 회전시킵니다.
      camera.rotation.y += 0.0005; // 회전 속도 조절
    });

    // 바닥에 표시할 점들의 위치를 생성합니다.
    const createGroundDots = () => {
      const count = 5000; // 점의 개수
      const positions = new Float32Array(count * 3); // x, y, z 좌표
      const size = 50; // 바닥 평면의 절반 크기 (예: -50 ~ 50)

      for (let i = 0; i < count; i++) {
        // x, z 좌표는 무작위로 분포, y 좌표는 바닥 평면과 동일하게 설정
        positions[i * 3] = (Math.random() - 0.5) * size * 2; // -size ~ size
        positions[i * 3 + 1] = -5; // Plane의 Y 위치와 동일
        positions[i * 3 + 2] = (Math.random() - 0.5) * size * 2;
      }
      return positions;
    };

    return (
      <>
        {/* 주변 조명: 장면 전체에 부드러운 빛을 제공 */}
        <ambientLight intensity={0.5} />
        {/* 포인트 조명: 특정 위치에서 나오는 빛, 그림자를 만들 수 있음 */}
        <pointLight position={[10, 10, 10]} />
        {/* 별 효과: 밤하늘처럼 보이게 함 */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />

        {/* 바닥 역할을 할 평면: X축으로 90도 회전하여 수평으로 배치 */}
        <Plane args={[100, 100]} rotation-x={-Math.PI / 2} position={[0, -5, 0]}>
          {/* 재질: 검은색 표준 재질 */}
          <meshStandardMaterial color="black" side={THREE.DoubleSide} /> {/* 바닥 색상을 검정으로 변경 */}
        </Plane>

        {/* 바닥에 표시할 점들 */}
        <points ref={pointsRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={createGroundDots().length / 3}
              array={createGroundDots()}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial size={0.1} color="white" sizeAttenuation={true} /> {/* 점 크기 및 색상 조절 */}
        </points>
      </>
    );
  };

  return (
    <div className="title-scene">
      {/* Three.js 캔버스: 3D 배경을 렌더링 */}
      <Canvas camera={{ fov: 75, position: [0, 0, 15] }}> {/* 초기 카메라 위치 설정 */}
        <BackgroundScene />
      </Canvas>
      {/* 오버레이: 3D 배경 위에 UI 요소를 표시 */}
      <div className="overlay">
        {/* 애니메이션 효과를 위해 motion.div 사용 */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* 타이틀 로고 */}
          <h1 className="logo">길 위의 현자</h1>

          {/* 사용자가 로그인되어 있고, AuthForm이 활성화되지 않은 경우 */}
          {user && !authMode ? (
            <>
              <p className="welcome-message">{user.email}님, 다시 오셨군요.</p>
              <button className="title-button" onClick={handleStartGame}>이어하기</button>
            </>
          ) : (
            // 사용자가 로그인되지 않았거나, AuthForm이 활성화된 경우
            !authMode ? (
              // AuthForm이 활성화되지 않은 초기 상태 (로그인, 회원가입, 옵션 버튼 표시)
              <>
                <button className="title-button" onClick={() => setAuthMode('login')}>로그인</button>
                <button className="title-button" onClick={() => setAuthMode('register')}>회원가입</button>
                <button className="title-button" onClick={() => console.log('옵션 기능은 여기에 구현됩니다.')}>옵션</button>
              </>
            ) : (
              // AuthForm이 활성화된 상태 (로그인 또는 회원가입 폼 표시)
              <AuthForm mode={authMode} onBack={() => setAuthMode(null)} />
            )
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default TitleScene;
