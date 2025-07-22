import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard';
import { EmployeeListComponent } from './employee/employee';
import { JobTitleComponent } from './job-title/job-title';
import { AddEmployeeComponent } from './add-employee/add-employee';

export const routes: Routes = [
  { 
    path: '', 
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'employees', pathMatch: 'full' },
      { path: 'employees', component: EmployeeListComponent },
      { path: 'titles', component: JobTitleComponent },
      { path: 'add-employee', component: AddEmployeeComponent }
    ]
  }
];
