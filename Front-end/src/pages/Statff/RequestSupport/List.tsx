import { selectGetAllRequestSupport } from '@/app/selector'
import { useAppDispatch, useAppSelector } from '@/app/store'
import { ArrowLeft, ArrowRight, TotalIcon } from '@/assets/icons'
import { navigateHook } from '@/routes/RouteApp'
import { routes } from '@/routes/routeName'
import { setLoading } from '@/services/app/appSlice'
import { getAllRequestSupportApiThunk } from '@/services/requestSupport/requestSupportThunk'
import { FC, useEffect, useState } from 'react'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';

dayjs.locale('vi');
dayjs.extend(relativeTime);

const StaffListRequestSupportPage: FC = () => {
    const handleToDetail = (newsId: string) => {
        const url = routes.staff.request_support.detail.replace(":id", newsId);
        return navigateHook(url)
    }

    const dispatch = useAppDispatch();
    const requestSupport = useAppSelector(selectGetAllRequestSupport);
    const sortedRequestSupport = [...requestSupport].reverse();

    useEffect(() => {
        dispatch(setLoading(true))
        dispatch(getAllRequestSupportApiThunk())
            .unwrap()
            .then()
            .catch()
            .finally(() => {
                setTimeout(() => {
                    dispatch(setLoading(false))
                }, 1000)
            })
    }, [dispatch])

    const ITEMS_PER_PAGE = 5;

    const [currentRequestSupportPage, setCurrentRequestSupportPage] = useState(1);

    const totalNewsPages = Math.ceil(sortedRequestSupport.length / ITEMS_PER_PAGE);

    const currentRequestSupportsPage = sortedRequestSupport.slice(
        (currentRequestSupportPage - 1) * ITEMS_PER_PAGE,
        currentRequestSupportPage * ITEMS_PER_PAGE
    );

    const onPreviousRequestSupportPage = () => {
        if (currentRequestSupportPage > 1) setCurrentRequestSupportPage(currentRequestSupportPage - 1);
    };

    const onNextRequestSupportPage = () => {
        if (currentRequestSupportPage < totalNewsPages) setCurrentRequestSupportPage(currentRequestSupportPage + 1);
    };

    return (
        <section id="staff-list-news" className="staff-section">
            <div className="staff-container sln-container">
                <div className="slncr1">
                    <h1>Đơn yêu cầu hỗ trợ</h1>
                    <p>Trang tổng quát<span className="staff-tag">Đơn yêu cầu hỗ trợ</span></p>
                </div>
                <div className="slncr2">
                    <div className="staff-tab staff-tab-1">
                        <div className="st-figure st-figure-1">
                            <TotalIcon className="st-icon" />
                        </div>
                        <div className="st-info">
                            <h3>Tất cả</h3>
                            <p>{requestSupport.length} Đơn</p>
                        </div>
                    </div>
                </div>
                <div className="slncr4">
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
                                    Thời gian tạo
                                </th>
                                <th className="table-head-cell">
                                    Hành động
                                </th>
                            </tr>
                        </thead>
                        <tbody className="table-body">
                            {requestSupport && currentRequestSupportsPage.map((item, index) => (
                                <tr className="table-body-row" key={index}>
                                    <td className='table-body-cell'>{item.fullName}</td>
                                    <td className='table-body-cell'>{item.phoneNumber}</td>
                                    <td className='table-body-cell'>
                                        {item?.createdDate ? dayjs(item.createdDate).fromNow() : ''}
                                    </td>
                                    <td className="table-body-cell">
                                        <button className='view-btn' onClick={() => handleToDetail(item.requestSupportId)}>Xem chi tiết</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className='paginator'>
                        <div className="p-container">
                            <div className="pcc2">{currentRequestSupportPage} of {totalNewsPages}</div>
                            <div className="pcc3">
                                <button disabled={currentRequestSupportPage === 1} onClick={onPreviousRequestSupportPage}>
                                    <ArrowLeft className="pcc3-icon" />
                                </button>
                                <button
                                    disabled={currentRequestSupportPage >= totalNewsPages}
                                    onClick={onNextRequestSupportPage}
                                >
                                    <ArrowRight
                                        className={`pcc3-icon ${currentRequestSupportPage >= totalNewsPages ? 'pcc3-icon-disabled' : ''}`}
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

export default StaffListRequestSupportPage