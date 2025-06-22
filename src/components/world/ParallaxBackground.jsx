// src/components/world/ParallaxBackground.jsx
import React, { useRef } from 'react';
import { useFrame } from '@react-three-fiber';
import { Plane, useTexture } from '@react-three/drei';

// 각 배경 레이어를 렌더링하는 컴포넌트
function BackgroundLayer({ texturePath, speed, worldPositionX }) {
  const texture = useTexture(texturePath);
  const meshRef = useRef();

  // useFrame을 사용하면 매 프레임마다 코드를 실행할 수 있습니다.
  useFrame(() => {
    if (meshRef.current) {
      // 월드의 움직임(worldPositionX)에 speed를 곱하여 각 레이어의 위치를 독립적으로 조절합니다.
      // speed가 작을수록 멀리 있는 것처럼 천천히 움직입니다.
      meshRef.current.position.x = -worldPositionX * speed;
    }
  });

  return (
    // Plane은 2D 평면을 만드는 데 사용됩니다.
    <Plane ref={meshRef} args={[40, 20]}>
      {/* 
        transparent={true}를 설정해야 png 파일의 투명한 부분이 제대로 보입니다.
        map={texture}를 통해 이미지를 입힙니다.
      */}
      <meshBasicMaterial map={texture} transparent={true} />
    </Plane>
  );
}

// 여러 배경 레이어를 관리하는 메인 컴포넌트
export function ParallaxBackground({ worldPositionX }) {
  // 배경 레이어 설정. 멀리 있는 것부터 순서대로 배치합니다.
  const layers = [
    // z 위치가 음수일수록 뒤에 배치됩니다. speed가 작을수록 느리게 움직입니다.
    { path: '/assets/backgrounds/sky.png', z: -20, speed: 0.1 },
    { path: '/assets/backgrounds/far-mountains.png', z: -15, speed: 0.3 },
    { path: '/assets/backgrounds/trees-back.png', z: -10, speed: 0.6 },
    { path: '/assets/backgrounds/trees-front.png', z: -5, speed: 0.8 },
  ];

  return (
    // 그룹으로 묶어서 한 번에 관리합니다.
    <group>
      {layers.map((layer, index) => (
        <group key={index} position-z={layer.z}>
          <BackgroundLayer
            texturePath={layer.path}
            speed={layer.speed}
            worldPositionX={worldPositionX}
          />
        </group>
      ))}
    </group>
  );
}