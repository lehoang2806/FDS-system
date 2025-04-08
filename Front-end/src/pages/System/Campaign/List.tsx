import { selectGetAllCampaign } from '@/app/selector';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { SearchIcon } from '@/assets/icons';
import { CampaignCard } from '@/components/Card/index';
import { Loading } from '@/components/Elements';
import { navigateHook } from '@/routes/RouteApp';
import { routes } from '@/routes/routeName';
import { setLoading } from '@/services/app/appSlice';
import { getAllCampaignApiThunk } from '@/services/campaign/campaignThunk';
import { FC, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ListCampaignPage: FC = () => {
    const dispatch = useAppDispatch();

    const handleToDetail = (campaignId: string) => {
        const url = routes.user.campaign.detail.replace(":id", campaignId);
        return navigateHook(url)
    }

    const campaigns = useAppSelector(selectGetAllCampaign)
    const sortedCampaigns = [...campaigns].reverse();

    const approvedCampaigns = sortedCampaigns.filter((campaign) => campaign.status === "Approved");

    const personalCampaigns = approvedCampaigns.filter((campaign) => campaign.typeAccount === "Personal Donor");

    const organizationCampaigns = approvedCampaigns.filter((campaign) => campaign.typeAccount === "Organization Donor");

    useEffect(() => {
        dispatch(setLoading(true));
        dispatch(getAllCampaignApiThunk())
            .unwrap()
            .catch(() => {
            }).finally(() => {
                setTimeout(() => {
                    dispatch(setLoading(false));
                }, 1000)
            });
    }, [dispatch])

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

    //All campaigns
    const [visibleAllCampaignsCount, setVisibleAllCampaignsCount] = useState(6);

    const handleShowMoreAllcampaigns = () => {
        setVisibleAllCampaignsCount((prev) => prev + 6);
    };

    //Personal campaigns
    const [visiblePersonalCampaignsCount, setVisiblePersonalCampaignsCount] = useState(6);

    const handleShowMorePersonalCampaigns = () => {
        setVisiblePersonalCampaignsCount((prev) => prev + 6);
    };

    //Organization campaigns
    const [visibleOrganizationCampaignsCount, setVisibleOrganizationCampaignsCount] = useState(6);

    const handleShowMoreOrganizationCampaigns = () => {
        setVisibleOrganizationCampaignsCount((prev) => prev + 6);
    };

    //Load
    const [isFiltering, setIsFiltering] = useState(false);

    const handleFilter = () => {
        setIsFiltering(true);
        setTimeout(() => {
            setIsFiltering(false);
        }, 1000);
    };

    //Search
    const [searchTerm, setSearchTerm] = useState<string>('');

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    //Filter By Date All Campaigns
    const [implementDateAllCampaignFilter, setImplementDateAllCampaignFilter] = useState<string>('');

    const handleImplementDateAllCampaignChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setImplementDateAllCampaignFilter(e.target.value);
    };

    const filterAllCampaignsByDate = (campaigns: CampaignInfo[]) => {
        if (!implementDateAllCampaignFilter) return campaigns;

        const filterDate = new Date(implementDateAllCampaignFilter);

        return campaigns.filter((campaign) => {
            const allCampaignImplementDate = new Date(campaign.implementationTime.split('T')[0]);
            return allCampaignImplementDate.toDateString() === filterDate.toDateString();
        });
    };



    //Filter By Date Personal Campaigns
    const [implementDatePersonalCampaignFilter, setImplementDatePersonalCampaignFilter] = useState<string>('');

    const handleImplementDatePersonalCampaignChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setImplementDatePersonalCampaignFilter(e.target.value);
    };

    const filterPersonalCampaignsByDate = (campaigns: CampaignInfo[]) => {
        if (!implementDatePersonalCampaignFilter) return campaigns;

        const filterDate = new Date(implementDatePersonalCampaignFilter);

        return campaigns.filter((campaign) => {
            const personalCampaignImplementDate = new Date(campaign.implementationTime.split('T')[0]);
            return personalCampaignImplementDate.toDateString() === filterDate.toDateString();
        });
    };

    //Filter By Date Organization Campaigns
    const [implementDateOrganizationCampaignFilter, setImplementDateOrganizationCampaignFilter] = useState<string>('');

    const handleImplementDateOrganizationCampaignChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setImplementDateOrganizationCampaignFilter(e.target.value);
    };

    const filterOrganizationCampaignsByDate = (campaigns: CampaignInfo[]) => {
        if (!implementDateOrganizationCampaignFilter) return campaigns;

        const filterDate = new Date(implementDateOrganizationCampaignFilter);

        return campaigns.filter((campaign) => {
            const organizationCampaignImplementDate = new Date(campaign.implementationTime.split('T')[0]);
            return organizationCampaignImplementDate.toDateString() === filterDate.toDateString();
        });
    };

    //Filter Status
    const [statusFilter, setStatusFilter] = useState<string>(''); // '', 'ongoing', 'ended'

    const filterByStatus = (campaigns: CampaignInfo[]) => {
        if (!statusFilter) return campaigns;

        const now = new Date();

        return campaigns.filter((campaign) => {
            const implementation = new Date(campaign.implementationTime);

            if (statusFilter === 'ongoing') {
                return implementation === now
            }

            if (statusFilter === 'ended') {
                return implementation < now;
            }

            return true;
        });
    };

    //Filter All Campaigns
    const filteredAllCampaigns = filterByStatus(
        filterAllCampaignsByDate(approvedCampaigns)
    ).filter((campaign) =>
        campaign.campaignName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const visibleFilteredAllCampaigns = filteredAllCampaigns.slice(0, visibleAllCampaignsCount);

    //Filter Personal Campaigns
    const filteredPersonalCampaigns = filterByStatus(
        filterPersonalCampaignsByDate(personalCampaigns)
    ).filter((campaign) =>
        campaign.campaignName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const visibleFilteredPersonalCampaigns = filteredPersonalCampaigns.slice(0, visiblePersonalCampaignsCount);

    //Filter Organization Campaigns
    const filteredOrganizationCampaigns = filterByStatus(
        filterOrganizationCampaignsByDate(organizationCampaigns)
    ).filter((campaign) =>
        campaign.campaignName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const visibleFilteredOrganizationCampaigns = filteredOrganizationCampaigns.slice(0, visibleOrganizationCampaignsCount);

    return (
        <main id="campaigns">
            <section id="campains-section">
                <div className="cs-container">
                    <div className="cscr1">
                        <h1>Danh sách chiến dịch gây quỹ</h1>
                        <div className="cs-tabs">
                            <h2 className={`cs-tab ${activeTab === 0 ? 'cs-tab-active' : ''}`} onClick={() => { handleTabChange(0); handleFilter() }}>Tất cả</h2>
                            <h2 className={`cs-tab ${activeTab === 1 ? 'cs-tab-active' : ''}`} onClick={() => { handleTabChange(1); handleFilter() }}>Cá nhân</h2>
                            <h2 className={`cs-tab ${activeTab === 2 ? 'cs-tab-active' : ''}`} onClick={() => { handleTabChange(2); handleFilter() }}>Tổ chức</h2>
                        </div>
                    </div>
                    {isFiltering && <Loading loading={true} isFullPage />}
                    <div className="cscr2">
                        <div className="cscr2r1">
                            <select className='pr-input' value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                                <option value="">Tất cả</option>
                                <option value="ongoing">Đang thực hiện</option>
                                <option value="ended">Đã kết thúc</option>
                            </select>
                            {activeTab === 0 && (
                                <div className="date-filter-container">
                                    <input
                                        type="date"
                                        className="pr-input"
                                        placeholder="Chọn ngày thực hiện"
                                        value={implementDateAllCampaignFilter}
                                        onChange={handleImplementDateAllCampaignChange}
                                    />
                                </div>
                            )}
                            {activeTab === 1 && (
                                <div className="date-filter-container">
                                    <input
                                        type="date"
                                        className="pr-input"
                                        placeholder="Chọn ngày thực hiện"
                                        value={implementDatePersonalCampaignFilter}
                                        onChange={handleImplementDatePersonalCampaignChange}
                                    />
                                </div>
                            )}
                            {activeTab === 2 && (
                                <div className="date-filter-container">
                                    <input
                                        type="date"
                                        className="pr-input"
                                        placeholder="Chọn ngày thực hiện"
                                        value={implementDateOrganizationCampaignFilter}
                                        onChange={handleImplementDateOrganizationCampaignChange}
                                    />
                                </div>
                            )}
                            <div className='campaign-search-container'>
                                <input
                                    type="text"
                                    className="pr-input campaign-search-input"
                                    placeholder='Tìm kiếm tên chiến dịch'
                                    value={searchTerm}
                                    onChange={handleSearch}
                                />
                                <SearchIcon className='campaign-search-icon' />
                            </div>
                        </div>
                        <div className="cscr2r2">
                            {activeTab === 0 && (
                                filteredAllCampaigns.length > 0 ? (
                                    <>
                                        <div className="cscr2r2-list">
                                            {visibleFilteredAllCampaigns.map((campaign) => (
                                                <CampaignCard
                                                    campaign={campaign}
                                                    key={campaign.campaignId}
                                                    onClickDetail={() => handleToDetail(campaign.campaignId)}
                                                />
                                            ))}
                                        </div>

                                        {filteredAllCampaigns.length > visibleAllCampaignsCount && (
                                            <button className="view-more" onClick={handleShowMoreAllcampaigns}>Xem thêm</button>
                                        )}
                                    </>
                                ) : (
                                    <h1>Chưa có dữ liệu</h1>
                                )
                            )}

                            {activeTab === 1 && (
                                filteredPersonalCampaigns.length > 0 ? (
                                    <>
                                        <div className="cscr2r2-list">
                                            {visibleFilteredPersonalCampaigns.map((campaign) => (
                                                <CampaignCard
                                                    campaign={campaign}
                                                    key={campaign.campaignId}
                                                    onClickDetail={() => handleToDetail(campaign.campaignId)}
                                                />
                                            ))}
                                        </div>

                                        {filteredPersonalCampaigns.length > visiblePersonalCampaignsCount && (
                                            <button className="view-more" onClick={handleShowMorePersonalCampaigns}>Xem thêm</button>
                                        )}
                                    </>
                                ) : (
                                    <h1>Chưa có dữ liệu</h1>
                                )
                            )}

                            {activeTab === 2 && (
                                filteredOrganizationCampaigns.length > 0 ? (
                                    <>
                                        <div className="cscr2r2-list">
                                            {visibleFilteredOrganizationCampaigns.map((campaign) => (
                                                <CampaignCard
                                                    campaign={campaign}
                                                    key={campaign.campaignId}
                                                    onClickDetail={() => handleToDetail(campaign.campaignId)}
                                                />
                                            ))}
                                        </div>

                                        {filteredOrganizationCampaigns.length > visibleOrganizationCampaignsCount && (
                                            <button className="view-more" onClick={handleShowMoreOrganizationCampaigns}>Xem thêm</button>
                                        )}
                                    </>
                                ) : (
                                    <h1>Chưa có dữ liệu</h1>
                                )
                            )}

                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default ListCampaignPage;
