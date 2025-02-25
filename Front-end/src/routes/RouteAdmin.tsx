import AdminBasicLayout from "@/layout/Admin/AdminBasicLayout";
import { AdminDashboard } from "@/pages/Admin";
import { RouteObject } from "react-router-dom";

const routeAdmin: RouteObject[] = [
    {
        path: "admin",
        element: <AdminBasicLayout />,
        children: [
            {
                path: "",
                element: <AdminDashboard/>
            }
        ]
    }
]

export default routeAdmin;