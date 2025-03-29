import { selectGetAllDonorCertificate } from '@/app/selector';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { ActiveIcon, BlockIcon, TotalIcon } from '@/assets/icons';
import { Loading } from '@/components/Elements';
import { navigateHook } from '@/routes/RouteApp';
import { routes } from '@/routes/routeName';
import { setLoading } from '@/services/app/appSlice';
import { getAllDonorCertificateApiThunk } from '@/services/user/userThunk';
import { useEffect, useState } from 'react'

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

    const handleToDetail = (certificateId: string, type: string) => {
        const url = routes.staff.certificate.donor.detail.replace(":id", certificateId);
        return navigateHook(`${url}?type=${type}`);
    }

    return (
        <section id="staff-list-donor-certificate" className="staff-section">
            {isFiltering && <Loading loading={true} isFullPage />} 
            <div className="staff-container sldc-container">
                <div className="sldccr1">
                    <h1>User</h1>
                    <p>Dashboard<span className="staff-tag">User</span></p>
                </div>
                <div className="sldccr2">
                    <div className="staff-tab staff-tab-1" onClick={() => handleFilter(null)}>
                        <div className="st-figure st-figure-1">
                            <TotalIcon className="st-icon" />
                        </div>
                        <div className="st-info">
                            <h3>Total</h3>
                            <p>{donorCertificates.length} Certificates</p>
                        </div>
                    </div>
                    <div className="staff-tab staff-tab-2" onClick={() => handleFilter("Approved")}>
                        <div className="st-figure st-figure-2">
                            <BlockIcon className="st-icon" />
                        </div>
                        <div className="st-info">
                            <h3>Approve</h3>
                            <p>{approvedDonorCertificates.length} Certificates</p>
                        </div>
                    </div>
                    <div className="staff-tab staff-tab-3" onClick={() => handleFilter("Rejected")}>
                        <div className="st-figure st-figure-3">
                            <ActiveIcon className="st-icon" />
                        </div>
                        <div className="st-info">
                            <h3>Reject</h3>
                            <p>{rejectedDonorCertificates.length} Certificates</p>
                        </div>
                    </div>
                    <div className="staff-tab staff-tab-4" onClick={() => handleFilter("Pending")}>
                        <div className="st-figure st-figure-4">
                            <ActiveIcon className="st-icon" />
                        </div>
                        <div className="st-info">
                            <h3>Pending</h3>
                            <p>{pendingDonorCertificates.length} Certificates</p>
                        </div>
                    </div>
                </div>
                <div className="sldccr3">
                    <table className="table">
                        <thead className="table-head">
                            <tr className="table-head-row">
                                <th className="table-head-cell">
                                    Type
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
                                    <td className='table-body-cell'>{row.citizenId === null ? "Organization" : "Personal"}</td>
                                    <td className='table-body-cell'>{row.status === "Pending" ? <span className='status-pending'>Pending</span> : row.status === "Approved" ? <span className='status-approve'>Approve</span> : <span className='status-reject'>Reject</span>}</td>
                                    <td className="table-body-cell">
                                        <button className="view-btn" onClick={() => {row.citizenId === null ? handleToDetail(row.donorCertificateId, "Organization") : handleToDetail(row.donorCertificateId, "Personal")}}>View</button>
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

export default StaffListDonorCertificate