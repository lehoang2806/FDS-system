
using FDSSYSTEM.Models;
using FDSSYSTEM.Repositories.UserRepository;
using FDSSYSTEM.Services.UserService;
using MongoDB.Bson;
using System.Text;
using System.Security.Cryptography;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages.Manage;
using FDSSYSTEM.DTOs;
using Mapster;


namespace FDSSYSTEM.Services.UserService;


public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;

    public UserService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task AddUser(Account account)
    {
        account.Id = ObjectId.GenerateNewId().ToString();
        await _userRepository.AddAsync(account);
    }

    public async Task<IEnumerable<Account>> GetAllUser()
    {
        return await _userRepository.GetAllAsync();
    }

    public async Task<Account> GetUserByUsernameAsync(string userEmail)
    {

        userEmail = userEmail.ToLower();
        var allUser = await _userRepository.GetAllAsync();
        return allUser.FirstOrDefault(x => x.Email?.ToLower() == userEmail);

    }

    public async Task CreateUserAsync(RegisterUserDto user)
    {
        var passwordHash = HashPassword(user.Password);
        var account = new Account
        {
            AccountId = Guid.NewGuid().ToString(),
            Email =user.UserEmail,
            Password = passwordHash,
            FullName = user.FullName,
            Phone = user.Phone,
            RoleId = user.RoleId
        };
        await _userRepository.AddAsync(account);
    }

    public bool VerifyPassword(string enteredPassword, string hashPass)
    {
       return  BCrypt.Net.BCrypt.Verify(enteredPassword, hashPass);
    }

    private static string HashPassword(string password)
    {
      return  BCrypt.Net.BCrypt.HashPassword(password);
    }

    public async Task AddStaff(AddStaffDto staffDto)
    {
        var staff = new RegisterUserDto
        {
            FullName = staffDto.FullName,
            Phone = staffDto.Phone,
            Password = staffDto.Password,

            RoleId =2
        };
        await CreateUserAsync(staff);
    }
}