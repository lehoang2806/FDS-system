using FDSSYSTEM.Database;
using FDSSYSTEM.Models;
using MongoDB.Driver;
using System.Threading.Tasks;

namespace FDSSYSTEM.Repositories.DonorDonateRepository
{
    public class DonorDonateRepository : MongoRepository<DonorDonate>, IDonorDonateRepository
    {
        private readonly MongoDbContext _dbContext;

        public DonorDonateRepository(MongoDbContext dbContext) : base(dbContext.Database, "DonorDonate")
        {
            _dbContext = dbContext;
        }

        public async Task<DonorDonate> GetByIdAsync(string id)
        {
            var filter = Builders<DonorDonate>.Filter.Eq(d => d.DonorDonateId, id);
            var result = await GetAllAsync(filter);
            return result.FirstOrDefault();
        }

        public async Task DeleteAsync(FilterDefinition<DonorDonate> filter)
        {
            await _dbContext.Database.GetCollection<DonorDonate>("DonorDonate").DeleteOneAsync(filter);
        }
    }
}