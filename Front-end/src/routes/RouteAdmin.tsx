import AdminBasicLayout from "@/layout/Admin/AdminBasicLayout";
import { AdminDashboardPage } from "@/pages/Admin";
import { AdminAddStaffPage, AdminListStaffPage } from "@/pages/Admin/Staff";
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
                path: "staff",
                element: <AdminListStaffPage/>
            },
            {
                path: "staff/add",
                element: <AdminAddStaffPage/>
            }
        ]
    }
]

export default routeAdmin;