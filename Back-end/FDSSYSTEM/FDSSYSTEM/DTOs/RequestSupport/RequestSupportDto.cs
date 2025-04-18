﻿
namespace FDSSYSTEM.DTOs
{
    public class RequestSupportDto
    {
        public string FullName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string PhoneNumber { get; set; }
        public string Address { get; set; }
        public string? Email { get; set; }
        public string Reason { get; set; }
        public int HouseholdSize { get; set; }
        public string SpecialMembers { get; set; }
        public string IncomeSource { get; set; }
        public List<string> RequestedItems { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;

    }
}
