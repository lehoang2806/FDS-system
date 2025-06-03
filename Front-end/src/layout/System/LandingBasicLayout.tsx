import { Outlet } from "react-router-dom";
import { HeaderLanding } from "../../components/Header/index";
import { FC } from "react";
import { FooterLanding } from "@/components/Footer";
import { useAppSelector } from "@/app/store";
import { selectIsAuthenticated, selectUserLogin } from "@/app/selector";
import { ChatIcon } from "@/components/Elements";
import Unauthorized from "@/pages/System/Unauthorized";

const LandingBasicLayout: FC = () => {
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const userLogin = useAppSelector(selectUserLogin);

    if (userLogin?.roleId === 1 || userLogin?.roleId === 2) {
        return <Unauthorized />;
    }

    return (
        <div style={{ position: "relative" }}>
            <HeaderLanding isLogin={isAuthenticated} />
            <main id="landing">
                <Outlet />
            </main>
            <FooterLanding />
            {isAuthenticated && <ChatIcon />}
        </div>
    );
};

export default LandingBasicLayout;
