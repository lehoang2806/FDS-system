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
using FDSSYSTEM.DTOs.Posts;
using FDSSYSTEM.Repositories.PostLikeRepository;
using FDSSYSTEM.Repositories.PostCommentRepository;
using MongoDB.Driver.Linq;
using FDSSYSTEM.DTOs.CampaignFeedBack;
using FDSSYSTEM.Repositories.PostCommentLikeRepository;
namespace FDSSYSTEM.Services.PostService

{
    public class PostService : IPostService
    {
        private readonly IPostRepository _postRepository;
        private readonly IUserService _userService;
        private readonly IUserContextService _userContextService;
        private readonly INotificationService _notificationService;
        private readonly IHubContext<NotificationHub> _hubNotificationContext;

        private readonly IUserRepository _userRepository;
        private readonly IPostLikeRepository _postLikeRepository;
        private readonly IPostCommentRepository _postCommentRepository;
        private readonly IPostCommentLikeRepository _postCommentLikeRepository;

        public PostService(IPostRepository postRepository
            , IUserContextService userContextService, IUserService userService
            , INotificationService notificationService
            , IHubContext<NotificationHub> hubContext
            , IUserRepository userRepository
            , IPostLikeRepository postLikeRepository
            , IPostCommentRepository postCommentRepository
            , IPostCommentLikeRepository postCommentLikeRepository
            )
        {
            _postRepository = postRepository;
            _userContextService = userContextService;
            _userService = userService;
            _notificationService = notificationService;
            _hubNotificationContext = hubContext;
            _postLikeRepository = postLikeRepository;
            _postCommentRepository = postCommentRepository;
            _userRepository = userRepository;
            _postCommentLikeRepository = postCommentLikeRepository;
        }

        public async Task<PostDetailDto> Create(PostDto post)
        {
            string accountId = _userContextService.UserId ?? "";
            var newPost = new Post
            {
                CreatedDate = DateTime.Now,
                PostId = Guid.NewGuid().ToString(),
                Images = post.Images,
                AccountId = accountId,
                PosterRole = _userContextService.Role ?? "",
                PosterName = post.PosterName,
                PostContent = post.PostContent,
                Hashtags = post.Hashtags,
                ArticleTitle = post.ArticleTitle,
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
                    NotificationType = "pending",
                    ObjectType = "Post",
                    OjectId = newPost.PostId,
                    AccountId = userId
                };
                //save notifiation to db
                await _notificationService.AddNotificationAsync(notificationDto);
                //send notification via signalR
                await _hubNotificationContext.Clients.User(notificationDto.AccountId).SendAsync("ReceiveNotification", notificationDto);
            }

            return await GetPostDetail(newPost.PostId);
        }

        public async Task Delete(string id)
        {
            var post = await _postRepository.GetByPostIdAsync(id);
            if (post == null)
            {
                throw new Exception("Post not found");
            }

            await _postRepository.DeleteAsync(post.Id);

            var userReceiveNotifications = await _userService.GetAllAdminAndStaffId();
            foreach (var userId in userReceiveNotifications)
            {
                var notificationDto = new NotificationDto
                {
                    Title = "Bài đăng đã bị xóa",
                    Content = "Bài đăng đã bị xóa",
                    NotificationType = "Delete",
                    ObjectType = "Post",
                    OjectId = id,
                    AccountId = userId
                };
                await _notificationService.AddNotificationAsync(notificationDto);
                await _hubNotificationContext.Clients.User(notificationDto.AccountId).SendAsync("ReceiveNotification", notificationDto);
            }
        }



        public async Task<Post> GetById(string id)
        {
            return await _postRepository.GetByPostIdAsync(id);
        }

        public async Task Update(string id, PostDto postDto)
        {
            var post = await _postRepository.GetByPostIdAsync(id);

            post.Images = postDto.Images;
            post.PostContent = postDto.PostContent;
            post.PosterName = postDto.PosterName;
            post.Hashtags = postDto.Hashtags;
            post.ArticleTitle = postDto.ArticleTitle;

            await _postRepository.UpdateAsync(post.Id, post);

            var userReceiveNotifications = await _userService.GetAllAdminAndStaffId();
            foreach (var userId in userReceiveNotifications)
            {
                var notificationDto = new NotificationDto
                {
                    Title = "Có một bài đăng mới được cập nhật",
                    Content = "Có một bài đăng vừa được cập nhật",
                    NotificationType = "Update",
                    ObjectType = "Post",
                    OjectId = post.PostId,
                    AccountId = userId,

                };
                //save notifiation to db
                await _notificationService.AddNotificationAsync(notificationDto);
                //send notification via signalR
                await _hubNotificationContext.Clients.User(notificationDto.AccountId).SendAsync("ReceiveNotification", notificationDto);
            }

        }

