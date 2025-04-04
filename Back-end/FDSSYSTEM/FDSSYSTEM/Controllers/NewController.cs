using FDSSYSTEM.DTOs;
using FDSSYSTEM.Models;
using FDSSYSTEM.Services.NewService;
using Mapster;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FDSSYSTEM.Controllers
{
    [Route("api/news")]
    [ApiController]
    public class NewsController : Controller
    {
        private readonly INewService _newService;

        public NewsController(INewService newsService)
        {
            _newService = newsService;
        }

        // Tạo bài viết tin tức
        [HttpPost("CreateNews")]
        [Authorize(Roles = "Staff")]
        public async Task<ActionResult> CreateNews(NewDto news)
        {
            try
            {
                await _newService.Create(news);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        // Lấy tất cả tin tức

        [HttpGet("GetAllNews")]
        /* [Authorize(Roles = "Admin,Staff,Donor")]*/
        public async Task<ActionResult> GetAllNew()
        {
            try
            {
                var news = await _newService.GetAllNew();
                return Ok(news);
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        [HttpGet("GetNewById/{id}")]
        /* [Authorize(Roles = "Staff,Admin,Donor,Recipient")]*/
        public async Task<ActionResult> GetNewById(string id)
        {
            try
            {
                // Gọi service để lấy chứng nhận theo ID
                var news = await _newService.GetNewById(id);

                // Nếu chứng nhận không tìm thấy, trả về lỗi NotFound
                if (news == null)
                {
                    return NotFound(new { message = "News not found" });
                }

                // Trả về thông tin chi tiết của chứng nhận
                return Ok(news);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }




        /*[HttpPut("Approve")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> Approve(ApproveNewDto approveNewDto)
        {
            try
            {
                await _newService.Approve(approveNewDto);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        [HttpPut("Reject")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> Reject(RejectNewDto rejectNewDto)
        {
            try
            {
                await _newService.Reject(rejectNewDto);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }
*/
        // Cập nhật tin tức
        [HttpPut("UpdateNews/{id}")]
        [Authorize(Roles = "Admin,Staff")]
        public async Task<ActionResult> UpdateNews(string id, NewDto news)
        {
            try
            {
                var existingNews = await _newService.GetById(id);
                if (existingNews == null)
                {
                    return NotFound();
                }

                await _newService.Update(id, news);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        // Xóa tin tức
        [HttpDelete("DeleteNews/{id}")]
        [Authorize(Roles = "Admin,Staff")]
        public async Task<ActionResult> DeleteNews(string id)
        {
            try
            {
                var existingNews = await _newService.GetById(id);
                if (existingNews == null)
                {
                    return NotFound();
                }

                await _newService.Delete(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }
    }
}
