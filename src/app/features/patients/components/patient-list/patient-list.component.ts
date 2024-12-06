import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PatientService } from '../../services/patient.service';
import { Patient } from '../../models/patient';
import { PatientFormComponent } from "../patient-form/patient-form.component";

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './patient-list.component.html',
  styleUrl: './patient-list.component.scss'
})
export class PatientListComponent implements OnInit {
  patients: Patient[] = [];
  filteredPatients: Patient[] = [];
  searchQuery: string = '';
  departments: { id: number; name: string }[] = [];

  constructor(private patientService: PatientService, private router: Router) { }

  ngOnInit(): void {
    this.fetchPatients();
    this.fetchDepartments();
  }

  fetchPatients(): void {
    this.patientService.getPatients().subscribe((data) => {
      this.patients = data
        .map((patient) => ({
          ...patient,
          lastVisit: new Date(patient.lastVisit).toISOString().split('T')[0],
        }))
        .sort((a, b) => a.id - b.id); // Sort by ID in ascending order
      this.filteredPatients = [...this.patients];
    });
  }


  fetchDepartments(): void {
    this.patientService.getDepartments().subscribe((data) => {
      this.departments = data;
    });
  }

  getDepartmentName(departmentId: number): string {
    const department = this.departments.find((dept) => dept.id === departmentId);
    return department ? department.name : 'Unknown';
  }

  onSearch(): void {
    const lowerCaseQuery = this.searchQuery.trim().toLowerCase();

    if (lowerCaseQuery === '') {
      // If the search query is empty, reset the filtered list
      this.filteredPatients = [...this.patients];
    } else {
      // Filter by patient's name, doctor's name, or department name
      this.filteredPatients = this.patients.filter((patient) => {
        const departmentName = this.getDepartmentName(patient.departmentId).toLowerCase();
        return (
          patient.name.toLowerCase().includes(lowerCaseQuery) || // Search by patient name
          patient.doctor.toLowerCase().includes(lowerCaseQuery) || // Search by doctor name
          departmentName.includes(lowerCaseQuery) // Search by department name
        );
      });
    }
  }


  onAddPatient(): void {
    this.router.navigate(['/patients/add']);
  }

  onEditPatient(patientId: number): void {
    this.router.navigate(['/patients/edit', patientId]);
  }

  onDeletePatient(patientId: number): void {
    this.patientService.deletePatient(patientId).subscribe(() => {
      this.fetchPatients();
    });
  }
}
