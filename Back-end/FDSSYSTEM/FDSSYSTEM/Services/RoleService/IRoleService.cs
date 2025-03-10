using FDSSYSTEM.DTOs;
using FDSSYSTEM.Models;

namespace FDSSYSTEM.Services.RoleService
{
    public interface IRoleService
    {
        Task<List<RoleDto>> GetPublicRole();
        Task<Role> GetRoleById(int roleId);
    }
}
