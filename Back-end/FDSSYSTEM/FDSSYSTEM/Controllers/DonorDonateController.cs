using FDSSYSTEM.DTOs;
using FDSSYSTEM.Helper;
using FDSSYSTEM.Options;
using FDSSYSTEM.Services.DonorDonateService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System;
using System.Threading.Tasks;

namespace FDSSYSTEM.Controllers
{
    [Route("api/donordonate")]
    [ApiController]
    public class DonorDonateController : ControllerBase
    {
        private readonly IDonorDonateService _donorDonateService;
        private readonly VnPaySetting _vnPaySetting;
        public DonorDonateController(IDonorDonateService donorDonateService, IOptions<VnPaySetting> options)
        {
            _donorDonateService = donorDonateService;
            _vnPaySetting = options.Value;
        }

        [HttpPost("CreateDonorDonate")]
        [Authorize(Roles = "Donor")]
        public async Task<ActionResult> CreateDonorDonate(DonorDonateDto donorDonateDto)
        {
            try
            {
                var donorDonate = await _donorDonateService.Create(donorDonateDto);

                var baseUrl = $"{Request.Scheme}://{Request.Host}";
                var returnUrl = $"{baseUrl}/api/donordonate/vnpayreturn";

                var url = VnPayHelper.CreatePaymentUrl(
                    _vnPaySetting.PaymentUrl,
                    _vnPaySetting.TmnCode,
                    _vnPaySetting.HashSecret,
                    returnUrl,
                    donorDonate.DonorDonateId,
                    donorDonate.Amount
                );

                return Ok(new { paymentUrl = url });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("vnpayreturn")]
        [AllowAnonymous]
        public async Task<ActionResult> VnpayReturn()
        {
            var query = Request.Query;
            var hashSecret = _vnPaySetting.HashSecret;

            if (!VnPayHelper.ValidateSignature(query, hashSecret))
                return Content("❌ Chữ ký không hợp lệ!");

            var responseCode = query["vnp_ResponseCode"];
            var donorDonateId = query["vnp_TxnRef"];
            var transactionId = query["vnp_TransactionNo"];
            if (responseCode == "00")
            {
                // TUpdate DB khi thanh toán thành công
                await _donorDonateService.Update(donorDonateId, true, transactionId);
            }

            var frontendRedirect = _vnPaySetting.FrontendReturnUrl;
            frontendRedirect += $"?status={(responseCode == "00" ? "success" : "fail")}&donorDonateId={donorDonateId}";

            return Redirect(frontendRedirect);
        }


        [HttpGet("GetAllDonorDonates")]
        [Authorize(Roles = "Staff,Admin,Donor")]
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
        [Authorize(Roles = "Staff,Admin,Donor")]
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