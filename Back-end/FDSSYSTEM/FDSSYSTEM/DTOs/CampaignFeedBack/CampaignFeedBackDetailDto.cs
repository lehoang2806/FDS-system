namespace FDSSYSTEM.DTOs.CampaignFeedBack
{
    public class CampaignFeedBackDetailDto
    {
        public string FeedBackId { get; set; }
        public DateTime CreatedDate { get; set; }
        public List<string> Images { get; set; }
        public string FeedBackerName { get; set; }
        public string FeedBackContent { get; set; } = null!;
        public string PublicDate { get; set; }
        public string FeedBackerId { get; set; }
        public string FeedBackerRole { get; set; }


        public IEnumerable<FeedBackLikeDetailDto> Likes { get; set; }
        public IEnumerable<FeedBackCommentDetailDto> Comments { get; set; }
    }

    public class FeedBackLikeDetailDto
    {
        public string AccountId { get; set; }
        public string FullName { get; set; }
        public string CreatedDate { get; set; }
    }

    public class FeedBackCommentDetailDto
    {
        public string FullName { get; set; }
        public string Content { get; set; }
        public string FileComment { get; set; }
        public string CreatedDate { get; set; }
    }
}
