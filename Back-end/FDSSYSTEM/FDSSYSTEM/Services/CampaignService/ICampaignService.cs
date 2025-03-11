using System.Collections.Generic;
using System.Threading.Tasks;
using FDSSYSTEM.DTOs;
using FDSSYSTEM.Models;

namespace FDSSYSTEM.Services.CampaignService
{
    public interface ICampaignService
    {
        Task<List<CampaignWithCreatorDto>> GetAll();
        Task<Campaign> GetById(string id);
        Task Create(CampaignDto campaign);
        Task Update(string id, CampaignDto campaign);
        Task Approve(ApproveCampaignDto approveCampaignDto);
        Task Delete(string id);
    }
}
