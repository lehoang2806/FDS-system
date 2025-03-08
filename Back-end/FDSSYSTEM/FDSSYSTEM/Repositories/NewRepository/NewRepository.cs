using FDSSYSTEM.Database;
using FDSSYSTEM.Models;
using FDSSYSTEM.Repositories.PostRepository;
using MongoDB.Driver;

namespace FDSSYSTEM.Repositories.NewRepository
{
    public class NewRepository :MongoRepository<New>, INewRepository
    {
        MongoDbContext _dbContext;
        public NewRepository(MongoDbContext dbContext) : base(dbContext.Database, "New")
        {
            _dbContext = dbContext;
        }

        public Task DeleteAsync(FilterDefinition<New> filter)
        {
            throw new NotImplementedException();
        }

        public async Task<New> GetByIdAsync(string id)
        {
            var filter = Builders<New>.Filter.Eq(news => news.NewId, id);
            var getbyId = await GetAllAsync(filter);
            return getbyId.FirstOrDefault();
        }

     
    }
}
