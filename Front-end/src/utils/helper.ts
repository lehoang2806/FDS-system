import { routes } from "@/routes/routeName";

export const logout = () => {
    localStorage.clear();


    window.location.href = routes.user.home; 
};

export const logoutManager = () => {
    localStorage.clear();


    window.location.href = routes.admin_login; 
};