using FDSSYSTEM.DTOs;
using FDSSYSTEM.DTOs.News;
using System.Threading.Tasks;

namespace FDSSYSTEM.Services.NewOfInterest
{
    public interface INewOfInterestService
    {
        Task NewOfInterest(string newId);
        Task UnNewOfInterest(string newId);
        Task<List<NewOfInterestDto>> GetNewOfInterest(string newId);
    }
}
