import { selectGetDonateById, selectGetProfileUser } from "@/app/selector";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { navigateHook } from "@/routes/RouteApp";
import { routes } from "@/routes/routeName";
import { setLoading } from "@/services/app/appSlice";
import { getDonateByIdApiThunk } from "@/services/donate/donateThunk";
import { getProfileApiThunk } from "@/services/user/userThunk";
import { formatDater } from "@/utils/helper";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const StaffDetailDonatePage = () => {
    const { id } = useParams<{ id: string }>();

    const dispatch = useAppDispatch();

    const donate = useAppSelector(selectGetDonateById);
    const userProfile = useAppSelector(selectGetProfileUser);

    useEffect(() => {
        dispatch(setLoading(true));
        dispatch(getDonateByIdApiThunk(String(id)))
            .unwrap()
            .catch()
            .finally(() => {
                setTimeout(() => {
                    dispatch(setLoading(false));
                }, 1000);
            });
    }, [dispatch, id]);

    useEffect(() => {
        if (donate?.donorId) {
            dispatch(getProfileApiThunk(String(donate.donorId)));
        }
    }, [dispatch, donate?.donorId]);

    return (
        <section id="staff-detail-news" className="staff-section">
            <div className="staff-container sdn-container">
                <div className="sdncr1">
                    <h1>Tiền ủng hộ</h1>
                    <p>
                        Trang tổng quát
                        <span className="staff-tag">Chi tiết</span>
                    </p>
                </div>
                <div className="sdncr2">
                    <div className="sdncr2r1">
                        <div className="group-btn">
                            <button
                                onClick={() =>
                                    navigateHook(routes.staff.donate.list)
                                }
                            >
                                Quay lại danh sách
                            </button>
                        </div>
                    </div>
                    <hr />
                    <div className="sdncr2r2">
                        <div className="sdncr2r2c1"></div>
                        <div className="sdncr2r2c2">
                            <h3>Ngày tạo:</h3>
                            <p>{formatDater(String(donate?.createdAt))}</p>
                        </div>
                    </div>
                    <hr />
                    <div className="sdncr2r3">
                        <div className="sdncr2r3c1">
                            <h2>Thông tin người ủng hộ</h2>
                            <h3>Họ và tên:</h3>
                            <p>{userProfile?.fullName}</p>
                            <h3>Email:</h3>
                            <p>{userProfile?.email}</p>
                            <h3>Số điện thoại:</h3>
                            <p>{userProfile?.phone}</p>
                        </div>
                        <div className="sdncr2r3c2">
                            <h2>Thông tin ủng hộ</h2>
                            <h3>Tiền ủng hộ:</h3>
                            <p>{donate?.amount}</p>
                            <h3>Nội dung ủng hộ:</h3>
                            <p>{donate?.message}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default StaffDetailDonatePage;
