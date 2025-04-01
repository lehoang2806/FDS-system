using FDSSYSTEM.Database;
using FDSSYSTEM.Models;
using MongoDB.Driver;
using System.Threading.Tasks;
using System.Linq;

namespace FDSSYSTEM.Repositories.NewOfInterestRepository
{
    public class NewOfInterestRepository : MongoRepository<NewOfInterest>, INewOfInterestRepository
    {
        MongoDbContext _dbContext;

        public NewOfInterestRepository(MongoDbContext dbContext) : base(dbContext.Database, "NewOfInterest")
        {
            _dbContext = dbContext;
        }

        public async Task<NewOfInterest> GetByNewIdAndUserIdAsync(string newId, string userId)
        {
            var filter = Builders<NewOfInterest>.Filter.And(
                Builders<NewOfInterest>.Filter.Eq(p => p.NewId, newId),
                Builders<NewOfInterest>.Filter.Eq(p => p.AccountId, userId)
            );

            var result = await GetAllAsync(filter);
            return result.FirstOrDefault();
        }
    }
}
