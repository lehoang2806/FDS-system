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
            NotificationId = Guid.NewGuid().ToString(),
            AccountId = notificationDto.AccountId,
            Title = notificationDto.Title,
            Content = notificationDto.Content,
            NotificationType = notificationDto.NotificationType,
            ObjectType = notificationDto.ObjectType,
            OjectId = notificationDto.OjectId,
            CreatedDate = DateTime.Now,
        });
    }

    public async Task Delete(string notificationId)
    {
        var filter = Builders<Notification>.Filter.Eq(c => c.NotificationId, notificationId);
        var notification = (await _notificationRepository.GetAllAsync(filter)).FirstOrDefault();

        notification.IsDelete = true;
        await _notificationRepository.UpdateAsync(notification.Id, notification);
    }

    public async Task<List<Notification>> GetNotificationUnReadByUserIdAsyc(string userId)
    {
        var filter = Builders<Notification>.Filter.And(
            Builders<Notification>.Filter.Eq(c => c.AccountId, userId),
            Builders<Notification>.Filter.Eq(c => c.IsRead, false),
            Builders<Notification>.Filter.Eq(c => c.IsDelete, false)
        );
        var getbyId = await _notificationRepository.GetAllAsync(filter);
        return getbyId.ToList();
    }

    public async Task IsRead(string notificationId)
    {
        var filter = Builders<Notification>.Filter.Eq(c => c.NotificationId, notificationId);
        var notification = (await _notificationRepository.GetAllAsync(filter)).FirstOrDefault();

        notification.IsRead = true;
        await _notificationRepository.UpdateAsync(notification.Id, notification);
    }
}
