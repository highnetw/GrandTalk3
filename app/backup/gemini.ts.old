import { GoogleGenerativeAI } from '@google/generative-ai';

// API 키
const GEMINI_API_KEY = "AIzaSyBF0UpNGwzvMvQ3hOAhVkzNtxrY1SAEdmA";

export interface TranslationVariant {
  text: string;
  style: string;
}

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(apiKey: string) {
    console.log('🔧 Gemini 초기화...');
    this.genAI = new GoogleGenerativeAI(apiKey);
    
    // ✅ v1 API 사용 (v1beta가 아님)
    this.model = this.genAI.getGenerativeModel({ 
      model: 'gemini-pro'  
    });
    
    console.log('✅ 모델: gemini-pro');
  }

  async translateToEnglish(koreanText: string): Promise<TranslationVariant[]> {
    try {
      console.log('🌐 번역 시작:', koreanText);

      const prompt = `Translate this Korean to English for an 11-year-old grandson's blog:

"${koreanText}"

Give exactly 3 different styles. Reply ONLY with JSON, no other text:

{"translations":[{"style":"Friendly","text":"translation 1"},{"style":"Warm","text":"translation 2"},{"style":"Fun","text":"translation 3"}]}`;

      console.log('📤 API 호출...');
      
      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      
      console.log('📥 응답:', text);

      let cleaned = text.trim()
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();
      
      const parsed = JSON.parse(cleaned);
      
      if (parsed.translations && parsed.translations.length >= 3) {
        console.log('✅ 번역 성공!');
        
        // 한국어 스타일명으로 변경
        return [
          { style: '친근한', text: parsed.translations[0].text },
          { style: '따뜻한', text: parsed.translations[1].text },
          { style: '재미있는', text: parsed.translations[2].text }
        ];
      }
      
      throw new Error('JSON 파싱 실패');
      
    } catch (error: any) {
      console.error('❌ 번역 실패:', error.message);
      
      // 심플한 폴백
      return [
        { style: '친근한', text: 'Hey! Great job! 😊' },
        { style: '따뜻한', text: "I'm so proud of you! ❤️" },
        { style: '재미있는', text: "That's awesome! 🎉" }
      ];
    }
  }
}

let geminiService: GeminiService | null = null;

export const initGeminiService = (apiKey: string): GeminiService => {
  console.log('🎬 초기화');
  geminiService = new GeminiService(apiKey);
  return geminiService;
};

export const getGeminiService = (): GeminiService => {
  if (!geminiService) {
    throw new Error('초기화 필요');
  }
  return geminiService;
};

export const isGeminiInitialized = (): boolean => {
  return geminiService !== null;
};

// 자동 초기화
if (GEMINI_API_KEY) {
  console.log('🚀 자동 초기화');
  initGeminiService(GEMINI_API_KEY);
}