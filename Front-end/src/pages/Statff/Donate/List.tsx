import { selectGetAllDonate } from "@/app/selector";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { ArrowLeft, ArrowRight, TotalIcon } from "@/assets/icons";
import { setLoading } from "@/services/app/appSlice";
import { getAllDonateApiThunk } from "@/services/donate/donateThunk";
import { formatDater, formatNumberWithDot } from "@/utils/helper";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import weekday from "dayjs/plugin/weekday";
import utc from "dayjs/plugin/utc";
import { routes } from "@/routes/routeName";
import { navigateHook } from "@/routes/RouteApp";

dayjs.extend(isSameOrAfter);
dayjs.extend(weekday);
dayjs.extend(utc);

const StaffListDonatePage = () => {
    const dispatch = useAppDispatch();
    const donates = useAppSelector(selectGetAllDonate);
    const paidDonates = donates.filter((donate) => donate.isPaid === true);
    const donatesSorted = [...paidDonates].reverse();
    const totalAmount = paidDonates.reduce(
        (sum, donate) => sum + donate.amount,
        0
    );

    const [filterType, setFilterType] = useState("all");

    const filterByTime = (donateDate: string) => {
        const now = dayjs();
        const date = dayjs(donateDate);

        switch (filterType) {
            case "today":
                return date.isSame(now, "day");
            case "week":
                return date.isSame(now, "week");
            case "month":
                return date.isSame(now, "month");
            case "year":
                return date.isSame(now, "year");
            default:
                return true;
        }
    };

    const filteredDonates = donatesSorted.filter(
        (donate) => donate.isPaid && filterByTime(donate.createdAt)
    );

    useEffect(() => {
        dispatch(setLoading(true));
        dispatch(getAllDonateApiThunk())
            .unwrap()
            .then(() => {})
            .catch()
            .finally(() => {
                setTimeout(() => {
                    dispatch(setLoading(false));
                }, 1000);
            });
    }, [dispatch]);

    const ITEMS_PER_PAGE = 5;

    const [currentDonatePage, setCurrentDonatePage] = useState(1);

    const totalDonatePages = Math.ceil(filteredDonates.length / ITEMS_PER_PAGE);

    const currentDonatesPage = filteredDonates.slice(
        (currentDonatePage - 1) * ITEMS_PER_PAGE,
        currentDonatePage * ITEMS_PER_PAGE
    );

    const onPreviousDonatePage = () => {
        if (currentDonatePage > 1) setCurrentDonatePage(currentDonatePage - 1);
    };

    const onNextDonatePage = () => {
        if (currentDonatePage < totalDonatePages)
            setCurrentDonatePage(currentDonatePage + 1);
    };

    const handleToDetail = (donorDonateId: string) => {
        const url = routes.staff.donate.detail.replace(":id", donorDonateId);
        return navigateHook(url);
    };

    return (
        <section id="staff-list-donate" className="staff-section">
            <div className="staff-container sld-container">
                <div className="sldcr1">
                    <h1>Tiền ủng hộ</h1>
                    <p>
                        Trang tổng quát
                        <span className="staff-tag">Tiền ủng hộ</span>
                    </p>
                </div>
                <div className="sldcr2">
                    <div className="staff-tab staff-tab-1">
                        <div className="st-figure st-figure-1">
                            <TotalIcon className="st-icon" />
                        </div>
                        <div className="st-info">
                            <h3>Tất cả</h3>
                            <p>{formatNumberWithDot(totalAmount)} VNĐ</p>
                        </div>
                    </div>
                </div>
                <div className="sldcr3">
                    <label>Lọc theo thời gian:</label>
                    <select
                        className="pr-input"
                        value={filterType}
                        onChange={(e) => {
                            setCurrentDonatePage(1); // reset về trang đầu
                            setFilterType(e.target.value);
                        }}
                    >
                        <option value="all">Tất cả</option>
                        <option value="today">Trong ngày</option>
                        <option value="week">Trong tuần</option>
                        <option value="month">Trong tháng</option>
                        <option value="year">Trong năm</option>
                    </select>
                </div>
                <div className="sldcr4">
                    <table className="table">
                        <thead className="table-head">
                            <tr className="table-head-row">
                                <th className="table-head-cell">
                                    Số tiền ủng hộ (VNĐ)
                                </th>
                                <th className="table-head-cell">Ngày ủng hộ</th>
                                <th className="table-head-cell">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="table-body">
                            {donates &&
                                currentDonatesPage.map((item, index) => (
                                    <tr className="table-body-row" key={index}>
                                        <td className="table-body-cell">
                                            {formatNumberWithDot(item.amount)}
                                        </td>
                                        <td className="table-body-cell">
                                            {formatDater(item.createdAt)}
                                        </td>
                                        <td className="table-body-cell">
                                            <button
                                                className="view-btn"
                                                onClick={() =>
                                                    handleToDetail(item.donorDonateId)
                                                }
                                            >
                                                Xem chi tiết
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                    <div className="paginator">
                        <div className="p-container">
                            <div className="pcc2">
                                {currentDonatePage} of {totalDonatePages}
                            </div>
                            <div className="pcc3">
                                <button
                                    disabled={currentDonatePage === 1}
                                    onClick={onPreviousDonatePage}
                                >
                                    <ArrowLeft className="pcc3-icon" />
                                </button>
                                <button
                                    disabled={
                                        currentDonatePage >= totalDonatePages
                                    }
                                    onClick={onNextDonatePage}
                                >
                                    <ArrowRight
                                        className={`pcc3-icon ${
                                            currentDonatePage >=
                                            totalDonatePages
                                                ? "pcc3-icon-disabled"
                                                : ""
                                        }`}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default StaffListDonatePage;
