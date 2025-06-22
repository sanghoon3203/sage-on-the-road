// AI 응답을 시뮬레이션합니다. 실제로는 백엔드에 요청을 보내야 합니다.
export const getAIEvaluation = (answer, npc) => {
  console.log(`AI 평가 요청: [${npc.name}]에게 [${answer}] 라고 답변함`);

  return new Promise(resolve => {
    setTimeout(() => {
      // 50% 확률로 통과/실패를 시뮬레이션
      if (Math.random() > 0.5) {
        const score = 8.0 + Math.random() * 2.0; // 8.0 ~ 10.0
        resolve({
          score: parseFloat(score.toFixed(1)),
          feedback: "훌륭한 통찰입니다. 당신의 생각에서 깊이가 느껴지는군요."
        });
      } else {
        const score = 5.0 + Math.random() * 2.9; // 5.0 ~ 7.9
        resolve({
          score: parseFloat(score.toFixed(1)),
          feedback: "흥미로운 생각이지만, 핵심을 조금 벗어난 것 같습니다."
        });
      }
    }, 1500); // AI가 생각하는 시간 시뮬레이션
  });
};