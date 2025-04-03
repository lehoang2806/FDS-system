import { selectGetNewsById } from '@/app/selector'
import { useAppDispatch, useAppSelector } from '@/app/store'
import { navigateHook } from '@/routes/RouteApp'
import { routes } from '@/routes/routeName'
import { setLoading } from '@/services/app/appSlice'
import { getNewsByIdApiThunk } from '@/services/news/newsThunk'
import { FC, useEffect } from 'react'
import { useParams } from 'react-router-dom'

const StaffDetailNewsPage: FC = () => {
    const { id } = useParams<{ id: string }>();

    const dispatch =useAppDispatch();
    const currentNews = useAppSelector(selectGetNewsById)

    const createDate = currentNews?.createdDate && currentNews?.createdDate.split("T")[0];

    useEffect(() => {
        dispatch(setLoading(true))
        dispatch(getNewsByIdApiThunk(String(id)))
            .unwrap()
            .then()
            .catch()
            .finally(() => {
                setTimeout(() => {
                    dispatch(setLoading(false))
                }, 1000)
            })
    }, [dispatch, id])

    return (
        <section id="staff-detail-news" className="staff-section">
            <div className="staff-container sdn-container">
                <div className="sdncr1">
                    <h1>News</h1>
                    <p>Dashboard<span className="staff-tag">Detail News</span></p>
                </div>
                <div className="sdncr2">
                    <div className="sdncr2r1">
                        <div className="group-btn">
                            <button onClick={() => navigateHook(routes.staff.news.list)}>Back to list</button>
                        </div>
                    </div>
                    <hr />
                    <div className="sdncr2r2">
                        <div className="sdncr2r2c1">
                        </div>
                        <div className="sdncr2r2c2">
                            <h3>Created Date:</h3>
                            <p>{createDate}</p>
                        </div>
                    </div>
                    <hr />
                    <div className="sdncr2r3">
                        <div className="sdncr2r3c1">
                            <h3>Title:</h3>
                            <p>{currentNews?.newsTitle}</p>
                            <h3>Description:</h3>
                            <p>{currentNews?.newsDescripttion}</p>
                            <h3>Support Beneficiaries:</h3>
                            <p>{currentNews?.supportBeneficiaries}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default StaffDetailNewsPage