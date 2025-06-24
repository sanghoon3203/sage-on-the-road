// src/scenes/TitleScene.jsx
import React, { useState } from 'react';
import { useGameStore } from '../store/useGameStore'; // <--- 수정: 기본 가져오기에서 이름 있는 가져오기로 변경
import AuthForm from '../components/ui/AuthForm';
import './TitleScene.css';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Plane } from '@react-three/drei';
import * as THREE from 'three';

const TitleScene = () => {
  const { user, setGameState } = useGameStore(); // <--- 수정: useGameStore는 이름 있는 가져오기

  const handleStartGame = () => {
    setGameState('playing');
  };

  // 3D 배경을 위한 간단한 요소들
  const BackgroundScene = () => (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
      <Plane args={[100, 100]} rotation-x={-Math.PI / 2} position={[0, -5, 0]}>
        <meshStandardMaterial color="darkgrey" side={THREE.DoubleSide} />
      </Plane>
      <OrbitControls />
    </>
  );

  return (
    <div className="title-scene">
      <Canvas>
        <BackgroundScene />
      </Canvas>
      <div className="overlay">
        <h1>길속위의 현자</h1>
        {!user ? (
          <AuthForm />
        ) : (
          <button onClick={handleStartGame} className="start-game-button">
            게임 시작
          </button>
        )}
      </div>
    </div>
  );
};

export default TitleScene;