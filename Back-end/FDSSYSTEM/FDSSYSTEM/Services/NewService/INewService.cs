using FDSSYSTEM.DTOs;
using FDSSYSTEM.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
namespace FDSSYSTEM.Services.NewService
{
    public interface INewService
    {
        Task<List<New>> GetAllNews();
        Task<List<New>> GetAllNewsApproved();
        Task<List<New>> GetAllNewsPending();
        Task<New> GetById(string id);
        Task Create(NewDto news);
        Task Update(string id, NewDto news);
        Task Delete(string id);
        /*Task Approve(ApproveNewDto approveNewDto);
        Task Reject(RejectNewDto rejectNewDto);*/
    }
}
