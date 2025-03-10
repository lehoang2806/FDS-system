using FDSSYSTEM.DTOs;
using FDSSYSTEM.Helpers;
using FDSSYSTEM.Services.RoleService;
using FDSSYSTEM.Services.UserService;
using Mapster;
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

            await _userService.CreateUserAsync(user);

            return Ok("User registered successfully.");
        }
    }
}
