using FDSSYSTEM.DTOs;
using FDSSYSTEM.Models;
using FDSSYSTEM.Services.RegisterReceiverService;
using Mapster;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FDSSYSTEM.Controllers
{
    [Route("api/RegisterReceiver")]
    [ApiController]
    public class RegisterReceiverController : Controller
    {
        private readonly IRegisterReceiverService _registerReceiverService;

        public RegisterReceiverController(IRegisterReceiverService registerReceiverService)
        {
            _registerReceiverService = registerReceiverService;
        }

        // Lấy tất cả RegisterReceiver
        [HttpGet("GetAllRegisterReceivers")]
        /*[Authorize(Roles = "Admin,Staff,Recipient")]*/
        public async Task<ActionResult> GetAllRegisterReceivers()
        {
            try
            {
                var registerReceivers = await _registerReceiverService.GetAll();
                return Ok(registerReceivers);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // Lấy RegisterReceiver theo ID
        [HttpGet("GetRegisterReceiverById/{id}")]
       /* [Authorize(Roles = "Admin,Staff,Recipient")]*/
        public async Task<ActionResult> GetRegisterReceiverById(string id)
        {
            try
            {
                var registerReceiver = await _registerReceiverService.GetById(id);
                if (registerReceiver == null)
                {
                    return NotFound(new { message = "RegisterReceiver not found" });
                }
                return Ok(registerReceiver.Adapt<RegisterReceiverDto>());
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // Tạo RegisterReceiver
        [HttpPost("CreateRegisterReceiver")]
        [Authorize(Roles = "Recipient")]
        public async Task<ActionResult> CreateRegisterReceiver(RegisterReceiverDto registerReceiver)
        {
            try
            {
                await _registerReceiverService.Create(registerReceiver);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        // Cập nhật RegisterReceiver
        [HttpPut("UpdateRegisterReceiver/{id}")]
        [Authorize(Roles = "Staff,Recipient")]
        public async Task<ActionResult> UpdateRegisterReceiver(string id, RegisterReceiverDto registerReceiverDto)
        {
            try
            {
                var existingRegisterReceiver = await _registerReceiverService.GetById(id);
                if (existingRegisterReceiver == null)
                {
                    return NotFound();
                }

                await _registerReceiverService.Update(id, registerReceiverDto);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        [HttpGet("GetTotalQuantityRegistered")]
        [Authorize(Roles = "Recipient")]
        public async Task<ActionResult> GetTotalQuantityRegistered([FromQuery] string campaignId)
        {
            try
            {
                var accountId = User?.Claims?.FirstOrDefault(c => c.Type == "UserId")?.Value;
                if (string.IsNullOrEmpty(accountId))
                    return Unauthorized(new { message = "Không tìm thấy người dùng." });

                var total = await _registerReceiverService.GetTotalRegisteredQuantityAsync(campaignId, accountId);
                return Ok(new { TotalRegisteredQuantity = total });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }



    }
}
