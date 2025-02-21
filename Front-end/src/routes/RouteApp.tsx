import { createBrowserRouter, RouterProvider, To } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import routeStatff from "./RouteStaff";
import { LandingPage, LoginPage, NotFoundPage, OTPAuthPage, RegisterPage, UnauthorizedPage } from "../pages/System";
import routeDonor from "./RouteDonor";
import routeRecipient from "./RouteRecipient";
import LandingBasicLayout from "../layout/System/LandingBasicLayout";
import { DetailCampaignPage, ListCampaignPage } from "@/pages/System/Campaign";

export default function () {
    return (
        <Fragment>
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
            }
        ]
    },
    ...routeStatff,
    ...routeDonor,
    ...routeRecipient,
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
        path: "register",
        element: <RegisterPage/>
    },
    {
        path: "otp-auth",
        element: <OTPAuthPage/>
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