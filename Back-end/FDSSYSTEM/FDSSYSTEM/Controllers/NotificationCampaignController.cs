using FDSSYSTEM.DTOs;
using FDSSYSTEM.Models;
using FDSSYSTEM.Services.NotificationCampaignService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FDSSYSTEM.Controllers
{
    [Route("api/Notification/NotificationCampaign")]
    [ApiController]
    public class NotificationCampaignController : ControllerBase
    {
        private readonly INotificationCampaignService _notificationCampaignService;

        public NotificationCampaignController(INotificationCampaignService notificationCampaignService)
        {
            _notificationCampaignService = notificationCampaignService;
        }

        [HttpPost("CreateDonorCampaignNotification")]
        [Authorize(Roles = "Staff")]
        public async Task<ActionResult> CreateDonorCampaignNotification(NotificationCampaignDto notificationCampaignDto)
        {
            try
            {
                await _notificationCampaignService.CreateDonorCampaignNotification(notificationCampaignDto);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        [HttpPost("CreateRecipientCampaignNotification")]
        [Authorize(Roles = "Staff")]
        public async Task<ActionResult> CreateRecipientCampaignNotification(NotificationCampaignDto notificationCampaignDto)
        {
            try
            {
                await _notificationCampaignService.CreateDonorCampaignNotification(notificationCampaignDto);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        [HttpPost("CreateStaffCampaignNotification")]
        [Authorize(Roles = "Admin, Staff")]
        public async Task<ActionResult> CreateStaffCampaignNotification(NotificationCampaignDto notificationCampaignDto)
        {
            try
            {
                await _notificationCampaignService.CreateDonorCampaignNotification(notificationCampaignDto);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        [HttpGet("GetAllNotificationCampaign")]
        /*[Authorize(Roles = "Staff,Admin,Donor,Recipient")]*/
        public async Task<ActionResult> GetAllNotificationCampaign()
        {
            try
            {
                var notificationCampaign = await _notificationCampaignService.GetAll();
                return Ok(notificationCampaign);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

    }
}
