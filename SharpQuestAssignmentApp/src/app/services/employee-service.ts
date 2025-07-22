import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { AbstractControl, ValidationErrors } from '@angular/forms';

export interface Employee {
  employeeID: number;
  employeeName: string;
  title: string;
  ssn: string;
  dateOfBirth: string; // DateTime from backend
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  joinDate: string; // DateTime from backend
  exitDate?: string; // DateTime? from backend (nullable)
}

export interface EmployeeSalary {
  employeeSalaryID: number;
  employeeID: number;
  title: string;
  salary: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface PaginationParams {
  pageNumber: number;
  pageSize: number;
  searchQuery?: string;
}

@Injectable({
  providedIn: 'root',
})

export class EmployeeService {
  private apiUrl = 'https://localhost:44354/api/employee'; // Update this URL to match your backend
  private employeesSubject = new BehaviorSubject<Employee[]>([]);
  private paginationSubject =
    new BehaviorSubject<PaginatedResponse<Employee> | null>(null);
  private employees: Employee[] = [];

  constructor(private http: HttpClient) {
  }

  // Get paginated employees with optional search and filters
  getPaginatedEmployees(
    params: PaginationParams
  ): Observable<PaginatedResponse<Employee>> {
    let httpParams = new HttpParams()
      .set('pageNumber', params.pageNumber.toString())
      .set('pageSize', params.pageSize.toString());

    if (params.searchQuery && params.searchQuery.trim() !== '') {
      httpParams = httpParams.set('searchQuery', params.searchQuery);
    }

    return this.http.get<PaginatedResponse<Employee>>(
      `${this.apiUrl}/paginated`,
      { params: httpParams }
    );
  }

  // Legacy method for backward compatibility
  getAll(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl);
  }

  getEmployees(): Observable<Employee[]> {
    return this.employeesSubject.asObservable();
  }

  getPaginationInfo(): Observable<PaginatedResponse<Employee> | null> {
    return this.paginationSubject.asObservable();
  }

  // Load employees with pagination
  loadEmployeesWithPagination(params: PaginationParams): void {
    this.getPaginatedEmployees(params).subscribe({
      next: (response) => {
        console.log('Pagination response:', response);
        this.employees = response.data;
        this.employeesSubject.next(response.data);
        this.paginationSubject.next(response);
      },
      error: (error) => {
        console.error('Error loading employees:', error);
        this.employees = [];
        this.employeesSubject.next([]);
        this.paginationSubject.next(null);
      },
    });
  }

  searchEmployees(query: string): Employee[] {
    const lowerQuery = query.toLowerCase();
    return this.employees.filter(
      (emp) =>
        emp.employeeName.toLowerCase().includes(lowerQuery) ||
        emp.title.toLowerCase().includes(lowerQuery)
    );
  }

  getTitles(): string[] {
    return [...new Set(this.employees.map((emp) => emp.title))];
  }

  static phoneValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value ? control.value.replace(/\D/g, '') : '';
    return value.length === 10 ? null : { phone: true };
  }

  static dateValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return { date: true };
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const d = new Date(value);
      return isNaN(d.getTime()) ? { date: true } : null;
    }
    if (/^\d{2}[-\/]\d{2}[-\/]\d{4}$/.test(value)) {
      const [dd, mm, yyyy] = value.split(/[-\/]/);
      const d = new Date(`${yyyy}-${mm}-${dd}`);
      return isNaN(d.getTime()) ? { date: true } : null;
    }
    return { date: true };
  }

 formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  static formatSSN(ssn: string): string {
    if (!ssn) return '';
    const cleaned = ssn.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{2})(\d{4})$/);
    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`;
    }
    return ssn;
  }

  getEmployeeStatus(employee: Employee): 'active' | 'inactive' {
    return employee.exitDate ? 'inactive' : 'active';
  }

  create(employee: Omit<Employee, 'employeeID'>): Observable<Employee> {
    return this.http.post<Employee>(`${this.apiUrl}/SaveEmployee`, employee);
  }
}
 