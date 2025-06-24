// src/scenes/stages/Stage1_Sketch.jsx
import React from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import NpcCharacter from '../../components/world/NpcCharacter';
import VideoBackground from '../../components/world/VideoBackground'; // 스케치 비디오가 있다면 사용

const Stage1_Sketch = () => {
    // Stage 1의 맵 모델 및 텍스처 로드 (미드저니로 생성한 스케치 스타일 에셋)
    const { nodes, materials } = useGLTF('/models/stage1_map_sketch.gltf'); // 예시 경로

    // 스케치 스타일 재질 정의 (또는 GLTF에 포함된 재질 사용)
    const sketchMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff, // 기본 흰색
        map: new THREE.TextureLoader().load('/textures/sketch_paper_texture.jpg'), // 종이 질감 텍스처
        alphaMap: new THREE.TextureLoader().load('/textures/sketch_line_alpha.png'), // 선화 알파 맵 (투명한 선화)
        transparent: true,
    });
    // 또는 Post-processing 셰이더를 통해 전체 장면에 스케치 효과 적용

    return (
        <>
            {/* 스케치 배경 (비디오 또는 이미지) */}
            {/* <VideoBackground videoPath="/videos/sketch_bg.mp4" /> */}
            <mesh geometry={nodes.Stage1Map.geometry} material={sketchMaterial} position={[0, 0, 0]} />

            {/* NPC 캐릭터 (Stage1 스타일로 렌더링될 것임) */}
            <NpcCharacter id="npc_sage1" position={[2, 0, -5]} rotation={[0, Math.PI / 4, 0]} />
            <NpcCharacter id="npc_wanderer1" position={[-3, 0, -2]} rotation={[0, -Math.PI / 6, 0]} />

            {/* 조명 설정 (간단하게) */}
            <ambientLight intensity={0.8} />
            <directionalLight position={[5, 10, 5]} intensity={0.5} />
        </>
    );
};

export default Stage1_Sketch;