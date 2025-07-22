using SharpQuestAssignment.Models;
using SharpQuestAssignment.Repository;

namespace SharpQuestAssignment.Services
{
    public class EmployeeService : IEmployeeService
    {
        private readonly IEmployeeRepository _employeeRepository;

        public EmployeeService(IEmployeeRepository employeeRepository)
        {
            _employeeRepository = employeeRepository;
        }

        public async Task<IEnumerable<Employee>> GetAllEmployeesAsync()
        {
            // Add business logic here if needed
            return await _employeeRepository.GetAllEmployeesAsync();
        }

        public async Task<PaginatedResponse<Employee>> GetEmployeesPaginatedAsync(int pageNumber, int pageSize, string? searchQuery = null)
        {
            // Add business logic here if needed
            return await _employeeRepository.GetEmployeesPaginatedAsync(pageNumber, pageSize, searchQuery);
        }

        public async Task<IEnumerable<JobTitleSalaryStats>> GetJobTitleSalaryStatsAsync()
        {
            // Add business logic here if needed
            return await _employeeRepository.GetJobTitleSalaryStatsAsync();
        }

        public async Task<int> SaveEmployeeWithSalaryAsync(Employee employee)
        {
            return await _employeeRepository.SaveEmployeeWithSalaryAsync(employee);
        }
    }
}
