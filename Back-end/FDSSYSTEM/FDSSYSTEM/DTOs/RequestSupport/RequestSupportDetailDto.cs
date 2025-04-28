namespace FDSSYSTEM.DTOs.RequestSupport
{
    public class RequestSupportDetailDto
    {
        public string RequestSupportId { get; set; }
        public string CampaignId { get; set; }
        public string AccountId { get; set; }

        // Thông tin định danh
        public string FullName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string CitizenId { get; set; } // Thêm số CMND/CCCD
        public List<string> CitizenIdImages { get; set; } // Thêm hình ảnh giấy tờ tùy thân

        // Thông tin liên hệ
        public string PhoneNumber { get; set; }
        public string Address { get; set; }
        public string Email { get; set; }
        public string LocalAuthorityContact { get; set; } // Thêm thông tin liên hệ chính quyền địa phương
        public string RelativeContact { get; set; } // Thêm thông tin liên hệ người thân

        // Hoàn cảnh và lý do hỗ trợ
        public string Reason { get; set; }
        public int HouseholdSize { get; set; }
        public string SpecialMembers { get; set; }
        public List<string> CircumstanceImages { get; set; } // Thêm hình ảnh hoàn cảnh
        public string? LocalAuthorityConfirmation { get; set; } // Thêm giấy xác nhận của chính quyền

        // Thông tin tài chính
        public string IncomeSource { get; set; }
        public decimal MonthlyIncome { get; set; } // Thêm thu nhập hàng tháng

        // Yêu cầu hỗ trợ
        public List<string> RequestedItems { get; set; }
        public DateTime CreatedDate { get; set; }
        public List<string>? Images { get; set; }

        // Lịch sử nhận hỗ trợ
        public bool HasReceivedSupportBefore { get; set; } // Thêm thông tin lịch sử nhận hỗ trợ
        public string? PreviousSupportDetails { get; set; } // Thêm chi tiết hỗ trợ trước đây

        // Cam kết minh bạch
        public bool CommitmentToAccuracy { get; set; } // Thêm cam kết minh bạch
        public string? SignatureImage { get; set; } // Thêm hình ảnh chữ ký

        // Danh sách nhà tài trợ
        public List<SupportDonorDto> SupportDonors { get; set; } = new List<SupportDonorDto>(); // Đã có, khởi tạo mặc định để tránh null
    }

    public class SupportDonorDto
    {
        public string DonorId { get; set; }
        public string FullName { get; set; }
        public DateTime CreatedDate { get; set; }
        public string Status { get; set; } // Trạng thái: "Participating", "NotParticipating", "Pending"
    }
}