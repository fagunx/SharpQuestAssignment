using System.Data.SqlClient;
using Dapper;
using SharpQuestAssignment.Models;

namespace SharpQuestAssignment.Repository
{
    public class EmployeeRepository : IEmployeeRepository
    {
        private readonly IConfiguration _configuration;

        public EmployeeRepository(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<IEnumerable<Employee>> GetAllEmployeesAsync()
        {
            var connectionString = _configuration.GetConnectionString("DefaultConnection");
            var query = @"
                SELECT e.*, ISNULL(es.Title, '') as Title 
                FROM Employee e 
                LEFT JOIN EmployeeSalary es ON e.EmployeeID = es.EmployeeID";
            using (var connection = new SqlConnection(connectionString))
            return await connection.QueryAsync<Employee>(query);
        }

        public async Task<PaginatedResponse<Employee>> GetEmployeesPaginatedAsync(int pageNumber, int pageSize, string? searchQuery = null)
        {
            var connectionString = _configuration.GetConnectionString("DefaultConnection");
            using (var connection = new SqlConnection(connectionString))
            {
                // Build WHERE clause for search
                var whereClause = "";
                var searchParameters = new DynamicParameters();
                
                if (!string.IsNullOrWhiteSpace(searchQuery))
                {
                    whereClause = "WHERE (e.EmployeeName LIKE @SearchQuery OR ISNULL(es.Title, '') LIKE @SearchQuery)";
                    searchParameters.Add("@SearchQuery", $"%{searchQuery}%");
                }

                // Get total count with search
                var countQuery = $@"
                    SELECT COUNT(*) 
                    FROM Employee e 
                    LEFT JOIN EmployeeSalary es ON e.EmployeeID = es.EmployeeID 
                    {whereClause}";
                
                var totalCount = await connection.ExecuteScalarAsync<int>(countQuery, searchParameters);

                // Get paginated data with title and search
                var offset = (pageNumber - 1) * pageSize;
                var query = $@"
                    SELECT e.*, ISNULL(es.Title, '') as Title 
                    FROM Employee e 
                    LEFT JOIN EmployeeSalary es ON e.EmployeeID = es.EmployeeID 
                    {whereClause}
                    ORDER BY e.EmployeeID 
                    OFFSET @Offset ROWS 
                    FETCH NEXT @PageSize ROWS ONLY";

                searchParameters.Add("@Offset", offset);
                searchParameters.Add("@PageSize", pageSize);
                var employees = await connection.QueryAsync<Employee>(query, searchParameters);

                return new PaginatedResponse<Employee>(employees, pageNumber, pageSize, totalCount);
            }
        }

        public async Task<IEnumerable<JobTitleSalaryStats>> GetJobTitleSalaryStatsAsync()
        {
            var connectionString = _configuration.GetConnectionString("DefaultConnection");
            var query = @"
                SELECT 
                    Title,
                    MIN(Salary) as MinSalary,
                    MAX(Salary) as MaxSalary,
                    COUNT(*) as EmployeeCount
                FROM EmployeeSalary 
                WHERE Title IS NOT NULL AND Title != ''
                GROUP BY Title 
                ORDER BY Title";

            using (var connection = new SqlConnection(connectionString))
            {
                return await connection.QueryAsync<JobTitleSalaryStats>(query);
            }
        }

        public async Task<int> SaveEmployeeWithSalaryAsync(Employee employee)
        {
            var connectionString = _configuration.GetConnectionString("DefaultConnection");
            using (var connection = new SqlConnection(connectionString))
            {
                await connection.OpenAsync();
                using (var transaction = connection.BeginTransaction())
                {
                    try
                    {
                        // Insert Employee
                        var employeeQuery = @"INSERT INTO Employee (EmployeeName, SSN, DateOfBirth, Address, State, Zip, Phone, JoinDate, ExitDate)
                                               VALUES (@EmployeeName, @SSN, @DateOfBirth, @Address, @State, @Zip, @Phone, @JoinDate, @ExitDate);
                                               SELECT CAST(SCOPE_IDENTITY() as int);";
                        var employeeId = await connection.ExecuteScalarAsync<int>(employeeQuery, employee, transaction);

                        // Insert EmployeeSalary
                        var salaryQuery = @"INSERT INTO EmployeeSalary (EmployeeID, FromDate, ToDate, Title, Salary)
                                               VALUES (@EmployeeID, @FromDate, @ToDate, @Title, @Salary);";
                        var salaryParams = new
                        {
                            EmployeeID = employeeId,
                            FromDate = DateTime.Now,
                            ToDate = (DateTime?)null,
                            Title = employee.Title,
                            Salary = employee.Salary
                        };
                        await connection.ExecuteAsync(salaryQuery, salaryParams, transaction);

                        transaction.Commit();
                        return employeeId;
                    }
                    catch
                    {
                        transaction.Rollback();
                        throw;
                    }
                }
            }
        }
    }
}
