using FDSSYSTEM.DTOs;
using FDSSYSTEM.DTOs.Posts;
using FDSSYSTEM.Services.PostCommentLikeService;
using FDSSYSTEM.Services.PostCommentService;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace FDSSYSTEM.Controllers
{
    [Route("api/PostCommentlike")]
    [ApiController]
    public class PostCommentLikeController : ControllerBase
    {
        private readonly IPostCommentLikeService _postCommentLikeService;

        public PostCommentLikeController(IPostCommentLikeService postCommentLikeService)
        {
            _postCommentLikeService = postCommentLikeService;
        }

        [HttpPost("like")]
        public async Task<IActionResult> LikePostComment(PostCommentLikeDto postCommentLikeDto)
        {
            try
            {
                await _postCommentLikeService.LikePostComment(postCommentLikeDto);
                return Ok(new { message = "PostComment liked successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }


        [HttpDelete("unlike/{postCommentLikeId}")]
        public async Task<IActionResult> UnlikePostComment(string postCommentLikeId)
        {
            await _postCommentLikeService.UnlikePostComment(postCommentLikeId);
            return Ok(new { message = "PostComment unliked successfully" });
        }

        [HttpGet("count/{postCommentId}")]
        public async Task<IActionResult> GetLikeCount(string postCommentId)
        {
            var count = await _postCommentLikeService.GetLikeCount(postCommentId);
            return Ok(new { postCommentId, likeCount = count });
        }
    }
}
