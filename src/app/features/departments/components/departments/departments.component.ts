import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../../core/services/api.service';
import { PatientService } from '../../../patients/services/patient.service';
import { PieComponent } from "../../../../data-viz/components/pie/pie.component";

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [CommonModule, FormsModule, PieComponent],
  templateUrl: './departments.component.html',
  styleUrl: './departments.component.scss'
})
export class DepartmentsComponent implements OnInit {
  departmentData: { name: string; patientCount: number }[] = [];
  isLoading = true;

  constructor(private patientService: PatientService) { }

  ngOnInit(): void {
    this.fetchDepartmentOverview();
  }
  // fetchDepartmentOverview function fetches data from the service
  fetchDepartmentOverview(): void {
    this.patientService.getDepartments().subscribe({
      next: (departments) => {
        // After receiving departments, calls getPatients() to get patient data
        this.patientService.getPatients().subscribe({
          next: (patients) => {
            // Maps through departments and calculates the number of patients in each department
            this.departmentData = departments.map((dept) => ({
              name: dept.name,
              patientCount: patients.filter((patient) => +patient.departmentId === +dept.id).length,
            }));
            this.isLoading = false;
          },
          error: () => (this.isLoading = false),
        });
      },
      error: () => (this.isLoading = false),
    });
  }

}