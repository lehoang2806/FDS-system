using FDSSYSTEM.DTOs;
using FDSSYSTEM.Services.PostSaveService;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace FDSSYSTEM.Controllers
{
    [Route("api/post-save")]
    [ApiController]
    public class PostSaveController : ControllerBase
    {
        private readonly IPostSaveService _postSaveService;

        public PostSaveController(IPostSaveService postSaveService)
        {
            _postSaveService = postSaveService;
        }

        [HttpPost("save/{postId}")]
        public async Task<IActionResult> SavePost(string postId)
        {
            await _postSaveService.SavePost(postId);
            return Ok(new { message = "Post saved successfully" });
        }

        [HttpDelete("unsave/{postId}")]
        public async Task<IActionResult> UnsavePost(string postId)
        {
            await _postSaveService.UnsavePost(postId);
            return Ok(new { message = "Post unsaved successfully" });
        }

    }
}
