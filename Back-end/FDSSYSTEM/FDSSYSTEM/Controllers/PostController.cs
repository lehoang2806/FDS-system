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

        [HttpDelete("DeletePost/{id}")]
        public async Task<ActionResult> DeletePost(string id, PostDto post)
        {
            try
            {
                var existingPost = await _postService.GetById(id);
                if (existingPost == null)
                {
                    return NotFound();
                }

                await _postService.Delete(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }


    }
}
