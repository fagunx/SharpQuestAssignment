import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { JobTitleService } from '../services/job-title.service';

export interface JobTitle {
  jobTitleID: number;
  title: string;
  minSalary: number;
  maxSalary: number;
}

@Component({
  selector: 'app-job-title',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './job-title.html',
  styleUrls: ['./job-title.css']
})
export class JobTitleComponent implements OnInit {
  jobTitles: JobTitle[] = [];
  filteredJobTitles: JobTitle[] = [];
  isLoading: boolean = false;
  error: string = '';

  constructor(
    private jobTitleService: JobTitleService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.loadJobTitles();
  }

  loadJobTitles(): void {
    this.isLoading = true;
    this.error = '';
    
    this.jobTitleService.getJobTitles().subscribe({
      next: (data: JobTitle[]) => {
        
        if (data && data.length > 0) {
          this.jobTitles = data;
          this.filteredJobTitles = data;
        } 
        this.isLoading = false;
        this.cdr.detectChanges(); // <-- Force UI update
      },
      error: (err: any) => {
        this.isLoading = false;
        this.error = '';
        this.cdr.detectChanges(); // <-- Force UI update
      }
    });
  }

  formatSalary(salary: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(salary);
  }

  getSalaryRange(min: number, max: number): string {
    return `${this.formatSalary(min)} - ${this.formatSalary(max)}`;
  }
} 