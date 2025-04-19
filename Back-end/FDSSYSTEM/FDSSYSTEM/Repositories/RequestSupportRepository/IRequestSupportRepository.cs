using FDSSYSTEM.Database;
using FDSSYSTEM.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
namespace FDSSYSTEM.Repositories.RequestSupportRepository
{
    public interface IRequestSupportRepository : IMongoRepository<RequestSupport>
    {
        // Task<Post> GetMostAsync();
        Task<RequestSupport> GetByRequestSupportIdAsync(string requestSupportId);
    }
}
