using FDSSYSTEM.DTOs;
using FDSSYSTEM.DTOs.News;
using FDSSYSTEM.DTOs.Posts;
using FDSSYSTEM.Models;
using FDSSYSTEM.Repositories.NewOfInterestRepository;
using FDSSYSTEM.Repositories.UserRepository;
using FDSSYSTEM.Services.NewOfInterest;
using FDSSYSTEM.Services.UserContextService;
using System.Threading.Tasks;

namespace FDSSYSTEM.Services.PostSaveService
{
    public class NewOfInterestService : INewOfInterestService
    {
        private readonly IUserContextService _userContextService;
        private readonly INewOfInterestRepository _newOfInterestRepository;
        private readonly IUserRepository _userRepository;

        public NewOfInterestService(INewOfInterestRepository newOfInterestRepository,
            IUserContextService userContextService, IUserRepository userRepository)
        {
            _newOfInterestRepository = newOfInterestRepository;
            _userContextService = userContextService;
            _userRepository = userRepository;
        }

        public async Task<List<NewOfInterestDto>> GetNewOfInterest(string newId)
        {
            var accounts = await _userRepository.GetAllAsync();
            var newOfInterests = await _newOfInterestRepository.GetAllAsync();

            var query = from newInterest in newOfInterests
                        join acc in accounts on newInterest.AccountId equals acc.AccountId
                        select new NewOfInterestDto
                        {
                           FullName = acc.FullName,
                           CreatedDate = newInterest.CreatedDate.ToString()
                        };

            return query.ToList();
        }

        public async Task NewOfInterest(string newId)
        {
            var userId = _userContextService.UserId ?? "";
            var existingSave = await _newOfInterestRepository.GetByNewIdAndUserIdAsync(newId, userId);
            if (existingSave == null)
            {
                var newSave = new Models.NewOfInterest
                {
                    NewId = newId,
                    AccountId = userId
                };
                await _newOfInterestRepository.AddAsync(newSave);
            }
        }

        public async Task UnNewOfInterest(string newId)
        {
            var userId = _userContextService.UserId ?? "";
            var existingSave = await _newOfInterestRepository.GetByNewIdAndUserIdAsync(newId, userId);
            if (existingSave != null)
            {
                await _newOfInterestRepository.DeleteAsync(existingSave.Id);
            }
        }


    }
}
