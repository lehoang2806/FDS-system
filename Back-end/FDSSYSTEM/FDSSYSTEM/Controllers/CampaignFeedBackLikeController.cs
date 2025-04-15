using FDSSYSTEM.DTOs;
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

        [HttpPost("like/{feedBackId}")]
        public async Task<IActionResult> LikeFeedBack(string feedBackId)
        {
            await _feedBackLikeService.LikeFeedBack(feedBackId);
            return Ok(new { message = "FeedBack liked successfully" });
        }

        [HttpDelete("unlike/{feedBackId}")]
        public async Task<IActionResult> UnlikeFeedBack(string feedBackId)
        {
            await _feedBackLikeService.UnlikeFeedBack(feedBackId);
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
