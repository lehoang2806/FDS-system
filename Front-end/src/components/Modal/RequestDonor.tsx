import { FC, useEffect, useState } from 'react';
import Modal from './Modal';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { RequestDonorModalProps } from './type';
import { selectGetAllCampaign, selectGetAllDonorSupport } from '@/app/selector';
import { getAllDonorSupportApiThunk, requestDonorSupportApiThunk } from '@/services/requestSupport/requestSupportThunk';
import { ArrowLeft, ArrowRight } from '@/assets/icons';
import { toast } from 'react-toastify';
import { setLoading } from '@/services/app/appSlice';
import { getAllCampaignApiThunk } from '@/services/campaign/campaignThunk';

const RequestDonorModal: FC<RequestDonorModalProps> = ({ isOpen, setIsOpen, donorSupport, requestSupportId }) => {
    const dispatch = useAppDispatch();
    const donorSupports = useAppSelector(selectGetAllDonorSupport);
    const campaigns = useAppSelector(selectGetAllCampaign);

    const countCampaign = (acountID: string) => {
        const count = campaigns.filter(campaign => campaign.accountId === acountID).length;
        return count;
    }

    const sortedDonorSupports = [...donorSupports].sort((a, b) => {
        const countA = countCampaign(a.donorId);
        const countB = countCampaign(b.donorId);
        return countB - countA; // giảm dần (nhiều chiến dịch hơn lên trước)
    });
    
    const [searchTerm, setSearchTerm] = useState('');

    const filteredDonorSupports = sortedDonorSupports.filter(donor =>
        donor.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donor.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const [selectedDonors, setSelectedDonors] = useState<string[]>([]);
    const [isAllSelected, setIsAllSelected] = useState(false);

    const sentDonorEmails = donorSupport?.map(donor => donor.email) || [];

    useEffect(() => {
        dispatch(getAllDonorSupportApiThunk());
        dispatch(getAllCampaignApiThunk());
    }, [dispatch]);

    const handleSelectAll = () => {
        if (isAllSelected) {
            setSelectedDonors([]);
        } else {
            const selectableEmails = sortedDonorSupports
                .filter(donor => !sentDonorEmails.includes(donor.email))
                .map(donor => donor.email);
            setSelectedDonors(selectableEmails);
        }
        setIsAllSelected(!isAllSelected);
    };

    const ITEMS_PER_PAGE = 5;

    const [currentDonorSupportsPage, setCurrentDonorSupportsPage] = useState(1);

    const totalNewsPages = Math.ceil(filteredDonorSupports.length / ITEMS_PER_PAGE);

    const currentDonorSupportsesPage = filteredDonorSupports.slice(
        (currentDonorSupportsPage - 1) * ITEMS_PER_PAGE,
        currentDonorSupportsPage * ITEMS_PER_PAGE
    );

    const onPreviousDonorSupportsPage = () => {
        if (currentDonorSupportsPage > 1) setCurrentDonorSupportsPage(currentDonorSupportsPage - 1);
    };

    const onNextDonorSupportsPage = () => {
        if (currentDonorSupportsPage < totalNewsPages) setCurrentDonorSupportsPage(currentDonorSupportsPage + 1);
    };

    const handleSelectDonor = (email: string) => {
        setSelectedDonors(prevState =>
            prevState.includes(email)
                ? prevState.filter(donor => donor !== email)
                : [...prevState, email]
        );
    };

    const handleSubmit = async () => {
        if (!requestSupportId) {
            alert("Thiếu requestSupportId");
            return;
        }

        try {
            dispatch(setLoading(true));
            await dispatch(requestDonorSupportApiThunk({
                requestSupportId: requestSupportId,
                emails: selectedDonors,
            })).unwrap()
                .then(() => {


                    toast.success("Gửi thành công!");
                    setIsOpen(false);
                })
                .catch(() => { })
                .finally(() => {
                    setTimeout(() => {
                        dispatch(setLoading(false));
                    }, 1000)
                })
        } catch (err) {
            toast.error("Có lỗi xảy ra khi gửi: " + (err as any)?.errorMessage || "Unknown error");
        }
    };

    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
            <section id="request-donor-modal" style={{ width: '1000px' }}>
                <p style={{ fontSize: '20px', fontWeight: 'bold' }}>Tìm kiếm</p>
                <input
                    type="text"
                    placeholder='Tìm kiếm theo tên hoặc email'
                    className="pr-input"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentDonorSupportsPage(1); // Reset về page 1 khi tìm kiếm
                    }}
                    style={{ width: '400px', marginBottom: '20px' }}
                />
                <table className="table">
                    <thead className="table-head">
                        <tr className="table-head-row">
                            <th className="table-head-cell">
                                <input
                                    type="checkbox"
                                    checked={isAllSelected}
                                    onChange={handleSelectAll}
                                />
                            </th>
                            <th className="table-head-cell">
                                Họ và tên
                            </th>
                            <th className="table-head-cell">
                                Email
                            </th>
                            <th className="table-head-cell">
                                Chiến dịch đã tạo
                            </th>
                            <th className="table-head-cell">
                                Trạng thái
                            </th>
                        </tr>
                    </thead>
                    <tbody className="table-body">
                        {currentDonorSupportsesPage.map((donorSupport, index) => {
                            const isSent = sentDonorEmails.includes(donorSupport.email);

                            return (
                                <tr className="table-body-row" key={index}>
                                    <td className='table-body-cell'>
                                        <input
                                            type="checkbox"
                                            checked={selectedDonors.includes(donorSupport.email)}
                                            onChange={() => handleSelectDonor(donorSupport.email)}
                                            disabled={isSent}
                                        />
                                    </td>
                                    <td className='table-body-cell'>{donorSupport.fullName}</td>
                                    <td className='table-body-cell'>
                                        {donorSupport.email}
                                    </td>
                                    <td className='table-body-cell'>
                                        {countCampaign(donorSupport.donorId)}
                                    </td>
                                    <td className='table-body-cell'>
                                        {isSent ? (
                                            <span className="text-green-600">Đã gửi</span>
                                        ) : (
                                            <span className="text-gray-500">Chưa gửi</span>
                                        )}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                <div className='paginator'>
                    <div className="p-container">
                        <div className="pcc2">{currentDonorSupportsPage} of {totalNewsPages}</div>
                        <div className="pcc3">
                            <button disabled={currentDonorSupportsPage === 1} onClick={onPreviousDonorSupportsPage}>
                                <ArrowLeft className="pcc3-icon" />
                            </button>
                            <button
                                disabled={currentDonorSupportsPage >= totalNewsPages}
                                onClick={onNextDonorSupportsPage}
                            >
                                <ArrowRight
                                    className={`pcc3-icon ${currentDonorSupportsPage >= totalNewsPages ? 'pcc3-icon-disabled' : ''}`}
                                />
                            </button>
                        </div>
                    </div>
                </div>
                <div style={{ textAlign: "center" }}>
                    <button className="sc-btn" style={{ padding: "8px 30px", margin: "0px auto" }} onClick={handleSubmit}>
                        Gửi
                    </button>
                </div>
            </section>
        </Modal>
    );
};

export default RequestDonorModal;
