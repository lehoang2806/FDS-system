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


namespace FDSSYSTEM.Services.UserService;


public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly IUserContextService _userContextService;
    private readonly IOrganizationDonorCertificateRepository _organizationDonorCertificateRepository;
    private readonly IPersonalDonorCertificateRepository _personalDonorCertificateRepository;
    private readonly IRecipientCertificateRepository _recipientCertificateRepository;
    private readonly INotificationService _notificationService;

    private readonly IHubContext<NotificationHub> _hubNotificationContext;

    public UserService(IUserRepository userRepository
        , IUserContextService userContextService
        , IOrganizationDonorCertificateRepository organizationDonorCertificateRepository
        , IPersonalDonorCertificateRepository personalDonorCertificateRepository
        , IRecipientCertificateRepository recipientCertificateRepository
        , INotificationService notificationService
        , IHubContext<NotificationHub> hubContext
        )
    {
        _userRepository = userRepository;
        _userContextService = userContextService;
        _organizationDonorCertificateRepository = organizationDonorCertificateRepository;
        _personalDonorCertificateRepository = personalDonorCertificateRepository;
        _recipientCertificateRepository = recipientCertificateRepository;
        _notificationService = notificationService;
        _hubNotificationContext = hubContext;
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
        return allUser.FirstOrDefault(x => x.Email?.ToLower() == userEmail);

    }

    public async Task CreateUserAsync(RegisterUserDto user)
    {
        var passwordHash = HashPassword(user.Password);
        var account = new Account
        {
            AccountId = Guid.NewGuid().ToString(),
            Email = user.UserEmail,
            Password = passwordHash,
            FullName = user.FullName,
            Phone = user.Phone,
            RoleId = user.RoleId,
            Status = "Pending",
            //CCCD = user.CCCD,
            //TaxIdentificationNumber = user.TaxIdentificationNumber,
            //OrganizationName = user.OrganizationName,
            //Status = user.Status,
            /*IsConfirm = user.IsConfirm,*/
            /*type = user.type,*/
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
        await CreateUserAsync(staff);
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
        await _organizationDonorCertificateRepository.AddAsync(new OrganizationDonorCertificate
        {
            OrganizationDonorCertificateId = Guid.NewGuid().ToString(),
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

    }

    public async Task CreatePersonalDonorCertificate(CreatePersonalDonorCertificateDto certificateDto)
    {
        await _personalDonorCertificateRepository.AddAsync(new PersonalDonorCertificate
        {
            PersonalDonorCertificateId = Guid.NewGuid().ToString(),
            DonorId = _userContextService.UserId,
            CitizenId = certificateDto.CitizenId,
            FullName = certificateDto.FullName,
            BirthDay = certificateDto.BirthDay,
            Email = certificateDto.Email,
            Phone = certificateDto.Phone,
            Address = certificateDto.Address,
            SocialMediaLink = certificateDto.SocialMediaLink,
            MainSourceIncome = certificateDto.MainSourceIncome,
            MonthlyIncome = certificateDto.MonthlyIncome,
            Images = certificateDto.Images,
        });
    }


    public async Task CreateRecipientCertificate(CreateRecipientCertificateDto certificateDto)
    {
        await _recipientCertificateRepository.AddAsync(new RecipientCertificate
        {
            RecipientCertificateId = Guid.NewGuid().ToString(),
            RecipientId = _userContextService.UserId,
            CitizenId = certificateDto.CitizenId,
            FullName = certificateDto.FullName,
            Phone = certificateDto.Phone,
            Address = certificateDto.Address,
            BirthDay = certificateDto.BirthDay,
            Email = certificateDto.Email,
            Circumstances = certificateDto.Circumstances,
            RegisterSupportReason = certificateDto.RegisterSupportReason,
            Images = certificateDto.Images,
        });
    }

    public async Task<List<DonorCertificateDto>> GetAllDonorCertificat()
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


        var listDonorId = rs.Select(c => c.DonorId).Distinct().ToList();
        var donorFilter = Builders<Account>.Filter.In(c => c.AccountId, listDonorId);
        var allCreator = await _userRepository.GetAllAsync(donorFilter);

        foreach (var donor in rs)
        {
            var cretor = allCreator.FirstOrDefault(x => x.AccountId == donor.DonorId);
            if (cretor != null)
            {
                donor.FullName = cretor?.FullName;
                donor.Phone = cretor.Phone;
                donor.Email = cretor.Email;
            }
        }

        return rs;
    }

    public async Task<List<RecipientCertificateDto>> GetAllRecipientCertificat()
    {
        var rec = await _recipientCertificateRepository.GetAllAsync();

        var rs = rec.ToList().Adapt<List<RecipientCertificateDto>>();

        var listRecipientId = rs.Select(c => c.RecipientId).Distinct().ToList();
        var recipientFilter = Builders<Account>.Filter.In(c => c.AccountId, listRecipientId);
        var allCreator = await _userRepository.GetAllAsync(recipientFilter);

        foreach (var rep in rs)
        {
            var cretor = allCreator.FirstOrDefault(x => x.AccountId == rep.RecipientId);
            if (cretor != null)
            {
                rep.FullName = cretor?.FullName;
                rep.Phone = cretor.Phone;
                rep.Email = cretor.Email;
            }
        }

        return rs;
    }

    //public async Task ApproveDonorCertificate(DonorCertificateDto donorCertificateDto)
    //{
    //    // Kiểm tra nếu là Organization Donor Certificate
    //    if (!string.IsNullOrEmpty(donorCertificateDto.OrganizationName))
    //    {
    //        var orgFilter = Builders<OrganizationDonorCertificate>.Filter.Eq(c => c.OrganizationDonorCertificateId, donorCertificateDto.DonorCertificateId);
    //        var organizationDonorCertificate = (await _organizationDonorCertificateRepository.GetAllAsync(orgFilter)).FirstOrDefault();

    //        if (organizationDonorCertificate != null)
    //        {
    //            organizationDonorCertificate.Status = "Approved";
    //            await _organizationDonorCertificateRepository.UpdateAsync(organizationDonorCertificate.Id, organizationDonorCertificate);
    //        }
    //    }

    //    // Kiểm tra nếu là Personal Donor Certificate
    //    if (!string.IsNullOrEmpty(donorCertificateDto.CitizenId))
    //    {
    //        var personalFilter = Builders<PersonalDonorCertificate>.Filter.Eq(c => c.PersonalDonorCertificateId, donorCertificateDto.DonorCertificateId);
    //        var personalDonorCertificate = (await _personalDonorCertificateRepository.GetAllAsync(personalFilter)).FirstOrDefault();

    //        if (personalDonorCertificate != null)
    //        {
    //            personalDonorCertificate.Status = "Approved";
    //            await _personalDonorCertificateRepository.UpdateAsync(personalDonorCertificate.Id, personalDonorCertificate);
    //        }
    //    }
    //}

    //public async Task RejectDonorCertificate(DonorCertificateDto donorCertificateDto)
    //{
    //    // Reject Organization Donor Certificate
    //    if (!string.IsNullOrEmpty(donorCertificateDto.OrganizationName))
    //    {
    //        var orgFilter = Builders<OrganizationDonorCertificate>.Filter.Eq(c => c.OrganizationDonorCertificateId, donorCertificateDto.DonorCertificateId);
    //        var organizationDonorCertificate = (await _organizationDonorCertificateRepository.GetAllAsync(orgFilter)).FirstOrDefault();

    //        if (organizationDonorCertificate != null)
    //        {
    //            organizationDonorCertificate.Status = "Rejected";
    //            organizationDonorCertificate.RejectComment = donorCertificateDto.RejectComment;
    //            await _organizationDonorCertificateRepository.UpdateAsync(organizationDonorCertificate.Id, organizationDonorCertificate);
    //        }
    //    }

    //    // Reject Personal Donor Certificate
    //    if (!string.IsNullOrEmpty(donorCertificateDto.CitizenId))
    //    {
    //        var personalFilter = Builders<PersonalDonorCertificate>.Filter.Eq(c => c.PersonalDonorCertificateId, donorCertificateDto.DonorCertificateId);
    //        var personalDonorCertificate = (await _personalDonorCertificateRepository.GetAllAsync(personalFilter)).FirstOrDefault();

    //        if (personalDonorCertificate != null)
    //        {
    //            personalDonorCertificate.Status = "Rejected";
    //            personalDonorCertificate.RejectComment = donorCertificateDto.RejectComment;
    //            await _personalDonorCertificateRepository.UpdateAsync(personalDonorCertificate.Id, personalDonorCertificate);
    //        }
    //    }
    //}


    //public async Task Approve(ApproveRecipientCertificateDto approveRecipientCertificateDto)
    //{
    //    // Sử dụng IRecipientCertificateRepository thay vì _userRepository
    //    var filter = Builders<RecipientCertificate>.Filter.Eq(c => c.RecipientCertificateId, approveRecipientCertificateDto.RecipientCertificateId);
    //    var recipientCertificate = (await _recipientCertificateRepository.GetAllAsync(filter)).FirstOrDefault();

    //    if (recipientCertificate != null)
    //    {
    //        recipientCertificate.Status = "Approved";
    //        await _recipientCertificateRepository.UpdateAsync(recipientCertificate.Id, recipientCertificate);
    //    }
    //}

    //public async Task Reject(RejectRecipientCertificateDto rejectRecipientCertificateDto)
    //{
    //    // Sử dụng IRecipientCertificateRepository thay vì _userRepository
    //    var filter = Builders<RecipientCertificate>.Filter.Eq(c => c.RecipientCertificateId, rejectRecipientCertificateDto.RecipientCertificateId);
    //    var recipientCertificate = (await _recipientCertificateRepository.GetAllAsync(filter)).FirstOrDefault();

    //    if (recipientCertificate != null)
    //    {
    //        recipientCertificate.Status = "Rejected";
    //        recipientCertificate.RejectComment = rejectRecipientCertificateDto.Comment;
    //        await _recipientCertificateRepository.UpdateAsync(recipientCertificate.Id, recipientCertificate);
    //    }
    //}


    public async Task<IEnumerable<Account>> GetAllUser()
    {
        return await _userRepository.GetAllAsync();
    }



    public async Task ApproveCertificate(ApproveCertificateDto approveCertificateDto)
    {
        string objectId = "";
        string accountId = "";
        switch (approveCertificateDto.Type)
        {
            case ApproveCertificateType.PersonalDonor:
                var pcert = await _personalDonorCertificateRepository.GetPersonalDonorCertificateByIdAsync(approveCertificateDto.CertificateId);
                if (pcert == null) throw new Exception("Certificate Not found");
                pcert.Status = "Approved";
                await _personalDonorCertificateRepository.UpdateAsync(pcert.Id, pcert);
                objectId = pcert.PersonalDonorCertificateId;
                accountId = pcert.DonorId;
                break;
            case ApproveCertificateType.OrganizationDonor:
                var ogcert = await _organizationDonorCertificateRepository.GetOrganizationDonorCertificateByIdAsync(approveCertificateDto.CertificateId);
                if (ogcert == null) throw new Exception("Certificate Not found");
                ogcert.Status = "Approved";
                await _organizationDonorCertificateRepository.UpdateAsync(ogcert.Id, ogcert);
                objectId = ogcert.OrganizationDonorCertificateId;
                accountId = ogcert.DonorId;
                break;
            case ApproveCertificateType.Recipient:
                var rcert = await _recipientCertificateRepository.GetRecipientCertificateByIdAsync(approveCertificateDto.CertificateId);
                if (rcert == null) throw new Exception("Certificate Not found");
                rcert.Status = "Approved";
                await _recipientCertificateRepository.UpdateAsync(rcert.Id, rcert);
                objectId = rcert.RecipientCertificateId;
                accountId = rcert.RecipientId;
                break;
            default:
                throw new Exception("Type not found");
        }

        var notificationDto = new NotificationDto
        {
            Title = "Đã approve",
            Content = "Chứng nhận của bạn đã được phê duyệt thành công",
            CreatedDate = DateTime.Now,
            NotificationType = "Approve",
            ObjectType = "Certificate",
            OjectId = objectId,
            AccountId = accountId
        };
        //save notifiation to db
        await _notificationService.AddNotificationAsync(notificationDto);
        //send notification via signalR
        await _hubNotificationContext.Clients.User(notificationDto.AccountId).SendAsync("ReceiveNotification", notificationDto);

    }

    public async Task RejectCertificate(RejectCertificateDto rejectCertificateDto)
    {
        string objectId = "";
        string accountId = "";
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
                break;
            case ApproveCertificateType.OrganizationDonor:
                var ogcert = await _organizationDonorCertificateRepository.GetOrganizationDonorCertificateByIdAsync(rejectCertificateDto.CertificateId);
                if (ogcert == null) throw new Exception("Certificate Not found");
                ogcert.Status = "Rejected";
                ogcert.RejectComment = rejectCertificateDto.Comment;
                await _organizationDonorCertificateRepository.UpdateAsync(ogcert.Id, ogcert);
                objectId = ogcert.OrganizationDonorCertificateId;
                accountId = ogcert.DonorId;
                break;
            case ApproveCertificateType.Recipient:
                var rcert = await _recipientCertificateRepository.GetRecipientCertificateByIdAsync(rejectCertificateDto.CertificateId);
                if (rcert == null) throw new Exception("Certificate Not found");
                rcert.Status = "Rejected";
                rcert.RejectComment = rejectCertificateDto.Comment;
                await _recipientCertificateRepository.UpdateAsync(rcert.Id, rcert);
                objectId = rcert.RecipientCertificateId;
                accountId = rcert.RecipientId;
                break;
            default:
                throw new Exception("Type not found");
        }

        var notificationDto = new NotificationDto
        {
            Title = "Đã reject",
            Content = "Rất tiếc chiến dịch của bạn không phù hợp.Bạn có thể xem lý do ",
            CreatedDate = DateTime.Now,
            NotificationType = "Approve",
            ObjectType = "Campain",
            OjectId = objectId,
            AccountId = accountId
        };
        //save notifiation to db
        await _notificationService.AddNotificationAsync(notificationDto);
        //send notification via signalR
        await _hubNotificationContext.Clients.User(notificationDto.AccountId).SendAsync("ReceiveNotification", notificationDto);

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
                    CreatedDate = DateTime.Now
                });
                await _personalDonorCertificateRepository.UpdateAsync(pcert.Id, pcert);
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
                break;
            default:
                throw new Exception("Type not found");
        }

        //TODO: Send Email / SMS

        var notificationDto = new NotificationDto
        {
            Title = "Cần bổ sung chứng nhận",
            Content = "Chứng nhận của bạn còn thiếu sót.Bạn có thể xem lý do ",
            CreatedDate = DateTime.Now,
            NotificationType = "Approve",
            ObjectType = "Certificate",
            OjectId = objectId,
            AccountId = accountId,
        };
        //save notifiation to db
        await _notificationService.AddNotificationAsync(notificationDto);
        //send notification via signalR
        await _hubNotificationContext.Clients.User(notificationDto.AccountId).SendAsync("ReceiveNotification", notificationDto);
    }
}