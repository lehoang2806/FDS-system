using FDSSYSTEM.DTOs;
using FDSSYSTEM.Models;
using FDSSYSTEM.Services.PostService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
namespace FDSSYSTEM.Controllers
{
    [Route("api/forum")]
    [ApiController]
    public class PostController : Controller
    {
         private readonly IPostService _postService;

        public PostController(IPostService postService)
        {
            _postService = postService;
        }

        [HttpPost("CreatePost")]
        public async Task<ActionResult> CreatePost(PostDto post)
        {
            try
            {
                await _postService.Create(post);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        [HttpGet("GetAllPost")]
        public async Task<ActionResult> GetAllPost()
        {
            try
            {
                var posts = await _postService.GetAll();
               
                return Ok(posts);
            }
            catch (Exception ex)
            {

                return BadRequest();

            }
        }

        [HttpPut("UpdatePost/{id}")]
        public async Task<ActionResult> UpdatePost(string id, PostDto post)
        {
            try
            {
                var existingPost = await _postService.GetById(id);
                if (existingPost == null)
                {
                    return NotFound();
                }

                await _postService.Update(id, post);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }


        //[HttpGet]
        //public async Task<ActionResult<List<ForumPost>>> GetAll() =>
        //    Ok(await _forumService.GetAll());

        //[HttpGet("{id}")]
        //public async Task<ActionResult<ForumPost>> GetById(string id) =>
        //    Ok(await _forumService.GetById(id));

        //[HttpPost]
        //public async Task<IActionResult> Create([FromBody] ForumPost forumPost)
        //{
        //    await _forumService.Create(forumPost);
        //    return CreatedAtAction(nameof(GetById), new { id = forumPost.Id }, forumPost);
        //}

        //[HttpPut("{id}")]
        //public async Task<IActionResult> Update(string id, [FromBody] ForumPost forumPost)
        //{
        //    await _forumService.Update(id, forumPost);
        //    return NoContent();
        //}

        //[HttpDelete("{id}")]
        //public async Task<IActionResult> Delete(string id)
        //{
        //    await _forumService.Delete(id);
        //    return NoContent();
        //}

        //[HttpPost("like/{id}")]
        //public async Task<IActionResult> LikePost(string id)
        //{
        //    await _forumService.LikePost(id, User.Identity.Name);
        //    return Ok("Liked");
        //}

        //[HttpPost("save/{id}")]
        //public async Task<IActionResult> SavePost(string id)
        //{
        //    await _forumService.SavePost(id, User.Identity.Name);
        //    return Ok("Saved");
        //}
    }
}
