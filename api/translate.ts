import { GoogleGenerativeAI } from '@google/generative-ai';

// 이 파일은 Vercel 서버에서만 실행됩니다. 여기서 읽는 GEMINI_API_KEY는
// EXPO_PUBLIC_ 접두사가 없으므로 앱 번들에는 절대 포함되지 않습니다.
const SERVER_KEY = process.env.GEMINI_API_KEY?.trim().replace(/[\r\n]/gm, '');

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!SERVER_KEY) {
    console.error('GEMINI_API_KEY is not set on the server');
    return res.status(500).json({ error: 'Server misconfigured' });
  }

  const { koreanText } = req.body ?? {};
  if (typeof koreanText !== 'string' || koreanText.trim().length === 0) {
    return res.status(400).json({ error: 'koreanText is required' });
  }
  if (koreanText.length > 500) {
    return res.status(400).json({ error: 'koreanText is too long' });
  }

  try {
    const genAI = new GoogleGenerativeAI(SERVER_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite' });

    const prompt = `Translate "${koreanText}" into 3 conversational English styles for my 5th-grade grandson in Canada:
    1. Friendly (casual), 2. Warm (emotional), 3. Fun (energetic).
    Respond ONLY in this JSON format: {"variants": [{"style": "친근한", "text": "..."}, {"style": "따뜻한", "text": "..."}, {"style": "재미있는", "text": "..."}]}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('데이터 파싱 실패');

    const parsed = JSON.parse(jsonMatch[0]);
    return res.status(200).json({ variants: parsed.variants });
  } catch (error) {
    console.error('Gemini API 최종 통신 실패:', error);
    return res.status(502).json({ error: 'Gemini request failed' });
  }
}
