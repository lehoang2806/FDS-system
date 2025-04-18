using FDSSYSTEM.DTOs;
using FDSSYSTEM.DTOs.RequestSupport;
using FDSSYSTEM.Helper;
using FDSSYSTEM.Models;
using FDSSYSTEM.Repositories.CampaignRepository;
using FDSSYSTEM.Repositories.RequestSupportRepository;
using FDSSYSTEM.Repositories.UserRepository;
using FDSSYSTEM.Services.CampaignService;
using FDSSYSTEM.Services.NotificationService;
using FDSSYSTEM.Services.UserContextService;
using FDSSYSTEM.Services.UserService;
using FDSSYSTEM.SignalR;
using Mapster;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Hosting;
using MongoDB.Driver;

namespace FDSSYSTEM.Services.RequestSupportService
{

    public class RequestSupportService : IRequestSupportService
    {
        private readonly IRequestSupportRepository _requestSupportRepository;
        private readonly IUserRepository _userRepository;
        private readonly IUserService _userService;
        private readonly IUserContextService _userContextService;
        private readonly INotificationService _notificationService;

        private readonly IHubContext<NotificationHub> _hubNotificationContext;

        public RequestSupportService(IRequestSupportRepository requestSupportRepository, IUserRepository userRepository
            , IUserContextService userContextService, IUserService userService
            , INotificationService notificationService
            , IHubContext<NotificationHub> hubContext
            )
        {
            _requestSupportRepository = requestSupportRepository;
            _userRepository = userRepository;
            _userContextService = userContextService;
            _userService = userService;
            _notificationService = notificationService;
            _hubNotificationContext = hubContext;

        }

        public async Task Create(RequestSupportDto requestSupport)
        {
            string accountId = _userContextService.UserId ?? "";
            var newRequestSupport = new RequestSupport
            {
                RequestSupportId= Guid.NewGuid().ToString(),
                FullName= requestSupport.FullName,
                DateOfBirth= requestSupport.DateOfBirth,
                PhoneNumber= requestSupport.PhoneNumber,
                Address= requestSupport.Address,
                Email=requestSupport.Email,
                Reason=requestSupport.Reason,
                HouseholdSize= requestSupport.HouseholdSize,
                SpecialMembers= requestSupport.SpecialMembers,
                IncomeSource= requestSupport.IncomeSource,
                RequestedItems= requestSupport.RequestedItems,
                AccountId= accountId,
                CreatedDate=DateTime.Now,

            };
            await _requestSupportRepository.AddAsync(newRequestSupport);

            var userReceiveNotifications = await _userService.GetAllAdminAndStaffId();
            foreach (var userId in userReceiveNotifications)
            {
                var notificationDto = new NotificationDto
                {
                    Title = "Có một đơn yêu cầu hỗ trợ mới được tạo",
                    Content = "Có một đơn yêu cầu hỗ trợ mới được tạo ra",
                    NotificationType = "Yêu cầu trợ giúp",
                    ObjectType = "Yêu cầu trợ giúp",
                    OjectId = newRequestSupport.RequestSupportId,
                    AccountId = userId
                };
                //save notifiation to db
                await _notificationService.AddNotificationAsync(notificationDto);
                //send notification via signalR
                await _hubNotificationContext.Clients.User(notificationDto.AccountId).SendAsync("ReceiveNotification", notificationDto);
            }

        }

        public async Task Update(string id, RequestSupportDto requestSupport)
        {
            var request = await _requestSupportRepository.GetByRequestSupportIdAsync(id);

            request.FullName = requestSupport.FullName;
            request.DateOfBirth = requestSupport.DateOfBirth;
            request.PhoneNumber = requestSupport.PhoneNumber;
            request.Address = requestSupport.Address;
            request.Email =request.Email;
            request.Reason = requestSupport.Reason;
            request.HouseholdSize = requestSupport.HouseholdSize;
            request.SpecialMembers = requestSupport.SpecialMembers;
            request.IncomeSource = requestSupport.IncomeSource;
            request.RequestedItems = requestSupport.RequestedItems;

            await _requestSupportRepository.UpdateAsync(request.Id, request);

            var userReceiveNotifications = await _userService.GetAllAdminAndStaffId();
            foreach (var userId in userReceiveNotifications)
            {
                var notificationDto = new NotificationDto
                {
                    Title = "Có một đơn yêu cầu hỗ trợ vừa được cập nhật",
                    Content = "Có một đơn yêu cầu hỗ trợ vừa được cập nhật",
                    NotificationType = "Update",
                    ObjectType = "Yêu cầu hỗ trợ",
                    OjectId = request.RequestSupportId,
                    AccountId = userId,

                };
                //save notifiation to db
                await _notificationService.AddNotificationAsync(notificationDto);
                //send notification via signalR
                await _hubNotificationContext.Clients.User(notificationDto.AccountId).SendAsync("ReceiveNotification", notificationDto);
            }

        }

        public async Task Delete(string id)
        {
            await _requestSupportRepository.DeleteAsync(id);
        }

        public async Task<List<RequestSupportWithCreatorDto>> GetAll()
        {
            var rs = new List<RequestSupportWithCreatorDto>();

            var allRequestSupport = await _requestSupportRepository.GetAllAsync();
            var listCreatorId = allRequestSupport.Select(c => c.AccountId).Distinct().ToList();

            var creatorFilter = Builders<Account>.Filter.In(c => c.AccountId, listCreatorId);
            var allCreator = await _userRepository.GetAllAsync(creatorFilter);

            foreach (var cp in allRequestSupport)
            {
                var cpDto = cp.Adapt<RequestSupportWithCreatorDto>();
                var cretor = allCreator.FirstOrDefault(x => x.AccountId == cp.AccountId);
                if (cretor != null)
                {
                    cpDto.FullName = cretor?.FullName;
                    cpDto.PhoneNumber = cretor.Phone;
                    cpDto.Email = cretor.Email;
              
                }
                rs.Add(cpDto);
            }

            return rs;
        }

        public async Task<RequestSupport> GetRequestSupportById(string id)
        {
            var filter = Builders<RequestSupport>.Filter.Eq(c => c.RequestSupportId, id);
            var getbyId = await _requestSupportRepository.GetAllAsync(filter);
            return getbyId.FirstOrDefault();
        }

    }
}