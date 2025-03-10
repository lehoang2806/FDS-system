// import {
//   StaffAddCampaignPage,
//   StaffAddNewsPage,
//   StaffCampaignDashboard,
//   StaffUserListPage,
//   StaffUserDetailPage,
//   StaffViewNewsPage,
// } from "@/pages/Statff/staff";
import { RouteObject } from "react-router-dom";
import StaffBasicLayout from "@/layout/Staff/StaffBasicLayout";
import { StaffDashboardPage } from "@/pages/Statff";
import { StaffDetailUserPage, StaffListUserPage } from "@/pages/Statff/User";
import { StaffAddCampaignStaffPage, StaffDetailCampaignStaffPage, StaffListCampaignStaffPage } from "@/pages/Statff/Campaign/Staff";
import { StaffDetailCampaignUserPage, StaffListCampaignUserPage } from "@/pages/Statff/Campaign/User";

const routeStatff: RouteObject[] = [
    {
        path: "staff",
        element: <StaffBasicLayout />,
        children: [
            {
                path: "",
                element: <StaffDashboardPage />,
            },
            {
                path: "user",
                element: <StaffListUserPage />,
            },
            {
                path: "user/:id/detail",
                element: <StaffDetailUserPage />,
            },
            {
                path: "campaign/staff",
                element: <StaffListCampaignStaffPage />,
            },
            {
                path: "campaign/staff/add",
                element: <StaffAddCampaignStaffPage />,
            },
            {
                path: "campaign/staff/:id/detail",
                element: <StaffDetailCampaignStaffPage />,
            },
            {
                path: "campaign/user",
                element: <StaffListCampaignUserPage />,
            },
            {
                path: "campaign/user/:id/detail",
                element: <StaffDetailCampaignUserPage />,
            }
        ],
    },
];

export default routeStatff;
