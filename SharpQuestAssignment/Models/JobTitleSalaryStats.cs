namespace SharpQuestAssignment.Models
{
    public class JobTitleSalaryStats
    {
        public string Title { get; set; } = string.Empty;
        public decimal MinSalary { get; set; }
        public decimal MaxSalary { get; set; }
        public int EmployeeCount { get; set; }
    }
} 