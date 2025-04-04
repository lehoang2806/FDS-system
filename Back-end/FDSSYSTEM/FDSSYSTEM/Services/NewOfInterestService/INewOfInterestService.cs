using FDSSYSTEM.DTOs;
using System.Threading.Tasks;

namespace FDSSYSTEM.Services.NewOfInterest
{
    public interface INewOfInterestService
    {
        Task NewOfInterest(string newId);
        Task UnNewOfInterest(string newId);
    }
}
