using FDSSYSTEM.DTOs;
using FDSSYSTEM.DTOs.Certificates;
using FDSSYSTEM.Models;
using FDSSYSTEM.Services.PostService;
using Mapster;
using Microsoft.AspNetCore.Authorization;
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
        [Authorize(Roles = "Donor,Staff")]
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

        [HttpGet("GetAllPosts")]
        /*[Authorize(Roles = "Admin,Staff,Donor,Staff")]*/
        public async Task<ActionResult> GetAllPosts()
        {
            try
            {
                var config = new TypeAdapterConfig();
                config.NewConfig<Post, PostDto>()
                     .Map(dest => dest.PosterId, src => src.AccountId);

                var posts = await _postService.GetAllPosts();
                return Ok(posts.Adapt<List<PostDto>>(config));
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

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
        [Authorize(Roles = "Admin,Staff")]
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
        [Authorize(Roles = "Admin,Staff")]
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
        [Authorize(Roles = "Donor,Staff")]
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
        /*[Authorize(Roles = "Admin,Staff,Donor,Staff")]*/
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

        [HttpGet("Detail/{postId}")]
        public async Task<IActionResult> Detail(string postId)
        {
            var post = await _postService.GetPostDetail(postId);
            return Ok(post);
        }


    }
}
