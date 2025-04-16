using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FDSSYSTEM.Controllers
{
    [Route("api/Statistic")]
    public class StatisticController : BaseController
    {


        [HttpGet("GetStatisticDonor")]
        [Authorize(Roles = "Donor")]
        public async Task<ActionResult> GetStatisticDonor()
        {
            try
            {
                /*var statist = await _campaignService.GetAll();*/
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("GetStatisticAdmin")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> GetStatisticAdmin()
        {
            try
            {
                /*var statist = await _campaignService.GetAll();*/
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

    }
}
