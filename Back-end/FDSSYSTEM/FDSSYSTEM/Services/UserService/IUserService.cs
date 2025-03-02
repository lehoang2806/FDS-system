

using FDSSYSTEM.DTOs;
using FDSSYSTEM.Models;

namespace FDSSYSTEM.Services.UserService;

public interface IUserService
{

    Task<IEnumerable<Account>> GetAllUser();
    Task AddUser(Account account);
    public  Task<Account> GetUserByUsernameAsync(string userEmail);
    public  Task CreateUserAsync(RegisterUserDto user);
    public bool VerifyPassword(string enteredPassword, string storedHash);
}