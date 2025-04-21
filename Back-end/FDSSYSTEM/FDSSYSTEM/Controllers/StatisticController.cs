using FDSSYSTEM.DTOs.Statistic;
using FDSSYSTEM.Services.StatisticService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FDSSYSTEM.Controllers
{
    [Route("api/Statistic")]
    public class StatisticController : BaseController
    {
        private readonly IStatisticService _statisticService;
        public StatisticController(IStatisticService statisticService)
        {
            _statisticService = statisticService;
        }

        [HttpGet("GetStatisticDonor")]
        [Authorize(Roles = "Donor")]
        public async Task<ActionResult> GetStatisticDonor()
        {
            try
            {
                /*var statist = await _campaignService.GetAll();*/
                return Ok(new StatisticDonorDto());
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
                return Ok(await _statisticService.GetStatisticAdmin());
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

    }
}
