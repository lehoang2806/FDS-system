using FDSSYSTEM.DTOs;
using FDSSYSTEM.DTOs.Posts;
using FDSSYSTEM.Models;
using FDSSYSTEM.Repositories.PostCommentRepository;
using FDSSYSTEM.Repositories.PostRepository;
using FDSSYSTEM.Repositories.UserRepository;
using FDSSYSTEM.Services.NotificationService;
using FDSSYSTEM.Services.UserContextService;
using FDSSYSTEM.Services.UserService;
using FDSSYSTEM.SignalR;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Hosting;
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
        private readonly IUserRepository _userRepository;
        private readonly IUserService _userService;
        private readonly INotificationService _notificationService;
        private readonly IPostRepository _postRepository;
        private readonly IHubContext<NotificationHub> _hubNotificationContext;

        public PostCommentService(IPostCommentRepository postCommentRepository
             , IUserContextService userContextService, IUserService userService
            , INotificationService notificationService
            , IHubContext<NotificationHub> hubContext
            , IPostRepository postRepository)
        {
            _postCommentRepository = postCommentRepository;
            _userContextService = userContextService;
            _hubNotificationContext = hubContext;
            _notificationService = notificationService;
            _userService = userService;
            _postRepository = postRepository;
        }

        // Tạo bình luận mới
        public async Task Create(PostCommentDto comment)
        {
            if (string.IsNullOrEmpty(comment.PostCommentId))
            {
                //Đây là trường hợp tạo bình luận
                await _postCommentRepository.AddAsync(new PostComment
                {
                    PostCommentId = Guid.NewGuid().ToString(),
                    PostId = comment.PostId,
                    AccountId = _userContextService.UserId ?? "",
                    Content = comment.Content,
                    DateCreated = DateTime.Now,
                    Images = comment.Images,
                    
                });

                // Lấy thông tin người tạo bài viết
                var post = await _postRepository.GetByPostIdAsync(comment.PostId);
                if (post != null)
                {
                    var notificationDto = new NotificationDto
                    {
                        Title = "Bài đăng của bạn vừa có bình luận mới",
                        Content = "Một người dùng vừa bình luận trên bài đăng của bạn.",
                        NotificationType = "Comment",
                        ObjectType = "Post",
                        OjectId = comment.PostId,
                        AccountId = post.AccountId
                    };
                    await _notificationService.AddNotificationAsync(notificationDto);
                    await _hubNotificationContext.Clients.User(post.AccountId).SendAsync("ReceiveNotification", notificationDto);
                }
            }
            else
            {
                //Đây là trả lời bình luận
                var postComment = await _postCommentRepository.GetByPostCommentIdAsync(comment.PostCommentId);
                if (postComment != null)
                {
                    if (postComment.Replies == null)
                    {
                        postComment.Replies = new List<ReplyPostComment>();
                    }
                    postComment.Replies.Add(new ReplyPostComment
                    {
                        ReplyPostCommentId = Guid.NewGuid().ToString(),
                        PostCommentId = postComment.PostCommentId,
                        AccountId = _userContextService.UserId ?? "",
                        Content = comment.Content,
                        DateCreated = DateTime.Now,
                        Images = comment.Images,
                    });
                    await _postCommentRepository.UpdateAsync(postComment.Id, postComment);

                    //gửi thông báo cho người bình luận
                    var notificationDto = new NotificationDto
                    {
                        Title = "Bài đăng của bạn vừa có bình luận mới",
                        Content = "Một người dùng vừa bình luận trên bài đăng của bạn.",
                        NotificationType = "Comment",
                        ObjectType = "Post",
                        OjectId = comment.PostId,
                        AccountId = postComment.AccountId
                    };
                    await _notificationService.AddNotificationAsync(notificationDto);
                    await _hubNotificationContext.Clients.User(postComment.AccountId).SendAsync("ReceiveNotification", notificationDto);

                }
            }



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
        public async Task Update(string id, UpdatePostCommentDto comment)
        {
            var existingComment = await GetById(id);
            if (existingComment != null)
            {
                if (string.IsNullOrEmpty(comment.ReplyPostCommentId))
                {
                    //cập nhật bình luận
                    existingComment.Content = comment.Content;
                    existingComment.DateUpdated = DateTime.Now;
                    existingComment.Images = comment.Images;

                }
                else
                {
                    //cập nhật trả lời bình luận
                    if (existingComment.Replies != null)
                    {
                        foreach (var rp in existingComment.Replies)
                        {
                            if (rp.ReplyPostCommentId.Equals(comment.ReplyPostCommentId, StringComparison.OrdinalIgnoreCase))
                            {
                                rp.Content = comment.Content;
                                rp.DateUpdated = DateTime.Now;
                                rp.Images = comment.Images;
                                break;
                            }
                        }
                    }
                }
                await _postCommentRepository.UpdateAsync(existingComment.Id, existingComment);
            }
        }

        // Xóa bình luận
        public async Task Delete(string id)
        {
            await _postCommentRepository.DeleteAsync(id);
        }


    }
}
