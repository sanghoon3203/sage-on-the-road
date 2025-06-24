// src/scenes/stages/Stage2_2DLike.jsx
import React from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import NpcCharacter from '../../components/world/NpcCharacter';
// 2D 이미지 느낌의 배경 컴포넌트 (옵션)
// import FlatImageBackground from '../../components/world/FlatImageBackground';

const Stage2_2DLike = () => {
    // Stage 2의 맵 모델 및 텍스처 로드 (미드저니로 생성한 2D 일러스트 스타일 에셋)
    const { nodes, materials } = useGLTF('/models/stage2_map_2dlike.gltf'); // 예시 경로

    // 2D 일러스트 느낌의 재질 정의 (또는 GLTF에 포함된 재질 사용)
    const flatMaterial = new THREE.MeshLambertMaterial({
        map: new THREE.TextureLoader().load('/textures/2d_illustration_texture.jpg'), // 2D 일러스트 텍스처
    });

    return (
        <>
            {/* 2D 이미지 배경 (필요하다면) */}
            {/* <FlatImageBackground imageUrl="/images/stage2_bg.png" /> */}
            <mesh geometry={nodes.Stage2Map.geometry} material={flatMaterial} position={[0, 0, 0]} />

            {/* NPC 캐릭터 (Stage2 스타일로 렌더링될 것임) */}
            <NpcCharacter id="npc_scholar2" position={[2.5, 0, -3]} rotation={[0, -Math.PI / 8, 0]} />
            <NpcCharacter id="npc_hermit2" position={[-1, 0, 4]} rotation={[0, Math.PI / 2, 0]} />

            {/* 조명 설정 (조금 더 풍부하게) */}
            <ambientLight intensity={0.7} />
            <directionalLight position={[10, 15, 10]} intensity={0.6} />
        </>
    );
};

export default Stage2_2DLike;