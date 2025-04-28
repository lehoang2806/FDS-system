import { selectIsAuthenticated, selectUserLogin } from "@/app/selector";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { LogoLanding } from "@/assets/images";
import { routes } from "@/routes/routeName"
import { getProfileApiThunk } from "@/services/user/userThunk";
import { useEffect } from "react";
import { Link } from "react-router-dom"

const FooterLanding = () => {
    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const userLogin = useAppSelector(selectUserLogin);

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(getProfileApiThunk(String(userLogin?.accountId)))
                .unwrap();
        }
    }, [isAuthenticated]);

    const footers = [
        {
            title: "Chiến dịch", links: [
                {
                    label: "Tất cả",
                    to: routes.user.campaign.list
                },
                {
                    label: "Tổ chức",
                    to: `${routes.user.campaign.list}?tab=2`
                },
                {
                    label: "Cá nhân",
                    to: `${routes.user.campaign.list}?tab=1`
                }
            ]
        },
        {
            title: "Tin tức", links: [
                { to: routes.user.news.list, label: "Tất cả" }
            ]
        },
        {
            title: "Bảng tin", links: [
                { to: routes.user.post.forum, label: "Tất cả" }
            ]
        },
        {
            title: "Giới thiệu", links: [
                { to: "/about", label: "Về chúng tôi" },
                { to: "/contact", label: "Liên hệ" }
            ]
        }
    ];

    return (
        <main id="footer-landing">
            <section id="fl-section">
                <div className="fls-container">
                    <div className="flscc1">
                        <img src={LogoLanding} alt="" />
                        <p>FDS System - Hệ thống hỗ trợ thực phẩm cho các cá nhân có thu nhập thấp.</p>
                        <p><span className="text-black">Địa chỉ: </span><span>Hoà Xuân, Cẩm Lệ, Đà Nẵng</span></p>
                        <p><span className="text-black">Số điện thoại: </span><span className="text-orange">0898530964</span></p>
                        <p><span className="text-black">Email: </span><span className="text-orange">tuanpcl7103@gmail.com</span></p>
                    </div>
                    <div className="flscc2">
                        {footers.map((footer, index) => (
                            <div className="flscc2c" key={index}>
                                <h4>{footer.title}</h4>
                                <ul>
                                    {footer.links.map((link, idx) => (
                                        <li key={idx}><Link to={link.to}>{link.label}</Link></li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                    <div className="flscc3">
                        <h4>Liên hệ với chúng tôi</h4>
                    </div>
                </div>
            </section>
            <div className="copyright">
                © Bản quyền thuộc về <span className="text-black">FDS-System</span> | Cung cấp bởi <span className="text-black">FPT</span>
            </div>
        </main>
    )
}

export default FooterLanding