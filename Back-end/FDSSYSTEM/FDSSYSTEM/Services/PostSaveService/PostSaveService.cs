using FDSSYSTEM.DTOs;
using FDSSYSTEM.Models;
using FDSSYSTEM.Repositories.PostSaveRepository;
using FDSSYSTEM.Services.UserContextService;
using System.Threading.Tasks;

namespace FDSSYSTEM.Services.PostSaveService
{
    public class PostSaveService : IPostSaveService
    {
        private readonly IUserContextService _userContextService;
        private readonly IPostSaveRepository _postSaveRepository;

        public PostSaveService(IPostSaveRepository postSaveRepository,
            IUserContextService userContextService)
        {
            _postSaveRepository = postSaveRepository;
            _userContextService = userContextService;
        }

        public async Task SavePost(string postId)
        {
            var userId = _userContextService.UserId ?? "";
            var existingSave = await _postSaveRepository.GetByPostIdAndUserIdAsync(postId, userId);
            if (existingSave == null)
            {
                var newSave = new PostSave
                {
                    PostId = postId,
                    AccountId = userId
                };
                await _postSaveRepository.AddAsync(newSave);
            }
        }

        public async Task UnsavePost(string postId)
        {
            var userId = _userContextService.UserId ?? "";
            var existingSave = await _postSaveRepository.GetByPostIdAndUserIdAsync(postId, userId);
            if (existingSave != null)
            {
                await _postSaveRepository.DeleteAsync(existingSave.Id);
            }
        }

       
    }
}
