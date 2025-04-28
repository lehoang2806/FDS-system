namespace FDSSYSTEM.DTOs.RequestSupport
{
    public class RequestSupportWithCreatorDto
    {
        public string RequestSupportId { get; set; }
        public string CampaignId { get; set; }
        public string AccountId { get; set; }

        // Thông tin định danh
        public string FullName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string CitizenId { get; set; }
        public List<string> CitizenIdImages { get; set; }

        // Thông tin liên hệ
        public string PhoneNumber { get; set; }
        public string Address { get; set; }
        public string Email { get; set; }
        public string LocalAuthorityContact { get; set; }
        public string RelativeContact { get; set; }

        // Hoàn cảnh và lý do hỗ trợ
        public string Reason { get; set; }
        public int HouseholdSize { get; set; }
        public string SpecialMembers { get; set; }
        public List<string> CircumstanceImages { get; set; }
        public string? LocalAuthorityConfirmation { get; set; }

        // Thông tin tài chính
        public string IncomeSource { get; set; }
        public decimal MonthlyIncome { get; set; }

        // Yêu cầu hỗ trợ
        public List<string> RequestedItems { get; set; }
        public DateTime CreatedDate { get; set; }
        public List<string>? Images { get; set; }

        // Lịch sử nhận hỗ trợ
        public bool HasReceivedSupportBefore { get; set; }
        public string? PreviousSupportDetails { get; set; }

        // Cam kết minh bạch
        public bool CommitmentToAccuracy { get; set; }
        public string? SignatureImage { get; set; }

        // Danh sách nhà tài trợ
        public List<SupportDonorDto> SupportDonors { get; set; } = new List<SupportDonorDto>(); // Thêm trường này
    }
}