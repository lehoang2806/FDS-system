using FDSSYSTEM.DTOs;
using FDSSYSTEM.Models;
using FDSSYSTEM.Repositories.PostCommentRepository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FDSSYSTEM.Services.PostCommentService
{
    public class PostCommentService : IPostCommentService
    {
        private readonly IPostCommentRepository _postCommentRepository;

        public PostCommentService(IPostCommentRepository postCommentRepository)
        {
            _postCommentRepository = postCommentRepository;
        }

        // Tạo bình luận mới
        public async Task Create(PostCommentDto comment)
        {
            await _postCommentRepository.AddAsync(new PostComment
            {
                PostId = comment.PostId,
                AccountId = comment.AccountId,
                Content = comment.Content,
                DateCreated = DateTime.Now,
                DateUpdated = null,
                FileComment = Guid.NewGuid().ToString()
            });
        }

        // Lấy tất cả bình luận theo postId
        public async Task<List<PostComment>> GetByPostId(string postId)
        {
            return (await _postCommentRepository.GetByPostIdAsync(postId)).ToList();
        }

        // Lấy bình luận theo Id
        public async Task<PostComment> GetById(string id)
        {
            return await _postCommentRepository.GetByIdAsync(id);
        }

        // Cập nhật bình luận
        public async Task Update(string id, PostCommentDto comment)
        {
            var existingComment = await _postCommentRepository.GetByIdAsync(id);
            if (existingComment != null)
            {
                existingComment.Content = comment.Content;
                existingComment.DateUpdated = DateTime.Now;

                await _postCommentRepository.UpdateAsync(id, existingComment);
            }
        }

        // Xóa bình luận
        public async Task Delete(string id)
        {
            await _postCommentRepository.DeleteAsync(id);
        }
    }
}
