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
        Task Create(NewDto post);
        Task Update(string id, NewDto post);
        Task Delete(string id);
    }
}
