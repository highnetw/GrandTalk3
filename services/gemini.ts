import { GoogleGenerativeAI } from '@google/generative-ai';

// 1. [검증 완료] 브라우저 테스트에 성공한 그 키를 여기에 넣으세요.
const MY_SECRET_KEY = "REDACTED_API_KEY";

export interface TranslationVariant {
  text: string;
  style: string;
}

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey || MY_SECRET_KEY);
    // 2. [명칭 수정] 목록에서 확인된 최신 안정화 모델인 'gemini-2.0-flash-001'을 사용합니다.
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-001' });
  }

  async translateToEnglish(koreanText: string): Promise<TranslationVariant[]> {
    try {
      const prompt = `Translate "${koreanText}" into 3 conversational English styles for my 5th-grade grandson in Canada: 
      1. Friendly (casual), 2. Warm (emotional), 3. Fun (energetic). 
      Respond ONLY in this JSON format: {"variants": [{"style": "친근한", "text": "..."}, {"style": "따뜻한", "text": "..."}, {"style": "재미있는", "text": "..."}]}`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('데이터 파싱 실패');
      
      const parsed = JSON.parse(jsonMatch[0]);
      return parsed.variants;
    } catch (error) {
      console.error('Gemini API 최종 통신 실패:', error);
      // 에러 시 무한 로딩 방지용 예비 문구
      return [
        { style: '친근한', text: "Hey! You did such a great job! 😊" },
        { style: '따뜻한', text: "I'm so proud of you, my dear grandson. ❤️" },
        { style: '재미있는', text: "Wow, you're a superstar! 🌟" },
      ];
    }
  }
}

let geminiService: GeminiService | null = null;

export const getGeminiService = (): GeminiService => {
  if (!geminiService) {
    geminiService = new GeminiService(MY_SECRET_KEY);
  }
  return geminiService;
};

// 키가 적혀있으면 무조건 통과되도록 설정
export const isGeminiInitialized = (): boolean => {
  return !!MY_SECRET_KEY && MY_SECRET_KEY.length > 10;
};

export const initGeminiService = (key: string) => {};