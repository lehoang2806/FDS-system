import { selectGetNewsById } from "@/app/selector";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { PostContent } from "@/components/Elements";
import { setLoading } from "@/services/app/appSlice";
import { getNewsByIdApiThunk } from "@/services/news/newsThunk";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const DetailNewsPage = () => {
    const { id } = useParams<{ id: string }>();

    const dispatch = useAppDispatch();
    const currentNews = useAppSelector(selectGetNewsById)

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
                        <img src={currentNews?.images[0]} className="dn-img" />
                    </div>
                    <div className="dnscr2">
                        <div className="dnscr2r1">
                            <h2>{currentNews?.newsTitle}</h2>
                        </div>
                        <div className="dnscr2r2">
                            <p>Giới thiệu</p>
                        </div>
                    </div>
                    <div className="dnscr3">
                        <div className="dnscr3r2">
                            <h4>Chi tiết tin tức</h4>
                            <PostContent
                                content={String(currentNews?.newsDescripttion)}
                            />
                            <h4>Đối tượng hỗ trợ</h4>
                            <p>{currentNews?.supportBeneficiaries}</p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default DetailNewsPage