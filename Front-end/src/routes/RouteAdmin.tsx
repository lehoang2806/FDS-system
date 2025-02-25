import AdminBasicLayout from "@/layout/Admin/AdminBasicLayout";
import { AdminDashboardPage } from "@/pages/Admin";
import { RouteObject } from "react-router-dom";

const routeAdmin: RouteObject[] = [
    {
        path: "admin",
        element: <AdminBasicLayout />,
        children: [
            {
                path: "",
                element: <AdminDashboardPage/>
            }
        ]
    }
]

export default routeAdmin;