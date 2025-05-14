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
                RequestSupportId = Guid.NewGuid().ToString(),
                FullName = requestSupport.FullName,
                DateOfBirth = requestSupport.DateOfBirth,
                CitizenIdImages = requestSupport.CitizenIdImages, // Thêm hình ảnh giấy tờ tùy thân
                PhoneNumber = requestSupport.PhoneNumber,
                Address = requestSupport.Address,
                Email = requestSupport.Email,
                /*LocalAuthorityContact = requestSupport.LocalAuthorityContact, // Thêm thông tin liên hệ chính quyền địa phương
                RelativeContact = requestSupport.RelativeContact, // Thêm thông tin liên hệ người thân*/
                Reason = requestSupport.Reason,
                HouseholdSize = requestSupport.HouseholdSize,
                SpecialMembers = requestSupport.SpecialMembers,
                CircumstanceImages = requestSupport.CircumstanceImages, // Thêm hình ảnh hoàn cảnh
               /* IncomeSource = requestSupport.IncomeSource,
                MonthlyIncome = requestSupport.MonthlyIncome, // Thêm thu nhập hàng tháng*/
                RequestedItems = requestSupport.RequestedItems,
                DesiredQuantity = requestSupport.DesiredQuantity,
                AccountId = accountId,
                CreatedDate = DateTime.Now,
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
                // Lưu thông báo vào cơ sở dữ liệu
                await _notificationService.AddNotificationAsync(notificationDto);
                // Gửi thông báo qua SignalR
                await _hubNotificationContext.Clients.User(notificationDto.AccountId).SendAsync("ReceiveNotification", notificationDto);
            }
        }

        public async Task Update(string id, RequestSupportDto requestSupport)
        {
            var request = await _requestSupportRepository.GetByRequestSupportIdAsync(id);

            request.FullName = requestSupport.FullName;
            request.DateOfBirth = requestSupport.DateOfBirth;
            request.CitizenIdImages = requestSupport.CitizenIdImages; // Cập nhật hình ảnh giấy tờ tùy thân
            request.PhoneNumber = requestSupport.PhoneNumber;
            request.Address = requestSupport.Address;
            request.Email = requestSupport.Email; // Sửa lỗi: sử dụng requestSupport.Email thay vì request.Email
           /* request.LocalAuthorityContact = requestSupport.LocalAuthorityContact; // Cập nhật thông tin liên hệ chính quyền địa phương
            request.RelativeContact = requestSupport.RelativeContact; // Cập nhật thông tin liên hệ người thân*/
            request.Reason = requestSupport.Reason;
            request.HouseholdSize = requestSupport.HouseholdSize;
            request.SpecialMembers = requestSupport.SpecialMembers;
            request.CircumstanceImages = requestSupport.CircumstanceImages; // Cập nhật hình ảnh hoàn cảnh
            /*request.IncomeSource = requestSupport.IncomeSource;
            request.MonthlyIncome = requestSupport.MonthlyIncome; // Cập nhật thu nhập hàng tháng*/
            request.RequestedItems = requestSupport.RequestedItems;
            request.DesiredQuantity = requestSupport.DesiredQuantity;
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
                // Lưu thông báo vào cơ sở dữ liệu
                await _notificationService.AddNotificationAsync(notificationDto);
                // Gửi thông báo qua SignalR
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
                var creator = allCreator.FirstOrDefault(x => x.AccountId == cp.AccountId);
                if (creator != null)
                {
                    cpDto.FullName = creator?.FullName;
                    cpDto.PhoneNumber = creator.Phone;
                    cpDto.Email = creator.Email;
                }

                // Ánh xạ danh sách nhà tài trợ
                cpDto.SupportDonors = cp.SupportDonor?.Select(d => new SupportDonorDto
                {
                    DonorId = d.DonorId,
                    FullName = d.FullName,
                    CreatedDate = d.CreatedDate,
                    Status = d.Status,
                    Email = d.Email,
                }).ToList() ?? new List<SupportDonorDto>();

                rs.Add(cpDto);
            }

            return rs;
        }

        public async Task<RequestSupportDetailDto> GetRequestSupportById(string requestSupportId)
        {
            var filter = Builders<RequestSupport>.Filter.Eq(c => c.RequestSupportId, requestSupportId);
            var request = (await _requestSupportRepository.GetAllAsync(filter)).FirstOrDefault();

            if (request == null)
            {
                return null;
            }

            // Chuyển đổi sang DTO
            var requestDto = request.Adapt<RequestSupportDetailDto>();

            // Lấy thông tin người tạo
            var creator = await _userService.GetAccountById(request.AccountId);
            if (creator != null)
            {
                requestDto.FullName = creator.FullName;
                requestDto.PhoneNumber = creator.Phone;
                requestDto.Email = creator.Email;
            }

            // Chuyển đổi danh sách nhà tài trợ
            requestDto.SupportDonors = request.SupportDonor?.Select(d => new SupportDonorDto
            {
                DonorId = d.DonorId,
                FullName = d.FullName,
                CreatedDate = d.CreatedDate,
                Status = d.Status,
                Email = d.Email,
            }).ToList() ?? new List<SupportDonorDto>();

            return requestDto;
        }

        public async Task AddDonorSupportRequest(string requestSupportId, CampaignRequestDonorSupportDto donorSupportDto)
        {
            var request = await _requestSupportRepository.GetByRequestSupportIdAsync(requestSupportId);
            if (request == null)
            {
                throw new Exception("Không tìm thấy đơn yêu cầu hỗ trợ.");
            }

            // Lấy thông tin nhà tài trợ từ danh sách email
            var donorFilter = Builders<Account>.Filter.In(a => a.Email, donorSupportDto.Emails);
            var donors = await _userRepository.GetAllAsync(donorFilter);

            // Thêm nhà tài trợ vào danh sách SupportDonor với trạng thái Pending
            foreach (var donor in donors)
            {
                if (request.SupportDonor == null)
                {
                    request.SupportDonor = new List<SupportDonor>();
                }

                // Kiểm tra xem nhà tài trợ đã được thêm chưa
                if (!request.SupportDonor.Any(d => d.DonorId == donor.AccountId))
                {
                    request.SupportDonor.Add(new SupportDonor
                    {
                        DonorId = donor.AccountId,
                        FullName = donor.FullName,
                        CreatedDate = DateTime.Now,
                        Status = "Pending" // Trạng thái ban đầu
                    });
                }
            }

            // Cập nhật đơn yêu cầu trong cơ sở dữ liệu
            if (donors.Count() > 0)
            {
                request.Status = "Sent";
            }
            await _requestSupportRepository.UpdateAsync(request.Id, request);
/*
            // Gửi thông báo cho nhân viên/admin
            var userReceiveNotifications = await _userService.GetAllAdminAndStaffId();
            foreach (var userId in userReceiveNotifications)
            {
                var notificationDto = new NotificationDto
                {
                    Title = "Yêu cầu hỗ trợ đã được gửi đến nhà tài trợ",
                    Content = $"Yêu cầu hỗ trợ {requestSupportId} đã được gửi đến các nhà tài trợ.",
                    NotificationType = "Gửi yêu cầu",
                    ObjectType = "Yêu cầu hỗ trợ",
                    OjectId = requestSupportId,
                    AccountId = userId
                };
                await _notificationService.AddNotificationAsync(notificationDto);
                await _hubNotificationContext.Clients.User(notificationDto.AccountId).SendAsync("ReceiveNotification", notificationDto);
            }*/
        }

        public async Task UpdateDonorStatus(string requestSupportId, string donorId, string status)
        {
            if (!new[] { "Participating", "NotParticipating", "Pending" }.Contains(status))
            {
                throw new ArgumentException("Trạng thái không hợp lệ.");
            }

            var request = await _requestSupportRepository.GetByRequestSupportIdAsync(requestSupportId);
            if (request == null)
            {
                throw new Exception("Không tìm thấy đơn yêu cầu hỗ trợ.");
            }

            var donor = request.SupportDonor?.FirstOrDefault(d => d.DonorId == donorId);
            if (donor == null)
            {
                throw new Exception("Không tìm thấy nhà tài trợ trong đơn yêu cầu.");
            }

            donor.Status = status;
            await _requestSupportRepository.UpdateAsync(request.Id, request);

            // Gửi thông báo cho admin/staff
            var userReceiveNotifications = await _userService.GetAllAdminAndStaffId();
            foreach (var userId in userReceiveNotifications)
            {
                var notificationDto = new NotificationDto
                {
                    Title = $"Nhà tài trợ đã cập nhật trạng thái",
                    Content = $"Nhà tài trợ {donor.FullName} đã cập nhật trạng thái thành {status} cho đơn {requestSupportId}.",
                    NotificationType = "UpdateStatus",
                    ObjectType = "RequestSupport",
                    OjectId = requestSupportId,
                    AccountId = userId
                };
                await _notificationService.AddNotificationAsync(notificationDto);
                await _hubNotificationContext.Clients.User(notificationDto.AccountId).SendAsync("ReceiveNotification", notificationDto);
            }
        }

    }
}