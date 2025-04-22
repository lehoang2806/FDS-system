using FDSSYSTEM.DTOs.Statistic;
using FDSSYSTEM.Models;
using FDSSYSTEM.Repositories.CampaignRepository;
using FDSSYSTEM.Repositories.UserRepository;
using MongoDB.Driver;
using Twilio.Rest.Api.V2010.Account;

namespace FDSSYSTEM.Services.StatisticService
{
    public class StatisticService : IStatisticService
    {
        private readonly ICampaignRepository _campainRepository;
        private readonly IUserRepository _userRepository;
        public StatisticService(ICampaignRepository campainRepository, IUserRepository userRepository)
        {
            _campainRepository = campainRepository;
            _userRepository = userRepository;


        }

        public async Task<StatisticAdminDto> GetStatisticAdmin()
        {
            DateTime now = DateTime.Now;

            int diff = (7 + (now.DayOfWeek - DayOfWeek.Monday)) % 7;
            DateTime fromDateOfWeek = now.Date.AddDays(-1 * diff);   // Thứ 2 đầu tuần
            DateTime toDateOfWeek = fromDateOfWeek.AddDays(6); //chu nhat

            DateTime fromDateOfMonth = new DateTime(now.Year, now.Month, 1); // ngày đầu tháng
            DateTime toDateOfMonth = fromDateOfMonth.AddMonths(1).AddDays(-1); // ngày cuối tháng

            DateTime fromDateOfYear = new DateTime(now.Year, 1, 1);          // 01/01 năm nay
            DateTime toDateOfYear = fromDateOfYear.AddYears(1).AddDays(-1);


            var rs = new StatisticAdminDto();
            rs.Day = await GetStatisticAdmin(now,now);
            rs.Week = await GetStatisticAdmin(fromDateOfWeek, toDateOfWeek);
            rs.Month = await GetStatisticAdmin(fromDateOfMonth, toDateOfMonth);
            rs.Year = await GetStatisticAdmin(fromDateOfYear, toDateOfYear);


            return rs;
        }

        private async Task<StatisticAdminItemDto> GetStatisticAdmin(DateTime fromDate, DateTime toDate)
        {
            var rs = new StatisticAdminItemDto();
            var filterCampaign = Builders<Campaign>.Filter.And(
                Builders<Campaign>.Filter.Gte(p => p.CreatedDate, fromDate.Date.ToUniversalTime()),
                Builders<Campaign>.Filter.Lt(p => p.CreatedDate, toDate.Date.AddDays(1).ToUniversalTime())
            );
            var campaigns = await _campainRepository.GetAllAsync(filterCampaign);
            var users = await _userRepository.GetAllAsync();

            var campaignDetails = from campaign in campaigns
                                  join user in users on campaign.AccountId equals user.Id
                                  select new
                                  {
                                      Campaign = campaign,
                                      User = user
                                  };


            rs.NumberOfCampaignStaffCreated = campaignDetails.Where(x => x.User.RoleId == 2).Count();
            rs.NumberOfCampaignPersonalDonorCreated = campaignDetails.Where(x => x.User.RoleId == 3 && x.User.DonorType == "PersonalDonor").Count();
            rs.NumberOfCampaignOrganizaionDonorCreated = campaignDetails.Where(x => x.User.RoleId == 3 && x.User.DonorType == "OrganizationDonor").Count();

            return rs;
        }
    }
}
