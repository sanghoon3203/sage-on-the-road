// src/store/useGameStore.js
import { create } from 'zustand';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config'; // db import 추가

const useGameStore = create((set, get) => ({
  user: null,
  gameState: 'title', // 'title', 'playing', 'talking', 'answering'
  stageId: 1,
  stageScore: 0,
  completedNpcs: [], // 완료한 NPC ID 목록
  activeNpc: null,
  attempts: 0,
  dialogue: [],
  currentDialogueIndex: 0,

  // 사용자 설정 (음악 볼륨 등)
  musicVolume: 0.5,

  // 자동 저장 인터벌 ID (내부용)
  _saveInterval: null,

  // --- 게임 상태 관리 함수 (기존) ---
  setUser: (user) => set({ user }),
  setGameState: (state) => {
    set({ gameState: state });
    // 게임 상태 변경 시 (예: 'playing'으로 전환 시) 자동 저장 시작
    if (state === 'playing') {
      get().startAutoSave();
    } else {
      get().stopAutoSave(); // 게임 플레이 중이 아니면 자동 저장 중지
    }
  },
  setStageId: (id) => {
    set({ stageId: id });
    get().saveGameState(); // 스테이지 변경 시 자동 저장
  },
  setStageScore: (score) => {
    set({ stageScore: score });
    // 점수 변경 시 즉시 저장할 필요가 없다면 제외
  },
  addCompletedNpc: (npcId) => {
    set((state) => ({ completedNpcs: [...state.completedNpcs, npcId] }));
    get().saveGameState(); // NPC 완료 시 자동 저장
  },
  setActiveNpc: (npc) => set({ activeNpc: npc }),
  incrementAttempts: () => set((state) => ({ attempts: state.attempts + 1 })),
  setDialogue: (dialogue) => set({ dialogue, currentDialogueIndex: 0 }),
  nextDialogue: () => set((state) => ({ currentDialogueIndex: state.currentDialogueIndex + 1 })),
  setMusicVolume: (volume) => {
    set({ musicVolume: volume });
    get().saveGameState(); // 음악 볼륨 변경 시 저장
  },

  // --- Firestore 연동 함수 (새로운 기능) ---

  // 게임 상태를 Firestore에서 로드
  loadGameState: async (uid) => {
    if (!uid) {
      console.warn("UID is null, cannot load game state.");
      return;
    }
    console.log(`Loading game state for UID: ${uid}`);
    const docRef = doc(db, 'users', uid);
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        set({
          stageId: data.stageId || 1,
          stageScore: data.stageScore || 0,
          completedNpcs: data.completedNpcs || [],
          activeNpc: data.activeNpc || null,
          attempts: data.attempts || 0,
          musicVolume: data.musicVolume !== undefined ? data.musicVolume : 0.5, // 기본값 설정
          // 여기에 Firestore에서 로드할 다른 필드 추가
        });
        console.log("Game state loaded:", data);
      } else {
        console.log("No existing game state found, starting new game and saving initial state.");
        // 새 게임 시작 시 기본 값으로 설정
        set({
          stageId: 1,
          stageScore: 0,
          completedNpcs: [],
          activeNpc: null,
          attempts: 0,
          musicVolume: 0.5,
        });
        // 새 문서 생성 (첫 로그인 시)
        await get().saveGameState(); // 초기 상태 저장
      }
    } catch (error) {
      console.error("Error loading game state:", error);
      // 오류 발생 시에도 기본 상태로 시작할 수 있도록 처리
      set({
        stageId: 1,
        stageScore: 0,
        completedNpcs: [],
        activeNpc: null,
        attempts: 0,
        musicVolume: 0.5,
      });
    }
  },

  // 게임 상태를 Firestore에 저장 (수동 저장 포함)
  saveGameState: async () => {
    const { user, stageId, stageScore, completedNpcs, activeNpc, attempts, musicVolume } = get();
    if (!user || !user.uid) {
      console.warn("No user logged in, cannot save game state.");
      return;
    }

    const gameData = {
      stageId,
      stageScore,
      completedNpcs,
      activeNpc, // 이 필드는 null일 경우 저장하지 않거나 초기화
      attempts,
      musicVolume,
      lastSavedAt: new Date().toISOString(), // ISO 8601 형식으로 저장
    };

    const docRef = doc(db, 'users', user.uid);
    try {
      await setDoc(docRef, gameData, { merge: true }); // merge: true로 기존 필드 유지
      console.log("Game state saved successfully!");
    } catch (error) {
      console.error("Error saving game state:", error);
    }
  },

  // 로그인 상태 변경 감지 및 게임 로드/저장 초기화
  initializeAuthState: () => {
    // onAuthStateChanged는 한 번만 등록하는 것이 좋습니다.
    // 여러 번 호출될 수 있으므로 클린업 함수를 반환합니다.
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        set({ user });
        await get().loadGameState(user.uid); // 로그인 시 게임 상태 로드
        // 게임 상태가 'playing'이라면 자동 저장 시작 (GameScene이나 App에서 처리)
        if (get().gameState === 'playing') {
          get().startAutoSave();
        }
      } else {
        set({ user: null });
        get().stopAutoSave(); // 로그아웃 시 자동 저장 중지
        // 로그아웃 시 Zustand 상태를 초기화할지 결정 (예: set({ ...initialState }))
      }
    });
    return unsubscribe; // 컴포넌트 언마운트 시 구독 해제용
  },

  // 자동 저장 타이머 시작
  startAutoSave: () => {
    const { _saveInterval } = get();
    if (_saveInterval) {
      clearInterval(_saveInterval); // 이미 실행 중인 인터벌이 있다면 클리어
    }
    const newInterval = setInterval(() => {
      console.log("Auto-saving game state...");
      get().saveGameState();
    }, 30000); // 30초마다 저장
    set({ _saveInterval: newInterval });
  },

  // 자동 저장 타이머 중지
  stopAutoSave: () => {
    const { _saveInterval } = get();
    if (_saveInterval) {
      clearInterval(_saveInterval);
      set({ _saveInterval: null });
      console.log("Auto-save stopped.");
    }
  },
}));

export { useGameStore };