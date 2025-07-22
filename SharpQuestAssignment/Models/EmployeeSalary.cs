using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace SharpQuestAssignment.Models
{
    public class EmployeeSalary
    {
        public int EmployeeSalaryID { get; set; }

        public int EmployeeID { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime? ToDate { get; set; }

        public string Title { get; set; } = string.Empty;

        public decimal? Salary { get; set; }

        public Employee Employee { get; set; } = null!;
    }
}
