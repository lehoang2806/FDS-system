using FDSSYSTEM.DTOs.Statistic;
using FDSSYSTEM.Models;
using FDSSYSTEM.Repositories.CampaignRepository;
using FDSSYSTEM.Repositories.OrganizationDonorCertificateRepository;
using FDSSYSTEM.Repositories.RecipientCertificateRepository;
using FDSSYSTEM.Repositories.RegisterReceiverRepository;
using FDSSYSTEM.Repositories.UserRepository;
using FDSSYSTEM.Services.UserContextService;
using MongoDB.Driver;

namespace FDSSYSTEM.Services.StatisticService
{
    public class StatisticService : IStatisticService
    {
        private readonly ICampaignRepository _campainRepository;
        private readonly IUserRepository _userRepository;
        private readonly IRegisterReceiverRepository _registerReceiverRepository;
        private readonly IPersonalDonorCertificateRepository _personalDonorCertificateRepository;
        private readonly IOrganizationDonorCertificateRepository _organizationDonorCertificateRepository;
        private readonly IRecipientCertificateRepository _recipientCertificateRepository;
        private readonly IUserContextService _userContextService;


        public StatisticService(ICampaignRepository campainRepository
            , IUserRepository userRepository
            , IRegisterReceiverRepository registerReceiverRepository
            , IPersonalDonorCertificateRepository personalDonorCertificateRepository
            , IOrganizationDonorCertificateRepository organizationDonorCertificateRepository
            , IRecipientCertificateRepository recipientCertificateRepository
            , IUserContextService userContextService
            )
        {
            _campainRepository = campainRepository;
            _userRepository = userRepository;
            _registerReceiverRepository = registerReceiverRepository;
            _personalDonorCertificateRepository = personalDonorCertificateRepository;
            _organizationDonorCertificateRepository = organizationDonorCertificateRepository;
            _recipientCertificateRepository = recipientCertificateRepository;
            _userContextService = userContextService;
        }

        public async Task<StatisticAdminDto> GetStatisticAdmin()
        {
            DateTime now = DateTime.Now;

            int diff = now.DayOfWeek - DayOfWeek.Sunday;
            if (diff == 0)
            {
                diff = -6; //nếu hôm nay là chủ nhật thì thứ 2 đầu tuần sẽ -6
            }
            else
            {
                diff = diff - 1;
            }
            DateTime fromDateOfWeek = now.Date.AddDays(-1 * diff);   // Thứ 2 đầu tuần
            DateTime toDateOfWeek = fromDateOfWeek.AddDays(6); //chu nhat

            DateTime fromDateOfMonth = new DateTime(now.Year, now.Month, 1); // ngày đầu tháng
            DateTime toDateOfMonth = fromDateOfMonth.AddMonths(1).AddDays(-1); // ngày cuối tháng

            DateTime fromDateOfYear = new DateTime(now.Year, 1, 1);          // 01/01 năm nay
            DateTime toDateOfYear = fromDateOfYear.AddYears(1).AddDays(-1);


            var rs = new StatisticAdminDto();
            rs.Day = await GetStatisticAdmin(now, now);
            rs.Week = await GetStatisticAdmin(fromDateOfWeek, toDateOfWeek);
            rs.Month = await GetStatisticAdmin(fromDateOfMonth, toDateOfMonth);
            rs.Year = await GetStatisticAdmin(fromDateOfYear, toDateOfYear);


            return rs;
        }

