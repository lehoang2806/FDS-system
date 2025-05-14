using FDSSYSTEM.DTOs;
using FDSSYSTEM.Models;
using FDSSYSTEM.Repositories.DonorDonateRepository;
using FDSSYSTEM.Services.UserContextService;
using FDSSYSTEM.Services.UserService;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FDSSYSTEM.Services.DonorDonateService
{
    public class DonorDonateService : IDonorDonateService
    {
        private readonly IDonorDonateRepository _donorDonateRepository; 
        private readonly IUserContextService _userContextService;
        private readonly IUserService _userService;

        public DonorDonateService(IDonorDonateRepository donorDonateRepository, 
            IUserContextService userContextService,
            IUserService userService)
        {
            _donorDonateRepository = donorDonateRepository;
            _userContextService = userContextService;
            _userService = userService;
        }

        public async Task<DonorDonate> Create(DonorDonateDto donorDonateDto)
        {
            var donor = await _userService.GetAccountById(_userContextService.UserId);

            var donorDonate = new DonorDonate
            {
                DonorDonateId = Guid.NewGuid().ToString(),
                DonorId = donor.AccountId,
                Amount = donorDonateDto.Amount,
                Message = donorDonateDto.Message,
                DonateDate = DateTime.Now,
                CreatedAt = DateTime.Now,
                IsPaid = false
            };

            await _donorDonateRepository.AddAsync(donorDonate);
            return donorDonate;
        }

        public async Task Update(string donorDonateId,bool isPaid, string transactionId)
        {
            var existingDonorDonate = await _donorDonateRepository.GetByIdAsync(donorDonateId);
            if (existingDonorDonate == null)
            {
                throw new Exception("Donor donation not found");
            }
            existingDonorDonate.IsPaid = isPaid;
            existingDonorDonate.TransactionId = transactionId;
            existingDonorDonate.UpdatedAt = DateTime.Now;

            await _donorDonateRepository.UpdateAsync(existingDonorDonate.Id, existingDonorDonate);
        }

        public async Task Delete(string id)
        {
            var filter = Builders<DonorDonate>.Filter.Eq(d => d.DonorDonateId, id);
            var existingDonorDonate = await _donorDonateRepository.GetByIdAsync(id);
            if (existingDonorDonate == null)
            {
                throw new Exception("Donor donation not found");
            }

            await _donorDonateRepository.DeleteAsync(filter);
        }

        public async Task<List<DonorDonate>> GetAll()
        {
            return (await _donorDonateRepository.GetAllAsync()).ToList();
        }

        public async Task<DonorDonate> GetByDonorDonateId(string donorDonateId)
        {
            return await _donorDonateRepository.GetByIdAsync(donorDonateId);
        }

        
    }

}