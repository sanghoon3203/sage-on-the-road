// src/components/world/NpcCharacter.jsx
import React, { useRef, useState, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useGameStore } from '../../store/useGameStore';
import * as THREE from 'three'; // THREE import 추가

// NPC 데이터 (각 스테이지별 NPC 모델과 대화 내용을 정의)
// 실제로는 별도의 JSON 파일 등에서 관리하는 것이 좋습니다.
const npcData = {
    npc_sage1: {
        dialogues: [
            "현자의 길을 걷는 자여, 세상은 그대의 시야에 따라 다르게 보일지니.",
            "첫 발걸음은 스케치와 같으니, 모든 것이 형태만으로 존재하네.",
        ],
        stageSpecificModel: {
            1: '/models/npc_sage_sketch.gltf',
            // 다른 스테이지에서 이 NPC가 등장한다면 여기에 추가
        },
        material: new THREE.MeshBasicMaterial({ color: 0xADD8E6 }) // Light Blue
    },
    npc_wanderer1: {
        dialogues: [
            "세상아, 나를 깨우쳐라.",
            "아직은 흐릿하지만, 곧 명확해지리라 믿는다."
        ],
        stageSpecificModel: {
            1: '/models/npc_wanderer_sketch.gltf',
        },
        material: new THREE.MeshBasicMaterial({ color: 0xFFD700 }) // Gold
    },
    npc_scholar2: {
        dialogues: [
            "지식은 세상을 두텁게 하는 색깔과 같으니.",
            "이곳은 아직 평면적이지만, 그 속엔 깊이가 숨어있네."
        ],
        stageSpecificModel: {
            2: '/models/npc_scholar_2dlike.gltf',
        },
        material: new THREE.MeshLambertMaterial({ color: 0x98FB98 }) // Pale Green
    },
    // ... 나머지 NPC 데이터
    npc_guardian3: {
        dialogues: [
            "이 길을 따라 나아가라. 보이는 것만이 전부가 아니다.",
            "깊이를 탐험할 준비가 되었는가?"
        ],
        stageSpecificModel: {
            3: '/models/npc_guardian_2_5d.gltf',
        },
        material: new THREE.MeshStandardMaterial({ color: 0xDA70D6 }) // Orchid
    },
    npc_guide4: {
        dialogues: [
            "자유롭게 탐험하라, 현자의 길은 넓고도 깊으니.",
            "이제 세상은 온전히 그대의 것이다."
        ],
        stageSpecificModel: {
            4: '/models/npc_guide_3d.gltf',
        },
        material: new THREE.MeshStandardMaterial({ color: 0xFFA07A }) // Light Salmon
    },
    npc_master6: {
        dialogues: [
            "모든 것은 하나이고, 하나는 모든 것이다.",
            "세상의 모든 선명함이 그대 안에 있노라."
        ],
        stageSpecificModel: {
            6: '/models/npc_master_1stperson.gltf',
        },
        material: new THREE.MeshStandardMaterial({ color: 0x6A5ACD }) // Slate Blue
    },
};

const NpcCharacter = ({ id, position, rotation = [0, 0, 0] }) => {
    const npcRef = useRef();
    const { setGameState, setActiveNpc, setDialogue, stageId } = useGameStore();
    const [modelLoaded, setModelLoaded] = useState(false);

    // 현재 스테이지에 맞는 NPC 모델 경로 가져오기
    const currentNpcData = npcData[id];
    const modelPath = currentNpcData?.stageSpecificModel?.[stageId];
    const material = currentNpcData?.material;

    // useGLTF 훅은 조건부 호출이 불가능하므로, modelPath가 있을 때만 로드 시도
    let gltf = null;
    try {
        if (modelPath) {
            gltf = useGLTF(modelPath);
        }
    } catch (e) {
        console.error(`Error loading GLTF for ${id} on stage ${stageId}:`, e);
        gltf = null; // 로드 실패 시 gltf를 null로 설정
    }

    // 모델 로드 후 그림자 설정
    useEffect(() => {
        if (gltf?.scene && stageId >= 4) { // 스테이지 4부터 그림자 활성화
            gltf.scene.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            setModelLoaded(true);
        } else if (gltf?.scene) {
            setModelLoaded(true); // GLTF가 로드되면 설정
        }
    }, [gltf, stageId]);


    const handleNpcClick = () => {
        if (currentNpcData) {
            setActiveNpc(id);
            setDialogue(currentNpcData.dialogues);
            setGameState('talking');
        }
    };

    if (!modelLoaded || !gltf || !gltf.scene) {
        return null; // 모델이 로드되지 않았거나 존재하지 않으면 렌더링하지 않음
    }

    return (
        <primitive
            object={gltf.scene.clone()} // 각 NPC가 독립적인 인스턴스를 가지도록 clone() 사용
            ref={npcRef}
            position={position}
            rotation={rotation}
            onClick={handleNpcClick}
            // material={material} // 필요시 전체 모델에 새로운 재질 적용
            // GLTF 모델에 이미 재질이 포함되어 있다면 이 부분을 제거하거나 조절해야 합니다.
        />
    );
};

export default NpcCharacter;