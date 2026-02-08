import { GoogleGenerativeAI } from '@google/generative-ai';

// API 키 (실제 키로 교체)
const GEMINI_API_KEY = "REDACTED_API_KEY";

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
    
    // ✅ 작동하는 모델명
    this.model = this.genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.9,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
      }
    });
    
    console.log('✅ 모델 준비 완료');
  }

  async translateToEnglish(koreanText: string): Promise<TranslationVariant[]> {
    try {
      console.log('🌐 번역 시작:', koreanText);

      const prompt = `You are helping a Korean grandparent write English comments for their 5th-grade grandson's blog in Canada.

Translate this Korean text to natural English:
"${koreanText}"

Create 3 different style variations that an 11-year-old would enjoy reading.

RESPOND IN THIS EXACT JSON FORMAT (no markdown, no backticks):
{"translations":[{"style":"Friendly","text":"English translation here"},{"style":"Warm","text":"English translation here"},{"style":"Fun","text":"English translation here"}]}`;

      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      
      console.log('📥 원본 응답:', text);

      // JSON 파싱
      let cleaned = text.trim();
      
      // 마크다운 제거
      cleaned = cleaned.replace(/```json\s*/g, '');
      cleaned = cleaned.replace(/```\s*/g, '');
      cleaned = cleaned.trim();
      
      console.log('🧹 정리된 응답:', cleaned);
      
      const parsed = JSON.parse(cleaned);
      
      if (parsed.translations && Array.isArray(parsed.translations) && parsed.translations.length >= 3) {
        console.log('✅ 번역 성공:', parsed.translations.length, '개');
        return parsed.translations.map((t: any) => ({
          style: t.style || 'Default',
          text: t.text || 'Translation failed'
        }));
      }
      
      throw new Error('번역 배열 없음');
      
    } catch (error: any) {
      console.error('❌ 번역 실패:', error.message);
      console.error('상세:', error);
      
      // 폴백 번역
      return [
        {
          style: 'Friendly',
          text: `Hey! That's really great! Keep up the good work! 😊`
        },
        {
          style: 'Warm',
          text: `Hi there! I'm so proud of you! You're doing wonderfully! ❤️`
        },
        {
          style: 'Fun',
          text: `Yo! That's awesome! You're amazing! Keep it up! 🎉`
        }
      ];
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      console.log('🧪 연결 테스트...');
      const result = await this.model.generateContent('Say hello');
      const response = result.response;
      const text = response.text();
      console.log('✅ 연결 성공:', text);
      return true;
    } catch (error) {
      console.error('❌ 연결 실패:', error);
      return false;
    }
  }
}

// 싱글톤
let geminiService: GeminiService | null = null;

export const initGeminiService = (apiKey: string): GeminiService => {
  console.log('🎬 서비스 초기화');
  geminiService = new GeminiService(apiKey);
  return geminiService;
};

export const getGeminiService = (): GeminiService => {
  if (!geminiService) {
    throw new Error('Gemini 서비스가 초기화되지 않았습니다');
  }
  return geminiService;
};

export const isGeminiInitialized = (): boolean => {
  return geminiService !== null;
};

// 자동 초기화
if (GEMINI_API_KEY && GEMINI_API_KEY !== "REDACTED_API_KEY") {
  try {
    console.log('🚀 자동 초기화 시작');
    initGeminiService(GEMINI_API_KEY);
  } catch (error) {
    console.error('❌ 자동 초기화 실패:', error);
  }
}
