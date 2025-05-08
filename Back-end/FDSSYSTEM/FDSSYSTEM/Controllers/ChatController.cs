using FDSSYSTEM.Services.ChatService;
using FDSSYSTEM.Services.UserContextService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FDSSYSTEM.Controllers
{
    [Route("api/chat")]
    [Authorize]
    public class ChatController : BaseController
    {
        private readonly IChatService _chatService;
        private readonly IUserContextService _userContextService;
        public ChatController(IChatService chatService, IUserContextService userContextService)
        {
            _chatService = chatService;
            _userContextService = userContextService;
        }

        [HttpGet("GetUserForChat")]
        [Authorize]
        public async Task<ActionResult> GetUserForChat()
        {
            try
            {
                var rs = await _chatService.GetAllUserForChat(_userContextService.UserId);
                return Ok(rs);
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        [HttpGet("GetChattedUser")]
        [Authorize]
        public async Task<ActionResult> GetChattedUser()
        {
            try
            {
                var rs = await _chatService.GetChattedUsers(_userContextService.UserId);
                return Ok(rs);
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        [HttpGet("GetHistory/{toUserId}")]
        [Authorize]
        public async Task<ActionResult> GetHistory(string toUserId)
        {
            try
            {
                var rs = await _chatService.GetChatHistory(_userContextService.UserId, toUserId);
                return Ok(rs);
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }
    }
}
