namespace FDSSYSTEM.DTOs.CampaignFeedBack
{
    public class CampaignFeedBackDto
    {
        public string FeedBackId { get; set; }
        public string CampaignId { get; set; }
        public string FeedBackContent { get; set; }
        public string FileComment { get; set; }
        public List<string> Images { get; set; }
    }

    public class UpdateCampaignFeedBackDto
    {
        public string ReplyCampaignFeedbackId { get; set; }
        public string CampaignId { get; set; }
        public string FeedBackContent { get; set; }
        public List<string> Images { get; set; }
        public string FileComment { get; set; }
    }
}