        public async Task<StatisticDonorDto> GetStatisticDonor()
        {
            DateTime now = DateTime.Now;

            int diff = now.DayOfWeek - DayOfWeek.Sunday;
            if (diff == 0)
            {
                diff = -6; //nếu hôm nay là chủ nhật thì thứ 2 đầu tuần sẽ -6
            }
            else
            {
                diff = diff - 1;
            }
            DateTime fromDateOfWeek = now.Date.AddDays(-1 * diff);   // Thứ 2 đầu tuần
            DateTime toDateOfWeek = fromDateOfWeek.AddDays(6); //chu nhat

            DateTime fromDateOfMonth = new DateTime(now.Year, now.Month, 1); // ngày đầu tháng
            DateTime toDateOfMonth = fromDateOfMonth.AddMonths(1).AddDays(-1); // ngày cuối tháng

            DateTime fromDateOfYear = new DateTime(now.Year, 1, 1);          // 01/01 năm nay
            DateTime toDateOfYear = fromDateOfYear.AddYears(1).AddDays(-1);


            var rs = new StatisticDonorDto();
            rs.Day = await GetStatisticDonor(now, now);
            rs.Week = await GetStatisticDonor(fromDateOfWeek, toDateOfWeek);
            rs.Month = await GetStatisticDonor(fromDateOfMonth, toDateOfMonth);
            rs.Year = await GetStatisticDonor(fromDateOfYear, toDateOfYear);

            return rs;
        }

        private async Task<StatisticAdminItemDto> GetStatisticAdmin(DateTime fromDate, DateTime toDate)
        {
            var fromDateUTC = fromDate.ToUniversalTime().Date;
            var toDateUTC = toDate.AddDays(1).ToUniversalTime().Date;

            var rs = new StatisticAdminItemDto();
            var filterCampaign = Builders<Campaign>.Filter.And(
                Builders<Campaign>.Filter.Gte(p => p.CreatedDate, fromDateUTC),
                Builders<Campaign>.Filter.Lt(p => p.CreatedDate, toDateUTC),
                Builders<Campaign>.Filter.Eq(p => p.Status, "Approved")
            );
            var campaigns = await _campainRepository.GetAllAsync(filterCampaign);
            var users = await _userRepository.GetAllAsync();

            //campaign
            var campaignDetails = from campaign in campaigns
                                  join user in users on campaign.AccountId equals user.AccountId
                                  select new
                                  {
                                      Campaign = campaign,
                                      User = user
                                  };


            rs.NumberOfCampaignStaffCreated = campaignDetails.Where(x => x.User.RoleId == 2).Count();       
            rs.NumberOfCampaignPersonalDonorCreated = campaignDetails.Where(x => x.User.RoleId == 3 && x.User.DonorType == "Personal Donor").Count();
            rs.NumberOfCampaignOrganizaionDonorCreated = campaignDetails.Where(x => x.User.RoleId == 3 && x.User.DonorType == "Organization Donor").Count();

            

            //register receiver
            var filterRegisterReceiver = Builders<RegisterReceiver>.Filter.And(
                Builders<RegisterReceiver>.Filter.Gte(p => p.CreatedDate, fromDateUTC),
                Builders<RegisterReceiver>.Filter.Lt(p => p.CreatedDate, toDateUTC)
            );
            var registerReceivers = await _registerReceiverRepository.GetAllAsync(filterRegisterReceiver);
            rs.NumberOfRegisterReceiver = registerReceivers.Select(r => r.AccountId).Distinct().Count();

            //certificate
            var filterPersonalCert = Builders<PersonalDonorCertificate>.Filter.And(
                Builders<PersonalDonorCertificate>.Filter.Gte(p => p.CreatedDate, fromDateUTC),
                Builders<PersonalDonorCertificate>.Filter.Lt(p => p.CreatedDate, toDateUTC),
                 Builders<PersonalDonorCertificate>.Filter.Eq(p => p.Status, "Approved")
            );
            var personalCert = await _personalDonorCertificateRepository.GetAllAsync(filterPersonalCert);
            rs.NumberOfPersonalDonorCertificate = personalCert.Count();

            var filterOrganizationCert = Builders<OrganizationDonorCertificate>.Filter.And(
                Builders<OrganizationDonorCertificate>.Filter.Gte(p => p.CreatedDate, fromDateUTC),
                Builders<OrganizationDonorCertificate>.Filter.Lt(p => p.CreatedDate, toDateUTC),
                 Builders<OrganizationDonorCertificate>.Filter.Eq(p => p.Status, "Approved")
            );
            var organizationCert = await _organizationDonorCertificateRepository.GetAllAsync(filterOrganizationCert);
            rs.NumberOfOrganizaionDonorCertificate = organizationCert.Count();

            var filterRecipientCert = Builders<RecipientCertificate>.Filter.And(
               Builders<RecipientCertificate>.Filter.Gte(p => p.CreatedDate, fromDateUTC),
               Builders<RecipientCertificate>.Filter.Lt(p => p.CreatedDate, toDateUTC),
                Builders<RecipientCertificate>.Filter.Eq(p => p.Status, "Approved")
           );
            var recipientCert = await _recipientCertificateRepository.GetAllAsync(filterRecipientCert);
            rs.NumberOfRecipientCertificate = recipientCert.Count();

            rs.NumberOfGiftOfPersonalDonor = campaignDetails.Where(x => x.User.RoleId == 3 && x.User.DonorType == "Personal Donor").Sum(x => x.Campaign.LimitedQuantity);
            rs.NumberOfGiftOrganizaionDonor = campaignDetails.Where(x => x.User.RoleId == 3 && x.User.DonorType == "Organization Donor").Sum(x => x.Campaign.LimitedQuantity);
            rs.NumberOfGiftStaff = campaignDetails.Where(x => x.User.RoleId == 2).Sum(x => x.Campaign.LimitedQuantity);// 2 là staff

            rs.NumberOfAllPersonalDonorMember = users.Where(x => x.CreateDate >= fromDateUTC && x.CreateDate < toDateUTC && x.RoleId == 3 && x.DonorType == "Personal Donor").Count();
            rs.NumberOfAllOrganizaionDonorMember = users.Where(x => x.CreateDate >= fromDateUTC && x.CreateDate < toDateUTC && x.RoleId == 3 && x.DonorType == "Organization Donor").Count();
            rs.NumberOfAllRecipientMember = users.Where(x => x.CreateDate >= fromDateUTC && x.CreateDate < toDateUTC && x.RoleId == 4).Count();
            rs.NumberOfAllStaffMember = users.Where(x => x.CreateDate >= fromDateUTC && x.CreateDate < toDateUTC && x.RoleId == 2).Count();
            rs.NumberOfGiftRegisterReceiver = registerReceivers.Sum(x => x.Quantity);

            return rs;
        }


