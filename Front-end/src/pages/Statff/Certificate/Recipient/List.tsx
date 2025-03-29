import { selectGetAllRecipientCertificate } from '@/app/selector';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { ActiveIcon, BlockIcon, TotalIcon } from '@/assets/icons';
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

    return (
        <section id="staff-list-recipient-certificate" className="staff-section">
            {isFiltering && <Loading loading={true} isFullPage />} 
            <div className="staff-container slrc-container">
                <div className="slrccr1">
                    <h1>User</h1>
                    <p>Dashboard<span className="staff-tag">User</span></p>
                </div>
                <div className="slrccr2">
                    <div className="staff-tab staff-tab-1" onClick={() => handleFilter(null)}>
                        <div className="st-figure st-figure-1">
                            <TotalIcon className="st-icon" />
                        </div>
                        <div className="st-info">
                            <h3>Total</h3>
                            <p>{recipientCertificates.length} Certificates</p>
                        </div>
                    </div>
                    <div className="staff-tab staff-tab-2" onClick={() => handleFilter("Approved")}>
                        <div className="st-figure st-figure-2">
                            <BlockIcon className="st-icon" />
                        </div>
                        <div className="st-info">
                            <h3>Approve</h3>
                            <p>{approvedRecipientCertificates.length} Certificates</p>
                        </div>
                    </div>
                    <div className="staff-tab staff-tab-3" onClick={() => handleFilter("Rejected")}>
                        <div className="st-figure st-figure-3">
                            <ActiveIcon className="st-icon" />
                        </div>
                        <div className="st-info">
                            <h3>Reject</h3>
                            <p>{rejectedRecipientCertificates.length} Certificates</p>
                        </div>
                    </div>
                    <div className="staff-tab staff-tab-4" onClick={() => handleFilter("Pending")}>
                        <div className="st-figure st-figure-4">
                            <ActiveIcon className="st-icon" />
                        </div>
                        <div className="st-info">
                            <h3>Pending</h3>
                            <p>{pendingRecipientCertificates.length} Certificates</p>
                        </div>
                    </div>
                </div>
                <div className="slrccr3">
                    <table className="table">
                        <thead className="table-head">
                            <tr className="table-head-row">
                                <th className="table-head-cell">
                                    CCCD
                                </th>
                                <th className="table-head-cell">
                                    Full Name
                                </th>
                                <th className="table-head-cell">
                                    Phone
                                </th>
                                <th className="table-head-cell">
                                    Status
                                </th>
                                <th className="table-head-cell">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="table-body">
                            {filteredCertificates.map((row, index) => (
                                <tr key={index} className="table-body-row">
                                    <td className='table-body-cell'>{row.citizenId}</td>
                                    <td className='table-body-cell'>{row.fullName}</td>
                                    <td className='table-body-cell'>{row.phone}</td>
                                    <td className='table-body-cell'>{row.status === "Pending" ? <span className='status-pending'>Pending</span> : row.status === "Approved" ? <span className='status-approve'>Approve</span> : <span className='status-reject'>Reject</span>}</td>
                                    <td className="table-body-cell">
                                        <button className="view-btn" onClick={() => handleToDetail(row.recipientCertificateId)}>View</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    )
}

export default StaffListRecipientCertificate