using FDSSYSTEM.Database;
using FDSSYSTEM.Models;
using FDSSYSTEM.Repositories.FeedBackLikeRepository;
using MongoDB.Driver;

namespace FDSSYSTEM.Repositories.PostCommentLikeRepository
{
 
    public class PostCommentLikeRepository : MongoRepository<PostCommentLike>, IPostCommentLikeRepository
    {
        MongoDbContext _dbContext;

        public PostCommentLikeRepository(MongoDbContext dbContext) : base(dbContext.Database, "PostCommentLike")
        {
            _dbContext = dbContext;
        }

        public async Task<PostCommentLike> GetByPostCommentLikeIdAndUserIdAsync(string postCommentLikeId, string userId)
        {
            var filter = Builders<PostCommentLike>.Filter.And(
                Builders<PostCommentLike>.Filter.Eq(p => p.PostCommentLikeId, postCommentLikeId),
                Builders<PostCommentLike>.Filter.Eq(p => p.AccountId, userId)
            );

            var result = await GetAllAsync(filter);
            return result.FirstOrDefault();
        }
    }
}
