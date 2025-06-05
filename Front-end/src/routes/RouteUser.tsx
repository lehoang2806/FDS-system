import LandingBasicLayout from "@/layout/System/LandingBasicLayout";
import {
    DetailRequestSupport,
    DonatePage,
    ParticipateRequestSupport,
    ReturnPage,
    UserChangePasswordPage,
    UserDetailCampaignPage,
    UserDetailCampaignRequestSupportForRecipientPage,
    UserDetailCampaignRequestSupportPage,
    UserDetailCertificate,
    UserNewPasswordPage,
    UserPersonalPage,
    UserProfilePage,
    UserSubmitCertificatePage,
} from "@/pages/User";
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
                        element: <UserProfilePage />,
                    },
                ],
            },
            {
                path: "submit-certificate",
                element: <LandingBasicLayout />,
                children: [
                    {
                        path: "",
                        element: <UserSubmitCertificatePage />,
                    },
                ],
            },
            {
                path: "personal",
                element: <LandingBasicLayout />,
                children: [
                    {
                        path: "",
                        element: <UserPersonalPage />,
                    },
                ],
            },
            {
                path: "campaign/:id/detail",
                element: <LandingBasicLayout />,
                children: [
                    {
                        path: "",
                        element: <UserDetailCampaignPage />,
                    },
                ],
            },
            {
                path: "certificate/:id/detail",
                element: <LandingBasicLayout />,
                children: [
                    {
                        path: "",
                        element: <UserDetailCertificate />,
                    },
                ],
            },
            {
                path: "requestSupport/:id/detail",
                element: <LandingBasicLayout />,
                children: [
                    {
                        path: "",
                        element: <DetailRequestSupport />,
                    },
                ],
            },
            {
                path: "participateRequestSupport/:id/detail",
                element: <LandingBasicLayout />,
                children: [
                    {
                        path: "",
                        element: <ParticipateRequestSupport />,
                    },
                ],
            },
            {
                path: "donate",
                element: <LandingBasicLayout />,
                children: [
                    {
                        path: "",
                        element: <DonatePage />,
                    },
                ],
            },
            {
                path: "return",
                element: <LandingBasicLayout />,
                children: [
                    {
                        path: "",
                        element: <ReturnPage />,
                    },
                ],
            },
            {
                path: "change-pass",
                element: <UserChangePasswordPage />,
            },
            {
                path: "new-pass",
                element: <UserNewPasswordPage />,
            },
            {
                path: "campaignRequestSupport/:id/detail",
                element: <LandingBasicLayout />,
                children: [
                    {
                        path: "",
                        element: <UserDetailCampaignRequestSupportPage />,
                    },
                ],
            },
            {
                path: "recipient/campaignRequestSupport/:id/detail",
                element: <LandingBasicLayout />,
                children: [
                    {
                        path: "",
                        element: <UserDetailCampaignRequestSupportForRecipientPage />,
                    },
                ],
            },
        ],
    },
];

export default routeUser;
