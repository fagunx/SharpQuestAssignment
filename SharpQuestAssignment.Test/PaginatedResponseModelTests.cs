using SharpQuestAssignment.Models;
using System.Collections.Generic;
using Xunit;

namespace SharpQuestAssignment.Test
{
    public class PaginatedResponseModelTests
    {
        [Fact]
        public void PaginatedResponse_Constructor_SetsProperties()
        {
            var data = new List<int> { 1, 2, 3 };
            var response = new PaginatedResponse<int>(data, 2, 10, 25);
            Assert.Equal(data, response.Data);
            Assert.Equal(2, response.PageNumber);
            Assert.Equal(10, response.PageSize);
            Assert.Equal(25, response.TotalCount);
            Assert.Equal(3, response.TotalPages);
        }

        [Fact]
        public void PaginatedResponse_HasPreviousAndNextPage()
        {
            var response = new PaginatedResponse<int>(new List<int>(), 2, 10, 25);
            Assert.True(response.HasPreviousPage);
            Assert.True(response.HasNextPage);

            var firstPage = new PaginatedResponse<int>(new List<int>(), 1, 10, 25);
            Assert.False(firstPage.HasPreviousPage);
            Assert.True(firstPage.HasNextPage);

            var lastPage = new PaginatedResponse<int>(new List<int>(), 3, 10, 25);
            Assert.True(lastPage.HasPreviousPage);
            Assert.False(lastPage.HasNextPage);
        }
    }
} 