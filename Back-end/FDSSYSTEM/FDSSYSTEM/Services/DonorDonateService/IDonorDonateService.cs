using FDSSYSTEM.DTOs;
using FDSSYSTEM.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FDSSYSTEM.Services.DonorDonateService 
{ public interface IDonorDonateService 
    {
        Task<DonorDonate> Create(DonorDonateDto donorDonateDto); 
        Task Update(string donorDonateId, bool isPaid, string transactionId);
        Task Delete(string id); 
        Task<List<DonorDonate>> GetAll();
        Task<DonorDonate> GetByDonorDonateId(string donorDonateId); 
    } 
}