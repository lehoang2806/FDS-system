using FDSSYSTEM.Database;
using FDSSYSTEM.DTOs;
using FDSSYSTEM.DTOs.Certificates;
using FDSSYSTEM.DTOs.Users;
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
        /*[Authorize(Roles = "Admin,Staff")]*/
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

        [HttpGet("GetAccountById")]
        /*[Authorize(Roles = "Admin,Staff")]*/
        public async Task<ActionResult<Account>> GetAccountById(string accountId)
        {
            try
            {
                var account = await _userService.GetAccountById(accountId);
                return Ok(account);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
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

        [HttpPut("UpdatePersonalDonorCertificate")]
        [Authorize(Roles = "Donor")]
        public async Task<ActionResult> UpdatePersonalDonorCertificate(string id, CreatePersonalDonorCertificateDto personalDonorCertificate)
        {
            try
            {
                var existingPersonalDonorCertificate = await _userService.GetPersonalDonorCertificateById(id);
                if (existingPersonalDonorCertificate == null)
                {
                    return NotFound();
                }

                await _userService.UpdatePersonalDonorCertificate(id, personalDonorCertificate);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        [HttpPut("UpdateOrganizationDonorCertificate")]
        [Authorize(Roles = "Donor")]
        public async Task<ActionResult> UpdateOrganizationDonorCertificate(string id, CreateOrganizationDonorCertificateDto organizationDonorCertificate)
        {
            try
            {
                var existingOrganizationDonorCertificate = await _userService.GetOrganizationDonorCertificateById(id);
                if (existingOrganizationDonorCertificate == null)
                {
                    return NotFound();
                }

                await _userService.UpdateOrganizationDonorCertificate(id, organizationDonorCertificate);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        [HttpPut("UpdateRecipientCertificate")]
        [Authorize(Roles = "Recipient")]
        public async Task<ActionResult> UpdateRecipientCertificate(string id, CreateRecipientCertificateDto recipientCertificate)
        {
            try
            {
                var existingRecipientCertificate = await _userService.GetRecipientCertificateById(id);
                if (existingRecipientCertificate == null)
                {
                    return NotFound();
                }

                await _userService.UpdateRecipientCertificate(id, recipientCertificate);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }


        [HttpPost("CommentCertificate")]
        [Authorize(Roles = "Admin,Staff")]
        public async Task<ActionResult> CommentCertificate(ReviewCommentCertificateDto reviewCommentCertificateDto)
        {
            try
            {
                await _userService.AddCertificateReviewComment(reviewCommentCertificateDto);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        [HttpGet("GetPersonalDonorCertificateById/{id}")]
        /* [Authorize(Roles = "Staff,Admin,Donor,Recipient")]*/
        public async Task<ActionResult> GetPersonalDonorCertificateById(string id)
        {
            try
            {
                // Gọi service để lấy chứng nhận theo ID
                var personalDonorCertificate = await _userService.GetPersonalDonorCertificateById(id);

                // Nếu chứng nhận không tìm thấy, trả về lỗi NotFound
                if (personalDonorCertificate == null)
                {
                    return NotFound(new { message = "Certificate not found" });
                }

                // Trả về thông tin chi tiết của chứng nhận
                return Ok(personalDonorCertificate);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("GetOrganizationDonorCertificateById/{id}")]
        /* [Authorize(Roles = "Staff,Admin,Donor,Recipient")]*/
        public async Task<ActionResult> GetOrganizationDonorCertificateById(string id)
        {
            try
            {
                // Gọi service để lấy chứng nhận theo ID
                var organizationDonorCertificate = await _userService.GetOrganizationDonorCertificateById(id);

                // Nếu chứng nhận không tìm thấy, trả về lỗi NotFound
                if (organizationDonorCertificate == null)
                {
                    return NotFound(new { message = "Certificate not found" });
                }

                // Trả về thông tin chi tiết của chứng nhận
                return Ok(organizationDonorCertificate);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("GetRecipientCertificateById/{id}")]
        /* [Authorize(Roles = "Staff,Admin,Donor,Recipient")]*/
        public async Task<ActionResult> RecipientCertificateById(string id)
        {
            try
            {
                // Gọi service để lấy chứng nhận theo ID
                var recipientCertificate = await _userService.GetRecipientCertificateById(id);

                // Nếu chứng nhận không tìm thấy, trả về lỗi NotFound
                if (recipientCertificate == null)
                {
                    return NotFound(new { message = "Certificate not found" });
                }

                // Trả về thông tin chi tiết của chứng nhận
                return Ok(recipientCertificate);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }


        [HttpGet("GetAllDonorCertificate")]
        /* [Authorize(Roles = "Admin,Staff,Donor")]*/
        public async Task<ActionResult> GetAllDonorCertificate()
        {
            try
            {
                var cert = await _userService.GetAllDonorCertificate();
                return Ok(cert);
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        [HttpGet("GetAllRecipientCertificate")]
        /* [Authorize(Roles = "Admin,Staff,Recipient")]*/
        public async Task<ActionResult> GetAllRecipientCertificate()
        {
            try
            {
                var cert = await _userService.GetAllRecipientCertificate();
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



        [HttpPut("UpdateProfile")]
        [Authorize]
        public async Task<ActionResult> UpdateProfile(UpdateProfileDto userProfile)
        {
            try
            {
                await _userService.UpdateUserProfile(userProfile);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        [HttpGet("GetAllConfirmedDonorForSupport")]
        [Authorize(Roles = "Staff")]
        public async Task<ActionResult> GetAllConfirmedDonorForSupport()
        {
            try
            {
                var donors = await _userService.GetAllDonorConfirmed();
                var config = new TypeAdapterConfig();
                config.NewConfig<Account, DonorForSupportDto>()
                     .Map(dest => dest.DonorId, src => src.AccountId);

                return Ok(donors.Adapt<List<DonorForSupportDto>>(config));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
