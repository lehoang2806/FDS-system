
using FDSSYSTEM.DTOs;
using FDSSYSTEM.DTOs.Certificates;
using FDSSYSTEM.Models;
namespace FDSSYSTEM.Services.UserService;

public interface IUserService
{
    Task<IEnumerable<Account>> GetAllUser();
    Task AddUser(Account account);
    Task AddStaff(AddStaffDto staffDto);
    public Task<Account> GetUserByUsernameAsync(string userEmail);
    public Task CreateUserAsync(RegisterUserDto account);
    public bool VerifyPassword(string enteredPassword, string storedHash);
    Task Confirm(ConfirmUserDto confirmUserDto);

    Task CreateOrganizationDonorCertificate(CreateOrganizationDonorCertificateDto certificateDto);
    Task CreatePersonalDonorCertificate(CreatePersonalDonorCertificateDto certificateDto);
    Task CreateRecipientCertificate(CreateRecipientCertificateDto certificateDto);

    Task<List<DonorCertificateDto>> GetAllDonorCertificat();
    Task<List<RecipientCertificateDto>> GetAllRecipientCertificat();


    Task ApproveCertificate(ApproveCertificateDto approveCertificateDto);
    Task RejectCertificate(RejectCertificateDto rejectCertificateDto);
    Task<Account> GetAccountById(string accountId);

    Task<List<string>> GetAllAdminAndStaffId();
}