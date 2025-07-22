using SharpQuestAssignment.Models;
using System;
using Xunit;

namespace SharpQuestAssignment.Test
{
    public class EmployeeSalaryModelTests
    {
        [Fact]
        public void EmployeeSalary_DefaultValues_AreSet()
        {
            var salary = new EmployeeSalary();
            Assert.Equal(0, salary.EmployeeID);
            Assert.Equal(string.Empty, salary.Title);
            Assert.Null( salary.Salary);
            // FromDate is not nullable, so do not check for null
            Assert.Null(salary.ToDate);
            Assert.Null(salary.Employee);
        }

        [Fact]
        public void EmployeeSalary_PropertyAssignment_Works()
        {
            var employee = new Employee { EmployeeID = 1, EmployeeName = "Jane Doe" };
            var salary = new EmployeeSalary
            {
                EmployeeSalaryID = 1,
                EmployeeID = 1,
                FromDate = new DateTime(2020, 1, 1),
                ToDate = new DateTime(2021, 1, 1),
                Title = "Developer",
                Salary = 50000,
                Employee = employee
            };
            Assert.Equal(1, salary.EmployeeSalaryID);
            Assert.Equal(1, salary.EmployeeID);
            Assert.Equal(new DateTime(2020, 1, 1), salary.FromDate);
            Assert.Equal(new DateTime(2021, 1, 1), salary.ToDate);
            Assert.Equal("Developer", salary.Title);
            Assert.Equal(50000, salary.Salary);
            Assert.Equal(employee, salary.Employee);
        }
    }
} 