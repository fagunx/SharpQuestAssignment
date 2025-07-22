using SharpQuestAssignment.Models;

namespace SharpQuestAssignment.Services
{
    public interface IEmployeeService
    {
        Task<IEnumerable<Employee>> GetAllEmployeesAsync();
        Task<PaginatedResponse<Employee>> GetEmployeesPaginatedAsync(int pageNumber, int pageSize, string? searchQuery = null);
        Task<IEnumerable<JobTitleSalaryStats>> GetJobTitleSalaryStatsAsync();
        Task<int> SaveEmployeeWithSalaryAsync(Employee employee);
    }

}
