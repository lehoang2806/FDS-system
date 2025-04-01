using FDSSYSTEM.Database;
using FDSSYSTEM.DTOs;
using FDSSYSTEM.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
namespace FDSSYSTEM.Repositories.NewCommentRepository
{
    public interface INewCommentRepository : IMongoRepository<NewComment>
    {
        Task<List<NewComment>> GetByNewIdAsync(string newId); // Lấy bình luận theo bài viết
    }

}
