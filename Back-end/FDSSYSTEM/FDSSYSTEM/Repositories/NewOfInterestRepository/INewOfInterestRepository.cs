using FDSSYSTEM.Database;
using FDSSYSTEM.Models;
using System.Threading.Tasks;

namespace FDSSYSTEM.Repositories.NewOfInterestRepository
{
    public interface INewOfInterestRepository : IMongoRepository<NewOfInterest>
    {
        Task<NewOfInterest> GetByNewIdAndUserIdAsync(string newId, string userId);
    }
}
