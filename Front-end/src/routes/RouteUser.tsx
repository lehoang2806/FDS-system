import LandingBasicLayout from "@/layout/System/LandingBasicLayout";
import { UserChangePasswordPage, UserNewPasswordPage, UserProfilePage, UserSubmitCertificatePage } from "@/pages/User";
import { RouteObject } from "react-router-dom";

const routeUser: RouteObject[] = [
    {
        path: "user",
        element: null,
        children: [
            {
                path: "profile",
                element: <LandingBasicLayout />,
                children: [
                    {
                        path: "",
                        element: <UserProfilePage/>
                    }
                ]
            },
            {
                path: "submit-certificate",
                element: <LandingBasicLayout />,
                children: [
                    {
                        path: "",
                        element: <UserSubmitCertificatePage/>
                    }
                ]
            },
            {
                path: "change-pass",
                element: <UserChangePasswordPage/>
            },
            {
                path: "new-pass",
                element: <UserNewPasswordPage/>
            }
        ]
    }
]

export default routeUser;