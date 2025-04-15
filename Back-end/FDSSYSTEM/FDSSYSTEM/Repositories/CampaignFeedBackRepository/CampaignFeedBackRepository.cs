using FDSSYSTEM.Database;
using FDSSYSTEM.Models;
using FDSSYSTEM.Repositories.FeedBackCommentRepository;
using MongoDB.Driver;

namespace FDSSYSTEM.Repositories.FeedBackCommentRepository
{
    public class CampaignFeedBackRepository : MongoRepository<CampaignFeedBack>, ICampaignFeedBackRepository
    {

        MongoDbContext _dbContext;
        public CampaignFeedBackRepository(MongoDbContext dbContext) : base(dbContext.Database, "CapaignFeedback")
        {
            _dbContext = dbContext;
        }

        public async Task<List<CampaignFeedBack>> GetByFeedBackCampaignIdAsync(string campaignId)
        {
            var allComment = await GetAllAsync();
            return allComment.Where(x => x.CampaignId == campaignId).ToList();
        }

        public async Task<CampaignFeedBack> GetByFeedBackByIdAsync(string feedbackId)
        {
            var filter = Builders<CampaignFeedBack>.Filter.Eq(p => p.FeedBackId, feedbackId);
            var getbyId = await GetAllAsync(filter);
            return getbyId.FirstOrDefault();
        }
    }
}
