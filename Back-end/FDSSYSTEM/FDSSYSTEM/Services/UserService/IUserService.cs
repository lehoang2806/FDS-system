
using FDSSYSTEM.DTOs;
using FDSSYSTEM.DTOs.Certificates;
using FDSSYSTEM.DTOs.Users;
using FDSSYSTEM.Models;
using Google.Apis.Auth;
namespace FDSSYSTEM.Services.UserService;

public interface IUserService
{
    Task<IEnumerable<Account>> GetAllUser();
    Task AddUser(Account account);
    Task AddStaff(AddStaffDto staffDto);
    public Task<Account> GetUserByUsernameAsync(string userEmail);
    public Task CreateUserAsync(RegisterUserDto account, bool verifyOtp, bool isGoogleAccount);
    public bool VerifyPassword(string enteredPassword, string storedHash);
    Task Confirm(ConfirmUserDto confirmUserDto);

    Task CreateOrganizationDonorCertificate(CreateOrganizationDonorCertificateDto certificateDto);
    Task CreatePersonalDonorCertificate(CreatePersonalDonorCertificateDto certificateDto);
    Task CreateRecipientCertificate(CreateRecipientCertificateDto certificateDto);

    Task<List<DonorCertificateDto>> GetAllDonorCertificate();
    Task<List<RecipientCertificateDto>> GetAllRecipientCertificate();


    Task<PersonalDonorCertificate> GetPersonalDonorCertificateById(string personalDonorCertificate);  // Thêm phương thức này để lấy chiến dịch theo ID
    Task<OrganizationDonorCertificate> GetOrganizationDonorCertificateById(string organizationDonorCertificate);  // Thêm phương thức này để lấy chiến dịch theo ID
    Task<RecipientCertificate> GetRecipientCertificateById(string recipientCertificate);  // Thêm phương thức này để lấy chiến dịch theo ID

    Task ApproveCertificate(ApproveCertificateDto approveCertificateDto);
    Task RejectCertificate(RejectCertificateDto rejectCertificateDto);
    Task<Account> GetAccountById(string accountId);

    Task<List<string>> GetAllAdminAndStaffId();
    Task<List<string>> GetAllAdminAndDnonorId();
    Task<List<string>> GetAllAdminId();
    Task<List<Account>> GetAllAdminAndRecipientId();
    Task<List<string>> GetAllDonorAndStaffId();
    Task<List<Account>> GetAllAdminAndStaffAndRecipientId();
    Task<List<string>> GetAllDonorAndRecipientConfirmedId();
    Task<List<string>> GetAllDonorConfirmedId();
    Task AddCertificateReviewComment(ReviewCommentCertificateDto reviewCommentCertificateDto);
    Task UpdatePersonalDonorCertificate(string id, CreatePersonalDonorCertificateDto personalDonorCertificate);
    Task UpdateOrganizationDonorCertificate(string id, CreateOrganizationDonorCertificateDto organizationDonorCertificate);
    Task UpdateRecipientCertificate(string id, CreateRecipientCertificateDto recipientCertificate);
    Task RequestOtp(RequestOtpDto requestOtpDto);
    Task RequestOtpForgetPassword(RequestOtpDto requestOtpDto);
    Task<bool> VerifyOtp( VerifyOtpDto verifyOtpDto);
    Task UpdateUserProfile(UpdateProfileDto updateProfileDto);
    Task ChangePassword (ChangePasswordDto changePassword);
    Task ResetPassword (ResetPasswordDto resetPassword);
    Task<List<Account>> GetAllDonorConfirmed();
    Task<List<Account>> GetAllRecipientConfirmed();
    Task<GoogleJsonWebSignature.Payload> VerifyGoogleTokenAsync(string idToken);
}