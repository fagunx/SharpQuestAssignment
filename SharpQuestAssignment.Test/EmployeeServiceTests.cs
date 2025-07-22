using Moq;
using SharpQuestAssignment.Models;
using SharpQuestAssignment.Repository;
using SharpQuestAssignment.Services;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace SharpQuestAssignment.Test
{
    public class EmployeeServiceTests
    {
        private readonly Mock<IEmployeeRepository> _mockRepo;
        private readonly EmployeeService _service;

        public EmployeeServiceTests()
        {
            _mockRepo = new Mock<IEmployeeRepository>();
            _service = new EmployeeService(_mockRepo.Object);
        }

        [Fact]
        public async Task GetAllEmployeesAsync_ReturnsEmployees()
        {
            var employees = new List<Employee> { new Employee { EmployeeID = 1, EmployeeName = "John Doe" } };
            _mockRepo.Setup(r => r.GetAllEmployeesAsync()).ReturnsAsync(employees);
            var result = await _service.GetAllEmployeesAsync();
            Assert.Equal(employees, result);
        }

        [Fact]
        public async Task GetEmployeesPaginatedAsync_ReturnsPaginatedResponse()
        {
            var paginated = new PaginatedResponse<Employee>(new List<Employee>(), 1, 10, 0);
            _mockRepo.Setup(r => r.GetEmployeesPaginatedAsync(1, 10, null)).ReturnsAsync(paginated);
            var result = await _service.GetEmployeesPaginatedAsync(1, 10, null);
            Assert.Equal(paginated, result);
        }

        [Fact]
        public async Task GetJobTitleSalaryStatsAsync_ReturnsStats()
        {
            var stats = new List<JobTitleSalaryStats> { new JobTitleSalaryStats { Title = "Dev", MinSalary = 1000, MaxSalary = 2000, EmployeeCount = 1 } };
            _mockRepo.Setup(r => r.GetJobTitleSalaryStatsAsync()).ReturnsAsync(stats);
            var result = await _service.GetJobTitleSalaryStatsAsync();
            Assert.Equal(stats, result);
        }


        [Fact]
        public async Task SaveEmployeeWithSalaryAsync_ReturnsEmployeeId()
        {
            var employee = new Employee { EmployeeID = 1, EmployeeName = "John Doe" };
            _mockRepo.Setup(r => r.SaveEmployeeWithSalaryAsync(employee)).ReturnsAsync(1);
            var result = await _service.SaveEmployeeWithSalaryAsync(employee);
            Assert.Equal(1, result);
        }
    }
} 