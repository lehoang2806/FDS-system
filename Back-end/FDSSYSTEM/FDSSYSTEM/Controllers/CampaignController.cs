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
    [Authorize(Roles = "Donor,Staff")]
    public class CampaignController : BaseController
    {
        private readonly ICampaignService _campaignService;
       

        public CampaignController(ICampaignService campaignService)
        {
            _campaignService = campaignService;
        }

        [HttpPost("CreateCampaign")]
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


        [HttpPost("Approve")]
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

        [HttpPut("UpdateCampaign/{id}")]
        public async Task<ActionResult> UpdateCampaign(string id, CampaignDto campaign)
        {
            try
            {
                var existingCampaign = await _campaignService.GetById(id);
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
        public async Task<ActionResult> DeleteCampaign(string id)
        {
            try
            {
                var existingCampaign = await _campaignService.GetById(id);
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
    }
}
