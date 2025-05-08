using FDSSYSTEM.Services.ChatService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace FDSSYSTEM.SignalR
{
    [Authorize]
    public class ChatHub : Hub
    {
        private readonly IChatService _chatService;
        public ChatHub(IChatService chatService)
        {
            _chatService = chatService;
        }
        public async Task SendMessage(string toUserId, string content)
        {
            var userId = Context.GetHttpContext()?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var message = new
            {
                senderId = userId,
                receiverId = toUserId,
                content = content,
                timestamp = DateTime.UtcNow
            };

            //Lưu DB
            await _chatService.AddNewChatMessage(message.senderId, message.receiverId, message.content);

            // Gửi tới người nhận -> có thể kiểm tra online nhưng không cần cứ gửi thôi
            await Clients.User(toUserId).SendAsync("ReceiveMessage", message);

            // Gửi echo lại cho chính người gửi
            await Clients.Caller.SendAsync("ReceiveMessage", message);
        }
    }
}
