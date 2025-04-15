namespace FDSSYSTEM.DTOs.CampaignFeedBack
{
    public class FeedBackResponseDto
    {
        public string FeedBackContent { get; set; }
        public List<string> Images { get; set; }
        public string FeedBackerId { get; set; }
        public string FeedBackerRole { get; set; }
        public string FeedBackerName { get; set; }
        public string CampaignId { get; set; }
    }
}
