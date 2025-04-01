using FDSSYSTEM.DTOs;
using FDSSYSTEM.Models;
using FDSSYSTEM.Services.NewCommentService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FDSSYSTEM.Controllers
{
    [Route("api/News/comment")]
    [ApiController]
    public class NewCommentController : Controller
    {
        private readonly INewCommentService _newCommentService;

        public NewCommentController(INewCommentService newCommentService)
        {
            _newCommentService = newCommentService;
        }

        // Tạo bình luận mới cho bài viết
        [HttpPost("CreateComment")]
        public async Task<ActionResult> CreateComment(NewCommentDto comment)
        {
            try
            {
                await _newCommentService.Create(comment);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        // Lấy tất cả bình luận của một bài viết theo postId
        [HttpGet("GetCommentsByPost/{newId}")]
        public async Task<ActionResult> GetCommentsByPost(string newId)
        {
            try
            {
                var comments = await _newCommentService.GetByNewId(newId);
                return Ok(comments);
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        // Cập nhật bình luận
        [HttpPut("UpdateComment/{id}")]
        public async Task<ActionResult> UpdateComment(string id, NewCommentDto comment)
        {
            try
            {
                var existingComment = await _newCommentService.GetById(id);
                if (existingComment == null)
                {
                    return NotFound();
                }

                await _newCommentService.Update(id, comment);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        // Xóa bình luận
        [HttpDelete("DeleteComment/{id}")]
        public async Task<ActionResult> DeleteComment(string id)
        {
            try
            {
                var existingComment = await _newCommentService.GetById(id);
                if (existingComment == null)
                {
                    return NotFound();
                }

                await _newCommentService.Delete(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }
    }
}
