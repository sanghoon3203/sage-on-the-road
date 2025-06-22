import React, { useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Player } from '../../components/world/Player';
import { NpcCharacter } from '../../components/world/NpcCharacter';
import { usePlayerControls } from '../../hooks/usePlayerControls';

// 가상 NPC 데이터
const stage1Npcs = [
  { id: "stoic_01", position: [10, 0, 0], name: "고목나무 노인", script: "인생이란 바람 앞의 등불과도 같지...", philoType: "stoic", mainQuestion: "그대에게 '완벽한 자유'란 무엇인가?" },
  { id: "nihilist_01", position: [25, 0, 0], name: "공허한 그림자", script: "모든 것은 결국 사라질 뿐.", philoType: "nihilist", mainQuestion: "의미가 없다면, 왜 살아가야 하는가?" },
  { id: "realist_01", position: [40, 0, 0], name: "현실적인 상인", script: "세상은 꿈만으로 돌아가지 않아.", philoType: "realist", mainQuestion: "이상과 현실의 괴리는 어떻게 메워야 하나?" },
];

export function Stage1_Forest() {
  const { movement } = usePlayerControls();
  const [worldPositionX, setWorldPositionX] = useState(0);

  useFrame((state, delta) => {
    // 키보드 입력에 따라 월드를 스크롤
    if (movement.right) setWorldPositionX(pos => pos - 5 * delta);
    if (movement.left) setWorldPositionX(pos => pos + 5 * delta);
  });

  return (
    <group position-x={worldPositionX}>
      {/* 배경 */}
      <mesh position-z={-10} scale={[100, 20, 1]}>
        <planeGeometry />
        <meshBasicMaterial color="#a2d2a2" />
      </mesh>
      {/* 땅 */}
      <mesh position-y={-2} rotation-x={-Math.PI / 2} scale={[100, 20, 1]}>
        <planeGeometry />
        <meshBasicMaterial color="#5a8b5a" />
      </mesh>
      
      <Player />

      {stage1Npcs.map(npc => (
        <NpcCharacter key={npc.id} npcData={npc} />
      ))}
    </group>
  );
}