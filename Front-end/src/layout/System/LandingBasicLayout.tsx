import { Outlet } from "react-router-dom"
import { HeaderLanding } from "../../components/Header/index"
import { FC } from "react"
import { FooterLanding } from "@/components/Footer"

const LandingBasicLayout: FC = () => {
    return (
        <>
            <HeaderLanding isLogin={true}/>
            <main id="landing">
                <Outlet/>
            </main>
            <FooterLanding/>
        </>
    )
}

export default LandingBasicLayout