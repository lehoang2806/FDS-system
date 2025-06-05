import { selectGetAllCampaign, selectGetAllUser } from "@/app/selector";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { CampaignIcon, OrganizationIcon, PersonalIcon } from "@/assets/icons";
import { setLoading } from "@/services/app/appSlice";
import { getAllCampaignApiThunk } from "@/services/campaign/campaignThunk";
import { getAllUserApiThunk } from "@/services/user/userThunk";
import { FC, useEffect, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import { CampaignComparisonChart } from "@/components/Elements";

dayjs.locale("vi");
dayjs.extend(relativeTime);
const AdminDashboardPage: FC = () => {
    const campaigns = useAppSelector(selectGetAllCampaign);
    const dispatch = useAppDispatch();

    const [selectedYear, setSelectedYear] = useState(2025); // State for selected year

    const users = useAppSelector(selectGetAllUser);
    const donors = users.filter((user) => user.roleId === 3);
    const personalDonor = donors.filter((donor) => donor.type === "1");
    const organizationDonor = donors.filter((donor) => donor.type === "2");
    const recipients = users.filter((user) => user.roleId === 4);

    // Sort campaigns and filter by "Approved" status
    const sortedCampaigns = [...campaigns].reverse();
    const approvedCampaigns = sortedCampaigns.filter(
        (campaign) => campaign.status === "Approved"
    );

    // Function to get campaigns by month for a specific year
    const getCampaignsByMonth = (year: number) => {
        const campaignsByMonth: { [key: string]: number } = {};

        // Initialize 12 months
        for (let month = 1; month <= 12; month++) {
            const monthStr = month.toString().padStart(2, "0");
            campaignsByMonth[monthStr] = 0;
        }

        // Count campaigns for the selected year
        approvedCampaigns
            .filter((campaign) => {
                const date = new Date(campaign.implementationTime);
                return date.getFullYear() === year;
            })
            .forEach((campaign) => {
                const date = new Date(campaign.implementationTime);
                const month = (date.getMonth() + 1).toString().padStart(2, "0");
                campaignsByMonth[month] += 1;
            });

        // Convert to array sorted by month
        return Object.keys(campaignsByMonth)
            .sort()
            .map((month) => ({
                month,
                count: campaignsByMonth[month],
            }));
    };

    // Get campaigns for selected year
    const campaignsByMonthArray = getCampaignsByMonth(selectedYear);

    // Get the current month (0-based, so we add 1)
    const currentMonth = (new Date().getMonth() + 1)
        .toString()
        .padStart(2, "0");

    useEffect(() => {
        dispatch(setLoading(true));
        Promise.all([
            dispatch(getAllCampaignApiThunk()).unwrap(),
            dispatch(getAllUserApiThunk()).unwrap(),
        ])
            .catch(() => {})
            .finally(() => {
                setTimeout(() => {
                    dispatch(setLoading(false));
                }, 1000);
            });
    }, [dispatch]);

    //Compare cmpaign betwenn 2 years
    const currentYear = new Date().getFullYear();
    const availableYears = Array.from(
        { length: 10 },
        (_, i) => currentYear - i
    ).reverse();

    const generateComparisonData = (years: number[]) => {
        const monthlyData: { [month: string]: { [year: string]: number } } = {};

        for (let month = 1; month <= 12; month++) {
            const monthStr = month.toString().padStart(2, "0");
            monthlyData[monthStr] = {};
            years.forEach((year) => {
                monthlyData[monthStr][year.toString()] = 0;
            });
        }

        approvedCampaigns.forEach((campaign) => {
            const date = new Date(campaign.implementationTime);
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, "0");

            if (years.includes(year)) {
                monthlyData[month][year.toString()] += 1;
            }
        });

        // ✅ Trả về dữ liệu theo đúng thứ tự từ T01 đến T12
        const monthsOrder = [
            "01",
            "02",
            "03",
            "04",
            "05",
            "06",
            "07",
            "08",
            "09",
            "10",
            "11",
            "12",
        ];

        return monthsOrder.map((month) => ({
            month: "T" + month,
            ...monthlyData[month],
        }));
    };

    return (
        <section id="admin-dashboard" className="admin-section">
            <div className="admin-container ad-container">
                <div className="adcr3">
                    <div className="adcr3-card adcr3-card-1">
                        <figure className="adcr3-card-img adcr3-card-img-1">
                            <CampaignIcon className="adcr3-card-icon" />
                        </figure>
                        <h3 className="adcr3-card-title">Tổng số chiến dịch</h3>
                        <p className="adcr3-card-quantity">
                            {approvedCampaigns.length}
                        </p>
                    </div>
                    <div className="adcr3-card adcr3-card-2">
                        <figure className="adcr3-card-img adcr3-card-img-2">
                            <OrganizationIcon className="adcr3-card-icon" />
                        </figure>
                        <h3 className="adcr3-card-title">Tổng số tổ chức</h3>
                        <p className="adcr3-card-quantity">
                            {personalDonor.length}
                        </p>
                    </div>
                    <div className="adcr3-card adcr3-card-3">
                        <figure className="adcr3-card-img adcr3-card-img-3">
                            <PersonalIcon className="adcr3-card-icon" />
                        </figure>
                        <h3 className="adcr3-card-title">Tổng số cá nhân</h3>
                        <p className="adcr3-card-quantity">
                            {organizationDonor.length}
                        </p>
                    </div>
                    <div className="adcr3-card adcr3-card-4">
                        <figure className="adcr3-card-img adcr3-card-img-4">
                            <PersonalIcon className="adcr3-card-icon" />
                        </figure>
                        <h3 className="adcr3-card-title">Tổng số người nhận</h3>
                        <p className="adcr3-card-quantity">
                            {recipients.length}
                        </p>
                    </div>
                </div>
                <div className="adcr1">
                    <div className="adcr1c1">
                        <div className="adcr1c1r1">
                            <div className="adcr1c1r1c1">
                                <h3>Số lượng chiến dịch</h3>
                                <p>Thống kê theo tháng</p>
                            </div>
                            <div className="adcr1c1r1c2">
                                <select
                                    value={selectedYear}
                                    onChange={(e) =>
                                        setSelectedYear(Number(e.target.value))
                                    } // Update year on change
                                    className="pr-input"
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
                        <div className="adcr1c1r2">
                            {campaignsByMonthArray.map(({ month, count }) => (
                                <div
                                    className={`item-container ${
                                        month === currentMonth ? "active" : ""
                                    }`}
                                    key={month}
                                    style={{ position: "relative" }}
                                >
                                    <div
                                        className="item"
                                        style={{
                                            height: `${Math.max(
                                                count * 20,
                                                10
                                            )}px`, // Chiều cao = count * 10, nhưng tối thiểu là 10px
                                        }}
                                    ></div>
                                    <p>{month}</p>

                                    {/* Tooltip hiển thị số lượng chiến dịch khi hover */}
                                    <div className="tooltip">
                                        {count} chiến dịch
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="adcr1c1r3"></div>
                    </div>
                    <div className="adcr1c2"></div>
                </div>
                <div className="adcr2">
                    <div className="adcr2c1">
                        <h3>So sánh chiến dịch theo tháng giữa 2 năm</h3>
                        <CampaignComparisonChart
                            allYears={availableYears}
                            dataGenerator={generateComparisonData}
                        />
                    </div>
                    <div className="adcr2c2"></div>
                </div>
            </div>
        </section>
    );
};

export default AdminDashboardPage;
