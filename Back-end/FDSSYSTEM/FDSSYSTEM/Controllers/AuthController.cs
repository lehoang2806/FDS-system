using FDSSYSTEM.DTOs;
using FDSSYSTEM.Helpers;
using FDSSYSTEM.Services.UserService;
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
        private readonly JwtHelper _jwtHelper;
        public AuthController(IUserService userService, JwtHelper jwtHelper)
        {
            _userService = userService;
            _jwtHelper = jwtHelper;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginUserDto loginRequest)
        {
            var user = await _userService.GetUserByUsernameAsync(loginRequest.UserEmail);
            if (user == null || !_userService.VerifyPassword(loginRequest.Password, user.Password))
                return Unauthorized("Invalid credentials.");

            var token = _jwtHelper.GenerateToken(new UserDto
            {
                UserEmail =user.Email,
                Role = user.RoleId.ToString()
            });
            return Ok(new { token });
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
