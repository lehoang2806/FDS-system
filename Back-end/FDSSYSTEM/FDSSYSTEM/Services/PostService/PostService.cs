using FDSSYSTEM.DTOs;
using FDSSYSTEM.Models;
using FDSSYSTEM.Repositories.PostRepository;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;
using FDSSYSTEM.Services.UserContextService;
using FDSSYSTEM.Services.UserService;
using FDSSYSTEM.SignalR;
using Mapster;
using Microsoft.AspNetCore.SignalR;
using FDSSYSTEM.Repositories.UserRepository;
using FDSSYSTEM.Services.NotificationService;
namespace FDSSYSTEM.Services.PostService

{
    public class PostService : IPostService
    {
        private readonly IPostRepository _postRepository;
        private readonly IUserService _userService;
        private readonly IUserContextService _userContextService;
        private readonly INotificationService _notificationService;
        private readonly IHubContext<NotificationHub> _hubNotificationContext;

        public PostService(IPostRepository postRepository
            , IUserContextService userContextService, IUserService userService
            , INotificationService notificationService
            , IHubContext<NotificationHub> hubContext
            )
        {
            _postRepository = postRepository;
            _userContextService = userContextService;
            _userService = userService;
            _notificationService = notificationService;
            _hubNotificationContext = hubContext;
        }

        public async Task Create(PostDto post)
        {
            var newPost = new Post
            {
                PostText = post.PostText,
                CreatedDate = DateTime.Now,
                PostId = Guid.NewGuid().ToString(),
                Images = post.Images,
            };
            await _postRepository.AddAsync(newPost);

            //Send notifiction all staff and admin
            var userReceiveNotifications = await _userService.GetAllAdminAndStaffId();
            foreach (var userId in userReceiveNotifications)
            {
                var notificationDto = new NotificationDto
                {
                    Title = "Có một bài đăng mới được tạo",
                    Content = "Có một bài đăng mới được tạo ra",
                    NotificationType = "Approve",
                    ObjectType = "Post",
                    OjectId = newPost.PostId,
                    AccountId = userId
                };
                //save notifiation to db
                await _notificationService.AddNotificationAsync(notificationDto);
                //send notification via signalR
                await _hubNotificationContext.Clients.User(notificationDto.AccountId).SendAsync("ReceiveNotification", notificationDto);
            }

        }

        public Task Delete(string id)
        {
            throw new NotImplementedException();
        }

        public async Task<List<Post>> GetAll()
        {
           return (await _postRepository.GetAllAsync()).ToList();
        }

        public async Task<Post> GetById(string id)
        {
            return await _postRepository.GetByPostIdAsync(id);
        }

        public async Task Update(string id, PostDto postDto)
        {
            var post = await _postRepository.GetByPostIdAsync(id);
            post.PostFile = postDto.PostFile;
            post.Images = postDto.Images;
            post.Content = postDto.Content;
            post.PostText = postDto.PostText;

            await _postRepository.UpdateAsync(post.Id, post);

            var userReceiveNotifications = await _userService.GetAllAdminAndStaffId();
            foreach (var userId in userReceiveNotifications)
            {
                var notificationDto = new NotificationDto
                {
                    Title = "Có một bài đăng mới được cập nhật",
                    Content = "Có một bài đăng vừa được cập nhật",
                    NotificationType = "Approve",
                    ObjectType = "Post",
                    OjectId = post.PostId,
                    AccountId = userId
                };
                //save notifiation to db
                await _notificationService.AddNotificationAsync(notificationDto);
                //send notification via signalR
                await _hubNotificationContext.Clients.User(notificationDto.AccountId).SendAsync("ReceiveNotification", notificationDto);
            }

        }

        public async Task Approve(ApprovePostDto approvePostDto)
        {
            var filter = Builders<Post>.Filter.Eq(c => c.PostId, approvePostDto.PostId);
            var post = (await _postRepository.GetAllAsync(filter)).FirstOrDefault();

            post.Status = "Approved";
            await _postRepository.UpdateAsync(post.Id, post);

            //Send notifiction
            var notificationDto = new NotificationDto
            {
                Title = "Bài đăng đã được phê duyệt",
                Content = "Bài đăng đã được phê duyệt",
                NotificationType = "Approve",
                ObjectType = "Post",
                OjectId = post.PostId,
                AccountId = post.AccountId
            };
            //save notifiation to db
            await _notificationService.AddNotificationAsync(notificationDto);
            //send notification via signalR
            await _hubNotificationContext.Clients.User(notificationDto.AccountId).SendAsync("ReceiveNotification", notificationDto);
        }

        public async Task Reject(RejectPostDto rejectPostDto)
        {
            var filter = Builders<Post>.Filter.Eq(c => c.PostId, rejectPostDto.PostId);
            var post = (await _postRepository.GetAllAsync(filter)).FirstOrDefault();

            post.Status = "Rejected";
            post.RejectComment = rejectPostDto.Comment;
            await _postRepository.UpdateAsync(post.Id, post);

            //Send notifiction
            var notificationDto = new NotificationDto
            {
                Title = "Bài đăng không được phê duyệt",
                Content = "Bài đăng không được phê duyệt",
                NotificationType = "Reject",
                ObjectType = "Post",
                OjectId = post.PostId,
                AccountId = post.AccountId
            };
            //save notifiation to db
            await _notificationService.AddNotificationAsync(notificationDto);
            //send notification via signalR
            await _hubNotificationContext.Clients.User(notificationDto.AccountId).SendAsync("ReceiveNotification", notificationDto);

        }

        public async Task<List<Post>> GetAllPostsApproved()
        {
            var filter = Builders<Post>.Filter.Eq(posts => posts.Status, "Approved");
            return (await _postRepository.GetAllAsync(filter)).ToList();
        }

        public async Task<List<Post>> GetAllPostsPending()
        {
            var filter = Builders<Post>.Filter.Eq(posts => posts.Status, "Pending");
            return (await _postRepository.GetAllAsync(filter)).ToList();
        }

        public async Task<List<Post>> GetAllPosts()
        {
            return (await _postRepository.GetAllAsync()).ToList();
        }

    }
}
