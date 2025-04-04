using FDSSYSTEM.DTOs;
using System.Threading.Tasks;

namespace FDSSYSTEM.Services.PostSaveService
{
    public interface IPostSaveService
    {
        Task SavePost(string postId);
        Task UnsavePost(string postId);
    }
}
