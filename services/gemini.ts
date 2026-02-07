import { GoogleGenerativeAI } from '@google/generative-ai';

// API 키 설정 (여기!)
const GEMINI_API_KEY = "REDACTED_API_KEY";  // ← 여기에 넣기!

export interface TranslationVariant {
  text: string;
  style: string; // "친근한", "따뜻한", "재미있는" 등
}

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  /**
   * 한글 텍스트를 5학년 캐나다 유학생 손자가 좋아할 영어로 번역
   * 3가지 스타일로 제공
   */
  async translateToEnglish(
    koreanText: string,
    retryCount: number = 0
  ): Promise<TranslationVariant[]> {
    try {
      const prompt = `
당신은 한국 할머니/할아버지가 캐나다에 유학 중인 5학년 손자의 블로그에 댓글을 다는 것을 도와주는 번역가입니다.

다음 한글 텍스트를 5학년 캐나다 유학생 손자가 좋아할 만한 영어로 번역해주세요.

요구사항:
- 친근하고 따뜻한 느낌
- 구어체 사용 (격식 없는 일상 대화체)
- 5학년 학생이 이해하기 쉬운 표현
- 이모지 적절히 사용 가능
- 손자가 기뻐할 만한 표현

3가지 다른 스타일로 번역해주세요:
1. 친근한 스타일 - 편안하고 캐주얼한 느낌 (예: "Hey!", "Cool!")
2. 따뜻한 스타일 - 격려와 칭찬이 담긴 느낌 (예: "So proud of you!")
3. 재미있는 스타일 - 활기차고 신나는 느낌 (예: "Awesome!", "That's amazing!")

한글 원문: "${koreanText}"

응답은 반드시 다음 JSON 형식으로만 작성해주세요. 다른 설명이나 텍스트는 포함하지 마세요:
{
  "variants": [
    {"style": "친근한", "text": "번역 내용 1"},
    {"style": "따뜻한", "text": "번역 내용 2"},
    {"style": "재미있는", "text": "번역 내용 3"}
  ]
}
`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      console.log('Gemini 원본 응답:', text);

      // JSON 파싱 시도
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error('JSON을 찾을 수 없습니다. 응답:', text);
        throw new Error('응답에서 JSON을 찾을 수 없습니다');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      if (!parsed.variants || !Array.isArray(parsed.variants)) {
        throw new Error('잘못된 응답 형식입니다');
      }

      return parsed.variants;

    } catch (error) {
      console.error('Gemini API 오류:', error);
      
      // 재시도 로직 (최대 2번)
      if (retryCount < 2) {
        console.log(`재시도 ${retryCount + 1}/2`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return this.translateToEnglish(koreanText, retryCount + 1);
      }

      // 재시도 실패 시 폴백
      console.log('폴백 번역 사용');
      return this.getFallbackTranslations(koreanText);
    }
  }

  /**
   * API 실패 시 사용할 기본 번역
   */
  private getFallbackTranslations(koreanText: string): TranslationVariant[] {
    // 간단한 패턴 기반 번역
    const simple = this.getSimpleTranslation(koreanText);
    
    return [
      {
        style: '친근한',
        text: `Hey! ${simple} 😊`,
      },
      {
        style: '따뜻한',
        text: `Hi there! ${simple} I'm so proud of you! ❤️`,
      },
      {
        style: '재미있는',
        text: `Yo! ${simple} That's awesome! 🎉`,
      },
    ];
  }

  /**
   * 간단한 키워드 기반 번역 (폴백용)
   */
  private getSimpleTranslation(koreanText: string): string {
    const patterns: { [key: string]: string } = {
      '좋아': 'I like it',
      '멋지': 'Cool',
      '재미있': 'Fun',
      '잘했': 'Good job',
      '훌륭': 'Great',
      '대단': 'Amazing',
      '예쁘': 'Beautiful',
      '맛있': 'Delicious',
      '행복': 'Happy',
      '사랑': 'Love',
    };

    for (const [ko, en] of Object.entries(patterns)) {
      if (koreanText.includes(ko)) {
        return en;
      }
    }

    return 'Nice post';
  }

  /**
   * API 키 유효성 확인
   */
  async testConnection(): Promise<boolean> {
    try {
      const result = await this.model.generateContent('Hello, test connection');
      const response = await result.response;
      const text = response.text();
      console.log('연결 테스트 성공:', text);
      return true;
    } catch (error) {
      console.error('Gemini API 연결 실패:', error);
      return false;
    }
  }

  /**
   * 간단한 번역 테스트
   */
  async quickTest(): Promise<string> {
    try {
      const result = await this.model.generateContent(
        'Translate "안녕하세요" to English in a friendly way for a 5th grader.'
      );
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('테스트 실패:', error);
      throw error;
    }
  }
}

// 싱글톤 인스턴스
let geminiService: GeminiService | null = null;

/**
 * Gemini 서비스 초기화
 */
export const initGeminiService = (apiKey: string): GeminiService => {
  if (!apiKey || apiKey.trim() === '') {
    throw new Error('API 키가 필요합니다');
  }
  
  geminiService = new GeminiService(apiKey);
  console.log('Gemini 서비스 초기화 완료');
  return geminiService;
};

/**
 * 초기화된 Gemini 서비스 가져오기
 */
export const getGeminiService = (): GeminiService => {
  if (!geminiService) {
    throw new Error('Gemini 서비스가 초기화되지 않았습니다. 먼저 설정에서 API 키를 입력하세요.');
  }
  return geminiService;
};

/**
 * Gemini 서비스 초기화 여부 확인
 */
export const isGeminiInitialized = (): boolean => {
  return geminiService !== null;
};