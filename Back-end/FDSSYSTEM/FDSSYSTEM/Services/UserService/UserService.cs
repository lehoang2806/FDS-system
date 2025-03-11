
using FDSSYSTEM.Models;
using FDSSYSTEM.Repositories.UserRepository;
using MongoDB.Bson;
using FDSSYSTEM.DTOs;
using MongoDB.Driver;


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

    public async Task CreateUserAsync(Account user)
    {
        var passwordHash = HashPassword(user.Password);
        var account = new Account
        {
            AccountId = Guid.NewGuid().ToString(),
            Email =user.Email,
            Password = passwordHash,
            FullName = user.FullName,
            Phone = user.Phone,
            RoleId = user.RoleId,
            CCCD = user.CCCD,
            TaxIdentificationNumber = user.TaxIdentificationNumber,
            OrganizationName = user.OrganizationName,
            Status = user.Status,
            IsConfirm = user.IsConfirm,
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
        var staff = new Account
        {
            FullName = staffDto.FullName,
            Phone = staffDto.Phone,
            Password = staffDto.Password,
            Email = staffDto.UserEmail,
            RoleId =2,
            IsConfirm =true
        };
        await CreateUserAsync(staff);
    }

    public async Task CreateUserAsync(RegisterPersonalDonorDto user)
    {
        var personalDonor = new Account
        {
            FullName = user.FullName,
            Phone = user.Phone,
            Password = user.Password,
            Email = user.UserEmail,
            RoleId = 3,
            Status ="Pending",
            CCCD = user.CCCD,
            IsConfirm = false
        };
        await CreateUserAsync(personalDonor);
    }

    public async Task CreateUserAsync(RegisterOrganizationDonorDto user)
    {
        var organizationDonor = new Account
        {
            FullName = user.FullName,
            Phone = user.Phone,
            Password = user.Password,
            Email = user.UserEmail,
            RoleId = 3,
            Status = "Pending",
            OrganizationName = user.OrganizationName,
            TaxIdentificationNumber = user.TaxIdentificationNumber,
            IsConfirm = false
        };
        await CreateUserAsync(organizationDonor);
    }

    public async Task CreateUserAsync(RegisterRecipientDto user)
    {
        var recipient = new Account
        {
            FullName = user.FullName,
            Phone = user.Phone,
            Password = user.Password,
            Email = user.UserEmail,
            RoleId = 4,
            Status = "Pending",
            CCCD = user.CCCD,
            IsConfirm = false
        };
        await CreateUserAsync(recipient);
    }

    public async Task Confirm(string id)
    {
        var filter = Builders<Account>.Filter.Eq(c => c.AccountId, id);
        var account = (await _userRepository.GetAllAsync(filter)).FirstOrDefault();

        account.IsConfirm =true;
        await _userRepository.UpdateAsync(account.Id, account);
    }
}