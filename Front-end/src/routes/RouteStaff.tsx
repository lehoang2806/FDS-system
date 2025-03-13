import { RouteObject } from "react-router-dom";
import StaffBasicLayout from "@/layout/Staff/StaffBasicLayout";
import { StaffDashboardPage } from "@/pages/Statff";
import { StaffDetailUserPage, StaffListUserPage } from "@/pages/Statff/User";
import { StaffAddCampaignStaffPage, StaffDetailCampaignStaffPage, StaffListCampaignStaffPage } from "@/pages/Statff/Campaign/Staff";
import { StaffDetailCampaignUserPage, StaffListCampaignUserPage } from "@/pages/Statff/Campaign/User";
import { StaffAddNewsPage, StaffDetailNewsPage, StaffListNewsPage } from "@/pages/Statff/News";
import { StaffListPostPage } from "@/pages/Statff/Post";
import { StaffListDonorCertificate } from "@/pages/Statff/Certificate/Donor";

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
            },
            {
                path: "news",
                element: <StaffListNewsPage />
            },
            {
                path: "news/add",
                element: <StaffAddNewsPage />
            },
            {
                path: "news/:id/detail",
                element: <StaffDetailNewsPage />
            },
            {
                path: "post",
                element: <StaffListPostPage />
            },
            {
                path: "certificate/donor",
                element: <StaffListDonorCertificate />
            }
        ],
    },
];

export default routeStatff;
