using System.Collections.Generic;
using System.Threading.Tasks;
using FDSSYSTEM.DTOs;
using FDSSYSTEM.Models;

public interface INewCommentService
{
    Task Create(NewCommentDto comment); // Tạo bình luận mới
    Task<List<NewComment>> GetByNewId(string newId); // Lấy bình luận theo bài viết
    Task<NewComment> GetById(string id); // Lấy bình luận theo ID
    Task Update(string id, NewCommentDto comment); // Cập nhật bình luận
    Task Delete(string id); // Xóa bình luận
}
