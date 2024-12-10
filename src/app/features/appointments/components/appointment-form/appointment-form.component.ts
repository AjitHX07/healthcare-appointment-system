import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Patient } from '../../models/appointment';
import { AppointmentService } from '../../services/appointment.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './appointment-form.component.html',
  styleUrl: './appointment-form.component.scss'
})

export class AppointmentFormComponent implements OnInit {
  appointmentForm!: FormGroup;
  isEdit = false;
  appointmentId: string | null = null;
  patients: Patient[] = [];
  errorMessage = '';
  successMessage = '';


  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.fetchPatients();

    // Check if this is an edit mode by getting the ID from the route
    this.route.paramMap.subscribe((params) => {
      this.appointmentId = params.get('id');
      if (this.appointmentId) {
        this.isEdit = true;
        this.loadAppointment(this.appointmentId);
      }
    });
  }

  initializeForm(): void {
    this.appointmentForm = this.fb.group({
      patientId: ['', Validators.required],
      doctor: ['', Validators.required], // Doctor input field
      date: ['', Validators.required],
      time: ['', Validators.required],
      status: ['Pending', Validators.required],
    });
  }

  fetchPatients(): void {
    this.appointmentService.getPatients().subscribe({
      next: (data) => (this.patients = data),
      error: () => (this.errorMessage = 'Failed to fetch patients'),
    });
  }

  loadAppointment(id: string): void {
    this.appointmentService.getAppointmentById(id).subscribe({
      next: (appointment) => {
        if (appointment) {
          this.appointmentForm.patchValue({
            patientId: appointment.patientId,
            doctor: appointment.doctor,
            date: appointment.date,
            time: appointment.time,
            status: appointment.status,
          });
        } else {
          this.errorMessage = 'Appointment not found';
        }
      },
      error: () => {
        this.errorMessage = 'Failed to load appointment';
      },
    });
  }

  onSubmit(): void {
    if (this.appointmentForm.invalid) {
      this.errorMessage = 'Please fill out all required fields';
      return;
    }

    const appointmentData = { ...this.appointmentForm.value, id: this.appointmentId };

    if (this.isEdit && this.appointmentId) {
      this.appointmentService.updateAppointment(this.appointmentId, appointmentData).subscribe({
        next: () => {
          alert('Appointment updated successfully.');
          this.router.navigate(['/appointments']);
        },
        error: () => {
          alert('Failed to update appointment.');
        },
      });
    } else {
      this.appointmentService.addAppointment(appointmentData).subscribe({
        next: () => {
          alert('Appointment added successfully.');
          this.router.navigate(['/appointments']);
        },
        error: () => {
          alert('Failed to add appointment.');
        },
      });
    }
  }
}