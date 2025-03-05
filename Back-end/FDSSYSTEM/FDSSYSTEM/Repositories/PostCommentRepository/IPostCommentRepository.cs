using FDSSYSTEM.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
namespace FDSSYSTEM.Repositories.PostCommentRepository
{
    public interface IPostCommentRepository
    {
        Task<List<PostComment>> GetByPostId(string postId);
        Task Create(PostComment postComment);
    }
}
