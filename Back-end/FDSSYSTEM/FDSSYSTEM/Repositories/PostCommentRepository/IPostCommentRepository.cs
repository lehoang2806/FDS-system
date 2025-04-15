using FDSSYSTEM.Database;
using FDSSYSTEM.DTOs;
using FDSSYSTEM.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
namespace FDSSYSTEM.Repositories.PostCommentRepository
{
    public interface IPostCommentRepository : IMongoRepository<PostComment>
    {
        Task<List<PostComment>> GetByPostIdAsync(string postId); // Lấy bình luận theo bài viết
        Task<PostComment> GetByPostCommentIdAsync(string id);
    }

}
