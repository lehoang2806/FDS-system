using FDSSYSTEM.DTOs;
using FDSSYSTEM.Models;
using FDSSYSTEM.Repositories.NotificationRepository;
using MongoDB.Driver;

namespace FDSSYSTEM.Services.NotificationService;

public class NotificationService : INotificationService
{
    private readonly INotificationRepository _notificationRepository;

    public NotificationService(INotificationRepository notificationRepository)
    {
        _notificationRepository = notificationRepository;
    }
    public async Task AddNotificationAsync(NotificationDto notificationDto)
    {
        await _notificationRepository.AddAsync(new Notification
        {
            AccountId = notificationDto.AccountId,
            Title = notificationDto.Title,
            Content = notificationDto.Content,
            NotificationType = notificationDto.NotificationType,
            ObjectType = notificationDto.ObjectType,
            OjectId = notificationDto.OjectId
        });
    }

    public async Task<List<Notification>> GetNotificationUnReadByUserIdAsyc(string userId)
    {
        var filter = Builders<Notification>.Filter.And(
            Builders<Notification>.Filter.Eq(c => c.AccountId, userId),
            Builders<Notification>.Filter.Eq(c => c.IsRead, false)
        );
        var getbyId = await _notificationRepository.GetAllAsync(filter);
        return getbyId.ToList();
    }
}
