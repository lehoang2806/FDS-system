using FDSSYSTEM.DTOs;
using FDSSYSTEM.Models;

namespace FDSSYSTEM.Services.NotificationService;

public interface INotificationService
{
    Task<List<Notification>> GetNotificationUnReadByUserIdAsyc(string userId);
    Task AddNotificationAsync(NotificationDto notificationDto);
}
