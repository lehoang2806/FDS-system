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

        [HttpPost("logingoogle")]
        public async Task<IActionResult> LoginGoogle([FromBody] LoginGoogleDto loginGoogleRequest)
        {
            if (string.IsNullOrEmpty(loginGoogleRequest.IdToken))
                return Unauthorized("Invalid credentials.");
            var payload = await _userService.VerifyGoogleTokenAsync(loginGoogleRequest.IdToken);
            if (payload == null)
                return Unauthorized("Invalid credentials.");
            if (string.IsNullOrEmpty(payload.Email))
                return Unauthorized("Invalid credentials.");
            var user = await _userService.GetUserByUsernameAsync(payload.Email);
            if (user == null)
            {
                //Lần đầu login cần yêu cầu tạo account với RoleId và Phone
                if (loginGoogleRequest.RoleId == null || (loginGoogleRequest.RoleId != 3 && loginGoogleRequest.RoleId != 4))
                {
                    //trương hợp chưa có roleid hoặc role không đúng (chỉ nhận roleid 3 hoặc4)
                    return Ok(new LoginResponseDto());
                }
                else
                {
                    //có role tạo account mới
                    var registerUserDto = new RegisterUserDto
                    {
                        FullName = payload.Name ?? payload.Email,
                        UserEmail = payload.Email,
                        Password = Guid.NewGuid().ToString(), //Tạo mật khẩu radom, nếu muốn đặt lại mật khẩu thì chọn quên password
                        RoleId = loginGoogleRequest.RoleId ?? 0,
                        Phone = loginGoogleRequest.PhoneNumber ?? ""
                    };
                    await _userService.CreateUserAsync(registerUserDto, false, true);

                    //sau khi tạo xong thì lấy lại thông tin user
                    user = await _userService.GetUserByUsernameAsync(payload.Email);
                }
            }

            var role = await _roleService.GetRoleById(user.RoleId);
            var token = _jwtHelper.GenerateToken(new UserTokenDto
            {
                Id = user.AccountId,
                UserEmail = user.Email,
                Role = role.RoleName
            });

            return Ok(new LoginResponseDto { Token = token, UserInfo = user.Adapt<UserProfileDto>() });
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
                await _userService.CreateUserAsync(user, true,false);
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
