using FDSSYSTEM.DTOs.Posts;
using FDSSYSTEM.Models;

namespace FDSSYSTEM.DTOs.CampaignFeedBack
{
    public class CampaignFeedBackDetailDto
    {
        public required string FeedBackId { get; set; }

        public string CampaignId { get; set; }

        public string AccountId { get; set; }
        public string FullName { get; set; }

        public string? Content { get; set; }


        public List<string> Images { get; set; }

        public DateTime? DateCreated { get; set; }

        public DateTime? DateUpdated { get; set; }
        public List<CampaignFeedBackLikeDetailDto> Likes { get; set; }

        public List<ReplyFeedBackDetail> Replies { get; set; }
    }

    public class ReplyFeedBackDetail
    {
        public string ReplyFeedBackId { get; set; }

        public string AccountId { get; set; }
        public string FullName {  get; set; }

        public string? Content { get; set; }
        public List<string> Images { get; set; }

        public DateTime? DateCreated { get; set; }

        public DateTime? DateUpdated { get; set; }

        public List<CampaignFeedBackLikeDetailDto> Likes { get; set; }


    }

    public class CampaignFeedBackLikeDetailDto
    {
        public string FeedBackLikeId { get; set; }
        public string AccountId { get; set; }
        public string FullName { get; set; }
        public DateTime CreatedDate { get; set; }
    }

}
