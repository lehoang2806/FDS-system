using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System;

namespace FDSSYSTEM.Models
{
    public class RequestSupport
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string RequestSupportId { get; set; }
        public string CampaignId { get; set; }
        public string AccountId { get; set; }

        // Thông tin định danh
        public string FullName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public List<string> CitizenIdImages { get; set; } // Hình ảnh giấy tờ tùy thân (CMND/CCCD)

        // Thông tin liên hệ
        public string PhoneNumber { get; set; }
        public string Address { get; set; }
        public string Email { get; set; }
      
        /*public string RelativeContact { get; set; } // Số điện thoại của người thân để xác minh*/

        // Hoà /* public string LocalAuthorityContact { get; set; } // Số điện thoại hoặc thông tin liên hệ của chính quyền địa phương*/n cảnh và lý do hỗ trợ
        public string Reason { get; set; }
        public int HouseholdSize { get; set; }
        public List<string> SpecialMembers { get; set; } // Ví dụ: ["Người già", "Trẻ em", "Khuyết tật"]
        public List<string> CircumstanceImages { get; set; } // Hình ảnh minh họa hoàn cảnh (nhà ở, điều kiện sống, v.v.)

        // Thông tin tài chính
       /* public string IncomeSource { get; set; }*/
       /* public decimal MonthlyIncome { get; set; } // Thu nhập hàng tháng (cụ thể hóa để đánh giá mức độ cần hỗ trợ)*/

        // Yêu cầu hỗ trợ
        public List<string> RequestedItems { get; set; } // Danh sách vật phẩm yêu cầu
        public int DesiredQuantity { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;

        public string Status { get; set; } = "NotSend";//NotSend, Sent, Completed
        public int ApprovedQuantity { get; set; } = 0; // Tổng số lượng đã được duyệt từ các chiến dịch

        // Danh sách nhà tài trợ
        public List<SupportDonor> SupportDonor { get; set; } = new List<SupportDonor>();
    }

    public class SupportDonor
    {
        public string DonorId { get; set; } // ID của nhà tài trợ
        public string FullName { get; set; } // Tên nhà tài trợ
        public DateTime CreatedDate { get; set; } // Ngày gửi yêu cầu
        public string Status { get; set; } // Trạng thái: "Participating", "NotParticipating", "Pending"
    }
}