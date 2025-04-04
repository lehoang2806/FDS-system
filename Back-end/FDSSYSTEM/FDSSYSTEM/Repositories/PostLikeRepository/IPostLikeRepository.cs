using FDSSYSTEM.Database;
using FDSSYSTEM.Models;
using System.Threading.Tasks;

namespace FDSSYSTEM.Repositories.PostLikeRepository
{
    public interface IPostLikeRepository : IMongoRepository<PostLike>
    {
        Task<PostLike> GetByPostIdAndUserIdAsync(string postId, string userId);
    }
}
