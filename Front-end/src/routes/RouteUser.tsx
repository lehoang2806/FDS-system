import LandingBasicLayout from "@/layout/System/LandingBasicLayout";
import { UserProfilePage } from "@/pages/User";
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
            }
        ]
    }
]

export default routeUser;