// src/components/world/Player.jsx
import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber'; // useThree 추가
import { useGLTF } from '@react-three/drei';
import { usePlayerControls } from '../../hooks/usePlayerControls';
import * as THREE from 'three';

// 스테이지별 모델 경로 및 재질 설정 (미드저니로 생성한 에셋 경로로 변경해야 함)
const stageAssets = {
    1: { model: '/models/player_sketch.gltf', material: new THREE.MeshBasicMaterial({ color: 0xffffff }) }, // 흰색 바탕, 텍스처는 GLTF에 포함되거나 별도 맵핑
    2: { model: '/models/player_2dlike.gltf', material: new THREE.MeshLambertMaterial({ color: 0x87CEEB }) }, // 스카이블루
    3: { model: '/models/player_2_5d.gltf', material: new THREE.MeshStandardMaterial({ color: 0x90EE90 }) }, // 연두색
    4: { model: '/models/player_3d.gltf', material: new THREE.MeshStandardMaterial({ color: 0x4169E1 }) }, // 로얄블루
    5: { model: '/models/player_3rdperson.gltf', material: new THREE.MeshStandardMaterial({ color: 0x800080 }) }, // 보라색
    6: { model: '/models/player_1stperson.gltf', material: new THREE.MeshStandardMaterial({ color: 0x8B0000 }) }, // 진한 빨강
};

const Player = ({ currentStageId }) => {
    const playerRef = useRef();
    const { moveForward, moveBackward, moveLeft, moveRight } = usePlayerControls(); // 기존 제어 훅
    const { camera } = useThree(); // 카메라 객체에 접근

    // GLTF 모델 로드 (각 스테이지 ID에 따라 동적으로 모델을 로드)
    // useGLTF는 훅이므로 조건부 호출 불가. 미리 모든 모델을 로드하거나, suspense/fallback 사용 고려.
    // 여기서는 간단화를 위해 필요한 모델만 로드하는 것으로 가정 (실제로는 최적화 필요)
    const { scene } = useGLTF(stageAssets[currentStageId].model);

    // 모델에 그림자 설정 (스테이지 4부터)
    useEffect(() => {
        if (currentStageId >= 4 && scene) {
            scene.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
        }
    }, [currentStageId, scene]);


    useFrame(() => {
        if (!playerRef.current) return;

        const speed = 0.1;
        const position = playerRef.current.position;

        // 스테이지별 이동 로직
        if (currentStageId === 3) { // 2.5D 플랫포머: X축 이동만 허용
            if (moveForward) position.x += speed; // 실제 게임에서는 정방향이 x+일수도, x-일수도 있습니다. 확인 필요.
            if (moveBackward) position.x -= speed;
        } else { // 3D 스테이지: 자유로운 이동
            // Z축: 앞/뒤 (Three.js 기본)
            if (moveForward) position.z -= speed;
            if (moveBackward) position.z += speed;
            // X축: 좌/우
            if (moveLeft) position.x -= speed;
            if (moveRight) position.x += speed;
        }

        // 1인칭 시점 (Stage 6)일 경우 카메라를 플레이어 위치로 고정 (또는 플레이어의 머리 위치)
        if (currentStageId === 6) {
            // 카메라 위치를 플레이어의 머리 위에 맞춤 (예시)
            camera.position.set(position.x, position.y + 1.5, position.z);
            // 카메라 회전은 usePlayerControls에서 마우스 움직임으로 제어될 수 있습니다.
            // 여기서는 플레이어의 회전과 카메라를 동기화하는 예시 (직접 구현 필요)
            // camera.rotation.copy(playerRef.current.rotation);
        }
        // 3인칭 시점 (Stage 5) 카메라 로직 (GameScene 또는 별도 CameraControl 훅에서 처리하는 것이 일반적)
        // 여기서는 예시로만 언급
        // if (currentStageId === 5) {
        //     camera.position.lerp(new THREE.Vector3(position.x, position.y + 3, position.z + 5), 0.1);
        //     camera.lookAt(position);
        // }
    });

    // 스테이지별 모델과 재질 적용
    // GLTF 로드 시 재질이 이미 포함되어 있을 수 있으므로, 재질을 직접 지정하는 것은 옵션입니다.
    // GLTF에 포함된 재질을 사용하려면 `nodes`와 `materials`를 적절히 사용해야 합니다.
    const playerMaterial = stageAssets[currentStageId].material;

    return (
        <primitive
            ref={playerRef}
            object={scene} // 로드된 GLTF scene 객체
            position={[0, 0, 0]} // 초기 위치
            // material={playerMaterial} // 필요시 전체 모델에 새로운 재질 적용
        />
    );
};

export default Player;