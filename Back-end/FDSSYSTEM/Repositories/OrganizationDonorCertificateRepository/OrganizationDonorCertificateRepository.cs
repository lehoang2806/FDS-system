using FDSSYSTEM.Database;
using FDSSYSTEM.Models;
using FDSSYSTEM.Repositories.UserRepository;
using MongoDB.Driver;

namespace FDSSYSTEM.Repositories.OrganizationDonorCertificateRepository;

public class OrganizationDonorCertificateRepository : MongoRepository<OrganizationDonorCertificate>, IOrganizationDonorCertificateRepository
{
    MongoDbContext _dbContext;
    public OrganizationDonorCertificateRepository(MongoDbContext dbContext) : base(dbContext.Database, "OrganizationDonorCertificate")
    {
        _dbContext = dbContext;
    }

    public async Task<OrganizationDonorCertificate> GetOrganizationDonorCertificateByIdAsync(string id)
    {
        var filter = Builders<OrganizationDonorCertificate>.Filter.Eq(p => p.OrganizationDonorCertificateId, id);
        var getbyId = await GetAllAsync(filter);
        return getbyId.FirstOrDefault();
    }

}