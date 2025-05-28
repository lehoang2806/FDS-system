using FDSSYSTEM.DTOs;
using FDSSYSTEM.DTOs.CampaignDonorSupport;
using FDSSYSTEM.Models;

namespace FDSSYSTEM.Services.RegisterReceiverService
{
    public interface IRegisterReceiverService
    {
        Task<List<RegisterReceiverWithRecipientDto>> GetAll();
        Task<RegisterReceiver> GetById(string id);
        Task Create(RegisterReceiverDto registerReceiver);
        Task Update(string id, RegisterReceiverDto registerReceiver);
        Task<int> GetTotalRegisteredQuantityAsync(string campaignId, string accountId);
        Task DonorUpdate(string id, DonorRegisterReceiverUpdateDto donorRegisterReceiverUpdateDto);


    }
}
