// src/components/ui/DialogueBox.jsx
import React from 'react';
import { useGameStore } from '../../store/useGameStore'; // <--- 수정: 기본 가져오기에서 이름 있는 가져오기로 변경
import './DialogueBox.css';
import { getAIResponse } from '../../api/aiService';

const DialogueBox = () => {
  const {
    activeNpc,
    dialogue,
    currentDialogueIndex,
    nextDialogue,
    setGameState,
    addCompletedNpc,
    incrementAttempts,
    setDialogue,
    setStageId,
    stageId, // 현재 스테이지 ID 가져오기
  } = useGameStore();

  const currentLine = dialogue[currentDialogueIndex];
  const isLastLine = currentDialogueIndex === dialogue.length - 1;

  const handleNextLine = async () => {
    if (isLastLine) {
      if (activeNpc && activeNpc.startsWith('npc_')) {
        const npcId = activeNpc; // 현재 활성화된 NPC ID

        // NPC별 특별한 로직 추가
        switch (npcId) {
          case 'npc_sage1':
            // 현자와의 대화 종료 시점 (스테이지 1)
            // AI에게 질문을 던지고 답변을 기다립니다.
            const questionSage1 = "세상은 무엇으로 이루어져 있다고 생각하나요? 보이는 것과 보이지 않는 것 중, 무엇이 더 중요하다고 생각하나요?";
            const aiResponseSage1 = await getAIResponse(questionSage1);
            setDialogue([aiResponseSage1]); // AI 답변을 대화로 설정
            useGameStore.getState().setGameState('answering'); // 답변 대기 상태로 전환
            break;
          case 'npc_wanderer1':
            // 방랑자와의 대화 종료 시점 (스테이지 1)
            const questionWanderer1 = "당신이 걸어온 길에서 가장 중요하다고 느낀 것은 무엇이며, 그것은 당신에게 어떤 의미였나요?";
            const aiResponseWanderer1 = await getAIResponse(questionWanderer1);
            setDialogue([aiResponseWanderer1]);
            useGameStore.getState().setGameState('answering');
            break;
          case 'npc_scholar2': // 스테이지 2 NPC 예시
            const questionScholar2 = "지식이 세상을 이해하는 유일한 길이라고 생각하십니까? 아니면 지식 너머에 무언가 더 중요한 것이 존재할까요?";
            const aiResponseScholar2 = await getAIResponse(questionScholar2);
            setDialogue([aiResponseScholar2]);
            useGameStore.getState().setGameState('answering');
            break;
          case 'npc_guardian3': // 스테이지 3 NPC 예시
            const questionGuardian3 = "이 길의 끝에는 무엇이 있을 거라고 생각하십니까? 그 끝이 존재한다면, 그 너머는 어떤 모습일까요?";
            const aiResponseGuardian3 = await getAIResponse(questionGuardian3);
            setDialogue([aiResponseGuardian3]);
            useGameStore.getState().setGameState('answering');
            break;
          case 'npc_guide4': // 스테이지 4 NPC 예시
            const questionGuide4 = "자유는 어떤 형태로 존재한다고 생각하십니까? 그리고 그 자유는 우리에게 어떤 책임을 요구하나요?";
            const aiResponseGuide4 = await getAIResponse(questionGuide4);
            setDialogue([aiResponseGuide4]);
            useGameStore.getState().setGameState('answering');
            break;
          case 'npc_master6': // 스테이지 6 NPC 예시
            const questionMaster6 = "모든 존재가 하나라는 말은 어떤 의미로 다가오십니까? 당신이 현자의 길을 걸으며 깨달은 궁극적인 진실은 무엇입니까?";
            const aiResponseMaster6 = await getAIResponse(questionMaster6);
            setDialogue([aiResponseMaster6]);
            useGameStore.getState().setGameState('answering');
            break;

          default:
            // 일반적인 NPC 대화 종료
            addCompletedNpc(npcId);
            setGameState('playing');
            break;
        }
      } else {
        // AI 답변이거나 일반적인 대화 종료
        setGameState('playing');
        if (activeNpc) { // NPC 대화였다면
          addCompletedNpc(activeNpc);
          // 모든 NPC를 완료했을 때 다음 스테이지로 전환 (예시)
          const completedCount = useGameStore.getState().completedNpcs.length;
          // 이 부분은 게임 디자인에 따라 변경해야 합니다.
          // 예시: 각 스테이지의 특정 NPC를 모두 만났을 때 다음 스테이지로.
          // 여기서는 편의상 2개의 NPC를 완료하면 다음 스테이지로 가정.
          if (completedCount >= (stageId === 1 ? 2 : 2) ) { // 스테이지 1에서 2개, 다른 스테이지도 2개
            if (stageId < 6) { // 마지막 스테이지가 아니라면
              setStageId(stageId + 1);
              // 다음 스테이지 시작 시 activeNpc, completedNpcs 초기화
              useGameStore.getState().setActiveNpc(null);
              useGameStore.getState().completedNpcs = []; // 새로운 스테이지에서 다시 NPC 만나기
            } else {
              console.log("모든 스테이지 완료!");
              // 게임 종료 또는 엔딩 처리
            }
          }
        }
      }
    } else {
      nextDialogue();
    }
  };

  const handleSkipDialogue = () => {
    setGameState('playing');
    if (activeNpc) {
      addCompletedNpc(activeNpc); // 스킵해도 완료 처리
    }
  };

  if (!currentLine) return null;

  return (
    <div className="dialogue-box-overlay">
      <div className="dialogue-box">
        <p>{currentLine}</p>
        <div className="dialogue-buttons">
          <button onClick={handleNextLine}>
            {isLastLine ? '대화 종료 / AI 답변 받기' : '다음'}
          </button>
          <button onClick={handleSkipDialogue}>건너뛰기</button>
        </div>
      </div>
    </div>
  );
};

export default DialogueBox;