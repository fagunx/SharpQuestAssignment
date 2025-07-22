import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JobTitleComponent } from './job-title';
import { JobTitleService } from '../services/job-title.service';
import { of } from 'rxjs';

describe('JobTitleComponent', () => {
  let component: JobTitleComponent;
  let fixture: ComponentFixture<JobTitleComponent>;
  let mockJobTitleService: jasmine.SpyObj<JobTitleService>;

  const mockJobTitles = [
    {
      jobTitleID: 1,
      title: 'Software Engineer',
      department: 'Engineering',
      minSalary: 80000,
      maxSalary: 120000,
      description: 'Develop and maintain software applications',
      activeEmployees: 1,
      openings: 1
    }
  ];

  beforeEach(async () => {
    mockJobTitleService = jasmine.createSpyObj('JobTitleService', ['getJobTitles']);
    mockJobTitleService.getJobTitles.and.returnValue(of(mockJobTitles));

    await TestBed.configureTestingModule({
      imports: [JobTitleComponent],
      providers: [
        { provide: JobTitleService, useValue: mockJobTitleService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(JobTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load job titles on init', () => {
    expect(mockJobTitleService.getJobTitles).toHaveBeenCalled();
    expect(component.jobTitles).toEqual(mockJobTitles);
  });

  it('should format salary correctly', () => {
    const formatted = component.formatSalary(80000);
    expect(formatted).toBe('$80,000');
  });

  it('should get salary range correctly', () => {
    const range = component.getSalaryRange(80000, 120000);
    expect(range).toBe('$80,000 - $120,000');
  });
}); 