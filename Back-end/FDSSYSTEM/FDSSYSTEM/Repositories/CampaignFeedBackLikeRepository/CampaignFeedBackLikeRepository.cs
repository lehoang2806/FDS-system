using FDSSYSTEM.Database;
using FDSSYSTEM.Models;
using FDSSYSTEM.Repositories.FeedBackLikeRepository;
using MongoDB.Driver;

namespace FDSSYSTEM.Repositories.FeedBackLikeRepository
{
    public class CampaignFeedBackLikeRepository : MongoRepository<CampaignFeedBackLike>, ICampaignFeedBackLikeRepository
    {
        MongoDbContext _dbContext;

        public CampaignFeedBackLikeRepository(MongoDbContext dbContext) : base(dbContext.Database, "FeedBackLike")
        {
            _dbContext = dbContext;
        }

        public async Task<CampaignFeedBackLike> GetByFeedBackIdAndUserIdAsync(string feedBackId, string userId)
        {
            var filter = Builders<CampaignFeedBackLike>.Filter.And(
                Builders<CampaignFeedBackLike>.Filter.Eq(p => p.FeedBackId, feedBackId),
                Builders<CampaignFeedBackLike>.Filter.Eq(p => p.AccountId, userId)
            );

            var result = await GetAllAsync(filter);
            return result.FirstOrDefault();
        }
    }
}
