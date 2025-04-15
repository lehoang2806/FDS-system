using FDSSYSTEM.Database;
using FDSSYSTEM.Models;

namespace FDSSYSTEM.Repositories.FeedBackCommentRepository
{
    public interface ICampaignFeedBackRepository : IMongoRepository<CampaignFeedBack>
    {
        Task<List<CampaignFeedBack>> GetByFeedBackCampaignIdAsync(string campaignId); // Lấy bình luận theo bài viết
        Task<CampaignFeedBack> GetByFeedBackByIdAsync(string feedbackId);
    }
}
