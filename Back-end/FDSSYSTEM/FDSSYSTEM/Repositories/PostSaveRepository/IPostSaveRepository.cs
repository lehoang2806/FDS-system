using FDSSYSTEM.Database;
using FDSSYSTEM.Models;
using System.Threading.Tasks;

namespace FDSSYSTEM.Repositories.PostSaveRepository
{
    public interface IPostSaveRepository : IMongoRepository<PostSave>
    {
        Task<PostSave> GetByPostIdAndUserIdAsync(string postId, string userId);
    }
}
