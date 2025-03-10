using FDSSYSTEM.DTOs;
using FDSSYSTEM.Models;
using FDSSYSTEM.Services.NewService;
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
        public async Task<ActionResult> GetAllNews()
        {
            try
            {
                var newsList = await _newService.GetAll();
                return Ok(newsList);
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        [HttpPost("Approve")]
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

        // Cập nhật tin tức
        [HttpPut("UpdateNews/{id}")]
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
