using FDSSYSTEM.DTOs.Statistic;

namespace FDSSYSTEM.Services.StatisticService
{
    public interface IStatisticService
    {
        Task<StatisticAdminDto> GetStatisticAdmin();
    }
}
