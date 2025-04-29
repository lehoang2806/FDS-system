using System.Collections.Generic;
using System.Threading.Tasks;
using FDSSYSTEM.DTOs;
using FDSSYSTEM.DTOs.RequestSupport;
using FDSSYSTEM.Models;
namespace FDSSYSTEM.Services.RequestSupportService
{
    public interface IRequestSupportService
    {
        Task<List<RequestSupportWithCreatorDto>> GetAll();
        Task<RequestSupportDetailDto> GetRequestSupportById(string requestSupportId); // Cập nhật để trả về DTO chi tiết
        Task Create(RequestSupportDto requestSupport);
        Task Update(string id, RequestSupportDto requestSupport);
        Task Delete(string id);
        Task AddDonorSupportRequest(string requestSupportId, CampaignRequestDonorSupportDto donorSupportDto); // Thêm phương thức lưu nhà tài trợ
        Task UpdateDonorStatus(string requestSupportId, string donorId, string status);
    }
}
