import { StaffAddCampaignPage, StaffAddNewsPage, StaffCampaignDashboard, StaffUserDetailPage, StaffViewNewsPage } from "@/pages/Statff/staff";
import { RouteObject } from "react-router-dom";

const routeStatff: RouteObject[] = [
    {
        path: "staff",
        element: null,
        children: [
            {
                path: "campaign",
                element: <StaffCampaignDashboard/>
            },
            {
                path: "campaign/add",
                element: <StaffAddCampaignPage/>
            },
            {
                path: 'news',
                element: <StaffViewNewsPage/>
            },
            {
                path: 'news/add',
                element: <StaffAddNewsPage/>
            },
            {
                path: 'user/:id/detail',
                element: <StaffUserDetailPage/>
            }
        ]
    }
]

export default routeStatff;