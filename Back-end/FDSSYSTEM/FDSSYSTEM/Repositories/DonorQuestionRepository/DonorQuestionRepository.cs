using FDSSYSTEM.Database;
using FDSSYSTEM.Models;

namespace FDSSYSTEM.Repositories.DonorQuestionRepository
{
    public class DonorQuestionRepository : MongoRepository<DonorQuestion>, IDonorQuestionRepository

    {
        MongoDbContext _dbContext;
        public DonorQuestionRepository(MongoDbContext dbContext) : base(dbContext.Database, "DonorQuestion")
        {
            _dbContext = dbContext;
        }
    }
}
