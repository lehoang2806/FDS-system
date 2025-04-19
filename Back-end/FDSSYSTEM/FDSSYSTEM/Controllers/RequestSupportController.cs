
using FDSSYSTEM.DTOs;
using FDSSYSTEM.Helper;
using FDSSYSTEM.Services.CampaignService;
using FDSSYSTEM.Services.RequestSupportService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FDSSYSTEM.Controllers
{
    [Route("api/RequestSupport")]
    public class RequestSupportController : BaseController
    {
        private readonly IRequestSupportService _requestSupportService;

        public RequestSupportController(IRequestSupportService requestSupportService)
        {
            _requestSupportService = requestSupportService;
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

        [HttpPut("UpdateRequestSupport/{id}")]
        [Authorize(Roles = "Recipient")]
        public async Task<ActionResult> UpdateRequestSupport(string id, RequestSupportDto requestSupport)
        {
            try
            {
                var existingRequestSupport = await _requestSupportService.GetRequestSupportById(id);
                if (existingRequestSupport == null)
                {
                    return NotFound();
                }

                await _requestSupportService.Update(id, requestSupport);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        [HttpDelete("DeleteRequestSupport/{id}")]
        [Authorize(Roles = "Recipient")]
        public async Task<ActionResult> DeleteRequestSupport(string id)
        {
            try
            {
                var existingRequestSupport = await _requestSupportService.GetRequestSupportById(id);
                if (existingRequestSupport == null)
                {
                    return NotFound();
                }

                await _requestSupportService.Delete(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        [HttpGet("GetRequestSupportById/{id}")]
        /* [Authorize(Roles = "Staff,Admin,Donor,Recipient")]*/
        public async Task<ActionResult> GetRequestSupportById(string id)
        {
            try
            {
                // Gọi service để lấy chiến dịch theo ID
                var requestSupport = await _requestSupportService.GetRequestSupportById(id);

                // Nếu chiến dịch không tìm thấy, trả về lỗi NotFound
                if (requestSupport == null)
                {
                    return NotFound(new { message = "RequestSupport not found" });
                }

                // Trả về thông tin chi tiết của chiến dịch
                return Ok(requestSupport);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }


    }
}
