import AdminBasicLayout from "@/layout/Admin/AdminBasicLayout";
import { AdminDashboardPage } from "@/pages/Admin";
import { AdminListStaffPage } from "@/pages/Admin/Staff";
import { RouteObject } from "react-router-dom";

const routeAdmin: RouteObject[] = [
    {
        path: "admin",
        element: <AdminBasicLayout />,
        children: [
            {
                path: "",
                element: <AdminDashboardPage/>
            },
            {
                path: "staff/list",
                element: <AdminListStaffPage/>
            }
        ]
    }
]

export default routeAdmin;