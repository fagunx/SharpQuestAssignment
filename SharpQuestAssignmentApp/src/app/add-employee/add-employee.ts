import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeService, Employee } from '../services/employee-service';
import { JobTitleService } from '../services/job-title.service';

function phoneValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value ? control.value.replace(/\D/g, '') : '';
  return value.length === 10 ? null : { phone: true };
}

function dateValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  // Accept yyyy-MM-dd or dd-MM-yyyy or dd/MM/yyyy
  if (!value) return { date: true };
  // Try yyyy-MM-dd
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const d = new Date(value);
    return isNaN(d.getTime()) ? { date: true } : null;
  }
  // Try dd-MM-yyyy or dd/MM/yyyy
  if (/^\d{2}[-\/]\d{2}[-\/]\d{4}$/.test(value)) {
    const [dd, mm, yyyy] = value.split(/[-\/]/);
    const d = new Date(`${yyyy}-${mm}-${dd}`);
    return isNaN(d.getTime()) ? { date: true } : null;
  }
  return { date: true };
}

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-employee.html',
  styleUrls: ['./add-employee.css']
})
export class AddEmployeeComponent implements OnInit {
  addEmployeeForm!: FormGroup;
  jobTitles: string[] = [];
  isLoading: boolean = false;
  isSubmitting: boolean = false;
  success: string = '';

  constructor(
    private employeeService: EmployeeService,
    private jobTitleService: JobTitleService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.addEmployeeForm = new FormGroup({
      employeeName: new FormControl('', Validators.required),
      ssn: new FormControl('', Validators.required),
      dateOfBirth: new FormControl('', [Validators.required, dateValidator]),
      address: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      state: new FormControl('', Validators.required),
      zip: new FormControl('', Validators.required),
      phone: new FormControl('', [Validators.required, phoneValidator]),
      joinDate: new FormControl('', [Validators.required, dateValidator]),
      title: new FormControl('', Validators.required),
      salary: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+$/)])
    });
    this.loadJobTitles();
  }

  loadJobTitles(): void {
    this.isLoading = true;
    this.jobTitleService.getJobTitles().subscribe({
      next: (titles: any[]) => {
        this.jobTitles = titles.map(t => t.title);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  formatDate(event: any, field: 'dateOfBirth' | 'joinDate'): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length >= 4) {
      value = value.replace(/(\d{2})(\d{2})(\d{4})/, '$1-$2-$3');
    } else if (value.length >= 2) {
      value = value.replace(/(\d{2})(\d{0,2})/, '$1-$2');
    }
    this.addEmployeeForm.get(field)!.setValue(value);
  }

  formatSSN(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length >= 5) {
      value = value.replace(/(\d{3})(\d{2})(\d{4})/, '$1-$2-$3');
    } else if (value.length >= 3) {
      value = value.replace(/(\d{3})(\d{0,2})/, '$1-$2');
    }
    this.addEmployeeForm.get('ssn')!.setValue(value);
  }

  onSubmit(): void {
    this.success = '';
    if (this.addEmployeeForm.invalid) {
      this.addEmployeeForm.markAllAsTouched();
      return;
    }

    // Optimized age validation for dateOfBirth
    const dobRaw = this.addEmployeeForm.value.dateOfBirth;
    const toISO = (dateStr: string) => {
      const parts = dateStr.split(/[-\/]/);
      if (parts.length === 3) {
        return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
      }
      return dateStr;
    };
    const dobISO = toISO(dobRaw);
    const birthDate = new Date(dobISO);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear() - (today < new Date(birthDate.setFullYear(today.getFullYear())) ? 1 : 0);
    if (age < 22 || age > 64) {
      this.addEmployeeForm.get('dateOfBirth')?.setErrors({ ...(this.addEmployeeForm.get('dateOfBirth')?.errors || {}), age: true });
      this.addEmployeeForm.get('dateOfBirth')?.markAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formValue = this.addEmployeeForm.value;
    const employeeData: Omit<Employee, 'employeeID'> = {
      ...formValue,
      dateOfBirth: toISO(formValue.dateOfBirth),
      joinDate: toISO(formValue.joinDate),
      title: formValue.title,
      salary: formValue.salary,
      ssn: formValue.ssn.replace(/\D/g, ''),
      phone: formValue.phone.replace(/\D/g, '')
    };
    this.employeeService.create(employeeData).subscribe({
      next: () => {
        this.success = 'Employee added successfully!';
        this.isSubmitting = false;
        this.cdr.detectChanges();
        setTimeout(() => {
          this.router.navigate(['/employees']);
        }, 2000);
      },
      error: () => {
        this.isSubmitting = false;
        this.cdr.detectChanges();
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/employees']);
  }

  goBack(): void {
    this.router.navigate(['/employees']);
  }
}
