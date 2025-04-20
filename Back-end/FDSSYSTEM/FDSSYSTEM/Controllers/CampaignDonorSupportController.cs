using FDSSYSTEM.DTOs.CampaignDonorSupport;
using FDSSYSTEM.Helper;
using FDSSYSTEM.Services.CampaignDonorSupportService;
using FDSSYSTEM.Services.CampaignService;
using FDSSYSTEM.Services.UserContextService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FDSSYSTEM.Controllers
{
    [Route("api/campaigndonorsupport")]
    [ApiExplorerSettings(IgnoreApi = true)]
    public class CampaignDonorSupportController : BaseController
    {
        private readonly ICampaignDonorSupportService _campaignDonorSupportService;
        private readonly IUserContextService _userContextService;

        public CampaignDonorSupportController(ICampaignDonorSupportService campaignDonorSupportService, IUserContextService userContextService)
        {
            _campaignDonorSupportService = campaignDonorSupportService;
            _userContextService = userContextService;
        }

        //[HttpGet("StaffGetAllDonorSupport")]
        //[Authorize(Roles = "Staff")]
        //public async Task<ActionResult> StaffGetAllDonorSupport()
        //{
        //    try
        //    {
        //        var donorSupports = await _campaignDonorSupportService.GetAllCampaignDonorSupportAsync();
        //        return Ok(donorSupports);
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new { message = ex.Message });
        //    }
        //}

        ////
        //[HttpGet("DonorGetAllDonorSupport")]
        //[Authorize(Roles = "Donor")]
        //public async Task<ActionResult> DonorGetAllDonorSupport()
        //{
        //    try
        //    {
        //        var donorSupports = await _campaignDonorSupportService.GetAllCampaignDonorSupportByDonorIdAsync(_userContextService.UserId ?? "");
        //        return Ok(donorSupports);
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new { message = ex.Message });
        //    }
        //}

        //[HttpPut("DonorAcceptRequestSupport")]
        //[Authorize(Roles = "Donor")]
        //public async Task<ActionResult> DonorAcceptRequestSupport(CampaignDonorSupportAcceptDto acceptDto)
        //{
        //    try
        //    {
        //        await _campaignDonorSupportService.AcceptRequestSupport(acceptDto);
        //        return Ok();
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new { message = ex.Message });
        //    }
        //}

        //[HttpPut("DonorRejectRequestSupport")]
        //[Authorize(Roles = "Donor")]
        //public async Task<ActionResult> DonorRejectRequestSupport(CampaignDonorSupportRejectDto rejectDto)
        //{
        //    try
        //    {
        //        await _campaignDonorSupportService.RejectRequestSupport(rejectDto);
        //        return Ok();
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new { message = ex.Message });
        //    }
        //}

    }
}
