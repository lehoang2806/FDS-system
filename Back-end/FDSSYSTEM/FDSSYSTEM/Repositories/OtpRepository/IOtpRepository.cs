using FDSSYSTEM.Database;
using FDSSYSTEM.Models;

namespace FDSSYSTEM.Repositories.OtpRepository;

public interface IOtpRepository : IMongoRepository<OtpCode>
{
    Task<OtpCode> GetLatestOtpCodeByEmail(string email);
}
