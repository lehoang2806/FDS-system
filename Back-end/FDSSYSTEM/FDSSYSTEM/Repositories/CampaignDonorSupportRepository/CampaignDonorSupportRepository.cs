using FDSSYSTEM.Database;
using FDSSYSTEM.Models;
using FDSSYSTEM.Repositories.FeedBackCommentRepository;

namespace FDSSYSTEM.Repositories.CampaignDonorSupportRepository
{
    public class CampaignDonorSupportRepository : MongoRepository<CampaignDonorSupport>, ICampaignDonorSupportRepository
    {

        MongoDbContext _dbContext;
        public CampaignDonorSupportRepository(MongoDbContext dbContext) : base(dbContext.Database, "CapaignDonorSupport")
        {
            _dbContext = dbContext;
        }

        public Task<List<CampaignDonorSupport>> GetByDonorIdAsync(string donorId)
        {
            throw new NotImplementedException();
        }

        public Task<CampaignFeedBack> GetByFeedBackByIdAsync(string feedbackId)
        {
            throw new NotImplementedException();
        }
    }
}
