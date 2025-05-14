using FDSSYSTEM.DTOs.Chat;
using FDSSYSTEM.Models;
using FDSSYSTEM.Repositories.ChatMessageRepository;
using FDSSYSTEM.Repositories.RoleRepository;
using FDSSYSTEM.Repositories.UserRepository;
using MongoDB.Driver;

namespace FDSSYSTEM.Services.ChatService
{
    public class ChatService : IChatService
    {
        private readonly IChatMessageRepository _chatMessageRepository;
        private readonly IRoleRepository _roleRepository;
        private readonly IUserRepository _userRepository;
        public ChatService(IChatMessageRepository chatMessageRepository, IRoleRepository roleRepository, IUserRepository userRepository)
        {
            _chatMessageRepository = chatMessageRepository;
            _roleRepository = roleRepository;
            _userRepository = userRepository;
        }

        public async Task AddNewChatMessage(string senderId, string receiverId, string content)
        {
            await _chatMessageRepository.AddAsync(new ChatMessage
            {
                ChatMessageId = Guid.NewGuid().ToString(),
                SenderId = senderId,
                ReceiverId = receiverId,
                Content = content,
                CreatedDate = DateTime.Now
            });
        }

        public async Task<IEnumerable<ChatMessage>> GetChatHistory(string userAId, string userBId)
        {
            var filter = Builders<ChatMessage>.Filter.Or(
            Builders<ChatMessage>.Filter.And(
            Builders<ChatMessage>.Filter.Eq(m => m.SenderId, userAId),
            Builders<ChatMessage>.Filter.Eq(m => m.ReceiverId, userBId)
            ),
            Builders<ChatMessage>.Filter.And(
            Builders<ChatMessage>.Filter.Eq(m => m.SenderId, userBId),
            Builders<ChatMessage>.Filter.Eq(m => m.ReceiverId, userAId)
            )
            );
            return await _chatMessageRepository.GetAllAsync(filter);
        }

        public async Task<IEnumerable<ChatUserDto>> GetChattedUsers(string userId)
        {
            var filter = Builders<ChatMessage>.Filter.Or(
            Builders<ChatMessage>.Filter.Eq(m => m.SenderId, userId),
            Builders<ChatMessage>.Filter.Eq(m => m.ReceiverId, userId)
            );

            var messages = await _chatMessageRepository.GetAllAsync(filter);
            var listChattedUserIds = messages.Select(x => x.SenderId == userId ? x.ReceiverId : x.SenderId).Distinct().ToList();

            var roles = await _roleRepository.GetAllAsync();

            var filterUser = Builders<Account>.Filter.In(m => m.AccountId, listChattedUserIds);
            var chattedUsers = await _userRepository.GetAllAsync(filterUser);

            var rs = chattedUsers
            .Join(
            roles,
            user => user.RoleId,
            role => role.RoleId,
            (user, role) => new ChatUserDto
            {
                UserId = user.AccountId,
                FullName = user.FullName,
                Role = role.RoleName,
                RoleId = role.RoleId,
                Email = user.Email,
            }
            ).Where(x => x.UserId != userId).ToList();

            return rs;
        }

        public async Task<IEnumerable<ChatUserDto>> GetAllUserForChat(string userId)
        {
            var roles = await _roleRepository.GetAllAsync();

            var filterUserWithoutAdmin = Builders<Account>.Filter.And(
            Builders<Account>.Filter.Ne(m => m.RoleId, 1),
            Builders<Account>.Filter.Ne(m => m.AccountId, userId)
            );
            var users = await _userRepository.GetAllAsync(filterUserWithoutAdmin);

            var rs = users
            .Join(
            roles,
            user => user.RoleId,
            role => role.RoleId,
            (user, role) => new ChatUserDto
            {
                UserId = user.AccountId,
                FullName = user.FullName,
                Role = role.RoleName,
                RoleId= role.RoleId,
                Email= user.Email,
            }
            ).ToList();

            return rs;
        }
    }
}
