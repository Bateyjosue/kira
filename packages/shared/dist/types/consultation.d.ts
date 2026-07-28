export interface IMedication {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
}
export interface IConsultation {
    _id?: string;
    patientId: string;
    doctorId: string;
    diagnosis: string;
    medications: IMedication[];
    notes?: string;
    nextVisitDate?: string;
    followUpScheduleDays: number[];
    status: 'active' | 'completed' | 'cancelled';
    isSeeded?: boolean;
    createdAt?: string;
}
