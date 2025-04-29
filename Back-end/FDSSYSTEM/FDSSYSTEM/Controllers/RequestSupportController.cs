
using FDSSYSTEM.DTOs;
using FDSSYSTEM.DTOs;
using FDSSYSTEM.Helper;
using FDSSYSTEM.Models;
using FDSSYSTEM.Options;
using FDSSYSTEM.Services.CampaignService;
using FDSSYSTEM.Services.RequestSupportService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace FDSSYSTEM.Controllers
{
    [Route("api/RequestSupport")]
    public class RequestSupportController : BaseController
    {
        private readonly IRequestSupportService _requestSupportService;
        private readonly IWebHostEnvironment _env;
        private readonly EmailHelper _emailHeper;
        private readonly EmailConfig _emailConfig;

        public RequestSupportController(IRequestSupportService requestSupportService, IWebHostEnvironment env, EmailHelper emailHeper, IOptions<EmailConfig> options)
        {
            _requestSupportService = requestSupportService;
            _env = env;
            _emailHeper = emailHeper;
            _emailConfig = options.Value;
        }



        [HttpPost("CreateRequestSupport")]
        [Authorize(Roles = "Recipient")]
        public async Task<ActionResult> CreateRequestSupport(RequestSupportDto requestSupport)
        {
            try
            {
                await _requestSupportService.Create(requestSupport);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        [HttpGet("GetAllRequestSupport")]
        /*[Authorize(Roles = "Staff,Admin,Donor,Recipient")]*/
        public async Task<ActionResult> GetAllRequestSupport()
        {
            try
            {
                var requestSupport = await _requestSupportService.GetAll();
                return Ok(requestSupport);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("UpdateRequestSupport/{RequestSupportId}")]
        [Authorize(Roles = "Recipient")]
        public async Task<ActionResult> UpdateRequestSupport(string RequestSupportId, RequestSupportDto requestSupport)
        {
            try
            {
                var existingRequestSupport = await _requestSupportService.GetRequestSupportById(RequestSupportId);
                if (existingRequestSupport == null)
                {
                    return NotFound();
                }

                await _requestSupportService.Update(RequestSupportId, requestSupport);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        [HttpDelete("DeleteRequestSupport/{RequestSupportId}")]
        [Authorize(Roles = "Recipient")]
        public async Task<ActionResult> DeleteRequestSupport(string RequestSupportId)
        {
            try
            {
                var existingRequestSupport = await _requestSupportService.GetRequestSupportById(RequestSupportId);
                if (existingRequestSupport == null)
                {
                    return NotFound();
                }

                await _requestSupportService.Delete(RequestSupportId);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        [HttpGet("GetRequestSupportById/{RequestSupportId}")]
        /*[Authorize(Roles = "Staff,Admin,Donor,Recipient")]*/
        public async Task<ActionResult> GetRequestSupportById(string RequestSupportId)
        {
            try
            {
                // Gọi service để lấy đơn yêu cầu theo ID
                var requestSupport = await _requestSupportService.GetRequestSupportById(RequestSupportId);

                // Nếu không tìm thấy, trả về lỗi NotFound
                if (requestSupport == null)
                {
                    return NotFound(new { message = "Không tìm thấy đơn yêu cầu hỗ trợ" });
                }

                // Trả về thông tin chi tiết
                return Ok(requestSupport);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("RequestDonorSupport")]
        [Authorize(Roles = "Staff")]
        public async Task<ActionResult> RequestDonorSupport(CampaignRequestDonorSupportDto requestDonorSupportDto)
        {
            try
            {
                // Đọc template email
                string filePath = Path.Combine(_env.ContentRootPath, "EmailTemplates", "CampaignRequestSupport.html");
                if (!System.IO.File.Exists(filePath))
                {
                    throw new FileNotFoundException("Không tìm thấy file template email.", filePath);
                }
                string htmlBody = await System.IO.File.ReadAllTextAsync(filePath);
                var linkDetail = string.Format(_emailConfig.DonorSupportLink, requestDonorSupportDto.RequestSupportId);
                string body = string.Format(htmlBody, linkDetail);
                string subject = "Lời mời trao gởi yêu thương";

                // Gửi email
                await _emailHeper.SendEmailAsync(subject, body, requestDonorSupportDto.Emails, true);

                // Lưu thông tin nhà tài trợ vào đơn yêu cầu
                await _requestSupportService.AddDonorSupportRequest(requestDonorSupportDto.RequestSupportId, requestDonorSupportDto);

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("UpdateDonorStatus/{requestSupportId}/{donorId}")]
        [Authorize(Roles = "Donor")]
        public async Task<ActionResult> UpdateDonorStatus(string requestSupportId, string donorId, [FromBody] string status)
        {
            try
            {
                await _requestSupportService.UpdateDonorStatus(requestSupportId, donorId, status);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

    }
}
