using SharpQuestAssignment.Models;
using Xunit;

namespace SharpQuestAssignment.Test
{
    public class JobTitleSalaryStatsModelTests
    {
        [Fact]
        public void JobTitleSalaryStats_DefaultValues_AreSet()
        {
            var stats = new JobTitleSalaryStats();
            Assert.Equal(string.Empty, stats.Title);
            Assert.Equal(0, stats.MinSalary);
            Assert.Equal(0, stats.MaxSalary);
            Assert.Equal(0, stats.EmployeeCount);
        }

        [Fact]
        public void JobTitleSalaryStats_PropertyAssignment_Works()
        {
            var stats = new JobTitleSalaryStats
            {
                Title = "Manager",
                MinSalary = 1000,
                MaxSalary = 5000,
                EmployeeCount = 10
            };
            Assert.Equal("Manager", stats.Title);
            Assert.Equal(1000, stats.MinSalary);
            Assert.Equal(5000, stats.MaxSalary);
            Assert.Equal(10, stats.EmployeeCount);
        }
    }
} 