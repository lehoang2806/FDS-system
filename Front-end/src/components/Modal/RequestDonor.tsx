import { FC, useEffect } from 'react'
import Modal from './Modal'
import { useAppDispatch, useAppSelector } from '@/app/store';
import { RequestDonorModalProps } from './type';
import { selectGetAllDonorSupport } from '@/app/selector';
import { getAllDonorSupportApiThunk } from '@/services/requestSupport/requestSupportThunk';

const RequestDonorModal: FC<RequestDonorModalProps> = ({ isOpen, setIsOpen }) => {
    const dispatch = useAppDispatch();
    const donorSupports = useAppSelector(selectGetAllDonorSupport);

    useEffect(() => {
        dispatch(getAllDonorSupportApiThunk());
    }, [dispatch]);

    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
            <section id="request-donor-modal">
                <table className="table">
                    <thead className="table-head">
                        <tr className="table-head-row">
                            <th className="table-head-cell">
                                Họ và tên
                            </th>
                            <th className="table-head-cell">
                                Email
                            </th>
                            <th className="table-head-cell">
                                Hành động
                            </th>
                        </tr>
                    </thead>
                    <tbody className="table-body">
                        {donorSupports.map((donorSupport, index) => (
                            <tr className="table-body-row" key={index}>
                                <td className='table-body-cell'>{donorSupport.fullName}</td>
                                <td className='table-body-cell'>
                                    {donorSupport.email}
                                </td>
                                <td className="table-body-cell">
                                    {/* <button className='view-btn' onClick={() => handleToDetail(campaign.campaignId)}>Xem chi tiết</button> */}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </Modal>
    );
};


export default RequestDonorModal