using FDSSYSTEM.Database;
using FDSSYSTEM.Models;

namespace FDSSYSTEM.Repositories.FeedBackLikeRepository
{
    public interface ICampaignFeedBackLikeRepository : IMongoRepository<CampaignFeedBackLike>
    {
        Task<CampaignFeedBackLike> GetByFeedBackIdAndUserIdAsync(string feedBackId, string userId);
    }
}
