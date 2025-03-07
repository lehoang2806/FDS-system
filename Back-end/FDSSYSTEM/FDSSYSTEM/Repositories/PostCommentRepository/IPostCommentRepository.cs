using FDSSYSTEM.Database;
using FDSSYSTEM.DTOs;
using FDSSYSTEM.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
namespace FDSSYSTEM.Repositories.PostCommentRepository
{
    public interface IPostCommentRepository
    {
        Task<List<PostComment>> GetAllAsync();  // Lấy tất cả bình luận
        Task<PostComment> GetByIdAsync(string id); // Lấy bình luận theo ID
        Task<List<PostComment>> GetByPostIdAsync(string postId); // Lấy bình luận theo bài viết
        Task AddAsync(PostComment comment); // Thêm bình luận
        Task UpdateAsync(string id, PostComment comment); // Cập nhật bình luận
        Task DeleteAsync(string id); // Xóa bình luận
    }

}
