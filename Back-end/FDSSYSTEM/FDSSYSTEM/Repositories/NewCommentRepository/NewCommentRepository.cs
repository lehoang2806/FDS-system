using FDSSYSTEM.Database;
using FDSSYSTEM.Models;
using MongoDB.Driver;

namespace FDSSYSTEM.Repositories.NewCommentRepository
{
    public class NewCommentRepository : MongoRepository<NewComment>, INewCommentRepository
    {

        MongoDbContext _dbContext;
        public NewCommentRepository(MongoDbContext dbContext) : base(dbContext.Database, "NewComment")
        {
            _dbContext = dbContext;
        }

        public async Task<List<NewComment>> GetByNewIdAsync(string newId)
        {
            var allComment = await GetAllAsync();
            return allComment.Where(x => x.NewId == newId).ToList();
        }
    }
}
