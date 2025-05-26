import { RouteObject } from "react-router-dom";
import StaffBasicLayout from "@/layout/Staff/StaffBasicLayout";
import { StaffDashboardPage } from "@/pages/Statff";
import { StaffDetailUserPage, StaffListUserPage } from "@/pages/Statff/User";
import { StaffAddCampaignStaffPage, StaffDetailCampaignStaffPage, StaffListCampaignStaffPage } from "@/pages/Statff/Campaign/Staff";
import { StaffDetailCampaignUserPage, StaffListCampaignUserPage } from "@/pages/Statff/Campaign/User";
import { StaffAddNewsPage, StaffDetailNewsPage, StaffListNewsPage, StaffUpdateNewsPage } from "@/pages/Statff/News";
import { StaffDetailPostPage, StaffListPostPage } from "@/pages/Statff/Post";
import { StaffDetailDonorCertificate, StaffListDonorCertificate } from "@/pages/Statff/Certificate/Donor";
import { StaffDetailCertificateRecipient, StaffListRecipientCertificate } from "@/pages/Statff/Certificate/Recipient";
import { StaffDetailRequestSupportPage, StaffListRequestSupportPage } from "@/pages/Statff/RequestSupport";
import { StaffChatWithUserPage } from "@/pages/Statff/Chat";
import { StaffDetailDonatePage, StaffListDonatePage } from "@/pages/Statff/Donate";

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
                path: "news/:id/update",
                element: <StaffUpdateNewsPage />
            },
            {
                path: "post",
                element: <StaffListPostPage />
            },
            {
                path: "post/:id/detail",
                element: <StaffDetailPostPage />
            },
            {
                path: "certificate/donor",
                element: <StaffListDonorCertificate />
            },
            {
                path: "certificate/donor/:id/detail",
                element: <StaffDetailDonorCertificate />
            },
            {
                path: "certificate/recipient",
                element: <StaffListRecipientCertificate />
            },
            {
                path: "certificate/recipient/:id/detail",
                element: <StaffDetailCertificateRecipient />
            },
            {
                path: "requestSupport",
                element: <StaffListRequestSupportPage />
            },
            {
                path: "requestSupport/:id/detail",
                element: <StaffDetailRequestSupportPage />
            },
            {
                path: "chat",
                element: <StaffChatWithUserPage />
            },
            {
                path: "donate",
                element: <StaffListDonatePage />
            },
            {
                path: "donate/:id/detail",
                element: <StaffDetailDonatePage />
            },
        ],
    },
];

export default routeStatff;
