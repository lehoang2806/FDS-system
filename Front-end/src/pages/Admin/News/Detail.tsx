import { selectGetNewsById } from '@/app/selector'
import { useAppDispatch, useAppSelector } from '@/app/store'
import { navigateHook } from '@/routes/RouteApp'
import { routes } from '@/routes/routeName'
import { setLoading } from '@/services/app/appSlice'
import { getNewsByIdApiThunk } from '@/services/news/newsThunk'
import { formatDater } from '@/utils/helper'
import { FC, useEffect, useState } from 'react'
import Lightbox from 'react-awesome-lightbox'
import { useParams } from 'react-router-dom'

const AdminDetailNewsPage: FC = () => {
    const { id } = useParams<{ id: string }>();

    const dispatch = useAppDispatch();
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

    const [imagePreview, setImagePreview] = useState<string[]>([]);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    useEffect(() => {
        if (currentNews?.images?.length) {
            setImagePreview(currentNews.images);
        } else {
            setImagePreview([]);
        }
    }, [currentNews]);

    return (
        <section id="admin-detail-news" className="admin-section">
            <div className="admin-container adn-container">
                <div className="adncr1">
                    <h1>Tin tức</h1>
                    <p>Trang tổng quát<span className="admin-tag">Chi tiết tin tức</span></p>
                </div>
                <div className="adncr2">
                    <div className="adncr2r1">
                        <div className="group-btn">
                            <button onClick={() => navigateHook(routes.admin.news.list)}>Quay lại danh sách</button>
                        </div>
                    </div>
                    <hr />
                    <div className="adncr2r2">
                        <div className="adncr2r2c1">
                        </div>
                        <div className="adncr2r2c2">
                            <h3>Ngày tạo:</h3>
                            <p>{formatDater(String(createDate))}</p>
                        </div>
                    </div>
                    <hr />
                    <div className="adncr2r3">
                        <div className="adncr2r3c1">
                            <h3>Tiểu đề:</h3>
                            <p>{currentNews?.newsTitle}</p>
                            <h3>Mô tả:</h3>
                            <p style={{ whiteSpace: "pre-line" }}>{currentNews?.newsDescripttion}</p>
                            <h3>Đối tượng hỗ trợ:</h3>
                            <p>{currentNews?.supportBeneficiaries}</p>
                        </div>
                    </div>
                    <div className="adncr2r4">
                        {imagePreview.length > 0 && (
                            <div className="image-preview-container">
                                {imagePreview.map((img, index) => (
                                    <img
                                        key={index}
                                        src={img}
                                        alt={`Preview ${index}`}
                                        className="image-preview"
                                        style={{ width: "200px", height: "200px", cursor: "pointer" }}
                                        onClick={() => setLightboxIndex(index)} // Thêm dòng này để mở Lightbox
                                    />
                                ))}
                            </div>
                        )}

                        {lightboxIndex !== null && (
                            <Lightbox
                                images={imagePreview.map((src) => ({ url: src }))}
                                startIndex={lightboxIndex}
                                onClose={() => setLightboxIndex(null)}
                            />
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default AdminDetailNewsPage