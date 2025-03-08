import {
  StaffAddCampaignPage,
  StaffAddNewsPage,
  StaffCampaignDashboard,
  StaffUserListPage,
  StaffUserDetailPage,
  StaffViewNewsPage,
  LoginPage,
} from "@/pages/Statff/staff";
import { RouteObject } from "react-router-dom";
import LandingBasicLayout from "../layout/System/LandingBasicLayout";
// import StaffUserDetailPage from "@/pages/Statff/staff/UserDetail";

const routeStatff: RouteObject[] = [
  {
    path: "staff",
    element: <LandingBasicLayout />,
    children: [
      {
        path: "Login",
        element: <LoginPage />,
      },
      {
        path: "campaign",
        element: <StaffCampaignDashboard />,
      },
      {
        path: "campaign/add",
        element: <StaffAddCampaignPage />,
      },
      {
        path: "news",
        element: <StaffViewNewsPage />,
      },
      {
        path: "news/add",
        element: <StaffAddNewsPage />,
      },
      {
        path: "user",
        element: <StaffUserListPage />,
      },
      {
        path: "user/detail",
        element: <StaffUserDetailPage />,
      },
    ],
  },
];

export default routeStatff;
