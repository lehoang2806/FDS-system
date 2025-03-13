using FDSSYSTEM.Database;
using FDSSYSTEM.Models;

namespace FDSSYSTEM.Repositories.OrganizationDonorCertificateRepository;


public interface IOrganizationDonorCertificateRepository : IMongoRepository<OrganizationDonorCertificate>
{
    Task<OrganizationDonorCertificate> GetOrganizationDonorCertificateByIdAsync(string id);
}