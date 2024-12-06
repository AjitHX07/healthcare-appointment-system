import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, forkJoin, map, Observable, of } from 'rxjs';
import { Appointment, } from '../models/appointment';
import { Patient } from '../../patients/models/patient';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {


  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/appointments`).pipe(
      map((appointments) =>
        appointments.map((appointment) => ({
          ...appointment,
          patientName: appointment.patientName || 'Unknown',
        }))
      ),
      catchError(() => {
        console.error('Failed to fetch appointments');
        return of([]);
      })
    );
  }

  getAppointmentsWithPatients(): Observable<Appointment[]> {
    return forkJoin({
      appointments: this.getAppointments(),
      patients: this.http.get<Patient[]>(`${this.apiUrl}/patients`),
    }).pipe(
      map(({ appointments, patients }) =>
        appointments.map((appointment) => {
          const patient = patients.find((p) => p.id === appointment.patientId);
          return {
            ...appointment,
            patientName: patient ? patient.name : 'Unknown', // Proper mapping
          };
        })
      ),
      catchError(() => {
        console.error('Failed to fetch appointments or patients');
        return of([]);
      })
    );
  }


  getAppointmentById(id: string): Observable<Appointment | null> {
    return this.http.get<Appointment>(`${this.apiUrl}/appointments/${id}`).pipe(
      map(appointment => appointment ? {
        ...appointment,
        patientName: appointment.patientName || 'Unknown'
      } : null),
      catchError((error) => {
        console.error('Error fetching appointment', error);
        return of(null);
      })
    );
  }

  getPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${this.apiUrl}/patients`);
  }

  addAppointment(appointment: Appointment): Observable<Appointment> {
    return this.http.post<Appointment>(`${this.apiUrl}/appointments`, appointment);
  }

  updateAppointment(id: string, appointment: Appointment): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.apiUrl}/appointments/${id}`, appointment);
  }

  deleteAppointment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/appointments/${id}`);
  }
}