        public async Task Approve(ApprovePostDto approvePostDto)
        {
            string approverId = _userContextService.UserId ?? "";
            var approver = await _userService.GetAccountById(approverId);
            var filter = Builders<Post>.Filter.Eq(c => c.PostId, approvePostDto.PostId);
            var post = (await _postRepository.GetAllAsync(filter)).FirstOrDefault();

            post.Status = "Approved";
            post.PosterApproverId = approverId;
            post.PosterApproverName = approver.FullName;
            post.PublicDate = DateTime.Now.ToString();
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

        public async Task<List<PostResponseDto>> GetAllPosts()
        {
            var result = new List<PostResponseDto>();
            var posts = await _postRepository.GetAllAsync();
            var users = await _userRepository.GetAllAsync();
            var postLikes = await _postLikeRepository.GetAllAsync();
            var postComments = await _postCommentRepository.GetAllAsync();
            var postCommentLikes = await _postCommentLikeRepository.GetAllAsync();
            foreach (var p in posts)
            {
                var postResponse = new PostResponseDto
                {
                    PostContent = p.PostContent,
                    Images = p.Images,
                    PosterId = p.AccountId,
                    PosterRole = p.PosterRole,
                    PosterName = p.PosterName,
                    Status = p.Status,
                    RejectComment = p.RejectComment,
                    PosterApproverId = p.PosterApproverId,
                    PosterApproverName = p.PosterApproverName,
                    PostId = p.PostId,
                    PublicDate = p.PublicDate,
                    Hashtags = p.Hashtags,
                    ArticleTitle = p.ArticleTitle,
                };

                //Lấy thông tin Like của bài post
                postResponse.Likes = new List<PostLikeResponseDto>();
                var plikes = postLikes.Where(x => x.PostId == postResponse.PostId);
                foreach (var item in plikes)
                {
                    var like = new PostLikeResponseDto
                    {
                        PostLikeId = item.PostLikeId,
                        AccountId = item.AccountId,
                        CreatedDate = item.CreatedDate
                    };

                    like.FullName = GetFullNameByAccountId(users, item.AccountId);
                    postResponse.Likes.Add(like);
                }

                //-------------------- phần comment -------
                postResponse.Comments = new List<PostCommentResponseDto>();
                var pComments = postComments.Where(x => x.PostId == postResponse.PostId);
                foreach (var pComentItem in pComments)
                {
                    var comment = new PostCommentResponseDto
                    {
                        PostCommentId = pComentItem.PostCommentId,
                        FullName = GetFullNameByAccountId(users, pComentItem.AccountId),
                        Content = pComentItem.Content,
                        CreatedDate = pComentItem.DateCreated,
                        Images = pComentItem.Images,
                    };
                    //Lấy Like của comment
                    comment.Likes = new List<PostCommentLikeResponseDto>();
                    var cLikes = postCommentLikes.Where(x => x.PostCommentId == pComentItem.PostCommentId && string.IsNullOrEmpty(x.ReplyPostCommentId));
                    foreach (var item in cLikes)
                    {
                        var like = new PostCommentLikeResponseDto
                        {
                            PostCommentLikeId = item.PostCommentLikeId,
                            FullName = GetFullNameByAccountId(users, item.AccountId),
                            AccountId = item.AccountId,
                            CreatedDate = item.CreatedDate
                        };
                        comment.Likes.Add(like);
                    }

                    //trả lời comment
                    if (pComentItem.Replies != null)
                    {
                        comment.Replies = new List<ReplyPostCommentResponseDto>();
                        foreach (var item in pComentItem.Replies)
                        {
                            var reply = new ReplyPostCommentResponseDto
                            {
                                ReplyPostCommentId = item.ReplyPostCommentId,
                                Content = item.Content,
                                CreatedDate = item.DateCreated,
                                FullName = GetFullNameByAccountId(users, item.AccountId),
                                Images = item.Images,
                            };

                            //user like trả lời comment
                            reply.Likes = new List<PostCommentLikeResponseDto>();
                            var commentReplylikes = postCommentLikes.Where(x => x.PostCommentId == item.PostCommentId && x.ReplyPostCommentId == item.ReplyPostCommentId);
                            foreach (var rcm in commentReplylikes)
                            {
                                var like = new PostCommentLikeResponseDto
                                {
                                    PostCommentLikeId = rcm.PostCommentLikeId,
                                    AccountId = rcm.AccountId,
                                    CreatedDate = rcm.CreatedDate,
                                    FullName = GetFullNameByAccountId(users, item.AccountId)
                                };
                                reply.Likes.Add(like);
                            }
                            comment.Replies.Add(reply);
                        }
                    }
                    postResponse.Comments.Add(comment);
                }

                result.Add(postResponse);
            }

            return result;
        }



        public async Task<PostDetailDto> GetPostDetail(string postId)
        {
            var posts = await _postRepository.GetAllAsync();
            var accounts = await _userRepository.GetAllAsync();
            var postLikes = await _postLikeRepository.GetAllAsync();
            var postComments = await _postCommentRepository.GetAllAsync();

            var query = from post in posts
                        join like in postLikes on post.PostId equals like.PostId into likesGroup
                        join comment in postComments on post.PostId equals comment.PostId into commentsGroup
                        select new PostDetailDto
                        {
                            PostId = post.PostId,
                            PostContent = post.PostContent,
                            Images = post.Images,
                            Status = post.Status,
                            PosterName = post.PosterName,
                            RejectComment = post.RejectComment,
                            PublicDate = post.PublicDate,
                            PosterId = post.AccountId,
                            PosterRole = post.PosterRole,
                            PosterApproverId = post.PosterApproverId,
                            PosterApproverName = post.PosterApproverName,
                            Likes = from like in likesGroup
                                    join account in accounts on like.AccountId equals account.AccountId
                                    select new PostLikeDetailDto
                                    {
                                        AccountId = account.AccountId,
                                        FullName = account.FullName,
                                        CreatedDate = like.CreatedDate.ToString()
                                    },
                            Comments = from comment in commentsGroup
                                       join account in accounts on comment.AccountId equals account.AccountId
                                       select new PostCommentDetailDto
                                       {
                                           FullName = account.FullName,
                                           CreatedDate = comment.DateCreated.ToString(),
                                           Content = comment.Content,
                                           Images = comment.Images
                                       }
                        };

            return query.FirstOrDefault(x => x.PostId == postId);

        }

        private string GetFullNameByAccountId(IEnumerable<Account> users, string accountId)
        {
            var u = users.FirstOrDefault(x => x.AccountId == accountId);
            if (u != null)
            {
                return u.FullName ?? "";
            }
            return "";
        }
    }
}
