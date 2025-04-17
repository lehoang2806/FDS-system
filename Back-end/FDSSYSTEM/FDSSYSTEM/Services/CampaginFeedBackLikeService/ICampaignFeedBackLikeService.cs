using FDSSYSTEM.DTOs;
using FDSSYSTEM.DTOs.CampaignFeedBackLike;
using System.Threading.Tasks;

namespace FDSSYSTEM.Services.FeedBackLikeService
{
    public interface ICampaignFeedBackLikeService
    {
        Task LikeFeedBack(CampaignFeedBackLikeDto campaignFeedBackLike);
        Task UnlikeFeedBack(string feedBackId);
        Task<int> GetLikeCount(string feedBackId);
    }
}
