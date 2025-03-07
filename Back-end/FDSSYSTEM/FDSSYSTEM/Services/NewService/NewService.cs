using FDSSYSTEM.DTOs;
using FDSSYSTEM.Models;
using FDSSYSTEM.Repositories.PostRepository;
using FDSSYSTEM.Services.PostService;
using System.Collections.Generic;
using System.Threading.Tasks;
namespace FDSSYSTEM.Services.NewService
{
    public class NewService : INewService
    {
        private readonly INewService _newRepository;

        public NewService(INewService newRepository)
        {
            _newRepository = newRepository;
        }

        public async Task Create(PostDto post)
        {
            await _newRepository.AddAsync(new Post
            {
                NewText = post.PostText,
                DateCreated = DateTime.Now,
                NewId = Guid.NewGuid().ToString()
            });
        }

        public Task Delete(string id)
        {
            throw new NotImplementedException();
        }

        public async Task<List<Post>> GetAll()
        {
            return (await _newRepository.GetAllAsync()).ToList();
        }

        public Task<Post> GetById(string id)
        {
            throw new NotImplementedException();
        }

        public async Task Update(string id, PostDto post)
        {
            var existingPost = await _newRepository.GetByIdAsync(id);
            if (existingPost != null)
            {
                existingPost.PostText = post.PostText;

                await _newRepository.UpdateAsync(id, existingPost);
            }

        }
    }
}
