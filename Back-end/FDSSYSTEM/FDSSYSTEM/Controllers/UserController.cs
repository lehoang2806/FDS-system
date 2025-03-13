using FDSSYSTEM.Database;
using FDSSYSTEM.DTOs;
using FDSSYSTEM.DTOs.Certificates;
using FDSSYSTEM.Helpers;
using FDSSYSTEM.Models;
using FDSSYSTEM.Repositories.UserRepository;
using FDSSYSTEM.Services.UserContextService;
using FDSSYSTEM.Services.UserService;
using Mapster;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages.Manage;
using System.Security.Claims;
namespace FDSSYSTEM.Controllers
{
    [Route("api/user")]
  
    public class UserController : BaseController
    {
        private readonly IUserService _userService;
        private readonly IConfiguration _configuration;
       
        public UserController(IConfiguration configuration, IUserService userService)
        {          
            _configuration = configuration;
            _userService = userService;
        }


        [HttpGet("GetAllUser")]
        [Authorize(Roles = "Admin,Staff")]
        public async Task<ActionResult> GetAllUser()
        {
            try
            {
             
                var users = await _userService.GetAllUser();
               
                return Ok(users.Adapt<List<UserProfileDto>>());
            }
            catch (Exception ex)
            {

                return BadRequest();

            }
        }


        [HttpPost("AddUser")]
        [Authorize(Roles = "Admin,Staff")]
        public async Task<ActionResult> AddUser(Account account)
        {
            try
            {
                await _userService.AddUser(account);
                return Ok();
            }
            catch (Exception ex)
            {

                return BadRequest();

            }
        }


        [HttpPost("AddStaff")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> AddStaff(AddStaffDto staffDto)
        {
            try
            {
                await _userService.AddStaff(staffDto);
                return Ok();
            }
            catch (Exception ex)
            {

                return BadRequest();

            }
        }

        [HttpPut("Confirm")]
        [Authorize(Roles = "Admin,Staff")]
        public async Task<ActionResult> Confirm([FromBody] ConfirmUserDto confirmUserDto)
        {
            try
            {
                await _userService.Confirm(confirmUserDto);  // Gọi phương thức Confirm với DTO
                return Ok();
            }
            catch (Exception ex)
            {
                // Xử lý lỗi và trả về phản hồi
                return BadRequest(ex.Message);
            }
        }


        [HttpPost("CreatePersonalDonorCertificate")]
        [Authorize(Roles = "Donor")]
        public async Task<ActionResult> CreatePersonalDonorCertificate(CreatePersonalDonorCertificateDto cert)
        {
            try
            {
                await _userService.CreatePersonalDonorCertificate(cert);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        [HttpPost("CreateOrganizationDonorCertificate")]
        [Authorize(Roles = "Donor")]
        public async Task<ActionResult> CreateOrganizationDonorCertificate(CreateOrganizationDonorCertificateDto cert)
        {
            try
            {
                await _userService.CreateOrganizationDonorCertificate(cert);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        [HttpPost("CreateRecipientCertificate")]
        [Authorize(Roles = "Recipient")]
        public async Task<ActionResult> CreateRecipientCertificate(CreateRecipientCertificateDto cert)
        {
            try
            {
                await _userService.CreateRecipientCertificate(cert);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }


        [HttpGet("GetAllDonorCertificate")]
        [Authorize(Roles = "Admin,Staff,Donor")]
        public async Task<ActionResult> GetAllDonorCertificate()
        {
            try
            {
                var cert = await _userService.GetAllDonorCertificat();
                return Ok(cert);
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        [HttpGet("GetAllRecipientCertificate")]
        [Authorize(Roles = "Admin,Staff,Recipient")]
        public async Task<ActionResult> GetAllRecipientCertificate()
        {
            try
            {
                var cert = await _userService.GetAllRecipientCertificat();
                return Ok(cert);
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        [HttpPut("ApproveCertificate")]
        [Authorize(Roles = "Staff")]
        public async Task<ActionResult> ApproveDonorCertificate(ApproveCertificateDto approveCertificateDto)
        {
            try
            {
                await _userService.ApproveCertificate(approveCertificateDto);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("RejectCertificate")]
        [Authorize(Roles = "Staff")]
        public async Task<ActionResult> RejectCertificate(RejectCertificateDto rejectCertificateDto)
        {
            try
            {
                await _userService.RejectCertificate(rejectCertificateDto);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
