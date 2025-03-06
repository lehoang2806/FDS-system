using FDSSYSTEM.Database;
using FDSSYSTEM.Models;
using FDSSYSTEM.Repositories.PostRepository;
using MongoDB.Driver;

namespace FDSSYSTEM.Repositories.NewRepository
{
    public class NewRepository : INewRepository
    {
        public Task AddAsync(New entity)
        {
            throw new NotImplementedException();
        }

        public Task DeleteAsync(string id)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<New>> GetAllAsync()
        {
            throw new NotImplementedException();
        }

        public Task<New> GetByIdAsync(string id)
        {
            throw new NotImplementedException();
        }

        public Task UpdateAsync(string id, New entity)
        {
            throw new NotImplementedException();
        }

        public class PostRepository : MongoRepository<New>, INewRepository

        {
            MongoDbContext _dbContext;
            public PostRepository(MongoDbContext dbContext) : base(dbContext.Database, "New")
            {
                _dbContext = dbContext;
            }
        }

    }
}
