import AdminBasicLayout from "@/layout/Admin/AdminBasicLayout";
import { AdminDashboardPage } from "@/pages/Admin";
import { AdminDetailCampaignDonorPage, AdminListCampaignDonorPage } from "@/pages/Admin/Campaign/Donor";
import { AdminDetailCampaignStaffPage, AdminListCampaignStaffPage } from "@/pages/Admin/Campaign/Staff";
import { AdminAddStaffPage, AdminDetailStaffPage, AdminListStaffPage } from "@/pages/Admin/Staff";
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
            },
            {
                path: "staff/:id/detail",
                element: <AdminDetailStaffPage/>
            },
            {
                path: "campaign/staff",
                element: <AdminListCampaignStaffPage/>
            },
            {
                path: "campaign/staff/:id/detail",
                element: <AdminDetailCampaignStaffPage/>
            },
            {
                path: "campaign/donor",
                element: <AdminListCampaignDonorPage/>
            },
            {
                path: "campaign/donor/:id/detail",
                element: <AdminDetailCampaignDonorPage/>
            },
        ]
    }
]

export default routeAdmin;