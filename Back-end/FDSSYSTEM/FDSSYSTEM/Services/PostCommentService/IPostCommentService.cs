using System.Collections.Generic;
using System.Threading.Tasks;
using FDSSYSTEM.DTOs;
using FDSSYSTEM.Models;

public interface IPostCommentService
{
    Task Create(PostCommentDto comment); // Tạo bình luận mới
    Task<List<PostComment>> GetByPostId(string postId); // Lấy bình luận theo bài viết
    Task<PostComment> GetById(string id); // Lấy bình luận theo ID
    Task Update(string id, PostCommentDto comment); // Cập nhật bình luận
    Task Delete(string id); // Xóa bình luận
}
