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

    // Use paramMap instead of directly accessing params
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      if (id) {
        this.appointmentId = id; // Directly use the string ID
        this.isEdit = true;
        this.loadAppointment(id);
      }
    });
  }

  initializeForm(): void {
    this.appointmentForm = this.fb.group({
      patientId: ['', Validators.required],
      doctor: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      status: ['Pending', Validators.required],
    });
  }
  //fetching patients
  fetchPatients(): void {
    this.appointmentService.getPatients().subscribe({
      next: (data) => (this.patients = data),
      error: () => (this.errorMessage = 'Failed to fetch patients'),
    });
  }
  //loading the  updating appointment  

  loadAppointment(id: string): void {
    this.appointmentService.getAppointmentById(id).subscribe({
      next: (appointment) => {
        if (appointment) {
          this.appointmentForm.patchValue({
            patientId: appointment.patientId,
            doctor: appointment.doctor,
            date: appointment.date,
            time: appointment.time,
            status: appointment.status
          });
        } else {
          this.errorMessage = 'Appointment not found';
        }
      },
      error: (error) => {
        console.error('Failed to load appointment', error);
        this.errorMessage = 'Failed to load appointment';
      }
    });
  }
  //handling form submission,
  onSubmit(): void {
    if (this.appointmentForm.invalid) {
      this.errorMessage = 'Please fill out all required fields';
      return;
    }

    const appointmentData = {
      ...this.appointmentForm.value,
      id: this.appointmentId // Use the existing ID for update
    };

    if (this.isEdit && this.appointmentId) {
      this.appointmentService.updateAppointment(this.appointmentId, appointmentData).subscribe({
        next: () => this.handleSuccess('Appointment updated successfully'),
        error: (error) => {
          console.error('Update error', error);
          this.errorMessage = 'Failed to update appointment';
        }
      });
    } else {
      this.appointmentService.addAppointment(appointmentData).subscribe({
        next: () => this.handleSuccess('Appointment added successfully'),
        error: (error) => {
          console.error('Add error', error);
          this.errorMessage = 'Failed to add appointment';
        }
      });
    }
  }

  handleSuccess(message: string): void {
    this.successMessage = message;
    setTimeout(() => {
      this.successMessage = '';
      this.router.navigate(['/appointments']);
    }, 2000);
  }
}