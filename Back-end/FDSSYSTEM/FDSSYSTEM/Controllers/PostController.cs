using FDSSYSTEM.DTOs;
using FDSSYSTEM.DTOs.Certificates;
using FDSSYSTEM.Models;
using FDSSYSTEM.Options;
using FDSSYSTEM.Services.PostService;
using Mapster;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using System.Threading.Tasks;
namespace FDSSYSTEM.Controllers
{
    [Route("api/forum")]
    [ApiController]
    public class PostController : Controller
    {
        private readonly IPostService _postService;
        private readonly PolicyConfig _policyConfig;

        public PostController(IPostService postService, IOptions<PolicyConfig> options)
        {
            _postService = postService;
            _policyConfig = options.Value;
        }

        [HttpPost("CreatePost")]
        [Authorize(Roles = "Donor,Recipient")]
        public async Task<ActionResult> CreatePost(PostDto post)
        {
            try
            {
                List<string> policyResult = verifyPolicy(post.PostContent);
                if (policyResult.Count > 0)
                {
                    return BadRequest("Nội dung chứa các từ không được phép: " + string.Join(", ", policyResult));
                }

                var newPost = await _postService.Create(post);
                return Ok(newPost);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // Lấy tất cả post

        [HttpGet("GetAllPosts")]
        /*[Authorize(Roles = "Admin,Staff,Donor,Staff")]*/
        public async Task<ActionResult> GetAllPosts()
        {
            try
            {
                var posts = await _postService.GetAllPosts();
                return Ok(posts);
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
       /* [Authorize(Roles = "Admin,Staff")]*/
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
       /* [Authorize(Roles = "Admin,Staff")]*/
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
        [Authorize(Roles = "Donor,Recipient")]
        public async Task<ActionResult> UpdatePost(string id, PostDto post)
        {
            try
            {
                List<string> policyResult = verifyPolicy(post.PostContent);
                if (policyResult.Count > 0)
                {
                    return BadRequest("Nội dung chứa các từ không được phép: " + string.Join(", ", policyResult));
                }

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

        [HttpDelete("DeletePost/{postId}")]
        [Authorize(Roles = "Admin,Staff,Donor,Recipient")]
        public async Task<ActionResult> DeletePost(string postId)
        {
            try
            {
                var existingPost = await _postService.GetById(postId);
                if (existingPost == null)
                {
                    return NotFound();
                }

                await _postService.Delete(postId);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("Detail/{postId}")]
        public async Task<IActionResult> Detail(string postId)
        {
            var post = await _postService.GetPostDetail(postId);
            return Ok(post);
        }


        private List<string> verifyPolicy(string content)
        {
            List<string> rs = new List<string>();
            foreach (var item in _policyConfig.Content)
            {
                if (content.Contains(item))
                {
                    rs.Add(item);
                }
            }
            return rs;
        }
    }


}
