import { selectGetAllRecipientCertificate } from '@/app/selector';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { ActiveIcon, ArrowLeft, ArrowRight, BlockIcon, TotalIcon } from '@/assets/icons';
import { Loading } from '@/components/Elements';
import { navigateHook } from '@/routes/RouteApp';
import { routes } from '@/routes/routeName';
import { setLoading } from '@/services/app/appSlice';
import { getAllRecipientCertificateApiThunk } from '@/services/user/userThunk';
import { useEffect, useState } from 'react'

const StaffListRecipientCertificate = () => {
    const dispatch = useAppDispatch();

    const recipientCertificates = useAppSelector(selectGetAllRecipientCertificate);
    const approvedRecipientCertificates = recipientCertificates.filter((c) => c.status === "Approved");
    const pendingRecipientCertificates = recipientCertificates.filter((c) => c.status === "Pending");
    const rejectedRecipientCertificates = recipientCertificates.filter((c) => c.status === "Rejected");

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
        ? recipientCertificates.filter((c) => c.status === filterStatus)
        : recipientCertificates;

    useEffect(() => {
        dispatch(setLoading(true));
        dispatch(getAllRecipientCertificateApiThunk())
            .unwrap()
            .catch(() => {
            }).finally(() => {
                setTimeout(() => {
                    dispatch(setLoading(false));
                }, 1000)
            });
    }, [dispatch]);

    const handleToDetail = (certificateId: string) => {
        const url = routes.staff.certificate.recipient.detail.replace(":id", certificateId);
        return navigateHook(url)
    }

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

    return (
        <section id="staff-list-recipient-certificate" className="staff-section">
            {isFiltering && <Loading loading={true} isFullPage />} 
            <div className="staff-container slrc-container">
                <div className="slrccr1">
                    <h1>Đơn xác minh</h1>
                    <p>Tổng quát<span className="staff-tag">Người nhận hỗ trợ</span></p>
                </div>
                <div className="slrccr2">
                    <div className="staff-tab staff-tab-1" onClick={() => handleFilter(null)}>
                        <div className="st-figure st-figure-1">
                            <TotalIcon className="st-icon" />
                        </div>
                        <div className="st-info">
                            <h3>Tất cả</h3>
                            <p>{recipientCertificates.length} Đơn</p>
                        </div>
                    </div>
                    <div className="staff-tab staff-tab-2" onClick={() => handleFilter("Approved")}>
                        <div className="st-figure st-figure-2">
                            <BlockIcon className="st-icon" />
                        </div>
                        <div className="st-info">
                            <h3>Phê duyệt</h3>
                            <p>{approvedRecipientCertificates.length} Đơn</p>
                        </div>
                    </div>
                    <div className="staff-tab staff-tab-3" onClick={() => handleFilter("Rejected")}>
                        <div className="st-figure st-figure-3">
                            <ActiveIcon className="st-icon" />
                        </div>
                        <div className="st-info">
                            <h3>Từ chối</h3>
                            <p>{rejectedRecipientCertificates.length} Đơn</p>
                        </div>
                    </div>
                    <div className="staff-tab staff-tab-4" onClick={() => handleFilter("Pending")}>
                        <div className="st-figure st-figure-4">
                            <ActiveIcon className="st-icon" />
                        </div>
                        <div className="st-info">
                            <h3>Chờ phê duyệt</h3>
                            <p>{pendingRecipientCertificates.length} Đơn</p>
                        </div>
                    </div>
                </div>
                <div className="slrccr3">
                    <table className="table">
                        <thead className="table-head">
                            <tr className="table-head-row">
                                <th className="table-head-cell">
                                    Họ và tên
                                </th>
                                <th className="table-head-cell">
                                    Số điện thoại
                                </th>
                                <th className="table-head-cell">
                                    Trạng thái
                                </th>
                                <th className="table-head-cell">
                                    Hành động
                                </th>
                            </tr>
                        </thead>
                        <tbody className="table-body">
                            {currentCertificatesPage.map((row, index) => (
                                <tr key={index} className="table-body-row">
                                    <td className='table-body-cell'>{row.fullName}</td>
                                    <td className='table-body-cell'>{row.phone}</td>
                                    <td className='table-body-cell'>{row.status === "Pending" ? <span className='status-pending'>Đang chờ phê duyệt</span> : row.status === "Approved" ? <span className='status-approve'>Đã được phê duyệt</span> : <span className='status-reject'>Đã bị từ chối</span>}</td>
                                    <td className="table-body-cell">
                                        <button className="view-btn" onClick={() => handleToDetail(row.recipientCertificateId)}>Xem chi tiết</button>
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

export default StaffListRecipientCertificate