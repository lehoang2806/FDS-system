import { selectGetAllDonorCertificate } from '@/app/selector';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { ActiveIcon, ArrowLeft, ArrowRight, BlockIcon, TotalIcon } from '@/assets/icons';
import { Loading } from '@/components/Elements';
import { navigateHook } from '@/routes/RouteApp';
import { routes } from '@/routes/routeName';
import { setLoading } from '@/services/app/appSlice';
import { getAllDonorCertificateApiThunk } from '@/services/user/userThunk';
import { useEffect, useState } from 'react'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';

dayjs.locale('vi');
dayjs.extend(relativeTime);

const StaffListDonorCertificate = () => {
    const dispatch = useAppDispatch();

    const donorCertificates = useAppSelector(selectGetAllDonorCertificate);

    const approvedDonorCertificates = donorCertificates.filter((c) => c.status === "Approved");
    const pendingDonorCertificates = donorCertificates.filter((c) => c.status === "Pending");
    const rejectedDonorCertificates = donorCertificates.filter((c) => c.status === "Rejected");

    const [isFiltering, setIsFiltering] = useState(false);

    const [filterStatus, setFilterStatus] = useState<string | null>(null);

    const handleFilter = (status: string | null) => {
        setIsFiltering(true);
        setTimeout(() => {
            setFilterStatus(status);
            setIsFiltering(false);
        }, 500);
    };

    const filteredCertificates = filterStatus
        ? donorCertificates.filter((c) => c.status === filterStatus)
        : donorCertificates;

    useEffect(() => {
        dispatch(setLoading(true));
        dispatch(getAllDonorCertificateApiThunk())
            .unwrap()
            .catch(() => {
            }).finally(() => {
                setTimeout(() => {
                    dispatch(setLoading(false));
                }, 1000)
            });
    }, [dispatch]);

    const ITEMS_PER_PAGE = 5;

    const [currentCertificatePage, setCurrentCertificatePage] = useState(1);

    const totalCertificatePages = Math.ceil(filteredCertificates.length / ITEMS_PER_PAGE);

    const currentCertificatesPage = filteredCertificates.slice(
        (currentCertificatePage - 1) * ITEMS_PER_PAGE,
        currentCertificatePage * ITEMS_PER_PAGE
    );

    const onPreviousCertificatePage = () => {
        if (currentCertificatePage > 1) setCurrentCertificatePage(currentCertificatePage - 1);
    };

    const onNextCertificatePage = () => {
        if (currentCertificatePage < totalCertificatePages) setCurrentCertificatePage(currentCertificatePage + 1);
    };

    const handleToDetail = (certificateId: string, type: string) => {
        const url = routes.staff.certificate.donor.detail.replace(":id", certificateId);
        return navigateHook(`${url}?type=${type}`);
    }

    return (
        <section id="staff-list-donor-certificate" className="staff-section">
            {isFiltering && <Loading loading={true} isFullPage />}
            <div className="staff-container sldc-container">
                <div className="sldccr1">
                    <h1>Đơn xác minh</h1>
                    <p>Trang tổng quát<span className="staff-tag">Người tặng thực phẩm</span></p>
                </div>
                <div className="sldccr2">
                    <div className="staff-tab staff-tab-1" onClick={() => handleFilter(null)}>
                        <div className="st-figure st-figure-1">
                            <TotalIcon className="st-icon" />
                        </div>
                        <div className="st-info">
                            <h3>Tất cả</h3>
                            <p>{donorCertificates.length} Đơn</p>
                        </div>
                    </div>
                    <div className="staff-tab staff-tab-2" onClick={() => handleFilter("Approved")}>
                        <div className="st-figure st-figure-2">
                            <BlockIcon className="st-icon" />
                        </div>
                        <div className="st-info">
                            <h3>Phê duyệt</h3>
                            <p>{approvedDonorCertificates.length} Đơn</p>
                        </div>
                    </div>
                    <div className="staff-tab staff-tab-3" onClick={() => handleFilter("Rejected")}>
                        <div className="st-figure st-figure-3">
                            <ActiveIcon className="st-icon" />
                        </div>
                        <div className="st-info">
                            <h3>Từ chối</h3>
                            <p>{rejectedDonorCertificates.length} Đơn</p>
                        </div>
                    </div>
                    <div className="staff-tab staff-tab-4" onClick={() => handleFilter("Pending")}>
                        <div className="st-figure st-figure-4">
                            <ActiveIcon className="st-icon" />
                        </div>
                        <div className="st-info">
                            <h3>Chờ phê duyệt</h3>
                            <p>{pendingDonorCertificates.length} Đơn</p>
                        </div>
                    </div>
                </div>
                <div className="sldccr3">
                    <table className="table">
                        <thead className="table-head">
                            <tr className="table-head-row">
                                <th className="table-head-cell">
                                    Loại
                                </th>
                                <th className="table-head-cell">
                                    Trạng thái
                                </th>
                                <th className="table-head-cell">
                                    Thời gian gửi
                                </th>
                                <th className="table-head-cell">
                                    Hành động
                                </th>
                            </tr>
                        </thead>
                        <tbody className="table-body">
                            {currentCertificatesPage.map((row, index) => (
                                <tr key={index} className="table-body-row">
                                    <td className='table-body-cell'>{row.organizationName === null ? "Cá nhân" : "Tổ chức"}</td>
                                    <td className='table-body-cell'>{row.status === "Pending" ? <span className='status-pending'>Đang chờ phê duyệt</span> : row.status === "Approved" ? <span className='status-approve'>Đã được phê duyệt</span> : <span className='status-reject'>Đã bị từ chối</span>}</td>
                                    <td className='table-body-cell'>
                                        {row?.createdDate ? dayjs(row.createdDate).fromNow() : ''}
                                    </td>
                                    <td className="table-body-cell">
                                        <button className="view-btn" onClick={() => { row.organizationName === null ? handleToDetail(row.donorCertificateId, "Personal") : handleToDetail(row.donorCertificateId, "Organization") }}>Xem chi tiết</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className='paginator'>
                        <div className="p-container">
                            <div className="pcc2">{currentCertificatePage} of {totalCertificatePages}</div>
                            <div className="pcc3">
                                <button disabled={currentCertificatePage === 1} onClick={onPreviousCertificatePage}>
                                    <ArrowLeft className="pcc3-icon" />
                                </button>
                                <button
                                    disabled={currentCertificatePage >= totalCertificatePages}
                                    onClick={onNextCertificatePage}
                                >
                                    <ArrowRight
                                        className={`pcc3-icon ${currentCertificatePage >= totalCertificatePages ? 'pcc3-icon-disabled' : ''}`}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default StaffListDonorCertificate