using System.Collections.Generic;
using System.Threading.Tasks;
using FDSSYSTEM.DTOs;
using FDSSYSTEM.Models;
namespace FDSSYSTEM.Services.PostService
{
    public interface IPostService
    {
        Task<List<Post>> GetAllPosts();
        Task<List<Post>> GetAllPostsApproved();
        Task<List<Post>> GetAllPostsPending();
        Task<Post> GetById(string id);
        Task Create(PostDto post);
        Task Update(string id, PostDto post);
        Task Delete(string id);
        Task Approve(ApprovePostDto approvePostDto);
        Task Reject(RejectPostDto rejectPostDto);
    }
}
