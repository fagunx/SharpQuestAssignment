using Microsoft.Extensions.Configuration;
using Moq;
using SharpQuestAssignment.Repository;
using Xunit;

namespace SharpQuestAssignment.Test
{
    public class EmployeeRepositoryTests
    {
        [Fact]
        public void Constructor_SetsConfiguration()
        {
            var mockConfig = new Mock<IConfiguration>();
            var repo = new EmployeeRepository(mockConfig.Object);
            Assert.NotNull(repo);
        }
    }
} 