using FDSSYSTEM.Models;
using FDSSYSTEM.Services.PostCommentService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
namespace FDSSYSTEM.Controllers
{
    [Route("api/forum/comments")]
    [ApiController]
    public class PostcommentController : Controller
    {
        //private readonly IPostCommentService _commentService;

        //public PostcommentController(IPostCommentService commentService)
        //{
        //    _commentService = commentService;
        //}

        //[HttpGet("{postId}")]
        //public async Task<ActionResult<List<PostComment>>> GetCommentsByPostId(string postId) =>
        //    Ok(await _commentService.GetByPostId(postId));

        //[HttpPost]
        //public async Task<IActionResult> Create([FromBody] PostComment postComment)
        //{
        //    await _commentService.Create(postComment);
        //    return CreatedAtAction(nameof(GetCommentsByPostId), new { postId = postComment.ForumPostId }, postComment);
        //}
    }
}