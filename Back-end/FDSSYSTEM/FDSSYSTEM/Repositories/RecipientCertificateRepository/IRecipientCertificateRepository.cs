using FDSSYSTEM.Database;
using FDSSYSTEM.Models;

namespace FDSSYSTEM.Repositories.RecipientCertificateRepository;


public interface IRecipientCertificateRepository : IMongoRepository<RecipientCertificate>
{
    Task<RecipientCertificate> GetRecipientCertificateByIdAsync(string id);
}