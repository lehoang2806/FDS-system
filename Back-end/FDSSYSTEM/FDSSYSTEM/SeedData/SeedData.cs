using FDSSYSTEM.Database;
using FDSSYSTEM.Models;
using FDSSYSTEM.Repositories.RoleRepository;
using FDSSYSTEM.Repositories.UserRepository;
using FDSSYSTEM.Services.RoleService;
using FDSSYSTEM.Services.UserService;

namespace FDSSYSTEM.SeedData
{
    public class SeedData
    {
        public static async Task Initialize(IUserService userService, IRoleService roleService, IRoleRepository roleRepository)
        {
            //Tạo Role
            var roleAdmin = await roleService.GetRoleById(1);
            if (roleAdmin == null)
            {
                await roleRepository.AddAsync(new Role
                {
                    RoleId = 1,
                    RoleName = "Admin"
                });
            }
            var roleStaff = await roleService.GetRoleById(2);
            if (roleStaff == null)
            {
                await roleRepository.AddAsync(new Role
                {
                    RoleId = 2,
                    RoleName = "Staff"
                });
            }
            var roleDonor = await roleService.GetRoleById(3);
            if (roleDonor == null)
            {
                await roleRepository.AddAsync(new Role
                {
                    RoleId = 3,
                    RoleName = "Donor"
                });
            }
            var roleRecipient = await roleService.GetRoleById(4);
            if (roleRecipient == null)
            {
                await roleRepository.AddAsync(new Role
                {
                    RoleId = 4,
                    RoleName = "Recipient"
                });
            }


            // Kiểm tra xem tài khoản admin đã tồn tại chưa
            var admin = await userService.GetUserByUsernameAsync("admin@gmail.com");

            if (admin == null)
            {
                var newAdmin = new DTOs.RegisterUserDto
                {
                    UserEmail = "admin@gmail.com",
                    Password = "123",
                    RoleId = 1,
                    FullName = "Admin",
                    Phone = "123456789",
                };

                // Lưu tài khoản admin vào MongoDB
                await userService.CreateUserAsync(newAdmin,false, false);
            }
        }
    }
}
