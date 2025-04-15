using FDSSYSTEM.DTOs;
using FDSSYSTEM.DTOs.CampaignFeedBack;
using FDSSYSTEM.DTOs.Posts;
using FDSSYSTEM.Models;
using FDSSYSTEM.Services.FeedBackCommentService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FDSSYSTEM.Controllers
{
    [Route("api/campaignfeedback")]
    [ApiController]
    public class CampaignFeedBackController : Controller
    {
        private readonly ICampaignFeedBackService _feedBackService;

        public CampaignFeedBackController(ICampaignFeedBackService feedBackService)
        {
            _feedBackService = feedBackService;
        }

        // Tạo bình luận mới cho bài viết
        [HttpPost("CreateFeedBack")]
        public async Task<ActionResult> CreateFeedBack(CampaignFeedBackDto feedback)
        {
            try
            {
                await _feedBackService.Create(feedback);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        // Lấy tất cả bình luận của một bài viết theo postId
        [HttpGet("GetFeedBack/{campaignId}")]
        public async Task<ActionResult> GetFeedBack(string campaignId)
        {
            try
            {
                var comments = await _feedBackService.GetByFeedBackByCampaignId(campaignId);
                return Ok(comments);
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        // Cập nhật bình luận
        [HttpPut("UpdateFeedBack/{feedbackId}")]
        public async Task<ActionResult> UpdateFeedBack(string feedbackId, UpdateCampaignFeedBackDto feedback)
        {
            try
            {
                var existingFeedBack = await _feedBackService.GetById(feedbackId);
                if (existingFeedBack == null)
                {
                    return NotFound();
                }

                await _feedBackService.Update(feedbackId, feedback);
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
                var existingComment = await _feedBackService.GetById(id);
                if (existingComment == null)
                {
                    return NotFound();
                }

                await _feedBackService.Delete(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }
    }
}
