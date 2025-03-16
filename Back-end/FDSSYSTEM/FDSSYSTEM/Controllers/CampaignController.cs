using FDSSYSTEM.DTOs;
using FDSSYSTEM.Models;
using FDSSYSTEM.Services.CampaignService;
using FDSSYSTEM.Services.UserContextService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FDSSYSTEM.Controllers
{
    [Route("api/campaign")]
   
    public class CampaignController : BaseController
    {
        private readonly ICampaignService _campaignService;
       

        public CampaignController(ICampaignService campaignService)
        {
            _campaignService = campaignService;
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
                return BadRequest();
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

        [HttpDelete("DeleteCampaign/{id}")]
        [Authorize(Roles = "Staff,Admin,Recipient,Donor")]
        public async Task<ActionResult> DeleteCampaign(string id)
        {
            try
            {
                var existingCampaign = await _campaignService.GetCampaignById(id);
                if (existingCampaign == null)
                {
                    return NotFound();
                }

                await _campaignService.Delete(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest();
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



    }
}
