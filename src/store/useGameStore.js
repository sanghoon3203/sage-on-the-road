import { create } from 'zustand';
import { getAIEvaluation } from '../api/aiService';

const useGameStore = create((set, get) => ({
  // --- STATE ---
  user: null, // Firebase user object
  gameState: 'title', // 'title', 'loading', 'cutscene', 'walking', 'talking', 'feedback'
  
  // Player & Stage
  stageId: 1,
  stageScore: 0,
  completedNpcs: 0,

  // NPC Interaction
  activeNpc: null,
  attempts: 0,
  dialogue: [], // { speaker, text }
  lastResult: null,

  // --- ACTIONS ---
  setUser: (user) => set({ user }),

  startGame: () => {
    set({ gameState: 'loading' });
    setTimeout(() => {
      set({ gameState: 'cutscene' });
    }, 1500); // 로딩 시간
  },

  finishCutscene: () => set({ gameState: 'walking' }),

  // NPC와 대화 시작
  startEncounter: (npc) => {
    set({
      gameState: 'talking',
      activeNpc: npc,
      attempts: 0,
      dialogue: [
        { speaker: npc.name, text: npc.script },
        { speaker: npc.name, text: npc.mainQuestion },
      ],
    });
  },

  // 플레이어 답변 제출
  submitAnswer: async (answer) => {
    const { activeNpc, dialogue, attempts } = get();
    
    // UI에 플레이어 답변 추가
    const newDialogue = [...dialogue, { speaker: '나', text: answer }];
    set({ dialogue: newDialogue, gameState: 'feedback' });

    // AI 평가 (Mock)
    const result = await getAIEvaluation(answer, activeNpc);
    set({ lastResult: result });
    
    // 잠시 후 결과 처리
    setTimeout(() => {
      if (result.score >= 8.0) {
        // 통과
        set(state => ({
          stageScore: state.stageScore + result.score,
          completedNpcs: state.completedNpcs + 1,
        }));
        get().endEncounter(true);
      } else if (attempts + 1 >= 3) {
        // 3회 실패
        get().endEncounter(false);
      } else {
        // 실패했지만 기회 남음
        set(state => ({
          gameState: 'talking',
          attempts: state.attempts + 1,
          dialogue: [
            ...newDialogue,
            { speaker: activeNpc.name, text: result.feedback },
            { speaker: activeNpc.name, text: "다시 한번 생각해보게. " + activeNpc.mainQuestion },
          ],
        }));
      }
    }, 2500); // 피드백 보여주는 시간
  },

  // 대화 종료
  endEncounter: (isSuccess) => {
    const npcName = get().activeNpc.name;
    const feedbackText = isSuccess 
      ? "깨달음을 얻었습니다." 
      : `${npcName}(이)가 아쉬워하며 길을 떠납니다.`;
      
    set({
      dialogue: [...get().dialogue, { speaker: '시스템', text: feedbackText }],
    });

    setTimeout(() => {
      set({ gameState: 'walking', activeNpc: null, dialogue: [] });
    }, 2000); // 마지막 메시지 보여주는 시간
  },
}));

export default useGameStore;