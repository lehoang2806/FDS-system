import { createBrowserRouter, RouterProvider, To } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import routeStatff from "./RouteStaff";
import { NotFoundPage, UnauthorizedPage } from "../pages/System";
import routeDonor from "./RouteDonor";
import routeRecipient from "./RouteRecipient";

export default function () {
    return (
        <Fragment>
            <RouterProvider router={routerRoot} />
        </Fragment>
    )
}

export const routerRoot = createBrowserRouter([
    {
        path: "/",
        element: <h1>Home</h1>
    },
    ...routeStatff,
    ...routeDonor,
    ...routeRecipient,
    {
        path: "403",
        element: <UnauthorizedPage />
    },
    {
        path: "*",
        element: <NotFoundPage />,
    }
], {
    future: {
        v7_fetcherPersist: true,
        v7_normalizeFormMethod: true,
        v7_partialHydration: true,
        v7_relativeSplatPath: true,
        v7_skipActionErrorRevalidation: true
    }
})

export const navigateHook = (path: To, opts?: any) => {
    routerRoot.navigate(path, opts);
}