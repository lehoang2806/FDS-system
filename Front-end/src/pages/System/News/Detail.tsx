import { selectGetNewsById } from "@/app/selector";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { setLoading } from "@/services/app/appSlice";
import { getNewsByIdApiThunk } from "@/services/news/newsThunk";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
// import { toast } from "react-toastify";
// import * as Yup from "yup";

const DetailNewsPage = () => {
    const { id } = useParams<{ id: string }>();

    const dispatch = useAppDispatch();
    const currentNews = useAppSelector(selectGetNewsById)

    // const initValuesNewsComment: ActionParamNewsComment = {
    //     newId: id,
    //     content: "",
    //     fileComment: "",
    // }

    // const newsCommentSchema = Yup.object().shape({
    //     content: Yup.string()
    //         .required("Content is required")
    //         .min(5, "Content must be at least 5 characters")
    //         .max(500, "Content must not exceed 500 characters"),
    // });

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

    // const onSubmitComment = (values: ActionParamNewsComment, helpers: FormikHelpers<ActionParamNewsComment>) => {
    //     dispatch(setLoading(true))
    //     dispatch(createNewsCommentApiThunk(values))
    //         .unwrap()
    //         .then(() => {
    //             helpers.resetForm();
    //             dispatch(getNewsByIdApiThunk(String(id)))
    //             toast.success("Bạn đã bình luận thành công")
    //         })
    //         .catch()
    //         .finally(() => {
    //             setTimeout(() => {
    //                 dispatch(setLoading(false))
    //             }, 1000)
    //         })
    // }

    // const onInterestNews = (newsId: string) => {
    //     dispatch(setLoading(true))
    //     dispatch(interestNewsApiThunk(newsId))
    //         .unwrap()
    //         .then(() => {
    //             dispatch(getNewsByIdApiThunk(String(id)))
    //             toast.success("Bạn đã quan tâm tin tức này")
    //         })
    //         .catch()
    //         .finally(() => {
    //             setTimeout(() => {
    //                 dispatch(setLoading(false))
    //             }, 1000)
    //         })
    // }

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
                        {/* <div className="dnscr3r1">
                            <p><span>5</span> người tham gia</p>
                        </div> */}
                        <div className="dnscr3r2">
                            <h4>Chi tiết tin tức</h4>
                            <p style={{ whiteSpace: "pre-line" }}>{currentNews?.newsDescripttion}</p>
                            <h4>Đối tượng hỗ trợ</h4>
                            <p>{currentNews?.supportBeneficiaries}</p>
                        </div>
                    </div>
                    {/* <div className="dnscr4">
                        <div className="dnscr4r1">
                            <h4>Bình luận</h4>
                            <Formik
                                initialValues={initValuesNewsComment}
                                onSubmit={onSubmitComment}
                                validationSchema={newsCommentSchema}
                            >
                                {({
                                    handleSubmit,
                                    values
                                }) => (
                                    <Form onSubmit={handleSubmit}>
                                        <div className="input-comment-container">
                                            <Field
                                                name="content"
                                                className="input-comment"
                                                type="text"
                                                placeholder="Thêm bình luận"
                                            />
                                            <button
                                                type="submit"
                                                className="send-btn"
                                                disabled={!values.content?.trim()}
                                            >
                                                <SendIcon
                                                    width={18}
                                                    height={18}
                                                    className="icon-comment"
                                                    style={{
                                                        color: values.content?.trim() ? "red" : "gray",
                                                        cursor: values.content?.trim() ? "pointer" : "not-allowed",
                                                    }}
                                                />
                                            </button>
                                        </div>
                                    </Form>
                                )
                                }
                            </Formik >
                        </div>
                        <div className="dnscr4r2">
                            <div className="comment-container">
                                <div className="cc-info">
                                    <p className="cc-name">Tên</p>
                                    <p className="cc-content">Bình luận</p>
                                    <p className='cc-time'>Thời gian</p>
                                </div>
                            </div>
                        </div>
                    </div> */}
                </div>
            </section>
        </main>
    )
}

export default DetailNewsPage