using FDSSYSTEM.DTOs.DonorQuestion;
using FDSSYSTEM.Models;
using FDSSYSTEM.Repositories.DonorQuestionRepository;
using FDSSYSTEM.Repositories.RegisterReceiverRepository;
using FDSSYSTEM.Repositories.UserRepository;
using FDSSYSTEM.Services.NotificationService;
using FDSSYSTEM.Services.UserContextService;
using FDSSYSTEM.Services.UserService;
using FDSSYSTEM.SignalR;
using Mapster;
using Microsoft.AspNetCore.SignalR;

namespace FDSSYSTEM.Services.DonorQuestionService
{
    public class DonorQuestionService : IDonorQuestionService
    {
        private readonly IDonorQuestionRepository _donorQuestionRepository;
        private readonly IUserContextService _userContextService;
        private readonly IUserRepository _userRepository;
        private readonly INotificationService _notificationService;

        private readonly IHubContext<NotificationHub> _hubNotificationContext;

        public DonorQuestionService(IDonorQuestionRepository donorQuestionRepository
            , IUserContextService userContextService
            , IUserRepository userRepository
            , INotificationService notificationService
            , IHubContext<NotificationHub> hubNotificationContext
            )
        {
            _donorQuestionRepository = donorQuestionRepository;
            _userContextService = userContextService;
            _userRepository = userRepository;
            _notificationService = notificationService;
            _hubNotificationContext = hubNotificationContext;
        }

        public async Task CreateDonorQuestionAsync(DonorQuestionDto donorQuestionDto)
        {
            await _donorQuestionRepository.AddAsync(new DonorQuestion
            {
                DonorQuestionId = Guid.NewGuid().ToString(),
                DonorId = _userContextService.UserId,
                CreatedDate = DateTime.Now,
                QuestionContent = donorQuestionDto.QuestionContent
            });
        }

        public async Task<List<DonorQuestionDetailDto>> GetAllDonorQuestionsAsync()
        {
            var donorQuestions = await _donorQuestionRepository.GetAllAsync();
            var users = await _userRepository.GetAllAsync();

            var rs = donorQuestions.Adapt<List<DonorQuestionDetailDto>>();
            foreach (var d in rs)
            {
                var u = users.FirstOrDefault(x => x.AccountId == d.DonorId);
                if (u != null)
                {
                    d.DonorFullName = u.FullName;
                }
            }
            return rs;

        }
    }
}
