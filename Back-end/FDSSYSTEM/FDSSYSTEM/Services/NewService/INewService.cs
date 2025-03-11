using FDSSYSTEM.DTOs;
using FDSSYSTEM.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
namespace FDSSYSTEM.Services.NewService
{
    public interface INewService
    {
        Task<List<New>> GetAll();
        Task<New> GetById(string id);
        Task Create(NewDto newDto);
        Task Update(string id, NewDto newDto);
        Task Delete(string id);
        Task Approve(ApproveNewDto approveNewDto);
    }
}
