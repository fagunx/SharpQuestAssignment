# SharpQuestAssignment

# SharpQuestAssignment

A full-stack programming exercise solution for the SharpQuest interview assignment, demonstrating the ability to build a simple employee management system using modern development practices and clean, maintainable code.

---

## 📋 Exercise Overview

This application is a solution to the given interview exercise that includes:

- Setting up a database with employee and salary details
- Generating realistic data for 100+ employees
- Providing options to list, search, and add employees
- Building **self-hosted web** application to demonstrate CRUD and query capabilities

---

## 🛠️ Tech Stack

> _(Modify based on your actual implementation)_

- **Backend**: .NET 8 ASP.NET Core Web App  
- **Frontend**: Angular
- **Database**: SQL Server 
- **ORM / DB Access**: Dapper 

---

## 🚀 Features

Depending on the option chosen, the app supports:

### Console Mode (`ManageEmployee.exe`)
- `-list`: Lists all employees
- `-titles`: Lists all distinct titles with min/max salaries
- `-add`: Prompts to add a new employee

### Web Mode (Self-Hosted)
- ✅ View all employees and their current salaries
- 🔍 Search employees by name or title
- 📊 View all job titles with min/max salary
- ➕ Add a new employee with required details

---

## 🧱 Database Design

### Tables:

#### `Employee`
- `EmployeeId` (PK, Identity)
- `Name`, `SSN`, `DOB`, `Address`, `City`, `State`, `Zip`, `Phone`
- `JoinDate`, `ExitDate`

#### `EmployeeSalary`
- `EmployeeSalaryId` (PK, Identity)
- `EmployeeId` (FK)
- `FromDate`, `ToDate`, `Title`, `Salary`

### Seed Data
- 100+ employees between age 22–64
- 1+ salary record per employee
- Realistic names and address info
- Sample data generated using ChatGPT and internet resources

---

## 🧪 Getting Started

### Prerequisites
- [.NET SDK 8+](https://dotnet.microsoft.com/download)
- SQL Server / MySQL / SQLite
- Git

### Installation

```bash
git clone https://github.com/fagunx/SharpQuestAssignment.git
cd SharpQuestAssignment

# Optional: setup database
# e.g., update connection string in appsettings.json

# For Console App
dotnet build
dotnet run -- -list

# For Web App (if applicable)
dotnet run
