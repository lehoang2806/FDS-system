using FDSSYSTEM.Services.NotificationService;
using FDSSYSTEM.Models;
using FDSSYSTEM.Repositories.UserRepository;
using MongoDB.Bson;
using FDSSYSTEM.DTOs;
using MongoDB.Driver;
using FDSSYSTEM.DTOs.Certificates;
using FDSSYSTEM.Services.UserContextService;
using FDSSYSTEM.Repositories.OrganizationDonorCertificateRepository;
using FDSSYSTEM.Repositories.RecipientCertificateRepository;
using Mapster;
using Elfie.Serialization;
using FDSSYSTEM.Enums;
using Microsoft.AspNetCore.Http.HttpResults;
using FDSSYSTEM.SignalR;
using Microsoft.AspNetCore.SignalR;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages.Manage;
using System.Net;
using FDSSYSTEM.Helper;
using static System.Net.WebRequestMethods;
using FDSSYSTEM.Repositories.OtpRepository;
using ZstdSharp.Unsafe;
using FDSSYSTEM.DTOs.Users;
using Microsoft.AspNetCore.Identity.Data;
using FDSSYSTEM.Options;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Mvc;
using Google.Apis.Auth;


namespace FDSSYSTEM.Services.UserService;


public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly IUserContextService _userContextService;
    private readonly IOrganizationDonorCertificateRepository _organizationDonorCertificateRepository;
    private readonly IPersonalDonorCertificateRepository _personalDonorCertificateRepository;
    private readonly IRecipientCertificateRepository _recipientCertificateRepository;
    private readonly INotificationService _notificationService;
    private readonly IOtpRepository _otpRepository;

    private readonly IHubContext<NotificationHub> _hubNotificationContext;
    private readonly EmailHelper _emailHeper;
    private readonly SMSHelper _smsHeper;
    private readonly IWebHostEnvironment _env;
    private readonly EmailConfig _emailConfig;
    private readonly JwtSetting _jwtSetting;

    public UserService(IUserRepository userRepository
        , IUserContextService userContextService
        , IOrganizationDonorCertificateRepository organizationDonorCertificateRepository
        , IPersonalDonorCertificateRepository personalDonorCertificateRepository
        , IRecipientCertificateRepository recipientCertificateRepository
        , INotificationService notificationService
        , IHubContext<NotificationHub> hubContext
        , EmailHelper emailHeper
        , IOtpRepository otpRepository
        , SMSHelper smsHelper
        , IWebHostEnvironment env
        , IOptions<EmailConfig> options
        , IOptions<JwtSetting> jwtSettings
        )
    {
        _userRepository = userRepository;
        _userContextService = userContextService;
        _organizationDonorCertificateRepository = organizationDonorCertificateRepository;
        _personalDonorCertificateRepository = personalDonorCertificateRepository;
        _recipientCertificateRepository = recipientCertificateRepository;
        _notificationService = notificationService;
        _hubNotificationContext = hubContext;
        _emailHeper = emailHeper;
        _otpRepository = otpRepository;
        _smsHeper = smsHelper;
        _env = env;
        _emailConfig = options.Value;
        _jwtSetting = jwtSettings.Value;
    }

    public async Task AddUser(Account account)
    {
        account.Id = ObjectId.GenerateNewId().ToString();
        await _userRepository.AddAsync(account);
    }



    public async Task<Account> GetUserByUsernameAsync(string userEmail)
    {
        userEmail = userEmail.ToLower();
        var allUser = await _userRepository.GetAllAsync();
        var user = allUser.FirstOrDefault(x => x.Email?.ToLower() == userEmail);
       
        return user;
    }

    public async Task CreateUserAsync(RegisterUserDto user, bool verifyOtp, bool isGoogleAccount)
    {

        //kiểm tra đã xác thực OTP trước khi tạo account
        if (verifyOtp)
        {
            //tạo user admin mặc định không cần kiểm tra OTP , verifyOtp =false
            var opt = await _otpRepository.GetLatestOtpCodeByEmail(user.UserEmail);
            if (opt == null || !opt.IsVerified) throw new Exception("OTP not verified");
            if (opt.ExpirationTime < DateTime.UtcNow) throw new Exception("OTP expired");
        }


        //Sau khi xác thực OTP xong tạo account
        var passwordHash = HashPassword(user.Password);
        var account = new Account
        {
            AccountId = Guid.NewGuid().ToString(),
            Email = user.UserEmail,
            Password = passwordHash,
            FullName = user.FullName,
            Phone = user.Phone,
            RoleId = user.RoleId,
            IsConfirm = !verifyOtp && !isGoogleAccount,
            //CCCD = user.CCCD,
            //TaxIdentificationNumber = user.TaxIdentificationNumber,
            //OrganizationName = user.OrganizationName,
            //Status = user.Status,
            /*IsConfirm = user.IsConfirm,*/
            /*type = user.type,*/
            CreatedDate = DateTime.UtcNow,
        };
        await _userRepository.AddAsync(account);


    }

    public bool VerifyPassword(string enteredPassword, string hashPass)
    {
        return BCrypt.Net.BCrypt.Verify(enteredPassword, hashPass);
    }

    private static string HashPassword(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password);
    }

    public async Task AddStaff(AddStaffDto staffDto)
    {
        var staff = new RegisterUserDto
        {
            FullName = staffDto.FullName,
            Phone = staffDto.Phone,
            Password = staffDto.Password,
            UserEmail = staffDto.UserEmail,
            RoleId = 2,
        };
        await CreateUserAsync(staff, false,false);
    }

    //public async Task CreateUserAsync(RegisterPersonalDonorDto user)
    //{
    //    var personalDonor = new Account
    //    {
    //        FullName = user.FullName,
    //        Phone = user.Phone,
    //        Password = user.Password,
    //        Email = user.UserEmail,
    //        RoleId = 3,
    //        Status ="Pending",
    //        CCCD = user.CCCD,
    //        IsConfirm = false
    //    };
    //    await CreateUserAsync(personalDonor);
    //}

    //public async Task CreateUserAsync(RegisterOrganizationDonorDto user)
    //{
    //    var organizationDonor = new Account
    //    {
    //        FullName = user.FullName,
    //        Phone = user.Phone,
    //        Password = user.Password,
    //        Email = user.UserEmail,
    //        RoleId = 3,
    //        Status = "Pending",
    //        OrganizationName = user.OrganizationName,
    //        TaxIdentificationNumber = user.TaxIdentificationNumber,
    //        IsConfirm = false
    //    };
    //    await CreateUserAsync(organizationDonor);
    //}

    //public async Task CreateUserAsync(RegisterRecipientDto user)
    //{
    //    var recipient = new Account
    //    {
    //        FullName = user.FullName,
    //        Phone = user.Phone,
    //        Password = user.Password,
    //        Email = user.UserEmail,
    //        RoleId = 4,
    //        Status = "Pending",
    //        CCCD = user.CCCD,
    //        IsConfirm = false
    //    };
    //    await CreateUserAsync(recipient);
    //}

    public async Task Confirm(ConfirmUserDto confirmUserDto)
    {
        var filter = Builders<Account>.Filter.Eq(c => c.AccountId, confirmUserDto.AccountId);
        var account = (await _userRepository.GetAllAsync(filter)).FirstOrDefault();

        if (account != null)
        {
            account.IsConfirm = true;
            account.Type = confirmUserDto.Type; // Thêm type từ DTO vào account
            await _userRepository.UpdateAsync(account.Id, account);
        }
        else
        {
            // Xử lý nếu không tìm thấy account
            throw new Exception("Account not found");
        }
    }


    public async Task CreateOrganizationDonorCertificate(CreateOrganizationDonorCertificateDto certificateDto)
    {
        string certificateId = Guid.NewGuid().ToString();
        await _organizationDonorCertificateRepository.AddAsync(new OrganizationDonorCertificate
        {
            OrganizationDonorCertificateId = certificateId,
            DonorId = _userContextService.UserId,
            OrganizationName = certificateDto.OrganizationName,
            TaxIdentificationNumber = certificateDto.TaxIdentificationNumber,
            OrganizationAbbreviatedName = certificateDto.OrganizationAbbreviatedName,
            OrganizationType = certificateDto.OrganizationType,
            MainBusiness = certificateDto.MainBusiness,
            OrganizationAddress = certificateDto.OrganizationAddress,
            ContactPhone = certificateDto.ContactPhone,
            OrganizationEmail = certificateDto.OrganizationEmail,
            WebsiteLink = certificateDto.WebsiteLink,
            RepresentativeName = certificateDto.RepresentativeName,
            RepresentativePhone = certificateDto.RepresentativePhone,
            RepresentativeEmail = certificateDto.RepresentativeEmail,
            Images = certificateDto.Images,
        });

        //Send notifiction all staff and admin
        var userReceiveNotifications = await GetAllAdminAndStaffId();
        foreach (var userId in userReceiveNotifications)
        {
            var notificationDto = new NotificationDto
            {
                Title = "Chứng nhận mới được tạo",
                Content = "Có chứng nhận mới được tạo ra",
                NotificationType = "Pending",
                ObjectType = "Organization Donor Certificate",
                OjectId = certificateId,
                AccountId = userId
            };
            //save notifiation to db
            await _notificationService.AddNotificationAsync(notificationDto);
            //send notification via signalR
            await _hubNotificationContext.Clients.User(notificationDto.AccountId).SendAsync("ReceiveNotification", notificationDto);
        }

    }

    public async Task CreatePersonalDonorCertificate(CreatePersonalDonorCertificateDto certificateDto)
    {
        string certificateId = Guid.NewGuid().ToString();
        await _personalDonorCertificateRepository.AddAsync(new PersonalDonorCertificate
        {
            PersonalDonorCertificateId = certificateId,
            DonorId = _userContextService.UserId,
            FullName = certificateDto.FullName,
            BirthDay = certificateDto.BirthDay,
            Email = certificateDto.Email,
            Phone = certificateDto.Phone,
            Address = certificateDto.Address,
            SocialMediaLink = certificateDto.SocialMediaLink,
            MainSourceIncome = certificateDto.MainSourceIncome,
            MonthlyIncome = certificateDto.MonthlyIncome,
            CitizenImages = certificateDto.CitizenImages,
            OtherImages = certificateDto.OtherImages,
        });

        //Send notifiction all staff and admin
        var userReceiveNotifications = await GetAllAdminAndStaffId();
        foreach (var userId in userReceiveNotifications)
        {
            var notificationDto = new NotificationDto
            {
                Title = "Chứng nhận mới được tạo",
                Content = "Có chứng nhận mới được tạo ra",
                NotificationType = "Pending",
                ObjectType = "Personal Donor Certificate",
                OjectId = certificateId,
                AccountId = userId
            };
            //save notifiation to db
            await _notificationService.AddNotificationAsync(notificationDto);
            //send notification via signalR
            await _hubNotificationContext.Clients.User(notificationDto.AccountId).SendAsync("ReceiveNotification", notificationDto);
        }

    }


    public async Task CreateRecipientCertificate(CreateRecipientCertificateDto certificateDto)
    {
        string certificateId = Guid.NewGuid().ToString();
        await _recipientCertificateRepository.AddAsync(new RecipientCertificate
        {
            RecipientCertificateId = certificateId,
            RecipientId = _userContextService.UserId,
            FullName = certificateDto.FullName,
            Phone = certificateDto.Phone,
            Address = certificateDto.Address,
            BirthDay = certificateDto.BirthDay,
            Email = certificateDto.Email,
            Circumstances = certificateDto.Circumstances,
            RegisterSupportReason = certificateDto.RegisterSupportReason,
            CitizenImages = certificateDto.CitizenImages,
            MainSourceIncome = certificateDto.MainSourceIncome,
            MonthlyIncome = certificateDto.MonthlyIncome,
            OtherImages = certificateDto.OtherImages,
        });

        //Send notifiction all staff and admin
        var userReceiveNotifications = await GetAllAdminAndStaffId();
        foreach (var userId in userReceiveNotifications)
        {
            var notificationDto = new NotificationDto
            {
                Title = "Chứng nhận mới được tạo",
                Content = "Có chứng nhận mới được tạo ra",
                NotificationType = "Pending",
                ObjectType = "Recipient Certificate",
                OjectId = certificateId,
                AccountId = userId
            };
            //save notifiation to db
            await _notificationService.AddNotificationAsync(notificationDto);
            //send notification via signalR
            await _hubNotificationContext.Clients.User(notificationDto.AccountId).SendAsync("ReceiveNotification", notificationDto);
        }

    }

    public async Task UpdatePersonalDonorCertificate(string id, CreatePersonalDonorCertificateDto personalDonorCertificate)
    {
        var existingPersonalDonorCertificate = await GetPersonalDonorCertificateById(id);
        if (existingPersonalDonorCertificate != null)
        {

            existingPersonalDonorCertificate.FullName = personalDonorCertificate.FullName;
            existingPersonalDonorCertificate.BirthDay = personalDonorCertificate.BirthDay;
            existingPersonalDonorCertificate.Email = personalDonorCertificate.Email;
            existingPersonalDonorCertificate.Phone = personalDonorCertificate.Phone;
            existingPersonalDonorCertificate.Address = personalDonorCertificate.Address;
            existingPersonalDonorCertificate.SocialMediaLink = personalDonorCertificate.SocialMediaLink;
            existingPersonalDonorCertificate.MainSourceIncome = personalDonorCertificate.MainSourceIncome;
            existingPersonalDonorCertificate.MonthlyIncome = personalDonorCertificate.MonthlyIncome;
            existingPersonalDonorCertificate.CitizenImages = personalDonorCertificate.CitizenImages;
            existingPersonalDonorCertificate.OtherImages = personalDonorCertificate.OtherImages;
            await _personalDonorCertificateRepository.UpdateAsync(existingPersonalDonorCertificate.Id, existingPersonalDonorCertificate);

        }

        var userReceiveNotifications = await GetAllAdminAndStaffId();
        foreach (var userId in userReceiveNotifications)
        {
            var notificationDto = new NotificationDto
            {
                Title = "Chứng nhận mới được cập nhật",
                Content = "có chứng nhận mới vừa được cập nhật",
                NotificationType = "Update",
                ObjectType = "Personal Donor Certificate",
                OjectId = existingPersonalDonorCertificate.PersonalDonorCertificateId,
                AccountId = userId
            };
            //save notifiation to db
            await _notificationService.AddNotificationAsync(notificationDto);
            //send notification via signalR
            await _hubNotificationContext.Clients.User(notificationDto.AccountId).SendAsync("ReceiveNotification", notificationDto);
        }

    }

    public async Task UpdateOrganizationDonorCertificate(string id, CreateOrganizationDonorCertificateDto organizationDonorCertificate)
    {
        var existingOrganizationDonorCertificate = await GetOrganizationDonorCertificateById(id);
        if (existingOrganizationDonorCertificate != null)
        {

            existingOrganizationDonorCertificate.OrganizationName = organizationDonorCertificate.OrganizationName;
            existingOrganizationDonorCertificate.TaxIdentificationNumber = organizationDonorCertificate.TaxIdentificationNumber;
            existingOrganizationDonorCertificate.OrganizationAbbreviatedName = organizationDonorCertificate.OrganizationAbbreviatedName;
            existingOrganizationDonorCertificate.OrganizationType = organizationDonorCertificate.OrganizationType;
            existingOrganizationDonorCertificate.MainBusiness = organizationDonorCertificate.MainBusiness;
            existingOrganizationDonorCertificate.OrganizationAddress = organizationDonorCertificate.OrganizationAddress;
            existingOrganizationDonorCertificate.ContactPhone = organizationDonorCertificate.ContactPhone;
            existingOrganizationDonorCertificate.OrganizationEmail = organizationDonorCertificate.OrganizationEmail;
            existingOrganizationDonorCertificate.WebsiteLink = organizationDonorCertificate.WebsiteLink;
            existingOrganizationDonorCertificate.RepresentativeName = organizationDonorCertificate.RepresentativeName;
            existingOrganizationDonorCertificate.RepresentativePhone = organizationDonorCertificate.RepresentativePhone;
            existingOrganizationDonorCertificate.RepresentativeEmail = organizationDonorCertificate.RepresentativeEmail;
            existingOrganizationDonorCertificate.Images = organizationDonorCertificate.Images;
            await _organizationDonorCertificateRepository.UpdateAsync(existingOrganizationDonorCertificate.Id, existingOrganizationDonorCertificate);

        }

        var userReceiveNotifications = await GetAllAdminAndStaffId();
        foreach (var userId in userReceiveNotifications)
        {
            var notificationDto = new NotificationDto
            {
                Title = "Chứng nhận mới được cập nhật",
                Content = "có chứng nhận mới vừa được cập nhật",
                NotificationType = "Update",
                ObjectType = "Organization Donor Certificate",
                OjectId = existingOrganizationDonorCertificate.OrganizationDonorCertificateId,
                AccountId = userId
            };
            //save notifiation to db
            await _notificationService.AddNotificationAsync(notificationDto);
            //send notification via signalR
            await _hubNotificationContext.Clients.User(notificationDto.AccountId).SendAsync("ReceiveNotification", notificationDto);
        }

    }

    public async Task UpdateRecipientCertificate(string id, CreateRecipientCertificateDto recipientCertificate)
    {
        var existingRecipientCertificate = await GetRecipientCertificateById(id);
        if (existingRecipientCertificate != null)
        {

            existingRecipientCertificate.FullName = recipientCertificate.FullName;
            existingRecipientCertificate.Phone = recipientCertificate.Phone;
            existingRecipientCertificate.Address = recipientCertificate.Address;
            existingRecipientCertificate.BirthDay = recipientCertificate.BirthDay;
            existingRecipientCertificate.Email = recipientCertificate.Email;
            existingRecipientCertificate.Circumstances = recipientCertificate.Circumstances;
            existingRecipientCertificate.RegisterSupportReason = recipientCertificate.RegisterSupportReason;
            existingRecipientCertificate.CitizenImages = recipientCertificate.CitizenImages;
            existingRecipientCertificate.OtherImages = recipientCertificate.OtherImages;
            existingRecipientCertificate.MainSourceIncome = recipientCertificate.MainSourceIncome;
            existingRecipientCertificate.MonthlyIncome = recipientCertificate.MonthlyIncome;
            await _recipientCertificateRepository.UpdateAsync(existingRecipientCertificate.Id, existingRecipientCertificate);

        }

        var userReceiveNotifications = await GetAllAdminAndStaffId();
        foreach (var userId in userReceiveNotifications)
        {
            var notificationDto = new NotificationDto
            {
                Title = "Chứng nhận mới được cập nhật",
                Content = "có chứng nhận mới vừa được cập nhật",
                NotificationType = "Update",
                ObjectType = "Recipient Certificate",
                OjectId = existingRecipientCertificate.RecipientCertificateId,
                AccountId = userId
            };
            //save notifiation to db
            await _notificationService.AddNotificationAsync(notificationDto);
            //send notification via signalR
            await _hubNotificationContext.Clients.User(notificationDto.AccountId).SendAsync("ReceiveNotification", notificationDto);
        }

    }


    public async Task<List<DonorCertificateDto>> GetAllDonorCertificate()
    {
        var config = new TypeAdapterConfig();
        config.NewConfig<OrganizationDonorCertificate, DonorCertificateDto>()
             .Map(dest => dest.DonorCertificateId, src => src.OrganizationDonorCertificateId);
        config.NewConfig<PersonalDonorCertificate, DonorCertificateDto>()
            .Map(dest => dest.DonorCertificateId, src => src.PersonalDonorCertificateId);

        var org = (await _organizationDonorCertificateRepository.GetAllAsync()).ToList();
        var per = (await _personalDonorCertificateRepository.GetAllAsync()).ToList();

        var rs = org.Adapt<List<DonorCertificateDto>>(config);
        rs.AddRange(per.Adapt<List<DonorCertificateDto>>(config));


        return rs;
    }

    public async Task<List<RecipientCertificateDto>> GetAllRecipientCertificate()
    {
        var rec = await _recipientCertificateRepository.GetAllAsync();

        var rs = rec.ToList().Adapt<List<RecipientCertificateDto>>();

        var listRecipientId = rs.Select(c => c.RecipientId).Distinct().ToList();
        var recipientFilter = Builders<Account>.Filter.In(c => c.AccountId, listRecipientId);
        var allCreator = await _userRepository.GetAllAsync(recipientFilter);


        return rs;
    }


    public async Task<IEnumerable<Account>> GetAllUser()
    {
        return await _userRepository.GetAllAsync();
    }



    public async Task ApproveCertificate(ApproveCertificateDto approveCertificateDto)
    {
        string objectId = "";
        string accountId = "";
        string objectType = "";
        string donorType = "";
        switch (approveCertificateDto.Type)
        {
            case ApproveCertificateType.PersonalDonor:
                var pcert = await _personalDonorCertificateRepository.GetPersonalDonorCertificateByIdAsync(approveCertificateDto.CertificateId);
                if (pcert == null) throw new Exception("Certificate Not found");
                pcert.Status = "Approved";
                await _personalDonorCertificateRepository.UpdateAsync(pcert.Id, pcert);
                objectId = pcert.PersonalDonorCertificateId;
                accountId = pcert.DonorId;
                objectType = "Personal Donor Certificate";
                donorType = "Personal Donor";
                break;
            case ApproveCertificateType.OrganizationDonor:
                var ogcert = await _organizationDonorCertificateRepository.GetOrganizationDonorCertificateByIdAsync(approveCertificateDto.CertificateId);
                if (ogcert == null) throw new Exception("Certificate Not found");
                ogcert.Status = "Approved";
                await _organizationDonorCertificateRepository.UpdateAsync(ogcert.Id, ogcert);
                objectId = ogcert.OrganizationDonorCertificateId;
                accountId = ogcert.DonorId;
                objectType = "Organization Donor Certificate";
                donorType = "Organization Donor";
                break;
            case ApproveCertificateType.Recipient:
                var rcert = await _recipientCertificateRepository.GetRecipientCertificateByIdAsync(approveCertificateDto.CertificateId);
                if (rcert == null) throw new Exception("Certificate Not found");
                rcert.Status = "Approved";
                await _recipientCertificateRepository.UpdateAsync(rcert.Id, rcert);
                objectId = rcert.RecipientCertificateId;
                accountId = rcert.RecipientId;
                objectType = "Recipient Certificate";
                break;
            default:
                throw new Exception("Type not found");
        }

        var account = await GetAccountById(accountId);
        account.IsConfirm = true;
        account.DonorType = donorType;
        await _userRepository.UpdateAsync(account.Id, account);

        var notificationDto = new NotificationDto
        {
            Title = "Phê duyệt chứng nhận thành công",
            Content = "Chứng nhận của bạn đã được phê duyệt thành công",
            NotificationType = "Approve",
            ObjectType = objectType,
            OjectId = objectId,
            AccountId = accountId
        };
        //save notifiation to db
        await _notificationService.AddNotificationAsync(notificationDto);
        //send notification via signalR
        await _hubNotificationContext.Clients.User(notificationDto.AccountId).SendAsync("ReceiveNotification", notificationDto);

        if (string.IsNullOrEmpty(donorType))
        {
            //donorType ="" => là recipient => gửi SMS
            _smsHeper.SendSMS(account.Phone, "FDS-System: Chứng nhận của bạn đã được phê duyệt");
        }
        else
        {
            //Gửi mail cho donor
            string filePath = Path.Combine(_env.ContentRootPath, "EmailTemplates", "ApproveCertificate.html");
            if (!System.IO.File.Exists(filePath))
            {
                throw new FileNotFoundException("Không tìm thấy file template email.", filePath);
            }
            string htmlBody = await System.IO.File.ReadAllTextAsync(filePath);
            string body = htmlBody.Replace("{{UserName}}", account.FullName).Replace("{{Hompage}}", _emailConfig.HomePage);
            string subject = "Chứng nhận của bạn đã được phê duyệt";
            await _emailHeper.SendEmailAsync(subject, body, new List<string> { account.Email }, true);
        }


    }

    public async Task RejectCertificate(RejectCertificateDto rejectCertificateDto)
    {
        string objectId = "";
        string accountId = "";
        string objectType = "";
        string donorType = "";
        switch (rejectCertificateDto.Type)
        {
            case ApproveCertificateType.PersonalDonor:
                var pcert = await _personalDonorCertificateRepository.GetPersonalDonorCertificateByIdAsync(rejectCertificateDto.CertificateId);
                if (pcert == null) throw new Exception("Certificate Not found");
                pcert.Status = "Rejected";
                pcert.RejectComment = rejectCertificateDto.Comment;
                await _personalDonorCertificateRepository.UpdateAsync(pcert.Id, pcert);
                objectId = pcert.PersonalDonorCertificateId;
                accountId = pcert.DonorId;
                objectType = "Personal Donor Certificate";
                donorType = "Personal Donor";
                break;
            case ApproveCertificateType.OrganizationDonor:
                var ogcert = await _organizationDonorCertificateRepository.GetOrganizationDonorCertificateByIdAsync(rejectCertificateDto.CertificateId);
                if (ogcert == null) throw new Exception("Certificate Not found");
                ogcert.Status = "Rejected";
                ogcert.RejectComment = rejectCertificateDto.Comment;
                await _organizationDonorCertificateRepository.UpdateAsync(ogcert.Id, ogcert);
                objectId = ogcert.OrganizationDonorCertificateId;
                accountId = ogcert.DonorId;
                objectType = "Organization Donor Certificate";
                donorType = "Organization Donor";
                break;
            case ApproveCertificateType.Recipient:
                var rcert = await _recipientCertificateRepository.GetRecipientCertificateByIdAsync(rejectCertificateDto.CertificateId);
                if (rcert == null) throw new Exception("Certificate Not found");
                rcert.Status = "Rejected";
                rcert.RejectComment = rejectCertificateDto.Comment;
                await _recipientCertificateRepository.UpdateAsync(rcert.Id, rcert);
                objectId = rcert.RecipientCertificateId;
                accountId = rcert.RecipientId;
                objectType = "Recipient Certificate";
                break;
            default:
                throw new Exception("Type not found");
        }

        var account = await GetAccountById(accountId);
        account.IsConfirm = true;
        account.DonorType = donorType;
        await _userRepository.UpdateAsync(account.Id, account);

        var notificationDto = new NotificationDto
        {
            Title = "Phê duyệt chứng nhận thất bại",
            Content = "Chứng nhận của bạn đã được phê duyệt thất bại",
            NotificationType = "Reject",
            ObjectType = objectType,
            OjectId = objectId,
            AccountId = accountId
        };
        //save notifiation to db
        await _notificationService.AddNotificationAsync(notificationDto);
        //send notification via signalR
        await _hubNotificationContext.Clients.User(notificationDto.AccountId).SendAsync("ReceiveNotification", notificationDto);

        if (string.IsNullOrEmpty(donorType))
        {
            //donorType ="" => là recipient => gửi SMS
            _smsHeper.SendSMS(account.Phone, "FDS-System: Chứng nhận của bạn đã không được phê duyệt");
        }
        else
        {
            //Gửi mail cho donor
            string filePath = Path.Combine(_env.ContentRootPath, "EmailTemplates", "RejectCertificate.html");
            if (!System.IO.File.Exists(filePath))
            {
                throw new FileNotFoundException("Không tìm thấy file template email.", filePath);
            }
            string htmlBody = await System.IO.File.ReadAllTextAsync(filePath);
            string body = htmlBody.Replace("{{UserName}}", account.FullName).Replace("{{Hompage}}", _emailConfig.HomePage);
            string subject = "Chứng nhận của bạn đã không được phê duyệt";
            await _emailHeper.SendEmailAsync(subject, body, new List<string> { account.Email }, true);
        }


    }



    public async Task<Account> GetAccountById(string accountId)
    {
        var filter = Builders<Account>.Filter.Eq(c => c.AccountId, accountId);
        var account = (await _userRepository.GetAllAsync(filter)).FirstOrDefault();
        if (account == null)
        {
            throw new Exception("Account not found");
        }
        return account;
    }

    public async Task<List<string>> GetAllAdminAndStaffId()
    {

        List<int> roleIds = new List<int>
        {
            1,//admin
            2//staff
        };
        var filter = Builders<Account>.Filter.In(c => c.RoleId, roleIds);
        return (await _userRepository.GetAllAsync(filter)).Select(x => x.AccountId).ToList();
    }

    public async Task<List<string>> GetAllAdminAndDnonorId()
    {

        List<int> roleIds = new List<int>
        {
            1,//admin
            3//donor
        };
        var filter = Builders<Account>.Filter.In(c => c.RoleId, roleIds);
        return (await _userRepository.GetAllAsync(filter)).Select(x => x.AccountId).ToList();
    }


    public async Task<List<string>> GetAllAdminId()
    {

        List<int> roleIds = new List<int>
        {
            1//admin         
        };
        var filter = Builders<Account>.Filter.In(c => c.RoleId, roleIds);
        return (await _userRepository.GetAllAsync(filter)).Select(x => x.AccountId).ToList();
    }

    public async Task<List<string>> GetAllDonorAndStaffId()
    {

        List<int> roleIds = new List<int>
        {

            3,//donor
            2//staff
        };
        var filter = Builders<Account>.Filter.In(c => c.RoleId, roleIds);
        return (await _userRepository.GetAllAsync(filter)).Select(x => x.AccountId).ToList();
    }

    public async Task<List<Account>> GetAllAdminAndStaffAndRecipientId()
    {
        List<int> roleIds = new List<int>
        {
            1,//admin
            2,//staff
            4//recipient
        };
        var filter = Builders<Account>.Filter.And(
             Builders<Account>.Filter.In(c => c.RoleId, roleIds),
             Builders<Account>.Filter.Eq(p => p.IsConfirm, true)
          );
        return (await _userRepository.GetAllAsync(filter)).ToList();
    }
    public async Task<List<Account>> GetAllAdminAndRecipientId()
    {
        List<int> roleIds = new List<int>
        {
            1,//admin
            4//recipient
        };
        var filter = Builders<Account>.Filter.And(
             Builders<Account>.Filter.In(c => c.RoleId, roleIds),
             Builders<Account>.Filter.Eq(p => p.IsConfirm, true)
          );
        return (await _userRepository.GetAllAsync(filter)).ToList();
    }

    public async Task<List<string>> GetAllDonorConfirmedId()
    {

        List<int> roleIds = new List<int>
        {

            3,//donor
           
        };
        var filter = Builders<Account>.Filter.In(c => c.RoleId, roleIds);
        return (await _userRepository.GetAllAsync(filter)).Select(x => x.AccountId).ToList();
    }


    public async Task<PersonalDonorCertificate> GetPersonalDonorCertificateById(string id)
    {
        var filter = Builders<PersonalDonorCertificate>.Filter.Eq(c => c.PersonalDonorCertificateId, id);
        var getbyId = await _personalDonorCertificateRepository.GetAllAsync(filter);
        return getbyId.FirstOrDefault();
    }

    public async Task<OrganizationDonorCertificate> GetOrganizationDonorCertificateById(string id)
    {
        var filter = Builders<OrganizationDonorCertificate>.Filter.Eq(c => c.OrganizationDonorCertificateId, id);
        var getbyId = await _organizationDonorCertificateRepository.GetAllAsync(filter);
        return getbyId.FirstOrDefault();
    }

    public async Task<RecipientCertificate> GetRecipientCertificateById(string id)
    {
        var filter = Builders<RecipientCertificate>.Filter.Eq(c => c.RecipientCertificateId, id);
        var getbyId = await _recipientCertificateRepository.GetAllAsync(filter);
        return getbyId.FirstOrDefault();
    }

    public async Task AddCertificateReviewComment(ReviewCommentCertificateDto reviewCommentCertificateDto)
    {
        string objectId = "";
        string accountId = "";
        string objectType = "";
        string donorType = "";
        switch (reviewCommentCertificateDto.Type)
        {
            case CertificateType.PersonalDonor:
                var pcert = await _personalDonorCertificateRepository.GetPersonalDonorCertificateByIdAsync(reviewCommentCertificateDto.CertificateId);
                if (pcert == null) throw new Exception("Certificate Not found");

                if (pcert.ReviewComments == null)
                {
                    pcert.ReviewComments = new List<PersonalDonorCertificateReViewComment>();
                }
                pcert.ReviewComments.Add(new PersonalDonorCertificateReViewComment
                {

                    Content = reviewCommentCertificateDto.Content,
                    CreatedDate = DateTime.Now,
                });
                await _personalDonorCertificateRepository.UpdateAsync(pcert.Id, pcert);
                objectId = pcert.PersonalDonorCertificateId;
                accountId = pcert.DonorId;
                objectType = "Personal Donor Certificate";
                donorType = "Personal Donor";
                break;
            case CertificateType.OrganizationDonor:
                var ogcert = await _organizationDonorCertificateRepository.GetOrganizationDonorCertificateByIdAsync(reviewCommentCertificateDto.CertificateId);
                if (ogcert == null) throw new Exception("Certificate Not found");

                if (ogcert.ReviewComments == null)
                {
                    ogcert.ReviewComments = new List<OrganizationDonorCertificateReViewComment>();
                }
                ogcert.ReviewComments.Add(new OrganizationDonorCertificateReViewComment
                {
                    Content = reviewCommentCertificateDto.Content,
                    CreatedDate = DateTime.Now
                });
                await _organizationDonorCertificateRepository.UpdateAsync(ogcert.Id, ogcert);
                objectId = ogcert.OrganizationDonorCertificateId;
                accountId = ogcert.DonorId;
                objectType = "Organization Donor Certificate";
                donorType = "Organization Donor";
                break;
            case CertificateType.Recipient:
                var rcert = await _recipientCertificateRepository.GetRecipientCertificateByIdAsync(reviewCommentCertificateDto.CertificateId);
                if (rcert == null) throw new Exception("Certificate Not found");

                if (rcert.ReviewComments == null)
                {
                    rcert.ReviewComments = new List<RecipientCertificateReViewComment>();
                }
                rcert.ReviewComments.Add(new RecipientCertificateReViewComment
                {
                    Content = reviewCommentCertificateDto.Content,
                    CreatedDate = DateTime.Now
                });
                await _recipientCertificateRepository.UpdateAsync(rcert.Id, rcert);
                objectId = rcert.RecipientCertificateId;
                accountId = rcert.RecipientId;
                objectType = "Recipient Certificate";
                break;
            default:
                throw new Exception("Type not found");
        }


        var account = await GetAccountById(accountId);
        account.IsConfirm = true;
        account.DonorType = donorType;
        await _userRepository.UpdateAsync(account.Id, account);

        var notificationDto = new NotificationDto
        {
            Title = "Phê duyệt chứng nhận thiếu sót",
            Content = "Chứng nhận của bạn đã thiếu sót, vui lòng bổ sung thêm",
            NotificationType = "Pending",
            ObjectType = objectType,
            OjectId = objectId,
            AccountId = accountId
        };
        //save notifiation to db
        await _notificationService.AddNotificationAsync(notificationDto);
        //send notification via signalR
        await _hubNotificationContext.Clients.User(notificationDto.AccountId).SendAsync("ReceiveNotification", notificationDto);

        if (string.IsNullOrEmpty(donorType))
        {
            //donorType ="" => là recipient => gửi SMS
            _smsHeper.SendSMS(account.Phone, "FDS-System: Chứng nhận của bạn đã thiếu sót.Vui lòng vào kiểm tra lại ở trang Web");
        }
        else
        {
            //Gửi mail cho donor
            string filePath = Path.Combine(_env.ContentRootPath, "EmailTemplates", "AddCertificateReviewComment.html");
            if (!System.IO.File.Exists(filePath))
            {
                throw new FileNotFoundException("Không tìm thấy file template email.", filePath);
            }
            string htmlBody = await System.IO.File.ReadAllTextAsync(filePath);
            string body = htmlBody.Replace("{{UserName}}", account.FullName).Replace("{{Hompage}}", _emailConfig.HomePage);
            string subject = "Chứng nhận của bạn đã thiếu sót";
            await _emailHeper.SendEmailAsync(subject, body, new List<string> { account.Email }, true);
        }
    }

    public async Task<bool> VerifyOtp(VerifyOtpDto verifyOtpDto)
    {
        var latestOtp = await _otpRepository.GetLatestOtpCodeByEmail(verifyOtpDto.Email);

        if (latestOtp == null) throw new Exception("Email không đúng");
        if (latestOtp.Code != verifyOtpDto.Otp) throw new Exception("OTP không đúng");
        if (latestOtp.ExpirationTime < DateTime.UtcNow) throw new Exception("OTP hết hạn");

        latestOtp.IsVerified = true;
        await _otpRepository.UpdateAsync(latestOtp.Id, latestOtp);
        return true;
    }

    public async Task RequestOtp(RequestOtpDto requestOtpDto)
    {
        var otpCode = new OtpCode
        {
            Email = requestOtpDto.Email,
            Code = OTPGenerator.GenerateOTP(),
            ExpirationTime = DateTime.UtcNow.AddMinutes(5),
            IsVerified = false
        };
        await _otpRepository.AddAsync(otpCode);

        //Send OTP
        //Send via Email
        string subject = "Mã OTP";
        string content = $"Mã OTP xác thực đăng ký tài khoản của bạn: {otpCode.Code}";
        await _emailHeper.SendEmailAsync(subject, content, new List<string> { otpCode.Email });

        //TODO: Send OTP via SMS
        //_smsHeper.SendSMS(requestOtpDto.PhoneNumber, $"FDSSystem OTP: {otpCode.Code}");

    }

    public async Task RequestOtpForgetPassword(RequestOtpDto requestOtpDto)
    {
        var otpCode = new OtpCode
        {
            Email = requestOtpDto.Email,
            Code = OTPGenerator.GenerateOTP(),
            ExpirationTime = DateTime.UtcNow.AddMinutes(5),
            IsVerified = false
        };
        await _otpRepository.AddAsync(otpCode);

        //Send OTP
        //Send via Email
        string subject = "Mã OTP";
        string content = $"Mã OTP quên mật khẩu của bạn: {otpCode.Code}";
        await _emailHeper.SendEmailAsync(subject, content, new List<string> { otpCode.Email });

    }

    public async Task<List<string>> GetAllDonorAndRecipientConfirmedId()
    {
        List<int> roleIds = new List<int>
        {

            3,//donor
            4//recipient
        };
        var filter = Builders<Account>.Filter.And(
              Builders<Account>.Filter.In(c => c.RoleId, roleIds),
              Builders<Account>.Filter.Eq(p => p.IsConfirm, true)
           );

        return (await _userRepository.GetAllAsync(filter)).Select(x => x.AccountId).ToList();
    }

    public async Task UpdateUserProfile(UpdateProfileDto updateProfileDto)
    {
        var currentUser = await GetAccountById(_userContextService.UserId ?? "");
        currentUser.FullName = updateProfileDto.FullName;
        currentUser.Phone = updateProfileDto.Phone;
        currentUser.Avatar = updateProfileDto.Avatar;
        currentUser.BirthDay = updateProfileDto.BirthDay;
        currentUser.Address = updateProfileDto.Address;
        currentUser.Gender = updateProfileDto.Gender;

        await _userRepository.UpdateAsync(currentUser.Id, currentUser);
    }

    public async Task ChangePassword(ChangePasswordDto changePassword)
    {
        var email = _userContextService.UserEmail;
        var user = await GetUserByUsernameAsync(email);
        if (user == null || !VerifyPassword(changePassword.OldPassword, user.Password))
        {
            throw new Exception("Mật khẩu cũ không đúng.");
        }
        var passwordHash = HashPassword(changePassword.NewPassword);
        user.Password = passwordHash;
        await _userRepository.UpdateAsync(user.Id, user);
    }

    public async Task ResetPassword(ResetPasswordDto resetPassword)
    {
        var latestOtp = await _otpRepository.GetLatestOtpCodeByEmail(resetPassword.Email);

        if (latestOtp == null) throw new Exception("Email không đúng");
        if (latestOtp.Code != resetPassword.Otp) throw new Exception(" OTP không đúng");
        if (latestOtp.ExpirationTime < DateTime.UtcNow) throw new Exception("OTP hết hạn");


        var user = await GetUserByUsernameAsync(resetPassword.Email);
        var passwordHash = HashPassword(resetPassword.NewPassword);
        user.Password = passwordHash;
        await _userRepository.UpdateAsync(user.Id, user);
    }

    public async Task<List<Account>> GetAllDonorConfirmed()
    {
        var filter = Builders<Account>.Filter.And(
              Builders<Account>.Filter.Eq(c => c.RoleId, 3),
              Builders<Account>.Filter.Eq(p => p.IsConfirm, true)
           );
        return (await _userRepository.GetAllAsync(filter)).ToList();
    }
    public async Task<List<Account>> GetAllRecipientConfirmed()
    {
        var filter = Builders<Account>.Filter.And(
              Builders<Account>.Filter.Eq(c => c.RoleId, 4),
              Builders<Account>.Filter.Eq(p => p.IsConfirm, true)
           );
        return (await _userRepository.GetAllAsync(filter)).ToList();
    }


    public async Task<GoogleJsonWebSignature.Payload> VerifyGoogleTokenAsync(string idToken)
    {
        try
        {
            var settings = new GoogleJsonWebSignature.ValidationSettings()
            {
                Audience = new List<string>() { _jwtSetting.GoogleClientID } // từ Google Console
            };

            var payload = await GoogleJsonWebSignature.ValidateAsync(idToken, settings);
            return payload;
        }
        catch
        {

        }
        return null;
    }

    public async Task BanAccount(string accountId, string reason)
    {
        var account = await GetAccountById(accountId);
        if (account.IsBanned)
        {
            throw new Exception("Tài khoản đã bị cấm.");
        }

        account.IsBanned = true;
        await _userRepository.UpdateAsync(account.Id, account);

        var notificationDto = new NotificationDto
        {
            Title = "Tài khoản bị cấm",
            Content = $"Tài khoản của bạn đã bị cấm. Lý do: {reason}",
            NotificationType = "Ban",
            ObjectType = "Account",
            OjectId = accountId,
            AccountId = accountId
        };

        // Lưu thông báo vào cơ sở dữ liệu
        await _notificationService.AddNotificationAsync(notificationDto);
        // Gửi thông báo qua SignalR
        await _hubNotificationContext.Clients.User(notificationDto.AccountId).SendAsync("ReceiveNotification", notificationDto);

        if (account.RoleId == 4) // Recipient
        {
            _smsHeper.SendSMS(account.Phone, $"FDS-System: Tài khoản của bạn đã bị cấm. Lý do: {reason}");
        }
        else // Donor
        {
            string filePath = Path.Combine(_env.ContentRootPath, "EmailTemplates", "BanAccount.html");
            if (!System.IO.File.Exists(filePath))
            {
                throw new FileNotFoundException("Không tìm thấy file template email.", filePath);
            }
            string htmlBody = await System.IO.File.ReadAllTextAsync(filePath);
            string body = htmlBody.Replace("{{UserName}}", account.FullName)
                                 .Replace("{{Reason}}", reason)
                                 .Replace("{{Hompage}}", _emailConfig.HomePage);
            string subject = "Tài khoản của bạn đã bị cấm";
            await _emailHeper.SendEmailAsync(subject, body, new List<string> { account.Email }, true);
        }
    }

    public async Task UnbanAccount(string accountId)
    {
        var account = await GetAccountById(accountId);
        if (!account.IsBanned)
        {
            throw new Exception("Tài khoản không bị cấm.");
        }

        account.IsBanned = false;
        await _userRepository.UpdateAsync(account.Id, account);

        var notificationDto = new NotificationDto
        {
            Title = "Tài khoản được bỏ cấm",
            Content = "Tài khoản của bạn đã được bỏ cấm.",
            NotificationType = "Unban",
            ObjectType = "Account",
            OjectId = accountId,
            AccountId = accountId
        };

        // Lưu thông báo vào cơ sở dữ liệu
        await _notificationService.AddNotificationAsync(notificationDto);
        // Gửi thông báo qua SignalR
        await _hubNotificationContext.Clients.User(notificationDto.AccountId).SendAsync("ReceiveNotification", notificationDto);

        if (account.RoleId == 4) // Recipient
        {
            _smsHeper.SendSMS(account.Phone, "FDS-System: Tài khoản của bạn đã được bỏ cấm.");
        }
        else // Donor
        {
            string filePath = Path.Combine(_env.ContentRootPath, "EmailTemplates", "UnbanAccount.html");
            if (!System.IO.File.Exists(filePath))
            {
                throw new FileNotFoundException("Không tìm thấy file template email.", filePath);
            }
            string htmlBody = await System.IO.File.ReadAllTextAsync(filePath);
            string body = htmlBody.Replace("{{UserName}}", account.FullName)
                                 .Replace("{{Hompage}}", _emailConfig.HomePage);
            string subject = "Tài khoản của bạn đã được bỏ cấm";
            await _emailHeper.SendEmailAsync(subject, body, new List<string> { account.Email }, true);
        }
    }


}
