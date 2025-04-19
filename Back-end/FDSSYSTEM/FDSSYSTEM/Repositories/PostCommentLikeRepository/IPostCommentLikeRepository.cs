using FDSSYSTEM.Database;
using FDSSYSTEM.Models;

namespace FDSSYSTEM.Repositories.PostCommentLikeRepository
{
    public interface IPostCommentLikeRepository : IMongoRepository<PostCommentLike>
    {
        Task<PostCommentLike> GetByPostCommentLikeIdAndUserIdAsync(string postCommentLikeId, string userId);
    }
}
