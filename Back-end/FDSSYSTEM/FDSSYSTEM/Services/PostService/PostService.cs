using FDSSYSTEM.DTOs;
using FDSSYSTEM.Models;
using FDSSYSTEM.Repositories.PostRepository;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;
namespace FDSSYSTEM.Services.PostService
{
    public class PostService : IPostService
    {
        private readonly IPostRepository _postRepository;

        public PostService(IPostRepository postRepository)
        {
            _postRepository = postRepository;
        }

        public async Task Create(PostDto post)
        {
            await _postRepository.AddAsync(new Post
            {
                PostText = post.PostText,
                DateCreated = DateTime.Now,
                PostId = Guid.NewGuid().ToString()
            });
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
            post.Image = postDto.Image;
            post.Content = postDto.Content;
            post.PostText = postDto.PostText;

            await _postRepository.UpdateAsync(post.Id, post);

        }

        public async Task Approve(ApprovePostDto approvePostDto)
        {
            var filter = Builders<Post>.Filter.Eq(c => c.PostId, approvePostDto.PostId);
            var post = (await _postRepository.GetAllAsync(filter)).FirstOrDefault();

            post.Status = "Approved";
            await _postRepository.UpdateAsync(post.Id, post);
        }

        public async Task Reject(RejectPostDto rejectPostDto)
        {
            var filter = Builders<Post>.Filter.Eq(c => c.PostId, rejectPostDto.PostId);
            var post = (await _postRepository.GetAllAsync(filter)).FirstOrDefault();

            post.Status = "Rejected";
            post.RejectComment = rejectPostDto.Comment;
            await _postRepository.UpdateAsync(post.Id, post);
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
