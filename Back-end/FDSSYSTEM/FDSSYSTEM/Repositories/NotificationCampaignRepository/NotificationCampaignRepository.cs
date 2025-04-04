using FDSSYSTEM.Database;
using FDSSYSTEM.Models;
using FDSSYSTEM.Repositories.CampaignRepository;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
namespace FDSSYSTEM.Repositories.NotificationCampaignRepository
{
    public class NotificationCampaignRepository : MongoRepository<NotificationCampaign>, INotificationCampaignRepostoy
    {
        MongoDbContext _dbContext;

        public NotificationCampaignRepository(MongoDbContext dbContext) : base(dbContext.Database, "NotificationCampaign")
        {
            _dbContext = dbContext;
        }
        public async Task<NotificationCampaign> GetNotificationCampaignIdAsync(string id)
        {
            var filter = Builders<NotificationCampaign>.Filter.Eq(p => p.NotificationCampaignId, id);
            var getbyId = await GetAllAsync(filter);
            return getbyId.FirstOrDefault();
        }

        
    }
}
