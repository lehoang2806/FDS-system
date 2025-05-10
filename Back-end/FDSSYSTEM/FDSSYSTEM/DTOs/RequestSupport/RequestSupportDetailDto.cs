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
        public List<string> CitizenIdImages { get; set; } // Thêm hình ảnh giấy tờ tùy thân

        // Thông tin liên hệ
        public string PhoneNumber { get; set; }
        public string Address { get; set; }
        public string Email { get; set; }

        // Hoàn cảnh và lý do hỗ trợ
        public string Reason { get; set; }
        public int HouseholdSize { get; set; }
        public string SpecialMembers { get; set; }
        public List<string> CircumstanceImages { get; set; } // Thêm hình ảnh hoàn cảnh

        public List<string> RequestedItems { get; set; }
        public DateTime CreatedDate { get; set; }
        public List<string>? Images { get; set; }



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