using SharpQuestAssignment.Models;
using SharpQuestAssignment.Services;
using System.Threading.Tasks;
using Xunit;

namespace SharpQuestAssignment.Test
{
    public class IEmployeeServiceTests
    {
        [Fact]
        public void Interface_HasExpectedMethods()
        {
            var type = typeof(IEmployeeService);
            Assert.NotNull(type.GetMethod("GetAllEmployeesAsync"));
            Assert.NotNull(type.GetMethod("GetEmployeesPaginatedAsync"));
            Assert.NotNull(type.GetMethod("GetJobTitleSalaryStatsAsync"));
            Assert.NotNull(type.GetMethod("SaveEmployeeAsync"));
            Assert.NotNull(type.GetMethod("SaveEmployeeSalaryAsync"));
            Assert.NotNull(type.GetMethod("SaveEmployeeWithSalaryAsync"));
        }
    }
} 