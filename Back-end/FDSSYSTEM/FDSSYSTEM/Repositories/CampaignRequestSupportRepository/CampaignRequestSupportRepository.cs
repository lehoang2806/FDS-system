using FDSSYSTEM.Database;
using FDSSYSTEM.Models;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FDSSYSTEM.Repositories.CampaignRepository
{
    public class CampaignRequestSupportRepository : MongoRepository<CampaignRequestSupport>, ICampaignRequestSupportRepository
    {
        MongoDbContext _dbContext;

        public CampaignRequestSupportRepository(MongoDbContext dbContext) : base(dbContext.Database, "CampaignRequestSupport")
        {
            _dbContext = dbContext;
        }

        public async Task<CampaignRequestSupport> GetLatestAsync()
        {
            var all = await GetAllAsync();
            return all.OrderByDescending(x => x.CreatedDate).FirstOrDefault();
        }

        public async Task DeleteByCampaignRequestSupportIdAsync(string campaignRequestSupportId)
        {
            var filter = Builders<CampaignRequestSupport>.Filter.Eq(c => c.CampaignRequestSupportId, campaignRequestSupportId);
            var result = await _collection.DeleteOneAsync(filter);
            if (result.DeletedCount == 0)
            {
                throw new Exception($"Không tìm thấy chiến dịch với CampaignId: {campaignRequestSupportId} để xóa.");
            }
        }
    }
}