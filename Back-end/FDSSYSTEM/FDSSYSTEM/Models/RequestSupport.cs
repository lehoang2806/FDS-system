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
        public string CitizenId { get; set; } // Số CMND/CCCD để xác minh danh tính
        public List<string> CitizenIdImages { get; set; } // Hình ảnh giấy tờ tùy thân (CMND/CCCD)

        // Thông tin liên hệ
        public string PhoneNumber { get; set; }
        public string Address { get; set; }
        public string Email { get; set; }
        public string LocalAuthorityContact { get; set; } // Số điện thoại hoặc thông tin liên hệ của chính quyền địa phương
        public string RelativeContact { get; set; } // Số điện thoại của người thân để xác minh

        // Hoàn cảnh và lý do hỗ trợ
        public string Reason { get; set; }
        public int HouseholdSize { get; set; }
        public string SpecialMembers { get; set; } // Thành viên đặc biệt (người già, trẻ em, khuyết tật, v.v.)
        public List<string> CircumstanceImages { get; set; } // Hình ảnh minh họa hoàn cảnh (nhà ở, điều kiện sống, v.v.)
        public string? LocalAuthorityConfirmation { get; set; } // Đường dẫn đến giấy xác nhận của chính quyền địa phương (nếu có)

        // Thông tin tài chính
        public string IncomeSource { get; set; }
        public decimal MonthlyIncome { get; set; } // Thu nhập hàng tháng (cụ thể hóa để đánh giá mức độ cần hỗ trợ)

        // Yêu cầu hỗ trợ
        public List<string> RequestedItems { get; set; } // Danh sách vật phẩm yêu cầu
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public List<string>? Images { get; set; } // Hình ảnh bổ sung (nếu cần)

        // Lịch sử nhận hỗ trợ
        public bool HasReceivedSupportBefore { get; set; } // Đã từng nhận hỗ trợ trước đây chưa?
        public string? PreviousSupportDetails { get; set; } // Chi tiết về hỗ trợ trước đây (nếu có)

        // Cam kết minh bạch
        public bool CommitmentToAccuracy { get; set; } // Cam kết thông tin cung cấp là chính xác
        public string? SignatureImage { get; set; } // Hình ảnh chữ ký của người yêu cầu (nếu có)

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