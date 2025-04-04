﻿using System.Collections.Generic;
using System.Threading.Tasks;
using FDSSYSTEM.DTOs;
using FDSSYSTEM.Models;

namespace FDSSYSTEM.Services.CampaignService
{
    public interface ICampaignService
    {
        Task<List<CampaignWithCreatorDto>> GetAll();
        Task<Campaign> GetCampaignById(string campaign);  // Thêm phương thức này để lấy chiến dịch theo ID
        Task Create(CampaignDto campaign);
        Task Update(string id, CampaignDto campaign);
        Task Approve(ApproveCampaignDto approveCampaignDto);
        Task Reject(RejectCampaignDto rejectCampaignDto);
        Task Delete(string id);
        Task AddReviewComment (ReviewCommentCampaignDto reviewCommentCampaignDto);
        Task Cancel (CancelCampaignDto cancelCampaignDto);
    }
}
