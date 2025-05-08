using FDSSYSTEM.DTOs.Chat;
using FDSSYSTEM.Models;

namespace FDSSYSTEM.Services.ChatService
{
    public interface IChatService
    {
        Task<IEnumerable<ChatUserDto>> GetChattedUsers(string userId);
        Task<IEnumerable<ChatUserDto>> GetAllUserForChat(string userId);
        Task<IEnumerable<ChatMessage>> GetChatHistory(string userAId, string userBId);
        Task AddNewChatMessage(string senderId, string receiverId, string content);
    }
}
