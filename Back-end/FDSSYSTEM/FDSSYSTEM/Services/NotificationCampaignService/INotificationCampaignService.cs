using FDSSYSTEM.DTOs;
using FDSSYSTEM.Models;
namespace FDSSYSTEM.Services.NotificationCampaignService
{
    public interface INotificationCampaignService
    {
        Task CreateDonorCampaignNotification(NotificationCampaignDto notificationCampaignDto);
        Task CreateRecipientCampaignNotification(NotificationCampaignDto notificationCampaignDto);
        Task CreateStaffCampaignNotification (NotificationCampaignDto notificationCampaignDto);
        Task<List<NotificationCampaignWithCreatorDto>> GetAll();
    }
}
