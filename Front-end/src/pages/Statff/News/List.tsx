import { selectGetAllNews } from '@/app/selector'
import { useAppDispatch, useAppSelector } from '@/app/store'
import { TotalIcon } from '@/assets/icons'
import { navigateHook } from '@/routes/RouteApp'
import { routes } from '@/routes/routeName'
import { setLoading } from '@/services/app/appSlice'
import { getAllNewsApiThunk } from '@/services/news/newsThunk'
import { FC, useEffect } from 'react'

const StaffListNewsPage: FC = () => {
    const handleToDetail = (newsId: string) => {
        const url = routes.staff.news.detail.replace(":id", newsId);
        return navigateHook(url)
    }

    const dispatch = useAppDispatch();
    const news = useAppSelector(selectGetAllNews);

    useEffect(() => {
        dispatch(setLoading(true))
        dispatch(getAllNewsApiThunk())
            .unwrap()
            .then()
            .catch()
            .finally(() => {
                setTimeout(() => {
                    dispatch(setLoading(false))
                }, 1000)
            })
    }, [dispatch])

    return (
        <section id="staff-list-news" className="staff-section">
            <div className="staff-container sln-container">
                <div className="slncr1">
                    <h1>News</h1>
                    <p>Dashboard<span className="staff-tag">News</span></p>
                </div>
                <div className="slncr2">
                    <div className="staff-tab staff-tab-1">
                        <div className="st-figure st-figure-1">
                            <TotalIcon className="st-icon" />
                        </div>
                        <div className="st-info">
                            <h3>Total</h3>
                            <p>{news.length} News</p>
                        </div>
                    </div>
                </div>
                <div className="slncr3">
                    <button className="staff-add-btn" onClick={() => navigateHook(routes.staff.news.add)}>Add News</button>
                </div>
                <div className="slncr4">
                    <table className="table">
                        <thead className="table-head">
                            <tr className="table-head-row">
                                <th className="table-head-cell">
                                    Title
                                </th>
                                <th className="table-head-cell">
                                    Description
                                </th>
                                <th className="table-head-cell">
                                    Support Beneficiaries
                                </th>
                                <th className="table-head-cell">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="table-body">
                            {news && news.map((item, index) => (
                                <tr className="table-body-row" key={index}>
                                    <td className='table-body-cell'>{item.newsTitle}</td>
                                    <td className='table-body-cell'>{item.newsDescripttion}</td>
                                    <td className='table-body-cell'>{item.supportBeneficiaries}</td>
                                    <td className="table-body-cell">
                                        <button className='view-btn' onClick={() => handleToDetail(item.newId)}>View</button>
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

export default StaffListNewsPage