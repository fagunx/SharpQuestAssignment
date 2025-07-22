import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddEmployeeComponent } from './add-employee';
import { EmployeeService } from '../employee-service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('AddEmployeeComponent', () => {
  let component: AddEmployeeComponent;
  let fixture: ComponentFixture<AddEmployeeComponent>;
  let mockEmployeeService: jasmine.SpyObj<EmployeeService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockEmployees = [
    {
      employeeID: 1,
      employeeName: 'John Doe',
      title: 'Software Engineer',
      ssn: '123-45-6789',
      dateOfBirth: '1990-01-01',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      phone: '(555) 123-4567',
      joinDate: '2020-01-01'
    }
  ];

  beforeEach(async () => {
    mockEmployeeService = jasmine.createSpyObj('EmployeeService', ['getAll', 'create']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    mockEmployeeService.getAll.and.returnValue(of(mockEmployees));
    mockEmployeeService.create.and.returnValue(of(mockEmployees[0]));

    await TestBed.configureTestingModule({
      imports: [AddEmployeeComponent],
      providers: [
        { provide: EmployeeService, useValue: mockEmployeeService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load job titles on init', () => {
    expect(mockEmployeeService.getAll).toHaveBeenCalled();
    expect(component.availableTitles).toContain('Software Engineer');
  });

  it('should format phone number correctly', () => {
    const event = { target: { value: '5551234567' } };
    component.formatPhone(event);
    expect(component.employee.phone).toBe('(555) 123-4567');
  });

  it('should format SSN correctly', () => {
    const event = { target: { value: '123456789' } };
    component.formatSSN(event);
    expect(component.employee.ssn).toBe('123-45-6789');
  });

  it('should validate form correctly', () => {
    // Test empty form
    expect(component.validateForm()).toBe(false);
    expect(component.error).toBe('Full name is required');

    // Test with required fields
    component.employee.employeeName = 'John Doe';
    component.employee.ssn = '123-45-6789';
    component.employee.dateOfBirth = '1990-01-01';
    component.employee.address = '123 Main St';
    component.employee.city = 'New York';
    component.employee.state = 'NY';
    component.employee.zip = '10001';
    component.employee.phone = '(555) 123-4567';
    component.employee.joinDate = '2020-01-01';
    component.employee.title = 'Software Engineer';

    expect(component.validateForm()).toBe(true);
  });
}); 