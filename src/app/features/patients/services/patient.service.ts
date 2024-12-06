import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, shareReplay, throwError } from 'rxjs';
import { Patient } from '../models/patient';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private apiUrl = 'http://localhost:3000';
  private departmentCache$: Observable<{ id: number; name: string }[]> | null = null;

  constructor(private http: HttpClient) { }

  getPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${this.apiUrl}/patients`).pipe(
      catchError(() => {
        console.error('Failed to fetch patients');
        return of([]);
      })
    );
  }


  getPatientById(id: number): Observable<Patient> {
    return this.http.get<Patient>(`${this.apiUrl}/patients/${id}`).pipe(
      map((patient) => ({
        ...patient,
        name: patient.name || 'Unknown',
        doctor: patient.doctor || 'Unknown'
      })),
      catchError(() => {
        console.error(`Failed to fetch patient with ID: ${id}`);
        return of({
          id: 0,
          name: 'Unknown',
          age: 0,
          lastVisit: '',
          doctor: 'Unknown',
          departmentId: 0
        });
      })
    );
  }

  addPatient(patient: Patient): Observable<Patient> {
    return this.http.post<Patient>(`${this.apiUrl}/patients`, patient).pipe(
      catchError((error) => {
        console.error('Failed to add patient:', error);
        return throwError(() => new Error('Unable to add patient.'));
      })
    );
  }


  updatePatient(patient: Patient): Observable<Patient> {
    return this.http.put<Patient>(`${this.apiUrl}/patients/${patient.id}`, patient);
  }

  deletePatient(patientId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/patients/${patientId}`);
  }

  getDepartments(): Observable<{ id: number; name: string }[]> {
    if (!this.departmentCache$) {
      this.departmentCache$ = this.http.get<{ id: number; name: string }[]>(`${this.apiUrl}/departments`).pipe(
        shareReplay(1),
        catchError(() => {
          console.error('Failed to fetch departments');
          return of([]);
        })
      );
    }
    return this.departmentCache$;
  }
}
