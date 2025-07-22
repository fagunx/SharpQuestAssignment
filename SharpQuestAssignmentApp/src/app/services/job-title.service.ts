import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, timeout, catchError, of } from 'rxjs';
import { JobTitle } from '../job-title/job-title';

@Injectable({
  providedIn: 'root'
})
export class JobTitleService {
  private apiUrl = 'https://localhost:44354/api/employee';

  constructor(private http: HttpClient) {}

  getJobTitles(): Observable<JobTitle[]> {
    return this.http.get<JobTitle[]>(`${this.apiUrl}/jobTitleSearch`).pipe(
      timeout(10000),
      catchError(error => {
        console.error('JobTitleService: Error fetching job titles:', error);
        return of([]);
      })
    );
  }
} 