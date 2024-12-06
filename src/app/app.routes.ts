import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { AppointmentListComponent } from './features/appointments/components/appointment-list/appointment-list.component';
import { PatientListComponent } from './features/patients/components/patient-list/patient-list.component';
import { AppointmentFormComponent } from './features/appointments/components/appointment-form/appointment-form.component';
import { PatientFormComponent } from './features/patients/components/patient-form/patient-form.component';
import { DepartmentsComponent } from './features/departments/components/departments/departments.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    // Login route
    {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
    },

    // Dashboard route
    {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),

        canActivate: [authGuard],
    },

    // Appointments routes
    {
        path: 'appointments',
        loadComponent: () => import('./features/appointments/components/appointment-list/appointment-list.component').then(m => m.AppointmentListComponent),
        canActivate: [authGuard],
    },
    {
        path: 'appointments/add',
        loadComponent: () => import('./features/appointments/components/appointment-form/appointment-form.component').then(m => m.AppointmentFormComponent),
    },
    {
        path: 'appointments/edit/:id',
        loadComponent: () => import('./features/appointments/components/appointment-form/appointment-form.component')
            .then(m => m.AppointmentFormComponent)
    },

    // Patients routes
    {
        path: 'patients',
        loadComponent: () => import('./features/patients/components/patient-list/patient-list.component').then(m => m.PatientListComponent),
        canActivate: [authGuard],
    },
    {
        path: 'patients/add',
        loadComponent: () => import('./features/patients/components/patient-form/patient-form.component').then(m => m.PatientFormComponent),
    },
    {
        path: 'patients/edit/:id',
        loadComponent: () => import('./features/patients/components/patient-form/patient-form.component').then(m => m.PatientFormComponent),
    },

    // Departments route
    {
        path: 'departments',
        loadComponent: () => import('./features/departments/components/departments/departments.component').then(m => m.DepartmentsComponent),
        canActivate: [authGuard],
    },

    // Redirect unknown paths to Dashboard
    { path: '**', redirectTo: 'login' },
];
