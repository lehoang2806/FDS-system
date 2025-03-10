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

        public Task<Post> GetById(string id)
        {
            throw new NotImplementedException();
        }

        public async Task Update(string id, PostDto post)
        {
            var existingPost = await _postRepository.GetByIdAsync(id);
            if (existingPost != null)
            {
                existingPost.PostText = post.PostText;

                await _postRepository.UpdateAsync(id, existingPost);
            }
          
        }

        public async Task Approve(ApprovePostDto approvePostDto)
        {
            var filter = Builders<Post>.Filter.Eq(c => c.PostId, approvePostDto.PostId);
            var post = (await _postRepository.GetAllAsync(filter)).FirstOrDefault();

            post.Status = approvePostDto.Type;
            post.ApproveComment = approvePostDto.Comment;
            await _postRepository.UpdateAsync(post.Id, post);
        }

    }
}
