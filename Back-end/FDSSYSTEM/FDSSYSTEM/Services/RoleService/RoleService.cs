using FDSSYSTEM.DTOs;
using FDSSYSTEM.Models;
using FDSSYSTEM.Repositories.RoleRepository;
using Mapster;

namespace FDSSYSTEM.Services.RoleService
{
    public class RoleService : IRoleService
    {
        private readonly IRoleRepository _roleRepository;

        public RoleService(IRoleRepository roleRepository)
        {
            _roleRepository = roleRepository;
        }
        public async Task<List<RoleDto>> GetPublicRole()
        {
            var allRole = await _roleRepository.GetAllAsync();
            return allRole.Where(x => x.RoleName == "Donor" || x.RoleName == "Recipient").ToList().Adapt<List<RoleDto>>();
        }

        public async Task<Role> GetRoleById(int roleId)
        {
            var allRole = await _roleRepository.GetAllAsync();
            return allRole.FirstOrDefault(x => x.RoleId == roleId);
        }
    }
}
