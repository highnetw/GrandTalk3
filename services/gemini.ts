export interface TranslationVariant {
  text: string;
  style: string;
}

export class GeminiService {
  async translateToEnglish(koreanText: string): Promise<TranslationVariant[]> {
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ koreanText }),
      });

      if (!response.ok) throw new Error(`서버 응답 오류: ${response.status}`);

      const data = await response.json();
      return data.variants;
    } catch (error) {
      console.error('번역 서버 통신 실패:', error);
      // 에러 시 무한 로딩 방지용 예비 문구
      return [
        { style: '안내', text: "Gemini가 잠시 쉬고 싶대요. 5초 뒤에 다시 시도해 볼까요? 😊" },
        { style: '안내', text: "방금 문장은 조금 어려웠나? 다시 한번 버튼을 눌러주세요! ✨" },
        { style: '안내', text: "교통 체증이 있네요! 잠시 후에 다시 번역 버튼을 눌러주세요. ❤️" },
      ];
    }
  }
}

let geminiService: GeminiService | null = null;

export const getGeminiService = (): GeminiService => {
  if (!geminiService) {
    geminiService = new GeminiService();
  }
  return geminiService;
};

// 번역은 이제 서버(/api/translate)에서 처리하므로 클라이언트는 항상 준비된 상태입니다.
export const isGeminiInitialized = (): boolean => true;

// 더 이상 클라이언트가 키를 보관하지 않으므로 아무 동작도 하지 않습니다.
export const initGeminiService = (_key: string) => { };
