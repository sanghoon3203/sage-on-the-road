// src/scenes/stages/Stage1_Forest.jsx

import React, { useState } from 'react';
import { useFrame } from '@react-three/fiber';   
import { Player } from '../../components/world/Player';
import { NpcCharacter } from '../../components/world/NpcCharacter';
import { usePlayerControls } from '../../hooks/usePlayerControls';
// VideoBackground 컴포넌트를 import 합니다.
import { VideoBackground } from '../../components/world/VideoBackground';

const stage1Npcs = [
  { id: "stoic_01", position: [10, -1, 0], name: "고목나무 노인", script: "인생이란 바람 앞의 등불과도 같지...", philoType: "stoic", mainQuestion: "그대에게 '완벽한 자유'란 무엇인가?" },
  { id: "nihilist_01", position: [25, -1, 0], name: "공허한 그림자", script: "모든 것은 결국 사라질 뿐.", philoType: "nihilist", mainQuestion: "의미가 없다면, 왜 살아가야 하는가?" },
  { id: "realist_01", position: [40, -1, 0], name: "현실적인 상인", script: "세상은 꿈만으로 돌아가지 않아.", philoType: "realist", mainQuestion: "이상과 현실의 괴리는 어떻게 메워야 하나?" },
];

export function Stage1_Forest() {
  const { movement } = usePlayerControls();
  const [worldPositionX, setWorldPositionX] = useState(0);

  useFrame((state, delta) => {
    if (movement.right) setWorldPositionX(pos => pos - 5 * delta);
    if (movement.left) setWorldPositionX(pos => pos + 5 * delta);
  });

  return (
    <>
      {/* 
        VideoBackground 컴포넌트를 씬에 추가합니다.
        public 폴더의 경로를 기준으로 동영상 파일 경로를 지정합니다.
        이 컴포넌트는 실제로는 아무것도 렌더링하지 않지만,
        내부적으로 씬의 배경을 동영상으로 설정합니다.
      */}
      <VideoBackground videoPath="/assets/background_movie/BG_Forest_green.mp4" />

      <group position-x={worldPositionX}>
        {/* 기존의 ParallaxBackground는 주석 처리하거나 삭제합니다. */}
        {/* <ParallaxBackground worldPositionX={worldPositionX} /> */}
        
        {/* 땅 (Ground) */}
        <mesh position-y={-2} rotation-x={-Math.PI / 2}>
          <planeGeometry args={[100, 20]} />
          {/* 땅을 투명하게 만들어서 비디오 배경이 보이게 할 수 있습니다. */}
          <meshStandardMaterial color="#5a8b5a" transparent opacity={0.5} />
        </mesh>

        {/* ... (Player, NpcCharacter, 기타 3D 객체들은 그대로) ... */}
        
        <Player />

        {stage1Npcs.map(npc => (
          <NpcCharacter key={npc.id} npcData={npc} />
        ))}
      </group>
    </>
  );
}