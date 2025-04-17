using FDSSYSTEM.DTOs;
using FDSSYSTEM.DTOs.CampaignFeedBackLike;
using FDSSYSTEM.Services.FeedBackLikeService;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace FDSSYSTEM.Controllers
{
    [Route("api/feedbacklike")]
    [ApiController]
    public class CampaignFeedBackLikeController : ControllerBase
    {
        private readonly ICampaignFeedBackLikeService _feedBackLikeService;

        public CampaignFeedBackLikeController(ICampaignFeedBackLikeService feedBackLikeService)
        {
            _feedBackLikeService = feedBackLikeService;
        }

        [HttpPost("like")]
        public async Task<IActionResult> LikeFeedBack(CampaignFeedBackLikeDto campaignFeedBackLike)
        {
            try
            {
                await _feedBackLikeService.LikeFeedBack(campaignFeedBackLike);
                return Ok(new { message = "FeedBack liked successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
           

        [HttpDelete("unlike/{feedBackLikeId}")]
        public async Task<IActionResult> UnlikeFeedBack(string feedBackLikeId)
        {
            await _feedBackLikeService.UnlikeFeedBack(feedBackLikeId);
            return Ok(new { message = "FeedBack unliked successfully" });
        }

        [HttpGet("count/{feedBackId}")]
        public async Task<IActionResult> GetLikeCount(string feedBackId)
        {
            var count = await _feedBackLikeService.GetLikeCount(feedBackId);
            return Ok(new { feedBackId, likeCount = count });
        }
    }
}
