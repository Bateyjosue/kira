"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiService = void 0;
const generative_ai_1 = require("@google/generative-ai");
const env_1 = require("../config/env");
const medical_1 = require("../prompts/medical");
const genAI = env_1.env.GEMINI_API_KEY ? new generative_ai_1.GoogleGenerativeAI(env_1.env.GEMINI_API_KEY) : null;
class GeminiService {
    static getModel() {
        if (!genAI)
            return null;
        return genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    }
    static async generateFollowUpQuestions(diagnosis, medications, dayNumber, language) {
        const model = this.getModel();
        if (!model) {
            return this.getFallbackQuestions(dayNumber, language);
        }
        try {
            const prompt = medical_1.MEDICAL_PROMPTS.FOLLOW_UP_GENERATION(diagnosis, medications, dayNumber, language);
            const result = await model.generateContent(prompt);
            const text = result.response.text();
            const jsonMatch = text.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
        }
        catch (error) {
            console.warn('⚠️ Gemini AI Generation fallback triggered:', error);
        }
        return this.getFallbackQuestions(dayNumber, language);
    }
    static async analyzeResponse(diagnosis, questionAnswers) {
        const model = this.getModel();
        if (!model) {
            return this.getFallbackAnalysis(questionAnswers);
        }
        try {
            const prompt = medical_1.MEDICAL_PROMPTS.RESPONSE_ANALYSIS(diagnosis, questionAnswers);
            const result = await model.generateContent(prompt);
            const text = result.response.text();
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
        }
        catch (error) {
            console.warn('⚠️ Gemini AI Analysis fallback triggered:', error);
        }
        return this.getFallbackAnalysis(questionAnswers);
    }
    static async generateRecoverySummary(diagnosis, responsesHistory) {
        const model = this.getModel();
        if (!model) {
            return `Patient diagnosis: ${diagnosis}. Patient has submitted follow-up responses and reports steady status.`;
        }
        try {
            const prompt = medical_1.MEDICAL_PROMPTS.RECOVERY_SUMMARY(diagnosis, responsesHistory);
            const result = await model.generateContent(prompt);
            return result.response.text();
        }
        catch (error) {
            return `Summary unavailable: Patient with ${diagnosis} completed follow-ups.`;
        }
    }
    static getFallbackQuestions(dayNumber, language) {
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
    static getFallbackAnalysis(text) {
        const isCritical = /fever|pain|blood|worse|dying|severe|vomit|uruguma|umuriro|kuribwa/i.test(text);
        return {
            sentiment: isCritical ? 'critical' : 'positive',
            hasRedFlag: isCritical,
            aiSummary: isCritical
                ? 'Patient reported alarming symptoms or worsening pain.'
                : 'Patient reports feeling relatively well and taking medication.',
            redFlagReason: isCritical ? 'Reported pain or fever in reply' : undefined,
        };
    }
}
exports.GeminiService = GeminiService;
