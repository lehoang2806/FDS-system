import { selectGetAllCampaign, selectGetAllUser } from '@/app/selector';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { CampaignIcon, OrganizationIcon, PersonalIcon } from '@/assets/icons';
import { setLoading } from '@/services/app/appSlice';
import { getAllCampaignApiThunk } from '@/services/campaign/campaignThunk';
import { getAllUserApiThunk } from '@/services/user/userThunk';
import { FC, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';

dayjs.locale('vi');
dayjs.extend(relativeTime);
const StaffDashboardPage: FC = () => {
    const campaigns = useAppSelector(selectGetAllCampaign);
    const dispatch = useAppDispatch();

    const [selectedYear, setSelectedYear] = useState(2025);  // State for selected year

    const users = useAppSelector(selectGetAllUser);
    const donors = users.filter(user => user.roleId === 3);
    const personalDonor = donors.filter(donor => donor.type === "1");
    const organizationDonor = donors.filter(donor => donor.type === "2");
    const recipients = users.filter(user => user.roleId === 4);

    // Sort campaigns and filter by "Approved" status
    const sortedCampaigns = [...campaigns].reverse();
    const approvedCampaigns = sortedCampaigns.filter(campaign => campaign.status === "Approved");
    const fiveCampaigns = approvedCampaigns.slice(0, 5);

    // Function to get campaigns by month for a specific year
    const getCampaignsByMonth = (year: number) => {
        const campaignsByMonth: { [key: string]: number } = {};

        // Initialize 12 months
        for (let month = 1; month <= 12; month++) {
            const monthStr = month.toString().padStart(2, '0');
            campaignsByMonth[monthStr] = 0;
        }

        // Count campaigns for the selected year
        approvedCampaigns
            .filter(campaign => {
                const date = new Date(campaign.implementationTime);
                return date.getFullYear() === year;
            })
            .forEach(campaign => {
                const date = new Date(campaign.implementationTime);
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                campaignsByMonth[month] += 1;
            });

        // Convert to array sorted by month
        return Object.keys(campaignsByMonth)
            .sort()
            .map(month => ({
                month,
                count: campaignsByMonth[month],
            }));
    };

    // Get campaigns for selected year
    const campaignsByMonthArray = getCampaignsByMonth(selectedYear);

    // Get the current month (0-based, so we add 1)
    const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');

    useEffect(() => {
        dispatch(setLoading(true));
        Promise.all([
            dispatch(getAllCampaignApiThunk()).unwrap(),
            dispatch(getAllUserApiThunk()).unwrap()
        ])
            .catch(() => { })
            .finally(() => {
                setTimeout(() => {
                    dispatch(setLoading(false));
                }, 1000);
            });
    }, [dispatch]);

    return (
        <section id="staff-dashboard" className="staff-section">
            <div className="staff-container sd-container">
                <div className="sdcr3">
                    <div className="sdcr3-card sdcr3-card-1">
                        <figure className='sdcr3-card-img sdcr3-card-img-1'>
                            <CampaignIcon className='sdcr3-card-icon' />
                        </figure>
                        <h3 className='sdcr3-card-title'>Tổng số chiến dịch</h3>
                        <p className='sdcr3-card-quantity'>{approvedCampaigns.length}</p>
                    </div>
                    <div className="sdcr3-card sdcr3-card-2">
                        <figure className='sdcr3-card-img sdcr3-card-img-2'>
                            <OrganizationIcon className='sdcr3-card-icon' />
                        </figure>
                        <h3 className='sdcr3-card-title'>Tổng số tổ chức</h3>
                        <p className='sdcr3-card-quantity'>{personalDonor.length}</p>
                    </div>
                    <div className="sdcr3-card sdcr3-card-3">
                        <figure className='sdcr3-card-img sdcr3-card-img-3'>
                            <PersonalIcon className='sdcr3-card-icon' />
                        </figure>
                        <h3 className='sdcr3-card-title'>Tổng số cá nhân</h3>
                        <p className='sdcr3-card-quantity'>{organizationDonor.length}</p>
                    </div>
                    <div className="sdcr3-card sdcr3-card-4">
                        <figure className='sdcr3-card-img sdcr3-card-img-4'>
                            <PersonalIcon className='sdcr3-card-icon' />
                        </figure>
                        <h3 className='sdcr3-card-title'>Tổng số người nhận</h3>
                        <p className='sdcr3-card-quantity'>{recipients.length}</p>
                    </div>
                </div>
                <div className="sdcr1">
                    <div className="sdcr1c1">
                        <div className="sdcr1c1r1">
                            <div className="sdcr1c1r1c1">
                                <h3>Số lượng chiến dịch</h3>
                                <p>Thống kê theo tháng</p>
                            </div>
                            <div className="sdcr1c1r1c2">
                                <select
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(Number(e.target.value))} // Update year on change
                                    className='pr-input'
                                >
                                    <option value="2023">2023</option>
                                    <option value="2024">2024</option>
                                    <option value="2025">2025</option>
                                    <option value="2026">2026</option>
                                    <option value="2027">2027</option>
                                    <option value="2028">2028</option>
                                    <option value="2029">2029</option>
                                </select>
                            </div>
                        </div>
                        <div className="sdcr1c1r2">
                            {
                                campaignsByMonthArray.map(({ month, count }) => (
                                    <div
                                        className={`item-container ${month === currentMonth ? 'active' : ''}`}
                                        key={month}
                                        style={{ position: 'relative' }}
                                    >
                                        <div
                                            className="item"
                                            style={{
                                                height: `${Math.max(count * 20, 10)}px`, // Chiều cao = count * 10, nhưng tối thiểu là 10px
                                            }}
                                        ></div>
                                        <p>{month}</p>

                                        {/* Tooltip hiển thị số lượng chiến dịch khi hover */}
                                        <div className="tooltip">
                                            {count} chiến dịch
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        <div className="sdcr1c1r3"></div>
                    </div>
                    <div className="sdcr1c2"></div>
                </div>
                <div className="sdcr2">
                    <div className="sdcr2c1">
                        <h3>Danh sách chiến dịch</h3>
                        <table className="table">
                            <thead className="table-head">
                                <tr className="table-head-row">
                                    <th className="table-head-cell">
                                        Tên chiến dịch
                                    </th>
                                    <th className="table-head-cell">
                                        Trạng thái
                                    </th>
                                    <th className="table-head-cell">
                                        Thời gian tạo
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="table-body">
                                {fiveCampaigns.map((campaign, index) => (
                                    <tr className="table-body-row" key={index}>
                                        <td className='table-body-cell'>{campaign.campaignName}</td>
                                        <td className='table-body-cell'>
                                            {campaign.status === "Pending" ? (
                                                <span className='status-pending'>Đang chờ phê duyệt</span>
                                            ) : campaign.status === "Approved" ? (
                                                <span className='status-approve'>Đã được phê duyệt</span>
                                            ) : campaign.status === "Rejected" ? (
                                                <span className='status-reject'>Đã bị từ chối</span>
                                            ) : campaign.status === "Canceled" ? (
                                                <span className='status-reject'>Đã huỷ</span>
                                            ) : null}
                                        </td>
                                        <td className='table-body-cell'>
                                            {campaign?.createdDate ? dayjs(campaign.createdDate).fromNow() : ''}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="sdcr2c2"></div>
                </div>
            </div>
        </section>
    );
};

export default StaffDashboardPage;
