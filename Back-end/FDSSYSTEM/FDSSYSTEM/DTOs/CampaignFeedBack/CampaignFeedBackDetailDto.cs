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
        public IEnumerable<CampaignFeedBackLikeDetailDto> Likes { get; set; }
        public IEnumerable<CampaignFeedBackCommentDetailDto> Comments { get; set; }

        public List<ReplyFeedBackCommentDetail> Replies { get; set; }
    }

    public class ReplyFeedBackCommentDetail
    {
        public string ReplyFeedBackCommentId { get; set; }

        public string AccountId { get; set; }
        public string FullName {  get; set; }

        public string? Content { get; set; }
        public List<string> Images { get; set; }

        public DateTime? DateCreated { get; set; }

        public DateTime? DateUpdated { get; set; }

    }

    public class CampaignFeedBackLikeDetailDto
    {
        public string AccountId { get; set; }
        public string FullName { get; set; }
        public string CreatedDate { get; set; }
    }

    public class CampaignFeedBackCommentDetailDto
    {
        public string FullName { get; set; }
        public string Content { get; set; }
        public string CreatedDate { get; set; }
    }

}
