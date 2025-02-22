import { routes } from "@/routes/routeName"
import { Link } from "react-router-dom"

const FooterLanding = () => {
    const footers = [
        {
            title: "Ủng hộ", links: [
                { to: routes.user.campaign.list, label: "Chiến dịch" },
                { to: routes.user.supporter.list, label: "Tổ chức, cá nhân ủng hộ" }
            ]
        },
        {
            title: "Khám phá", links: [
                { to: "", label: "Bản tin" },
                { to: routes.user.news.list, label: "Tin tức" }
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
                        Logo
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
                </div>
            </section>
        </main>
    )
}

export default FooterLanding