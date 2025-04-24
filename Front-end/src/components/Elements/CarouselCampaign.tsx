import { FC, useState } from 'react';
import { CampaignCard } from '../Card';
import { CampaignCarouselProps } from './type';

const ITEMS_PER_PAGE = 3;

const CampaignCarousel: FC<CampaignCarouselProps> = ({ campaigns, handleToDetailCampaign }) => {
    const [currentPage, setCurrentPage] = useState(0);

    const totalPages = Math.ceil(campaigns.length / ITEMS_PER_PAGE);

    const handlePageClick = (pageIndex: number) => {
        setCurrentPage(pageIndex);
    };

    const currentCampaigns = campaigns.slice(
        currentPage * ITEMS_PER_PAGE,
        (currentPage + 1) * ITEMS_PER_PAGE
    );

    return (
        <div>
            {campaigns.length > 0 ? (
                <>
                    <div className="carousel-wrapper">
                        {currentCampaigns.map((campaign) => (
                            <CampaignCard
                                campaign={campaign}
                                key={campaign.campaignId}
                                onClickDetail={() => handleToDetailCampaign(campaign.campaignId)}
                            />
                        ))}
                    </div>

                    <div className="pagination-lists">
                        {Array.from({ length: Math.min(totalPages, 5) }).map((_, index) => {
                            let pageIndex = index;

                            if (totalPages > 5) {
                                const start = Math.max(0, Math.min(totalPages - 5, currentPage - 2));
                                pageIndex = start + index;
                            }

                            return (
                                <div
                                    key={pageIndex}
                                    className={`pagination-item ${pageIndex === currentPage ? 'pagination-item-active' : ''}`}
                                    onClick={() => handlePageClick(pageIndex)}
                                />
                            );
                        })}
                    </div>
                </>
            ) : (
                <h1>Chưa có dữ liệu</h1>
            )}
        </div>
    );
};

export default CampaignCarousel;
