using FDSSYSTEM.DTOs;
using FDSSYSTEM.Services.NotificationCampaignService;
using FDSSYSTEM.Services.NotificationService;
using FDSSYSTEM.Services.UserService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FDSSYSTEM.Controllers
{
    [Route("api/notification")]

    public class NotificationController : BaseController
    {
        private readonly IUserService _userService;
        private readonly IConfiguration _configuration;
        private readonly INotificationService _notificationService;

        public NotificationController(IConfiguration configuration, IUserService userService, INotificationService notificationService )
        {
            _configuration = configuration;
            _userService = userService;
            _notificationService = notificationService;
        }

        [HttpPut("Read/{notificationId}")]
        [Authorize]
        public async Task<ActionResult> Read(string notificationId)
        {
            try
            {
                await _notificationService.IsRead(notificationId);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        [HttpPut("Delete/{notificationId}")]
        [Authorize]
        public async Task<ActionResult>Delete (string notificationId)
        {
            try
            {
                await _notificationService.Delete(notificationId);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

    }
}
