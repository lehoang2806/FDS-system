namespace FDSSYSTEM.DTOs
{
    public class CampaignRequestDonorSupportDto
    {
        public string RequestSupportId { get; set; } // ID của đơn yêu cầu hỗ trợ
        public List<string> Emails { get; set; } // Danh sách email nhà tài trợ
    }
}