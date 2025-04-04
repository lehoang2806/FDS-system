using FDSSYSTEM.Database;
using FDSSYSTEM.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FDSSYSTEM.Repositories.RegisterReceiverRepository
{
    public interface IRegisterReceiverRepository : IMongoRepository<RegisterReceiver>
    {
        Task<RegisterReceiver> GetLatestAsync();
    }
}
