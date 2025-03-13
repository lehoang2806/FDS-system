using FDSSYSTEM.Database;
using FDSSYSTEM.Models;
using FDSSYSTEM.Repositories.RecipientCertificateRepository;
using FDSSYSTEM.Repositories.UserRepository;
using MongoDB.Driver;

namespace FDSSYSTEM.Repositories.OrganizationDonorCertificateRepository;

public class RecipientCertificateRepository : MongoRepository<RecipientCertificate>, IRecipientCertificateRepository
{
    MongoDbContext _dbContext;
    public RecipientCertificateRepository(MongoDbContext dbContext) : base(dbContext.Database, "RecipientCertificate")
    {
        _dbContext = dbContext;
    }

    public async Task<RecipientCertificate> GetRecipientCertificateByIdAsync(string id)
    {
       var filter = Builders<RecipientCertificate>.Filter.Eq(p => p.RecipientCertificateId, id);
       var getbyId = await GetAllAsync(filter);
        return getbyId.FirstOrDefault();
    }
}