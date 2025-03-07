using FDSSYSTEM.Models;
using MongoDB.Driver;

namespace FDSSYSTEM.Repositories.PostCommentRepository
{
    public class PostCommentRepository : IPostCommentRepository
    {
        private readonly IMongoCollection<PostComment> _comments;

        public PostCommentRepository(IMongoDatabase database)
        {
            _comments = database.GetCollection<PostComment>("PostComments");
        }

        // Lấy tất cả bình luận
        public async Task<List<PostComment>> GetAllAsync()
        {
            return await _comments.Find(_ => true).ToListAsync();
        }

        // Lấy bình luận theo ID
        public async Task<PostComment> GetByIdAsync(string id)
        {
            return await _comments.Find(c => c.CommentId == id).FirstOrDefaultAsync();
        }

        // Lấy tất cả bình luận theo bài viết
        public async Task<List<PostComment>> GetByPostIdAsync(string postId)
        {
            return await _comments.Find(c => c.PostId == postId).ToListAsync();
        }

        // Thêm bình luận mới
        public async Task AddAsync(PostComment comment)
        {
            await _comments.InsertOneAsync(comment);
        }

        // Cập nhật bình luận
        public async Task UpdateAsync(string id, PostComment comment)
        {
            await _comments.ReplaceOneAsync(c => c.CommentId == id, comment);
        }

        // Xóa bình luận
        public async Task DeleteAsync(string id)
        {
            await _comments.DeleteOneAsync(c => c.CommentId == id);
        }
    }
}
