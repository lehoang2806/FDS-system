
using FDSSYSTEM.DTOs;
using FDSSYSTEM.Models;
namespace FDSSYSTEM.Services.UserService;

public interface IUserService
{

    Task<IEnumerable<Account>> GetAllUser();
    Task AddUser(Account account);
    Task AddStaff(AddStaffDto staffDto);
    public  Task<Account> GetUserByUsernameAsync(string userEmail);
    public  Task CreateUserAsync(Account account);
    public bool VerifyPassword(string enteredPassword, string storedHash);
    Task CreateUserAsync(RegisterPersonalDonorDto user);
    Task CreateUserAsync(RegisterOrganizationDonorDto user);
    Task CreateUserAsync(RegisterRecipientDto user);
    Task Confirm(string id);
}