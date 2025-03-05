using FDSSYSTEM.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
namespace FDSSYSTEM.Services.PostCommentService
{
    public interface IPostCommentService
    {
        Task<List<PostComment>> GetByPostId(string postId);
        Task Create(PostComment postComment);
    }
}
