import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, forkJoin, map, Observable, of } from 'rxjs';
import { Appointment, } from '../models/appointment';
import { Patient } from '../../patients/models/patient';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {


  private apiUrl = environment.url;

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
      patients: this.getPatients(),
    }).pipe(
      map(({ appointments, patients }) =>
        appointments.map((appointment) => {
          const patient = appointment.patientId
            ? patients.find((p) => p.id.toString() === appointment.patientId!.toString()) // Safely handle patientId
            : null;
          return {
            ...appointment,
            patientName: patient ? patient.name : 'Unknown', // Assign patient name or 'Unknown'
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
    const cleanAppointment = { ...appointment, id: undefined };
    return this.http.post<Appointment>(`${this.apiUrl}/appointments`, cleanAppointment);
  }

  updateAppointment(id: string, appointment: Appointment): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.apiUrl}/appointments/${id}`, appointment);
  }

  deleteAppointment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/appointments/${id}`).pipe(
      catchError((error) => {
        console.error('Failed to delete appointment:', error);
        return of();
      })
    );
  }
}