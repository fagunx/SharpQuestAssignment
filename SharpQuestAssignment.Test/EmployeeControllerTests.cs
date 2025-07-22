using Microsoft.AspNetCore.Mvc;
using Moq;
using SharpQuestAssignment.Controllers;
using SharpQuestAssignment.Models;
using SharpQuestAssignment.Services;
using Xunit;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SharpQuestAssignment.Test
{
    public class EmployeeControllerTests
    {
        private readonly Mock<IEmployeeService> _mockService;
        private readonly EmployeeController _controller;

        public EmployeeControllerTests()
        {
            _mockService = new Mock<IEmployeeService>();
            _controller = new EmployeeController(_mockService.Object);
        }

        [Fact]
        public async Task Get_ReturnsOkResult_WithEmployees()
        {
            // Arrange
            var employees = new List<Employee> { new Employee { EmployeeID = 1, EmployeeName = "John Doe" } };
            _mockService.Setup(s => s.GetAllEmployeesAsync()).ReturnsAsync(employees);

            // Act
            var result = await _controller.Get();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(employees, okResult.Value);
        }

        [Fact]
        public async Task GetPaginated_ReturnsBadRequest_ForInvalidPageNumber()
        {
            var result = await _controller.GetPaginated(0, 10, null);
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task GetPaginated_ReturnsBadRequest_ForInvalidPageSize()
        {
            var result = await _controller.GetPaginated(1, 0, null);
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task GetPaginated_ReturnsOkResult_WithPaginatedEmployees()
        {
            var paginated = new PaginatedResponse<Employee>(new List<Employee>(), 1, 10, 0);
            _mockService.Setup(s => s.GetEmployeesPaginatedAsync(1, 10, null)).ReturnsAsync(paginated);
            var result = await _controller.GetPaginated(1, 10, null);
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(paginated, okResult.Value);
        }

        [Fact]
        public async Task GetJobTitleSalaryStats_ReturnsOkResult()
        {
            var stats = new List<JobTitleSalaryStats> { new JobTitleSalaryStats { Title = "Dev", MinSalary = 1000, MaxSalary = 2000, EmployeeCount = 1 } };
            _mockService.Setup(s => s.GetJobTitleSalaryStatsAsync()).ReturnsAsync(stats);
            var result = await _controller.GetJobTitleSalaryStats();
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(stats, okResult.Value);
        }

        [Fact]
        public async Task SaveEmployee_ReturnsOkResult_WithEmployeeId()
        {
            var employee = new Employee { EmployeeID = 1, EmployeeName = "John Doe" };
            _mockService.Setup(s => s.SaveEmployeeWithSalaryAsync(employee)).ReturnsAsync(1);
            var result = await _controller.SaveEmployee(employee);
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.NotNull(okResult.Value);
        }
    }
} 