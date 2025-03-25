using FDSSYSTEM.DTOs;
using FDSSYSTEM.Models;
using FDSSYSTEM.Services.NotificationService;
using Mapster;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace FDSSYSTEM.SignalR;

[Authorize]
public class NotificationHub : Hub
{ 
    private readonly INotificationService _notificationService;
    public NotificationHub(INotificationService notificationService)
    {
        _notificationService = notificationService;
    }

    public async Task SendNotification(NotificationDto notification)
    {
        await Clients.All.SendAsync("ReceiveNotification", notification);
    }

    public async Task SendToUser(string userId, NotificationDto notification)
    {
        await Clients.User(userId).SendAsync("ReceiveNotification", notification);
    }

    public async override Task OnConnectedAsync()
    {
        //lấy thông báo chưa đọc
        var userId = Context.GetHttpContext()?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var unReadNotifications = await _notificationService.GetNotificationUnReadByUserIdAsyc(userId);
        await Clients.Caller.SendAsync("LoadOldNotifications", unReadNotifications.OrderByDescending(x=>x.CreatedDate).Adapt<List<NotificationDto>>());

        await base.OnConnectedAsync();
    }
}
