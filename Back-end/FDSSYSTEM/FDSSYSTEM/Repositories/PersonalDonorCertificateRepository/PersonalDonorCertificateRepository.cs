using FDSSYSTEM.Database;
using FDSSYSTEM.Models;
using FDSSYSTEM.Repositories.UserRepository;
using MongoDB.Driver;

namespace FDSSYSTEM.Repositories.OrganizationDonorCertificateRepository;

public class PersonalDonorCertificateRepository : MongoRepository<PersonalDonorCertificate>, IPersonalDonorCertificateRepository
{
    MongoDbContext _dbContext;
    public PersonalDonorCertificateRepository(MongoDbContext dbContext) : base(dbContext.Database, "PersonalDonorCertificate")
    {
        _dbContext = dbContext;
    }

  

    public async Task<PersonalDonorCertificate> GetPersonalDonorCertificateByIdAsync(string id)
    {
        var filter = Builders<PersonalDonorCertificate>.Filter.Eq(p => p.PersonalDonorCertificateId, id);
        var getbyId = await GetAllAsync(filter);
        return getbyId.FirstOrDefault();
    }
}