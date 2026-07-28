import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../config/env';
import { MEDICAL_PROMPTS } from '../prompts/medical';

const genAI = env.GEMINI_API_KEY ? new GoogleGenerativeAI(env.GEMINI_API_KEY) : null;

export class GeminiService {
  private static getModel() {
    if (!genAI) return null;
    return genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  }

  static async generateFollowUpQuestions(
    diagnosis: string,
    medications: string,
    dayNumber: number,
    language: string
  ): Promise<{ id: string; questionText: string }[]> {
    const model = this.getModel();
    if (!model) {
      return this.getFallbackQuestions(dayNumber, language);
    }

    try {
      const prompt = MEDICAL_PROMPTS.FOLLOW_UP_GENERATION(diagnosis, medications, dayNumber, language);
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.warn('⚠️ Gemini AI Generation fallback triggered:', error);
    }

    return this.getFallbackQuestions(dayNumber, language);
  }

  static async analyzeResponse(
    diagnosis: string,
    questionAnswers: string
  ): Promise<{
    sentiment: 'positive' | 'neutral' | 'negative' | 'critical';
    hasRedFlag: boolean;
    aiSummary: string;
    redFlagReason?: string;
  }> {
    const model = this.getModel();
    if (!model) {
      return this.getFallbackAnalysis(questionAnswers);
    }

    try {
      const prompt = MEDICAL_PROMPTS.RESPONSE_ANALYSIS(diagnosis, questionAnswers);
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.warn('⚠️ Gemini AI Analysis fallback triggered:', error);
    }

    return this.getFallbackAnalysis(questionAnswers);
  }

  static async generateRecoverySummary(diagnosis: string, responsesHistory: string): Promise<string> {
    const model = this.getModel();
    if (!model) {
      return `Patient diagnosis: ${diagnosis}. Patient has submitted follow-up responses and reports steady status.`;
    }

    try {
      const prompt = MEDICAL_PROMPTS.RECOVERY_SUMMARY(diagnosis, responsesHistory);
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      return `Summary unavailable: Patient with ${diagnosis} completed follow-ups.`;
    }
  }

  private static getFallbackQuestions(dayNumber: number, language: string) {
    if (language === 'rw') {
      return [
        { id: 'q1', questionText: `Mwaramutse, ubu ni umunsi wa ${dayNumber}. Umeze ute uyu munsi?` },
        { id: 'q2', questionText: 'Ufata imiti nkuko muganga yayiguhaye?' },
      ];
    }
    return [
      { id: 'q1', questionText: `Hello, this is Day ${dayNumber} of your recovery. How are you feeling today?` },
      { id: 'q2', questionText: 'Are you taking all your prescribed medications as directed?' },
    ];
  }

  private static getFallbackAnalysis(text: string) {
    const isCritical = /fever|pain|blood|worse|dying|severe|vomit|uruguma|umuriro|kuribwa/i.test(text);
    return {
      sentiment: isCritical ? ('critical' as const) : ('positive' as const),
      hasRedFlag: isCritical,
      aiSummary: isCritical
        ? 'Patient reported alarming symptoms or worsening pain.'
        : 'Patient reports feeling relatively well and taking medication.',
      redFlagReason: isCritical ? 'Reported pain or fever in reply' : undefined,
    };
  }
}
