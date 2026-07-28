export type FollowUpStatus = 'scheduled' | 'sent' | 'responded' | 'missed';
export interface IFollowUpQuestion {
    id: string;
    questionText: string;
}
export interface IFollowUp {
    _id?: string;
    consultationId: string;
    patientId: string;
    dayNumber: number;
    status: FollowUpStatus;
    questions: IFollowUpQuestion[];
    scheduledAt: string;
    sentAt?: string;
}
export type ResponseSentiment = 'positive' | 'neutral' | 'negative' | 'critical';
export interface IFollowUpAnswer {
    questionId: string;
    questionText: string;
    answerText: string;
}
export interface IFollowUpResponse {
    _id?: string;
    followUpId: string;
    patientId: string;
    answers: IFollowUpAnswer[];
    sentiment: ResponseSentiment;
    aiSummary: string;
    hasRedFlag: boolean;
    respondedAt: string;
}
