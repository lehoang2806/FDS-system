using FDSSYSTEM.Database;
using FDSSYSTEM.Models;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using FDSSYSTEM.Repositories.PostRepository;

namespace FDSSYSTEM.Repositories.RequestSupportRepository
{
    
    public class RequestSupportRepository : MongoRepository<RequestSupport>, IRequestSupportRepository

    {
        MongoDbContext _dbContext;
        public RequestSupportRepository(MongoDbContext dbContext) : base(dbContext.Database, "RequestSupport")
        {
            _dbContext = dbContext;
        }

        public async Task<RequestSupport> GetByRequestSupportIdAsync(string requestSupportId)
        {
            var filter = Builders<RequestSupport>.Filter.Eq(p => p.RequestSupportId, requestSupportId);
            var getbyId = await GetAllAsync(filter);
            return getbyId.FirstOrDefault();
        }
    }
}
