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
        Task<RequestSupport> GetRequestSupportById(string requestSupport);  // Thêm phương thức này để lấy chiến dịch theo ID
        Task Create(RequestSupportDto requestSupport);
        Task Update(string id, RequestSupportDto requestSupport);
        Task Delete(string id);
    }
}
