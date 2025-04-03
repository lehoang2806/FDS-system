import { selectGetNewsById } from "@/app/selector";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { setLoading } from "@/services/app/appSlice";
import { getNewsByIdApiThunk } from "@/services/news/newsThunk";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const DetailNewsPage = () => {
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
        <main id="detail-news">
            <section id="dn-section">
                <div className="dns-container">
                    <div className="dnscr1">
                        <img src={currentNews?.images[0]} className="dn-img"/>
                    </div>
                    <div className="dnscr2">
                        <div className="dnscr2r1">
                            <h2>{currentNews?.newsTitle}</h2>
                        </div>
                        <div className="dnscr2r2">
                            <p>Giới thiệu</p>
                            <button className="sc-btn">Quan tâm</button>
                        </div>
                    </div>
                    <div className="dnscr3">
                        <div className="dnscr3r1">
                            <p><span>5</span> người tham gia</p>
                        </div>
                        <div className="dnscr3r2">
                            <h4>Chi tiết tin tức</h4>
                            <p>{currentNews?.newsDescripttion}</p>
                            <h4>Đối tượng hỗ trợ</h4>
                            <p>{currentNews?.supportBeneficiaries}</p>
                        </div>
                    </div>
                    <div className="dnscr4">
                        <div className="dnscr4r1">
                            <h4>Bình luận</h4>
                        </div>
                        <div className="dnscr4r2">
                            <div className="comment-container">
                                <div className="cc-avatar"></div>
                                <div className="cc-info">
                                    <p className="cc-name">Tên</p>
                                    <p className="cc-content">Bình luận</p>
                                    <p className='cc-time'>Thời gian</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default DetailNewsPage