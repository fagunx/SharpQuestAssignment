using SharpQuestAssignment.Models;
using System;
using System.Linq;
using Xunit;

namespace SharpQuestAssignment.Test
{
    public class EmployeeModelTests
    {
        [Fact]
        public void Employee_DefaultValues_AreSet()
        {
            var employee = new Employee();
            Assert.Equal(0, employee.EmployeeID);
            Assert.Equal(string.Empty, employee.EmployeeName);
            Assert.Equal(string.Empty, employee.SSN);
            Assert.Equal(string.Empty, employee.Address);
            Assert.Equal(string.Empty, employee.City);
            Assert.Equal(string.Empty, employee.State);
            Assert.Equal(string.Empty, employee.Zip);
            Assert.Equal(string.Empty, employee.Phone);
            Assert.Equal(string.Empty, employee.Title);
            Assert.Equal(0, employee.Salary);
        }

        [Fact]
        public void Employee_PropertyAssignment_Works()
        {
            var employee = new Employee
            {
                EmployeeID = 1,
                EmployeeName = "Jane Doe",
                SSN = "123-45-6789",
                DateOfBirth = new DateTime(1990, 1, 1),
                Address = "123 Main St",
                City = "Metropolis",
                State = "NY",
                Zip = "10001",
                Phone = "555-1234",
                JoinDate = DateTime.Today,
                ExitDate = DateTime.Today.AddYears(1),
                Title = "Developer",
                Salary = 50000
            };
            Assert.Equal(1, employee.EmployeeID);
            Assert.Equal("Jane Doe", employee.EmployeeName);
            Assert.Equal("123-45-6789", employee.SSN);
            Assert.Equal("123 Main St", employee.Address);
            Assert.Equal("Metropolis", employee.City);
            Assert.Equal("NY", employee.State);
            Assert.Equal("10001", employee.Zip);
            Assert.Equal("555-1234", employee.Phone);
            Assert.Equal("Developer", employee.Title);
            Assert.Equal(50000, employee.Salary);
        }
    }
} 