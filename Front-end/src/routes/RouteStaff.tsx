import AddCampaign from "@/pages/Statff/staff/AddCampaign";
import AddNewsPage from "@/pages/Statff/staff/AddNews";
import CampaignDashboard from "@/pages/Statff/staff/CampaignDashboard";
import ViewNews from "@/pages/Statff/staff/ViewNews";
import ViewUser from "@/pages/Statff/staff/ViewUser";
import { LoginPage } from "@/pages/System";
import { RouteObject } from "react-router-dom";

const routeStatff: RouteObject[] = [
    {
        path: "staff",
        element: null,
        children: [
            {
                path: "AddNews",
                element: <AddNewsPage />,
               
            },
            {
                path: "AddCampaign",
                element: <AddCampaign/>
            },
            {
                path: "LoginPage",
                element: <LoginPage/>
            },
            {
                path: "ViewNews",
                element: <ViewNews/>
            },
            {
                path: "ViewUser",
                element: <ViewUser/>
            },
            {
                path: "CampaignDashboard",
                element: <CampaignDashboard/>
            }
        ]
    }
]

export default routeStatff;