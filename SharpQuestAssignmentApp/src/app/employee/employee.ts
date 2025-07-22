import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  EmployeeService,
  Employee,
  PaginationParams,
  PaginatedResponse,
} from '../services/employee-service';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee.html',
  styleUrls: ['./employee.css'],
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  searchQuery: string = '';
  loading: boolean = true;
  error: string | null = null;

  // Pagination properties
  currentPage: number = 1;
  pageSize: number = 10;
  totalCount: number = 0;
  totalPages: number = 0;
  hasPreviousPage: boolean = false;
  hasNextPage: boolean = false;
  paginationInfo: PaginatedResponse<Employee> | null = null;

  constructor(
    private employeeService: EmployeeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.loading = true;
    this.error = null;
    
    const params: PaginationParams = {
      pageNumber: this.currentPage,
      pageSize: this.pageSize,
      searchQuery: this.searchQuery.trim() || undefined
    };

    console.log('Loading employees with params:', params);

    this.employeeService.loadEmployeesWithPagination(params);
    
    // Subscribe to both employees and pagination info
    this.employeeService.getEmployees().subscribe({
      next: (employees) => {
        this.employees = employees;
        this.loading = false;
        this.cdr.detectChanges(); // Force change detection
      },
      error: (err) => {
        console.error('Error loading employees:', err);
        this.error = 'Failed to load employees. Please try again later.';
        this.loading = false;
        this.employees = [];
        this.cdr.detectChanges(); // Force change detection
      },
    });

    this.employeeService.getPaginationInfo().subscribe({
      next: (paginationInfo) => {
        console.log('Pagination info:', paginationInfo);
        if (paginationInfo) {
          this.paginationInfo = paginationInfo;
          this.totalCount = paginationInfo.totalCount;
          this.totalPages = paginationInfo.totalPages;
          this.hasPreviousPage = paginationInfo.hasPreviousPage;
          this.hasNextPage = paginationInfo.hasNextPage;
          this.currentPage = paginationInfo.pageNumber;
          this.cdr.detectChanges(); // Force change detection
        }
      },
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadEmployees();
  }


  // Pagination methods
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadEmployees();
    }
  }

  goToPreviousPage(): void {
    if (this.hasPreviousPage) {
      this.goToPage(this.currentPage - 1);
    }
  }

  goToNextPage(): void {
    if (this.hasNextPage) {
      this.goToPage(this.currentPage + 1);
    }
  }

  onPageSizeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.pageSize = parseInt(select.value);
    this.currentPage = 1; // Reset to first page when changing page size
    this.loadEmployees();
  }

  // Helper methods
  formatDate(dateString: string): string {
    return this.employeeService.formatDate(dateString);
  }

  getEmployeeStatus(employee: Employee): 'active' | 'inactive' {
    return this.employeeService.getEmployeeStatus(employee);
  }

  retryLoad(): void {
    this.loadEmployees();
  }

  // Generate page numbers for pagination
  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;

    if (this.totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show a window of pages around current page
      let start = Math.max(
        1,
        this.currentPage - Math.floor(maxVisiblePages / 2)
      );
      let end = Math.min(this.totalPages, start + maxVisiblePages - 1);

      // Adjust start if we're near the end
      if (end - start + 1 < maxVisiblePages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  }
}
