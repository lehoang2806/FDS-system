using FDSSYSTEM.Database;
using FDSSYSTEM.Models;

namespace FDSSYSTEM.Repositories.OrganizationDonorCertificateRepository;


public interface IPersonalDonorCertificateRepository : IMongoRepository<PersonalDonorCertificate>
{
    Task<PersonalDonorCertificate> GetPersonalDonorCertificateByIdAsync(string id);
}