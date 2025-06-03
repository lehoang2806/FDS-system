using FDSSYSTEM.DTOs;
using FDSSYSTEM.Helper;
using FDSSYSTEM.Models;
using FDSSYSTEM.Options;
using FDSSYSTEM.Services.CampaignRequestSupportService;
using FDSSYSTEM.Services.CampaignService;
using FDSSYSTEM.Services.UserContextService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages.Manage;
using System.Collections.Generic;
using System.Net.Mail;
using System.Threading.Tasks;

namespace FDSSYSTEM.Controllers
{
    [Route("api/campaignrequestsupport")]

    public class CampaignRequestSupportController : BaseController
    {
        private readonly ICampaignRequestSupportService _campaignRequestSupportService;
        private readonly IWebHostEnvironment _env;
        private readonly EmailHelper _emailHeper;
        private readonly EmailConfig _emailConfig;


        public CampaignRequestSupportController(IWebHostEnvironment env, ICampaignRequestSupportService campaignRequestSupportService, EmailHelper emailHeper, IOptions<EmailConfig> options)
        {
            _env = env;
            _campaignRequestSupportService = campaignRequestSupportService;
            _emailHeper = emailHeper;
            _emailConfig = options.Value;
        }

        [HttpPost("CreateCampaignRequestSupport")]
        [Authorize(Roles = "Donor")]
        public async Task<ActionResult> CreateCampaignRequestSupport(CampaignRequestSupportDto campaignRequestSupportDto)
        {
            try
            {
                await _campaignRequestSupportService.Create(campaignRequestSupportDto);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        [HttpGet("GetAllCampaignsRequestSupport")]
        /*[Authorize(Roles = "Staff,Admin,Donor,Recipient")]*/
        public async Task<ActionResult> GetAllCampaignsRequestSupport()
        {
            try
            {
                var campaigns = await _campaignRequestSupportService.GetAll();
                return Ok(campaigns);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }


        [HttpPut("Approve")]
        [Authorize(Roles = "Staff,Admin")]
        public async Task<ActionResult> Approve(ApproveCampaignRequestSupportDto approveCampaignRequestSupportDto)
        {
            try
            {
                await _campaignRequestSupportService.Approve(approveCampaignRequestSupportDto);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("Reject")]
        [Authorize(Roles = "Staff,Admin")]
        public async Task<ActionResult> Reject(RejectCampaignRequestSupportDto rejectCampaignRequestSupport)
        {
            try
            {
                await _campaignRequestSupportService.Reject(rejectCampaignRequestSupport);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        [HttpPut("UpdateCampaignRequestSupport/{id}")]
        [Authorize(Roles = "Staff,Admin,Recipient,Donor")]
        public async Task<ActionResult> UpdateCampaignRequestSupport(string id, CampaignRequestSupportDto campaignRequestSupportDto)
        {
            try
            {
                var existingCampaign = await _campaignRequestSupportService.GetCampaignRequestSupportById(id);
                if (existingCampaign == null)
                {
                    return NotFound();
                }

                await _campaignRequestSupportService.Update(id, campaignRequestSupportDto);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        [HttpDelete("DeleteCampaign/{campaignRequestSupportId}")]
        /*[Authorize(Roles = "Staff,Admin,Recipient,Donor")]*/
        public async Task<ActionResult> DeleteCampaignRequestSupport(string campaignRequestSupportId)
        {
            try
            {
                var existingCampaignRequestSupport = await _campaignRequestSupportService.GetCampaignRequestSupportById(campaignRequestSupportId);
                if (existingCampaignRequestSupport == null)
                {
                    return NotFound(new { message = "Không tìm thấy chiến dịch." });
                }

                await _campaignRequestSupportService.DeleteByCampaignRequestSupportId(campaignRequestSupportId);
                return Ok(new { message = "Xóa chiến dịch thành công." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("GetCampaignRequestSupportById/{id}")]
        /* [Authorize(Roles = "Staff,Admin,Donor,Recipient")]*/
        public async Task<ActionResult> GetCampaignRequestSupportById(string id)
        {
            try
            {
                // Gọi service để lấy chiến dịch theo ID
                var campaign = await _campaignRequestSupportService.GetCampaignRequestSupportById(id);

                // Nếu chiến dịch không tìm thấy, trả về lỗi NotFound
                if (campaign == null)
                {
                    return NotFound(new { message = "Campaign not found" });
                }

                // Trả về thông tin chi tiết của chiến dịch
                return Ok(campaign);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("CommentCampaign")]
        [Authorize(Roles = "Admin,Staff")]
        public async Task<ActionResult> CommentCampaign(ReviewCommentCampaignRequestSupportDto campaign)
        {
            try
            {
                await _campaignRequestSupportService.AddReviewComment(campaign);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        [HttpPut("CancelCampaignRequestSupport")]
        [Authorize(Roles = "Donor")]
        public async Task<ActionResult> Cancel(CancelCampaignRequestSupportDto cancelCampaignRequestSupportDto)
        {
            try
            {
                await _campaignRequestSupportService.Cancel(cancelCampaignRequestSupportDto);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }



    }
}
