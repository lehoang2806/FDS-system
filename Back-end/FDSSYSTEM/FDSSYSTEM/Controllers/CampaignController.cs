﻿using FDSSYSTEM.DTOs;
using FDSSYSTEM.Helper;
using FDSSYSTEM.Models;
using FDSSYSTEM.Options;
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
    [Route("api/campaign")]

    public class CampaignController : BaseController
    {
        private readonly ICampaignService _campaignService;
        private readonly IWebHostEnvironment _env;
        private readonly EmailHelper _emailHeper;
        private readonly EmailConfig _emailConfig;


        public CampaignController(IWebHostEnvironment env, ICampaignService campaignService, EmailHelper emailHeper, IOptions<EmailConfig> options)
        {
            _env = env;
            _campaignService = campaignService;
            _emailHeper = emailHeper;
            _emailConfig = options.Value;
        }

        [HttpPost("CreateCampaign")]
        [Authorize(Roles = "Donor,Staff")]
        public async Task<ActionResult> CreateCampaign(CampaignDto campaign)
        {
            try
            {
                await _campaignService.Create(campaign);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        [HttpGet("GetAllCampaigns")]
        /*[Authorize(Roles = "Staff,Admin,Donor,Recipient")]*/
        public async Task<ActionResult> GetAllCampaigns()
        {
            try
            {
                var campaigns = await _campaignService.GetAll();
                return Ok(campaigns);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }


        [HttpPut("Approve")]
        [Authorize(Roles = "Staff,Admin")]
        public async Task<ActionResult> Approve(ApproveCampaignDto approveCampaignDto)
        {
            try
            {
                await _campaignService.Approve(approveCampaignDto);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("Reject")]
        [Authorize(Roles = "Staff,Admin")]
        public async Task<ActionResult> Reject(RejectCampaignDto rejectCampaignDto)
        {
            try
            {
                await _campaignService.Reject(rejectCampaignDto);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        [HttpPut("UpdateCampaign/{id}")]
        [Authorize(Roles = "Staff,Admin,Recipient,Donor")]
        public async Task<ActionResult> UpdateCampaign(string id, CampaignDto campaign)
        {
            try
            {
                var existingCampaign = await _campaignService.GetCampaignById(id);
                if (existingCampaign == null)
                {
                    return NotFound();
                }

                await _campaignService.Update(id, campaign);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        [HttpDelete("DeleteCampaign/{campaignId}")]
        /*[Authorize(Roles = "Staff,Admin,Recipient,Donor")]*/
        public async Task<ActionResult> DeleteCampaign(string campaignId)
        {
            try
            {
                var existingCampaign = await _campaignService.GetCampaignById(campaignId);
                if (existingCampaign == null)
                {
                    return NotFound(new { message = "Không tìm thấy chiến dịch." });
                }

                await _campaignService.DeleteByCampaignId(campaignId);
                return Ok(new { message = "Xóa chiến dịch thành công." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("GetCampaignById/{id}")]
        /* [Authorize(Roles = "Staff,Admin,Donor,Recipient")]*/
        public async Task<ActionResult> GetCampaignById(string id)
        {
            try
            {
                // Gọi service để lấy chiến dịch theo ID
                var campaign = await _campaignService.GetCampaignById(id);

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
        public async Task<ActionResult> CommentCampaign(ReviewCommentCampaignDto campaign)
        {
            try
            {
                await _campaignService.AddReviewComment(campaign);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        [HttpPut("CancelCampaign")]
        [Authorize(Roles = "Staff,Donor")]
        public async Task<ActionResult> Cancel(CancelCampaignDto cancelCampaignDto)
        {
            try
            {
                await _campaignService.Cancel(cancelCampaignDto);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        

    }
}