        private async Task<StatisticDonorItemDto> GetStatisticDonor(DateTime fromDate, DateTime toDate)
        {
            var fromDateUTC = fromDate.ToUniversalTime().Date;
            var toDateUTC = toDate.AddDays(1).ToUniversalTime().Date;

            var rs = new StatisticDonorItemDto();
            var filterCampaign = Builders<Campaign>.Filter.And(
                Builders<Campaign>.Filter.Gte(p => p.CreatedDate, fromDateUTC),
                Builders<Campaign>.Filter.Lt(p => p.CreatedDate, toDateUTC),
                Builders<Campaign>.Filter.Eq(p => p.Status, "Approved"),
                Builders<Campaign>.Filter.Eq(p => p.AccountId, _userContextService.UserId)
            );
            var campaigns = await _campainRepository.GetAllAsync(filterCampaign);

            //register receiver
            var filterRegisterReceiver = Builders<RegisterReceiver>.Filter.And(
                Builders<RegisterReceiver>.Filter.Gte(p => p.CreatedDate, fromDateUTC),
                Builders<RegisterReceiver>.Filter.Lt(p => p.CreatedDate, toDateUTC),
                Builders<RegisterReceiver>.Filter.In(p => p.CampaignId, campaigns.Select(x=>x.CampaignId).ToList())
            );
            var registerReceivers = await _registerReceiverRepository.GetAllAsync(filterRegisterReceiver);

            rs.NumberOfCampaignsCreated = campaigns.Count();
            rs.NumberOfGift = campaigns.Sum(x=>x.LimitedQuantity);
            rs.NumberOfRecipientsParticipating = registerReceivers.Count();

            return rs;
        }
    }
}
