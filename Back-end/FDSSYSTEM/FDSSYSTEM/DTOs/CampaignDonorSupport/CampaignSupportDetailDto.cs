namespace FDSSYSTEM.DTOs.CampaignDonorSupport
{
    public class CampaignSupportDetailDto
    {
        public string CampaignDonorSupportId { get; set; }
        public string CampaignId { get; set; }
        public string CampaignName { get; set; }
        public string DonorId { get; set; }
        public string DonorFullName { get; set; }
        public DateTime CreatedDate { get; set; }
        public string Status { get; set; } //Pending, Accepted, Rejected
        public string DonorComment { get; set; } // donor comment khi accept hay reject sẽ comment
        public int GiftQuantity { get; set; }
        public DateTime UpdatedDate { get; set; }
    }
}
