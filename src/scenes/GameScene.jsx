// src/scenes/GameScene.jsx
import React, { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrthographicCamera, PerspectiveCamera } from '@react-three/drei';
import { useGameStore } from '../store/useGameStore'; // <--- 수정: 기본 가져오기에서 이름 있는 가져오기로 변경
import Player from '../components/world/Player';
import { DialogueBox } from '../components/ui/DialogueBox'; // <--- 수정: 기본 가져오기에서 이름 있는 가져오기로 변경
import MusicToggle from '../components/ui/MusicToggle';

// 각 스테이지 컴포넌트를 import 합니다.
import Stage1_Sketch from './stages/Stage1_Sketch';
import Stage2_2DLike from './stages/Stage2_2DLike'; // <--- 수정: 경로 './scenes/stages/' -> './stages/'
import Stage3_2_5DPlatformer from './stages/Stage3_2_5DPlatformer'; // <--- 수정
import Stage4_Full3D from './stages/Stage4_Full3D'; // <--- 수정
import Stage5_ThirdPerson from './stages/Stage5_ThirdPerson'; // <--- 수정
import Stage6_FirstPerson from './stages/Stage6_FirstPerson'; // <--- 수정


const GameScene = () => {
    const { stageId, gameState } = useGameStore();

    // stageId에 따라 렌더링할 스테이지 컴포넌트를 결정합니다.
    const CurrentStageComponent = (() => {
        switch (stageId) {
            case 1: return Stage1_Sketch;
            case 2: return Stage2_2DLike;
            case 3: return Stage3_2_5DPlatformer;
            case 4: return Stage4_Full3D;
            case 5: return Stage5_ThirdPerson;
            case 6: return Stage6_FirstPerson;
            default: return Stage1_Sketch; // 기본 스테이지
        }
    })();

    // 스테이지에 따라 다른 카메라 설정을 적용할 수 있습니다.
    // Stage 1, 2는 2D 느낌을 위해 OrthographicCamera (직교 카메라) 사용
    // Stage 3, 4, 5, 6은 3D 느낌을 위해 PerspectiveCamera (원근 카메라) 사용
    const CameraComponent = (stageId <= 2) ? OrthographicCamera : PerspectiveCamera;
    const cameraProps = (stageId <= 2)
        ? { makeDefault: true, zoom: 80, position: [0, 0, 10], near: 1, far: 200 } // 2D 느낌을 위한 직교 카메라
        : { makeDefault: true, fov: 75, near: 0.1, far: 1000, position: [0, 5, 10] }; // 3D 느낌을 위한 원근 카메라

    return (
        <>
            <Canvas shadows={stageId >= 4}> {/* 스테이지 4부터 그림자 활성화 */}
                <CameraComponent {...cameraProps} />
                {/* 스테이지별 환경 및 NPC 렌더링 */}
                <CurrentStageComponent />

                {/* 플레이어는 모든 스테이지에서 존재하되, 스테이지에 따라 모델/렌더링을 내부에서 조정할 수 있습니다. */}
                <Player currentStageId={stageId} />

                {/* 전역 조명 등 (각 스테이지 컴포넌트에서 더 구체적인 조명 설정 가능) */}
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
            </Canvas>
            {gameState === 'talking' && <DialogueBox />}
            <MusicToggle />
        </>
    );
};

export default GameScene;