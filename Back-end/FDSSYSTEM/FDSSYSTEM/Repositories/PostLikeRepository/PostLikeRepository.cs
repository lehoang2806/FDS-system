using FDSSYSTEM.Database;
using FDSSYSTEM.Models;
using MongoDB.Driver;
using System.Threading.Tasks;
using System.Linq;

namespace FDSSYSTEM.Repositories.PostLikeRepository
{
    public class PostLikeRepository : MongoRepository<PostLike>, IPostLikeRepository
    {
        MongoDbContext _dbContext;

        public PostLikeRepository(MongoDbContext dbContext) : base(dbContext.Database, "PostLike")
        {
            _dbContext = dbContext;
        }

        public async Task<PostLike> GetByPostIdAndUserIdAsync(string postId, string userId)
        {
            var filter = Builders<PostLike>.Filter.And(
                Builders<PostLike>.Filter.Eq(p => p.PostId, postId),
                Builders<PostLike>.Filter.Eq(p => p.AccountId, userId)
            );

            var result = await GetAllAsync(filter);
            return result.FirstOrDefault();
        }
    }
}
