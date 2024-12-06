import { Injectable } from '@angular/core';
import { AppointmentService } from '../../features/appointments/services/appointment.service';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataVizService {

  constructor(private appointmentService: AppointmentService) { }

  getAppointmentsCountByDoctor(): Observable<{ doctor: string; count: number }[]> {
    return this.appointmentService.getAppointments().pipe(
      map((appointments) => {
        const counts: { [key: string]: number } = {};
        appointments.forEach((appointment) => {
          counts[appointment.doctor] = (counts[appointment.doctor] || 0) + 1;
        });
        return Object.entries(counts).map(([doctor, count]) => ({ doctor, count }));
      })
    );
  }
}