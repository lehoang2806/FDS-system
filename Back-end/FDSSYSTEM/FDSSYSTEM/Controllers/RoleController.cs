using FDSSYSTEM.DTOs;
using FDSSYSTEM.Services.RoleService;
using FDSSYSTEM.Services.UserService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FDSSYSTEM.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoleController : ControllerBase
    {
        private readonly IRoleService _roleService;
        public RoleController(IRoleService roleService)
        {
            _roleService = roleService;
        }
        [HttpGet("GetPublicRoles")]
        public async Task<ActionResult> GetPublicRoles()
        {
            try
            {
                return Ok(await _roleService.GetPublicRole());
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }
    }
}
