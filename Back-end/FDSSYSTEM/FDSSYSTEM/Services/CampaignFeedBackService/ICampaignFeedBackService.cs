using System.Collections.Generic;
using System.Threading.Tasks;
using FDSSYSTEM.DTOs.CampaignFeedBack;
using FDSSYSTEM.DTOs.Posts;
using FDSSYSTEM.Models;

public interface ICampaignFeedBackService
{
    Task Create(CampaignFeedBackDto feedback); // Tạo bình luận mới
    Task<List<CampaignFeedBackDetailDto>> GetByFeedBackByCampaignId(string campaignId); // Lấy bình luận theo bài viết
    Task<CampaignFeedBack> GetById(string id); // Lấy bình luận theo ID
    Task Update(string id, UpdateCampaignFeedBackDto feedback); // Cập nhật bình luận
    Task Delete(string id); // Xóa bình luận
    Task<CampaignFeedBackDetailDto> GetCampaignFeedBackDetail(string feedbackId);
}
