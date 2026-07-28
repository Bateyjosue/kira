export type SupportedLanguage = 'en' | 'fr' | 'rw' | 'sw';
export interface IPatient {
    _id?: string;
    name: string;
    phoneWhatsapp: string;
    language: SupportedLanguage;
    dateOfBirth?: string;
    gender?: string;
    doctorId: string;
    isSeeded?: boolean;
    createdAt?: string;
}
