using FDSSYSTEM.Database;
using FDSSYSTEM.Models;
using MongoDB.Driver;

namespace FDSSYSTEM.Repositories.PostCommentRepository
{
    public class PostCommentRepository : MongoRepository<PostComment>, IPostCommentRepository
    {

        MongoDbContext _dbContext;
        public PostCommentRepository(MongoDbContext dbContext) : base(dbContext.Database, "PostComment")
        {
            _dbContext = dbContext;
        }

        public async Task<List<PostComment>> GetByPostIdAsync(string postId)
        {
            var allComment = await GetAllAsync();
            return allComment.Where(x => x.PostId == postId).ToList();
        }

        public async Task<PostComment> GetByPostCommentIdAsync(string id)
        {
            var filter = Builders<PostComment>.Filter.Eq(p => p.PostCommentId, id);
            var getbyId = await GetAllAsync(filter);
            return getbyId.FirstOrDefault();
        }
    }
}
