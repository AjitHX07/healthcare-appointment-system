export interface Appointment {
    id: string;
    patientId: number | null;
    doctor: string;
    date: string;
    time: string;
    status: string;
    patientName: string | null;
}


export interface Patient {
    id: number;
    name: string;
    age: number;
    lastVisit: string;
    doctor: string;
    departmentId: number;
}
