using FDSSYSTEM.Database;
using FDSSYSTEM.Models;
using System.Threading.Tasks;

namespace FDSSYSTEM.Repositories.PostLikeRepository
{
    public interface IPostLikeRepository : IMongoRepository<PostLike>
    {
        Task<PostLike> GetByPostLikeIdAndUserIdAsync(string postlikeId, string userId);
    }
}
