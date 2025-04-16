using FDSSYSTEM.DTOs.Posts;
using FDSSYSTEM.Models;
using FDSSYSTEM.Services.PostCommentService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FDSSYSTEM.Controllers
{
    [Route("api/forum/comment")]
    [ApiController]
    public class PostCommentController : Controller
    {
        private readonly IPostCommentService _postCommentService;

        public PostCommentController(IPostCommentService postCommentService)
        {
            _postCommentService = postCommentService;
        }

        // Tạo bình luận mới cho bài viết
        [HttpPost("CreateComment")]
        [Authorize]
        public async Task<ActionResult> CreateComment(PostCommentDto comment)
        {
            try
            {
                await _postCommentService.Create(comment);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        // Lấy tất cả bình luận của một bài viết theo postId
        [HttpGet("GetCommentsByPost/{postId}")]
        public async Task<ActionResult> GetCommentsByPost(string postId)
        {
            try
            {
                var comments = await _postCommentService.GetByPostId(postId);
                return Ok(comments);
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        // Cập nhật bình luận
        [HttpPut("UpdateComment/{postCommentid}")]
        [Authorize]
        public async Task<ActionResult> UpdateComment(string postCommentid, UpdatePostCommentDto comment)
        {
            try
            {
                var existingComment = await _postCommentService.GetById(postCommentid);
                if (existingComment == null)
                {
                    return NotFound();
                }

                await _postCommentService.Update(postCommentid, comment);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        // Xóa bình luận
        [HttpDelete("DeleteComment/{id}")]
        [Authorize]
        public async Task<ActionResult> DeleteComment(string id)
        {
            try
            {
                var existingComment = await _postCommentService.GetById(id);
                if (existingComment == null)
                {
                    return NotFound();
                }

                await _postCommentService.Delete(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }
    }
}
