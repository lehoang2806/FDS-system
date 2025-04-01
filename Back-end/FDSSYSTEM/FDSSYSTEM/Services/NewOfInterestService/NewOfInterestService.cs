using FDSSYSTEM.DTOs;
using FDSSYSTEM.Models;
using FDSSYSTEM.Repositories.NewOfInterestRepository;
using FDSSYSTEM.Services.NewOfInterest;
using FDSSYSTEM.Services.UserContextService;
using System.Threading.Tasks;

namespace FDSSYSTEM.Services.PostSaveService
{
    public class NewOfInterestService : INewOfInterestService
    {
        private readonly IUserContextService _userContextService;
        private readonly INewOfInterestRepository _newOfInterestRepository;

        public NewOfInterestService(INewOfInterestRepository newOfInterestRepository,
            IUserContextService userContextService)
        {
            _newOfInterestRepository = newOfInterestRepository;
            _userContextService = userContextService;
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
