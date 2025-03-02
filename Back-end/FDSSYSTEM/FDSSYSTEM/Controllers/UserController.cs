using FDSSYSTEM.Database;
using FDSSYSTEM.DTOs;
using FDSSYSTEM.Helpers;
using FDSSYSTEM.Models;
using FDSSYSTEM.Repositories.UserRepository;
using FDSSYSTEM.Services.UserService;
using Mapster;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages.Manage;
namespace FDSSYSTEM.Controllers
{
    [Route("api/user")]
    [ApiController]
    [Authorize]
    public class UserController : Controller
    {
        private readonly IUserService _userService;
        private readonly IConfiguration _configuration;



        //public UserController(IUserService userService, IConfiguration configuration)
        public UserController(IConfiguration configuration, IUserService userService)
        {
            //this._db = db;
            //_userService = userService;
            _configuration = configuration;
            _userService = userService;
        }


        [HttpGet("GetAllUser")]
        public async Task<ActionResult> GetAllUser()
        {
            try
            {
               // List<UserProfileDto> rs =new List<UserProfileDto>();
                var users = await _userService.GetAllUser();
                //foreach (var user in users)
                //{
                //    rs.Add(new UserProfileDto
                //    {
                //        Email = user.Email
                //    });

                //}
                return Ok(users.Adapt<List<UserProfileDto>>());
            }
            catch (Exception ex)
            {

                return BadRequest();

            }
        }


        [HttpPost("AddUser")]
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

        [Route("api/auth")]
        [ApiController]
        public class AuthController : ControllerBase
        {
            private readonly UserService _userService;
            private readonly JwtHelper _jwtHelper;

            public AuthController(UserService userService, JwtHelper jwtHelper)
            {
                _userService = userService;
                _jwtHelper = jwtHelper;
            }

            //[HttpPost("register")]
            //public async Task<IActionResult> Register([FromBody] Account account)
            //{
            //    var existingUser = await _userService.GetUserByUsernameAsync(account.Email);
            //    if (existingUser is not null)
            //    {
            //        return BadRequest("User already exists.");
            //    }

            //    await _userService.CreateUserAsync(account.Email);
            //    return Ok("User registered successfully.");

            //}

            //[HttpPost("login")]
            //public async Task<IActionResult> Login([FromBody] Account loginUser)
            //{
            //    var user = await _userService.GetUserByUsernameAsync(loginUser.Email);
            //    if (user == null || !_userService.VerifyPassword(loginUser.Password, user.Password))
            //    {
            //        return Unauthorized("Invalid username or password.");
            //    }

            //    var token = _jwtHelper.GenerateToken(user);
            //    return Ok(new { Token = token });
            //}
            //[HttpGet("info")]
            //public async Task<ActionResult> GetInfo(string token)
            //{
            //    try
            //    {
            //        if (token == "")
            //        {
            //            return BadRequest();
            //        }
            //        return Ok(_userService.GetInfo(token));
            //    }
            //    catch
            //    {
            //        return BadRequest();
            //    }
            //}

            //[HttpPost("changePassword")]
            //public async Task<ActionResult> ChangePassword(int accountId, string newPassword)
            //{
            //    try
            //    {
            //        var result = _userService.ChangePassword(accountId, newPassword);
            //        return Ok(result);
            //    }
            //    catch
            //    {
            //        return BadRequest();
            //    }
            //}

            //[HttpPost("updateUser")]
            //public async Task<ActionResult> UpdateUser(UpdateUser user)
            //{
            //    try
            //    {
            //        var result = _userService.UpdateUser(user);
            //        return Ok(result);
            //    }
            //    catch { return BadRequest(); }
            //}

            //[HttpPost("ChangeStatusUser")]
            //public async Task<ActionResult> ChangeStatusUser(int accountId, string newStatus)
            //{
            //    try
            //    {
            //        var result = _userService.ChangeStatusUser(accountId, newStatus);
            //        return Ok(result);
            //    }
            //    catch
            //    {
            //        return BadRequest();
            //    }
            //}

            //[HttpGet("getPhoneWithoutThisPhone")]
            //public async Task<ActionResult> GetPhoneWithoutThisPhone(string phone)
            //{
            //    try
            //    {
            //        var result = _userService.GetPhoneNumberWithoutThisPhone(phone);
            //        return Ok(result);
            //    }
            //    catch
            //    {
            //        return BadRequest();
            //    }
            //}



        }
    }
}
