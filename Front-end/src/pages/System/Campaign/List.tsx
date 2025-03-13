import { SearchIcon } from '@/assets/icons';
import { CampaignCard } from '@/components/Card/index';
import { FC, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ListCampaignPage: FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    const getActiveTabFromURL = () => {
        const params = new URLSearchParams(location.search);
        return Number(params.get('tab')) || 0;
    };

    const [activeTab, setActiveTab] = useState<number>(getActiveTabFromURL());

    const handleTabChange = (tabIndex: number) => {
        setActiveTab(tabIndex);
        navigate(`?tab=${tabIndex}`);
    };

    useEffect(() => {
        setActiveTab(getActiveTabFromURL());
    }, [location.search]);

    return (
        <main id="campaigns">
            <section id="campains-section">
                <div className="cs-container">
                    <div className="cscr1">
                        <h1>Danh sách chiến dịch gây quỹ</h1>
                        <div className="cs-tabs">
                            <h2 className={`cs-tab ${activeTab === 0 ? 'cs-tab-active' : ''}`} onClick={() => handleTabChange(0)}>Tất cả</h2>
                            <h2 className={`cs-tab ${activeTab === 1 ? 'cs-tab-active' : ''}`} onClick={() => handleTabChange(1)}>Cá nhân</h2>
                            <h2 className={`cs-tab ${activeTab === 2 ? 'cs-tab-active' : ''}`} onClick={() => handleTabChange(2)}>Tổ chức</h2>
                        </div>
                    </div>
                    <div className="cscr2">
                        <div className="cscr2r1">
                            <select className='pr-input'>
                                <option value="">Tất cả</option>
                                <option value="">Đang thực hiện</option>
                                <option value="">Đã kết thúc</option>
                            </select>
                            <div className='campaign-search-container'>
                                <input type="text" className="pr-input campaign-search-input" placeholder='Tìm kiếm tên chiến dịch' />
                                <SearchIcon className='campaign-search-icon' />
                            </div>
                        </div>
                        <div className="cscr2r2">
                            {activeTab === 0 && (
                                <>
                                    <CampaignCard />
                                    <CampaignCard />
                                    <CampaignCard />
                                    <CampaignCard />
                                    <CampaignCard />
                                    <CampaignCard />
                                </>
                            )}
                            {activeTab === 1 && (
                                <>
                                    <CampaignCard />
                                    <CampaignCard />
                                    <CampaignCard />
                                </>
                            )}
                            {activeTab === 2 && (
                                <>
                                    <CampaignCard />
                                    <CampaignCard />
                                    <CampaignCard />
                                    <CampaignCard />
                                </>
                            )}
                        </div>
                        <button className="view-more">Xem thêm</button>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default ListCampaignPage;
