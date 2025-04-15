using FDSSYSTEM.DTOs;
using FDSSYSTEM.DTOs.Users;
using FDSSYSTEM.Helpers;
using FDSSYSTEM.Services.RoleService;
using FDSSYSTEM.Services.UserService;
using Mapster;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.Scripting;

namespace FDSSYSTEM.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IRoleService _roleService;
        private readonly JwtHelper _jwtHelper;
        public AuthController(IUserService userService, IRoleService roleService, JwtHelper jwtHelper)
        {
            _userService = userService;
            _roleService = roleService;
            _jwtHelper = jwtHelper;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginUserDto loginRequest)
        {
            var user = await _userService.GetUserByUsernameAsync(loginRequest.UserEmail);
            if (user == null || !_userService.VerifyPassword(loginRequest.Password, user.Password))
                return Unauthorized("Invalid credentials.");


            var role = await _roleService.GetRoleById(user.RoleId);

            var token = _jwtHelper.GenerateToken(new UserTokenDto
            {
                Id = user.AccountId,
                UserEmail = user.Email,
                Role = role.RoleName
            });

            return Ok(new { token, UserInfo = user.Adapt<UserProfileDto>() });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterUserDto user)
        {
            var existingUser = await _userService.GetUserByUsernameAsync(user.UserEmail);
            if (existingUser != null) return BadRequest("Username already exists.");

            if (user.RoleId != 3 && user.RoleId != 4)
            {
                return BadRequest();
            }

            try
            {
                await _userService.CreateUserAsync(user, true);
                return Ok("User registered successfully.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("RequestOtp")]
        public async Task<IActionResult> RequestOtp([FromBody] RequestOtpDto requestOtpDto)
        {
            try
            {
                await _userService.RequestOtp(requestOtpDto);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("VerifyOtp")]
        public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpDto user)
        {
            try
            {
                var result = await _userService.VerifyOtp(user);
                return Ok("Verify successfully.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpGet("CheckEmail/{email}")]

        public async Task<IActionResult> CheckEmail(string email)
        {
            try
            {
                var existingUser = await _userService.GetUserByUsernameAsync(email);
                return Ok(new CheckExistingEmailDto { IsExisting = existingUser != null });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpPut("ChangePassword")]
        [Authorize]
        public async Task<IActionResult> ChangePassword(ChangePasswordDto changePassword)
        {
            try
            {
                await _userService.ChangePassword(changePassword);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("RequestOtpForgetPassword")]
        public async Task<IActionResult> RequestOtpForgetPassword([FromBody] RequestOtpDto requestOtpDto)
        {
            try
            {
                await _userService.RequestOtpForgetPassword(requestOtpDto);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("ResetPassword")]
        public async Task<IActionResult> ResetPassword(ResetPasswordDto resetPassword)
        {
            try
            {
                await _userService.ResetPassword(resetPassword);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
