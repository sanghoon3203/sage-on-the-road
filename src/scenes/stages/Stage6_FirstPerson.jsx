// src/scenes/stages/Stage6_FirstPerson.jsx
import React from 'react';
import * as THREE from 'three';
import { useGLTF, Environment } from '@react-three/drei';
import NpcCharacter from '../../components/world/NpcCharacter';

const Stage6_FirstPerson = () => {
    // Stage 6의 맵 모델 로드 (최고 디테일의 3D 환경 모델)
    const { scene } = useGLTF('/models/stage6_map_firstperson.gltf'); // 예시 경로

    scene.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    return (
        <>
            <Environment preset="studio" background /> {/* 최고 수준의 환경 맵 */}

            <primitive object={scene} position={[0, -0.5, 0]} />

            {/* NPC 캐릭터 (Stage6 스타일로 렌더링될 것임) */}
            <NpcCharacter id="npc_master6" position={[0, 0, -10]} />
            <NpcCharacter id="npc_enlightened6" position={[10, 0, 0]} />

            <ambientLight intensity={0.2} />
            <directionalLight position={[0, 30, 0]} intensity={1.5} castShadow />
            <spotLight position={[-10, 10, -10]} angle={0.5} penumbra={1} intensity={0.8} castShadow />
        </>
    );
};

export default Stage6_FirstPerson;