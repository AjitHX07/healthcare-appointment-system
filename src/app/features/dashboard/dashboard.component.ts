import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Appointment } from '../appointments/models/appointment';
import { Patient } from '../patients/models/patient';
import { AppointmentService } from '../appointments/services/appointment.service';
import { PatientService } from '../patients/services/patient.service';
import { ChartsComponent } from "../../data-viz/components/charts/charts.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, ChartsComponent, CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})

export class DashboardComponent implements OnInit {

  totalAppointments: number = 0;
  pendingAppointments: number = 0;
  patientsToday: number = 0;
  appointments: Appointment[] = [];
  patients: any[] = [];

  constructor(private appointmentService: AppointmentService, private patientService: PatientService) { }

  ngOnInit(): void {
    this.loadAppointments();
    this.loadPatients();
  }
  // Fetch the list of patients and handle the response
  loadPatients(): void {
    this.patientService.getPatients().subscribe({
      next: (data) => {
        this.patients = data;
      },
      error: () => {
        console.error('Failed to load patients');
      },
    });
  }

  loadAppointments(): void {
    this.appointmentService.getAppointmentsWithPatients().subscribe({
      next: (data) => {
        console.log('Fetched Appointments:', data); // Debugging log
        this.appointments = data;
        this.totalAppointments = data.length;
        this.pendingAppointments = data.filter((a) => a.status === 'Pending').length;

        const today = new Date().toISOString().split('T')[0]; // Get today's date in 'YYYY-MM-DD'
        console.log('Today\'s Date:', today); // Debugging log

        this.patientsToday = data.filter((a) => {
          console.log('Checking appointment date:', a.date); // Debugging log
          return a.date === today; // Compare as strings
        }).length;

        console.log('Patients Today:', this.patientsToday); // Debugging log
      },
      error: () => {
        console.error('Failed to load appointments');
      },
    });
  }


}
