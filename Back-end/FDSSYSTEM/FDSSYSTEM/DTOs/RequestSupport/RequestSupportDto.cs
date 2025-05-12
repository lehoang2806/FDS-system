namespace FDSSYSTEM.DTOs
{
    public class RequestSupportDto
    {
        // Thông tin định danh
        public string FullName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public List<string> CitizenIdImages { get; set; } // Hình ảnh giấy tờ tùy thân (CMND/CCCD)

        // Thông tin liên hệ
        public string PhoneNumber { get; set; }
        public string Address { get; set; }
        public string? Email { get; set; }


        // Hoàn cảnh và lý do hỗ trợ
        public string Reason { get; set; }
        public int HouseholdSize { get; set; }
        public List<string> SpecialMembers { get; set; } // Ví dụ: ["Người già", "Trẻ em", "Khuyết tật"]
        public List<string> CircumstanceImages { get; set; } // Hình ảnh minh họa hoàn cảnh (nhà ở, điều kiện sống, v.v.)


        // Yêu cầu hỗ trợ
        public List<string> RequestedItems { get; set; } // Danh sách vật phẩm yêu cầu
        public int DesiredQuantity { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;
      
    }
}