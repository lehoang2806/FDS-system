import { createBrowserRouter, RouterProvider, To } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import routeStatff from "./RouteStaff";
import { ForgotPasswordPage, LandingPage, LoginPage, ManageLogin, NewPasswordPage, NotFoundPage, OTPAuthPage, RegisterPage, UnauthorizedPage } from "../pages/System/index";
import LandingBasicLayout from "../layout/System/LandingBasicLayout";
import { DetailCampaignPage, ListCampaignPage } from "@/pages/System/Campaign";
import { DetailSupporterPage, ListSupporterPage } from "@/pages/System/Supporter";
import { DetailNewsPage, ListNewsPage } from "@/pages/System/News";
import routeUser from "./RouteUser";
import { PostForumPage } from "@/pages/System/Post";
import routeAdmin from "./RouteAdmin";
import { useAppSelector } from "@/app/store";
import { selectLoading } from "@/app/selector";
import { Loading } from "@/components/Elements";

export default function () {
    const loading = useAppSelector(selectLoading);
    return (
        <Fragment>
            <Loading loading={loading} isFullPage />
            <RouterProvider router={routerRoot} />
        </Fragment>
    )
}

export const routerRoot = createBrowserRouter([
    {
        path: "",
        element: <LandingBasicLayout/>,
        children: [
            {
                path: "",
                element: <LandingPage/>
            },
            {
                path: "campaigns",
                element: <ListCampaignPage/>
            },
            {
                path: "campaign/:id/detail",
                element: <DetailCampaignPage/>
            },
            {
                path: "supporters",
                element: <ListSupporterPage/>
            },
            {
                path: "supporter/:id/detail",
                element: <DetailSupporterPage/>
            },
            {
                path: "news",
                element: <ListNewsPage/>
            },
            {
                path: "news/:id/detail",
                element: <DetailNewsPage/>
            },
            {
                path: "posts",
                element: <PostForumPage/>
            }
        ]
    },
    ...routeStatff,
    ...routeUser,
    ...routeAdmin,
    {
        path: "403",
        element: <UnauthorizedPage />
    },
    {
        path: "*",
        element: <NotFoundPage />,
    },
    {
        path: "login",
        element: <LoginPage/>
    },
    {
        path: "manage/login",
        element: <ManageLogin/>
    },
    {
        path: "register",
        element: <RegisterPage/>
    },
    {
        path: "otp-auth",
        element: <OTPAuthPage/>
    },
    {
        path: "forgot-pass",
        element: <ForgotPasswordPage/>
    },
    {
        path: "new-pass",
        element: <NewPasswordPage/>
    },
], {
    future: {
        v7_fetcherPersist: true,
        v7_normalizeFormMethod: true,
        v7_partialHydration: true,
        v7_relativeSplatPath: true,
        v7_skipActionErrorRevalidation: true
    }
})

export const navigateHook = (path: To, opts?: any) => {
    routerRoot.navigate(path, opts);
}