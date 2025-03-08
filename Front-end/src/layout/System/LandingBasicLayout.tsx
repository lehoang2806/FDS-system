import { Outlet } from "react-router-dom"
import { HeaderLanding } from "../../components/Header/index"
import { FC } from "react"
import { FooterLanding } from "@/components/Footer"
import { useAppSelector } from "@/app/store"
import { selectIsAuthenticated } from "@/app/selector"

const LandingBasicLayout: FC = () => {
    const isAuthenticated = useAppSelector(selectIsAuthenticated);

    return (
        <>
            <HeaderLanding isLogin={isAuthenticated}/>
            <main id="landing">
                <Outlet/>
            </main>
            <FooterLanding/>
        </>
    )
}

export default LandingBasicLayout