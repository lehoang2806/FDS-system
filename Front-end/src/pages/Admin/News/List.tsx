import { ActiveIcon, BlockIcon, TotalIcon } from '@/assets/icons'
import { navigateHook } from '@/routes/RouteApp';
import { routes } from '@/routes/routeName';
import { FC } from 'react'

const AdminListNewsPage: FC = () => {
    const handleToDetail = (campaignId: string) => {
        const url = routes.admin.news.detail.replace(":id", campaignId);
        return navigateHook(url)
    }

    return (
        <section id="admin-list-news" className="admin-section">
            <div className="admin-container aln-container">
                <div className="alncr1">
                    <h1>News</h1>
                    <p>Dashboard<span className="admin-tag">News</span></p>
                </div>
                <div className="alncr2">
                    <div className="admin-tab admin-tab-1">
                        <div className="at-figure at-figure-1">
                            <TotalIcon className="at-icon" />
                        </div>
                        <div className="at-info">
                            <h3>Total</h3>
                            <p>7 news</p>
                        </div>
                    </div>
                    <div className="admin-tab admin-tab-2">
                        <div className="at-figure at-figure-2">
                            <BlockIcon className="at-icon" />
                        </div>
                        <div className="at-info">
                            <h3>Reject</h3>
                            <p>7 news</p>
                        </div>
                    </div>
                    <div className="admin-tab admin-tab-3">
                        <div className="at-figure at-figure-3">
                            <ActiveIcon className="at-icon" />
                        </div>
                        <div className="at-info">
                            <h3>Approve</h3>
                            <p>7 news</p>
                        </div>
                    </div>
                </div>
                <div className="alncr3">
                    <table className="table">
                        <thead className="table-head">
                            <tr className="table-head-row">
                                <th className="table-head-cell">
                                    ID
                                </th>
                                <th className="table-head-cell">
                                    Name
                                </th>
                                <th className="table-head-cell">
                                    Create Date
                                </th>
                                <th className="table-head-cell">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="table-body">
                            <tr className="table-body-row">
                                <td className='table-body-cell'>1</td>
                                <td className='table-body-cell'>A</td>
                                <td className='table-body-cell'>7/1</td>
                                <td className="table-body-cell">
                                    <button>view</button>
                                </td>
                            </tr>
                            <tr className="table-body-row">
                                <td className='table-body-cell'>1</td>
                                <td className='table-body-cell'>A</td>
                                <td className='table-body-cell'>7/1</td>
                                <td className="table-body-cell">
                                    <button className='reject-btn'>Reject</button>
                                    <button className='approve-btn'>Approve</button>
                                    <button className='view-btn' onClick={() => handleToDetail('1')}>View</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    )
}

export default AdminListNewsPage