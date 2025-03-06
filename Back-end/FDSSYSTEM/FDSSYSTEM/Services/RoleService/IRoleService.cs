using FDSSYSTEM.DTOs;

namespace FDSSYSTEM.Services.RoleService
{
    public interface IRoleService
    {
        Task<List<RoleDto>> GetPublicRole();
    }
}
