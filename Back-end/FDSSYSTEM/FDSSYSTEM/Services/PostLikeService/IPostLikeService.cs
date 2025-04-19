using FDSSYSTEM.DTOs;
using System.Threading.Tasks;

namespace FDSSYSTEM.Services.PostLikeService
{
    public interface IPostLikeService
    {
        Task LikePost(string postId);
        Task UnlikePost(string postlikeId);
        Task<int> GetLikeCount(string postId);
    }
}
