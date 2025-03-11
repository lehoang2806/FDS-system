using FDSSYSTEM.DTOs;
using FDSSYSTEM.Models;
using FDSSYSTEM.Services.PostService;
using Mapster;
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

        // Lấy tất cả post
        [HttpGet("GetAllPostsApproved")]
        public async Task<ActionResult> GetAllPostsApproved()
        {
            try
            {
                var posts = await _postService.GetAllPostsApproved();
                return Ok(posts.Adapt<List<PostDto>>());
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        [HttpGet("GetAllPostsPending")]
        public async Task<ActionResult> GetAllPostsPending()
        {
            try
            {
                var posts = await _postService.GetAllPostsPending();
                return Ok(posts.Adapt<List<PostDto>>());

            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }


        [HttpPut("Approve")]
        public async Task<ActionResult> Approve(ApprovePostDto approvePostDto)
        {
            try
            {
                await _postService.Approve(approvePostDto);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        [HttpPut("Reject")]
        public async Task<ActionResult> Reject(RejectPostDto rejectPostDto)
        {
            try
            {
                await _postService.Reject(rejectPostDto);
                return Ok();
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
