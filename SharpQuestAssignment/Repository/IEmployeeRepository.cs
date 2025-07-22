using SharpQuestAssignment.Models;

namespace SharpQuestAssignment.Repository
{
    public interface IEmployeeRepository
    {
        Task<IEnumerable<Employee>> GetAllEmployeesAsync();
        Task<PaginatedResponse<Employee>> GetEmployeesPaginatedAsync(int pageNumber, int pageSize, string? searchQuery = null);
        Task<IEnumerable<JobTitleSalaryStats>> GetJobTitleSalaryStatsAsync();
        Task<int> SaveEmployeeWithSalaryAsync(Employee employee);
    }
}
