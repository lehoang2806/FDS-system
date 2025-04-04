using FDSSYSTEM.Database;
using FDSSYSTEM.Models;
using MongoDB.Driver;
using System.Threading.Tasks;
using System.Linq;

namespace FDSSYSTEM.Repositories.PostSaveRepository
{
    public class PostSaveRepository : MongoRepository<PostSave>, IPostSaveRepository
    {
        MongoDbContext _dbContext;

        public PostSaveRepository(MongoDbContext dbContext) : base(dbContext.Database, "PostSave")
        {
            _dbContext = dbContext;
        }

        public async Task<PostSave> GetByPostIdAndUserIdAsync(string postId, string userId)
        {
            var filter = Builders<PostSave>.Filter.And(
                Builders<PostSave>.Filter.Eq(p => p.PostId, postId),
                Builders<PostSave>.Filter.Eq(p => p.AccountId, userId)
            );

            var result = await GetAllAsync(filter);
            return result.FirstOrDefault();
        }
    }
}
