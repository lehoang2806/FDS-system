using FDSSYSTEM.Database;
using FDSSYSTEM.Models;
using FDSSYSTEM.Repositories.UserRepository;
using FDSSYSTEM.Services.UserService;

namespace FDSSYSTEM.SeedData
{
    public class SeedData
    {
        public static async Task Initialize(IUserService userService)
        {
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
                await userService.CreateUserAsync(newAdmin);
            }
        }
    }
}
