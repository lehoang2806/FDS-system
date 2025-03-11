using FDSSYSTEM.Database;
using FDSSYSTEM.Models;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
namespace FDSSYSTEM.Repositories.PostRepository
{
    public class PostRepository : MongoRepository<Post>, IPostRepository

    {
        MongoDbContext _dbContext;
        public PostRepository(MongoDbContext dbContext) : base(dbContext.Database, "Post")
        {
            _dbContext = dbContext;
        }

    
    }
}
