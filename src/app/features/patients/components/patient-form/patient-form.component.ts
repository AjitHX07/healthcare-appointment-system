import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { PatientService } from '../../services/patient.service';
import { Patient } from '../../models/patient';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-patient-form',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './patient-form.component.html',
  styleUrl: './patient-form.component.scss'
})
export class PatientFormComponent implements OnInit {

  patient: Patient = { id: 0, name: '', age: 0, lastVisit: '', doctor: '', departmentId: 0 };
  departments: { id: number; name: string }[] = [];
  isEditMode = false;

  constructor(
    private patientService: PatientService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.patientService.getDepartments().subscribe((data) => (this.departments = data));
    const id = this.route.snapshot.paramMap.get('id');
    if (id && +id !== 0) {
      this.isEditMode = true;
      // Fetch patient data by ID and assign it to the 'patient' variable
      this.patientService.getPatientById(+id).subscribe((data) => (this.patient = data));
    }
  }

  onCancel(): void {
    // Navigate back to the list of patients when cancel is clicked
    this.router.navigate(['/patients']);
  }

  onSubmit(): void {
    if (this.isEditMode) {
      this.patientService.updatePatient(this.patient).subscribe(() => {
        this.router.navigate(['/patients']);
      });
    } else {
      this.patientService.getPatients().subscribe((patients) => {
        // Find the highest ID from the list of existing patients
        const maxId = patients.length > 0 ? Math.max(...patients.map((p) => p.id)) : 0;
        const newPatient = { ...this.patient, id: maxId + 1 };
        // Navigate back to the list of patients when cancel is clicked
        this.patientService.addPatient(newPatient).subscribe(() => {
          this.router.navigate(['/patients']);
        });
      });
    }
  }

}