import AdminBasicLayout from "@/layout/Admin/AdminBasicLayout";
import { AdminDashboardPage } from "@/pages/Admin";
import { AdminDetailCampaignPage, AdminListCampaignPage } from "@/pages/Admin/Campaign";
import { AdminDetailCampaignDonorPage, AdminListCampaignDonorPage } from "@/pages/Admin/Campaign/Donor";
import { AdminDetailCampaignStaffPage, AdminListCampaignStaffPage } from "@/pages/Admin/Campaign/Staff";
import { AdminDetailNewsPage, AdminListNewsPage } from "@/pages/Admin/News";
import { AdminForumPostPage, AdminStaffPostPage, AdminUserPostPage } from "@/pages/Admin/Post";
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
                path: "campaign",
                element: <AdminListCampaignPage/>
            },
            {
                path: "campaign/:id/detail",
                element: <AdminDetailCampaignPage/>
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
            {
                path: "news",
                element: <AdminListNewsPage/>
            },
            {
                path: "news/:id/detail",
                element: <AdminDetailNewsPage/>
            },
            {
                path: "post",
                element: <AdminForumPostPage/>
            },
            {
                path: "post/user",
                element: <AdminUserPostPage/>
            },
            {
                path: "post/staff",
                element: <AdminStaffPostPage/>
            }
        ]
    }
]

export default routeAdmin;