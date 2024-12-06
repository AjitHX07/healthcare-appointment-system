import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AppointmentService } from '../../services/appointment.service';
import { PatientService } from '../../../patients/services/patient.service';
import { Patient } from '../../models/appointment';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './appointment-list.component.html',
  styleUrl: './appointment-list.component.scss'
})
export class AppointmentListComponent implements OnInit {
  appointments: any[] = [];
  loading = false;
  errorMessage = '';
  private patients: Patient[] = [];


  constructor(private appointmentService: AppointmentService) { }

  ngOnInit(): void {
    this.fetchAppointments();
  }
  // Method to fetch appointments from the backend
  fetchAppointments(): void {
    this.loading = true;
    this.errorMessage = '';
    // Call the AppointmentService to fetch appointments with patient data
    this.appointmentService.getAppointmentsWithPatients().subscribe({
      next: (data) => {
        this.appointments = data;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load appointments';
        this.loading = false;
        console.error(error);
      },
    });
  }


  deleteAppointment(id: number): void {
    // Ask the user to confirm the deletion of the appointment
    if (confirm('Are you sure you want to delete this appointment?')) {
      this.appointmentService.deleteAppointment(id).subscribe({
        next: () => {
          // Filter out the deleted appointment from the appointments array
          this.appointments = this.appointments.filter(
            (appointment) => appointment.id !== id
          );
          alert('Appointment deleted successfully');
        },
        error: () => alert('Failed to delete appointment')
      });
    }
  }
}
