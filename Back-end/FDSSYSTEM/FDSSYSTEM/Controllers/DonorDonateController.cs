using FDSSYSTEM.DTOs;
using FDSSYSTEM.Services.DonorDonateService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace FDSSYSTEM.Controllers
{
    [Route("api/donordonate")]
    [ApiController]
    public class DonorDonateController : ControllerBase
    {
        private readonly IDonorDonateService _donorDonateService;

        public DonorDonateController(IDonorDonateService donorDonateService)
        {
            _donorDonateService = donorDonateService;
        }

        [HttpPost("CreateDonorDonate")]
        [Authorize(Roles = "Staff")]
        public async Task<ActionResult> CreateDonorDonate(DonorDonateDto donorDonateDto)
        {
            try
            {
                await _donorDonateService.Create(donorDonateDto);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("UpdateDonorDonate/{DonorDonateId}")]
        [Authorize(Roles = "Staff")]
        public async Task<ActionResult> UpdateDonorDonate(string id, DonorDonateDto donorDonateDto)
        {
            try
            {
                await _donorDonateService.Update(id, donorDonateDto);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("DeleteDonorDonate/{id}")]
        [Authorize(Roles = "Staff")]
        public async Task<ActionResult> DeleteDonorDonate(string id)
        {
            try
            {
                await _donorDonateService.Delete(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("GetAllDonorDonates")]
        [Authorize(Roles = "Staff,Admin")]
        public async Task<ActionResult> GetAllDonorDonates()
        {
            try
            {
                var donorDonates = await _donorDonateService.GetAll();
                return Ok(donorDonates);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("GetDonorDonateById/{donorDonateId}")]
        [Authorize(Roles = "Staff,Admin")]
        public async Task<ActionResult> GetDonorDonateById(string donorDonateId)
        {
            try
            {
                var donorDonate = await _donorDonateService.GetByDonorDonateId(donorDonateId);
                if (donorDonate == null)
                {
                    return NotFound(new { message = "Donor donation not found" });
                }
                return Ok(donorDonate);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }

}