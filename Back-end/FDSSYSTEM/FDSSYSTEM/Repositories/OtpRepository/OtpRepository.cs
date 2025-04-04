using FDSSYSTEM.Database;
using FDSSYSTEM.Models;
using MongoDB.Driver;

namespace FDSSYSTEM.Repositories.OtpRepository;

public class OtpRepository : MongoRepository<OtpCode>, IOtpRepository
{
    MongoDbContext _dbContext;
    public OtpRepository(MongoDbContext dbContext) : base(dbContext.Database, "OtpCode")
    {
        _dbContext = dbContext;
    }

    public async Task<OtpCode> GetLatestOtpCodeByEmail(string email)
    {
        var filter = Builders<OtpCode>.Filter.Eq(c => c.Email, email);
        var getbyId = await GetAllAsync(filter);
        if (getbyId != null)
        {
            return getbyId.OrderByDescending(x => x.ExpirationTime).FirstOrDefault();
        }
        return null;
    }
}