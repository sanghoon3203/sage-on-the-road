// src/components/world/Player.jsx
import React, { useRef, useEffect } from 'react';
import { useFrame, useThree, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { usePlayerControls } from '../../hooks/usePlayerControls';
import * as THREE from 'three';

const Player = ({ currentStageId }) => {
    const playerRef = useRef();
    const { moveForward, moveBackward, moveLeft, moveRight } = usePlayerControls();
    const { camera } = useThree();

    // PNG 텍스처 로드 (GLTF 대신)
    const texture = useLoader(TextureLoader, '/assets/models/player.png');

    useFrame(() => {
        if (!playerRef.current) return;

        const speed = 0.1;
        const position = playerRef.current.position;

        // 스테이지별 이동 로직
        if (currentStageId === 3) {
            if (moveForward) position.x += speed;
            if (moveBackward) position.x -= speed;
        } else {
            if (moveForward) position.z -= speed;
            if (moveBackward) position.z += speed;
            if (moveLeft) position.x -= speed;
            if (moveRight) position.x += speed;
        }

        if (currentStageId === 6) {
            camera.position.set(position.x, position.y + 1.5, position.z);
        }
    });

    return (
        <mesh ref={playerRef} position={[0, 0.75, 0]} rotation={[0, Math.PI, 0]}>
            {/* Plane 비율은 이미지 비율에 따라 조정 가능 */}
            <planeGeometry args={[1, 1.5]} />
            <meshBasicMaterial map={texture} transparent={true} />
        </mesh>
    );
};

export default Player;
