namespace SharpQuestAssignment.Models
{
    public class EmployeeCreateDto
    {
        public string EmployeeName { get; set; } = string.Empty;
        public string SSN { get; set; } = string.Empty;
        public DateTime DateOfBirth { get; set; }
        public string Address { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public string Zip { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public DateTime JoinDate { get; set; }
        public DateTime? ExitDate { get; set; }
        public string Title { get; set; } = string.Empty;
        public decimal Salary { get; set; }
    }
} 