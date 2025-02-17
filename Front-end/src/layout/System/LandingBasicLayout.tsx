import { Outlet } from "react-router-dom"
import { HeaderLanding } from "../../components/Header"
import { FC } from "react"

const LandingBasicLayout: FC = () => {
    return (
        <>
            <HeaderLanding isLogin={true}/>
            <main id="landing">
                <Outlet/>
            </main>
        </>
    )
}

export default LandingBasicLayout