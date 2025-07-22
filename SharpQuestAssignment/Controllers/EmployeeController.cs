using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using SharpQuestAssignment.Models;
using SharpQuestAssignment.Services;

namespace SharpQuestAssignment.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly IEmployeeService _service;

        public EmployeeController(IEmployeeService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var employees = await _service.GetAllEmployeesAsync();
            return Ok(employees);
        }

        [HttpGet("paginated")]
        public async Task<IActionResult> GetPaginated([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10, [FromQuery] string? searchQuery = null)
        {
            if (pageNumber < 1)
                return BadRequest("Page number must be greater than 0");

            if (pageSize < 1 || pageSize > 100)
                return BadRequest("Page size must be between 1 and 100");

            var paginatedEmployees = await _service.GetEmployeesPaginatedAsync(pageNumber, pageSize, searchQuery);
            return Ok(paginatedEmployees);
        }

        [HttpGet("jobTitleSearch")]
        public async Task<IActionResult> GetJobTitleSalaryStats()
        {
            var jobTitleStats = await _service.GetJobTitleSalaryStatsAsync();
            return Ok(jobTitleStats);
        }

        [HttpPost("SaveEmployee")]
        public async Task<IActionResult> SaveEmployee([FromBody] Employee employee)
        {
            var employeeId = await _service.SaveEmployeeWithSalaryAsync(employee);
            return Ok(new { EmployeeID = employeeId, Message = "Employee and salary saved successfully." });
        }
    }
}
