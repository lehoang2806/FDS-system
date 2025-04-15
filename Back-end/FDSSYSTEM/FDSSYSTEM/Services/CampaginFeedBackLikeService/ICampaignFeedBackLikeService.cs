using FDSSYSTEM.DTOs;
using System.Threading.Tasks;

namespace FDSSYSTEM.Services.FeedBackLikeService
{
    public interface ICampaignFeedBackLikeService
    {
        Task LikeFeedBack(string feedBackId);
        Task UnlikeFeedBack(string feedBackId);
        Task<int> GetLikeCount(string feedBackId);
    }
}
