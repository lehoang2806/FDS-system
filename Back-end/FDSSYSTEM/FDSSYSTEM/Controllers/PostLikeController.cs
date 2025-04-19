using FDSSYSTEM.DTOs;
using FDSSYSTEM.Services.PostLikeService;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace FDSSYSTEM.Controllers
{
    [Route("api/postlike")]
    [ApiController]
    public class PostLikeController : ControllerBase
    {
        private readonly IPostLikeService _postLikeService;

        public PostLikeController(IPostLikeService postLikeService)
        {
            _postLikeService = postLikeService;
        }

        [HttpPost("like/{postId}")]
        public async Task<IActionResult> LikePost(string postId)
        {
            await _postLikeService.LikePost(postId);
            return Ok(new { message = "Post liked successfully" });
        }

        [HttpDelete("unlike/{postLikeId}")]
        public async Task<IActionResult> UnlikePost(string postLikeId)
        {
            await _postLikeService.UnlikePost(postLikeId);
            return Ok(new { message = "Post unliked successfully" });
        }

        [HttpGet("count/{postId}")]
        public async Task<IActionResult> GetLikeCount(string postId)
        {
            var count = await _postLikeService.GetLikeCount(postId);
            return Ok(new { postId, likeCount = count });
        }
    }
}
