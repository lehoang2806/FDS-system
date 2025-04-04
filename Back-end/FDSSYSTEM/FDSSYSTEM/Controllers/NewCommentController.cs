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

        [HttpGet("GetCommentsByNew/{newId}")]
        public async Task<ActionResult<List<NewCommentResponseDto>>> GetCommentsByNew(string newId)
        {
            try
            {
                var comments = await _newCommentService.GetByNewId(newId);
                return Ok(comments);  // Đảm bảo trả về danh sách đúng với AccountName và AccountId
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
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
