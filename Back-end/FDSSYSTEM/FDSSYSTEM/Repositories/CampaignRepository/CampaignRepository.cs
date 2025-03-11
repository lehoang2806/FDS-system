using FDSSYSTEM.Database;
using FDSSYSTEM.Models;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FDSSYSTEM.Repositories.CampaignRepository
{
    public class CampaignRepository : MongoRepository<Campaign>, ICampaignRepository
    {
        MongoDbContext _dbContext;

        public CampaignRepository(MongoDbContext dbContext) : base(dbContext.Database, "Campaign")
        {
            _dbContext = dbContext;
        }

        public async Task<Campaign> GetLatestAsync()
        {
            var all = await GetAllAsync();
            return all.OrderByDescending(x => x.DateCreated).FirstOrDefault();
        }
    }
}
