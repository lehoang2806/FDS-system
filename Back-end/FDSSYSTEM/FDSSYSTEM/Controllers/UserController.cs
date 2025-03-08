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



       
        public UserController(IConfiguration configuration, IUserService userService)
        {
           
            _configuration = configuration;
            _userService = userService;
        }


        [HttpGet("GetAllUser")]
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


        
    }
}
