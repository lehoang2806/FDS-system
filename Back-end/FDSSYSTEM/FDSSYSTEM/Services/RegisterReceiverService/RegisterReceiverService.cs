using FDSSYSTEM.DTOs;
using FDSSYSTEM.Models;
using FDSSYSTEM.Repositories.CampaignRepository;
using FDSSYSTEM.Repositories.RegisterReceiverRepository;
using FDSSYSTEM.Repositories.UserRepository;
using FDSSYSTEM.Services.UserContextService;
using FDSSYSTEM.Services.UserService;
using Mapster;
using Microsoft.Extensions.Hosting;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FDSSYSTEM.Services.RegisterReceiverService
{
    public class RegisterReceiverService : IRegisterReceiverService
    {
        private readonly IRegisterReceiverRepository _registerReceiverRepository;
        private readonly IUserRepository _userRepository;
        private readonly IUserContextService _userContextService;

        public RegisterReceiverService(IRegisterReceiverRepository registerReceiverRepository,
             IUserRepository userRepository, IUserContextService userContextService)
        {
           _registerReceiverRepository = registerReceiverRepository;
            _userRepository = userRepository;
            _userContextService = userContextService;
        }

        // Lấy tất cả các RegisterReceiver
        public async Task<List<RegisterReceiverWithRecipientDto>> GetAll()
        {
            var rs = new List<RegisterReceiverWithRecipientDto>();

            var allRegisterReceiver = await _registerReceiverRepository.GetAllAsync();
            var listCreatorId = allRegisterReceiver.Select(c => c.AccountId).Distinct().ToList();

            var creatorFilter = Builders<Account>.Filter.In(c => c.AccountId, listCreatorId);
            var allCreator = await _userRepository .GetAllAsync(creatorFilter);

            foreach (var cp in allRegisterReceiver)
            {
                var rrDto = cp.Adapt<RegisterReceiverWithRecipientDto>();
                var cretor = allCreator.FirstOrDefault(x => x.AccountId == cp.AccountId);
                if (cretor != null)
                {
                    rrDto.FullName = cretor?.FullName;
                    rrDto.Phone = cretor.Phone;
                    rrDto.Email = cretor.Email;
                    rrDto.RoleId = cretor.RoleId;

                }
                rs.Add(rrDto);
            }

            return rs;
        }


        // Lấy một RegisterReceiver theo ID
        public async Task<RegisterReceiver> GetById(string id)
        {
            var filter = Builders<RegisterReceiver>.Filter.Eq(r => r.RegisterReceiverId, id);
            return (await _registerReceiverRepository.GetAllAsync(filter)).FirstOrDefault();
        }

        // Tạo một RegisterReceiver mới
        public async Task Create(RegisterReceiverDto registerReceiver)
        {
            await _registerReceiverRepository.AddAsync(new RegisterReceiver
            {
                AccountId = _userContextService.UserId ?? "",
                RegisterReceiverName = registerReceiver.RegisterReceiverName,
                Quantity = registerReceiver.Quantity,
                CreatAt = registerReceiver.CreatAt,
                RegisterReceiverId = Guid.NewGuid().ToString()
            });
        }

        // Cập nhật một RegisterReceiver theo ID
        public async Task Update(string id, RegisterReceiverDto registerReceiver)
        {
            var existingRegisterReceiver = await GetById(id);
            if (existingRegisterReceiver != null)
            {
                existingRegisterReceiver.RegisterReceiverName = registerReceiver.RegisterReceiverName;
                existingRegisterReceiver.Quantity = registerReceiver.Quantity;
                existingRegisterReceiver.CreatAt = registerReceiver.CreatAt;
                existingRegisterReceiver.DateUpdated = DateTime.Now;

                await _registerReceiverRepository.UpdateAsync(existingRegisterReceiver.Id, existingRegisterReceiver);
            }
        }


    }
}
