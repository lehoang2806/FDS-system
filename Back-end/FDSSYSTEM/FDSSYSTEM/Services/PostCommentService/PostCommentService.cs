using FDSSYSTEM.DTOs;
using FDSSYSTEM.Models;
using FDSSYSTEM.Repositories.PostCommentRepository;
using FDSSYSTEM.Services.UserContextService;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FDSSYSTEM.Services.PostCommentService
{
    public class PostCommentService : IPostCommentService
    {
        private readonly IPostCommentRepository _postCommentRepository;
        private readonly IUserContextService _userContextService;

        public PostCommentService(IPostCommentRepository postCommentRepository,
              IUserContextService userContextService)
        {
            _postCommentRepository = postCommentRepository;
            _userContextService = userContextService;
        }

        // Tạo bình luận mới
        public async Task Create(PostCommentDto comment)
        {
            await _postCommentRepository.AddAsync(new PostComment
            {
                PostId = comment.PostId,
                AccountId = _userContextService.UserId ?? "",
                Content = comment.Content,
                DateCreated = DateTime.Now,
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
            var filter = Builders<PostComment>.Filter.Eq(c => c.PostCommentId, id);
            var getbyId = await _postCommentRepository.GetAllAsync(filter);
            return getbyId.FirstOrDefault();
        }

        // Cập nhật bình luận
        public async Task Update(string id, PostCommentDto comment)
        {
            var existingComment = await GetById(id);
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
