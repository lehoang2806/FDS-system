import { routes } from "@/routes/routeName";

export const logout = () => {
    localStorage.clear();

    window.location.href = routes.user.home;
};

export const logoutManager = () => {
    localStorage.clear();

    window.location.href = routes.admin_login;
};

export const formatDater = (date: string) => {
    const newDate = new Date(date);
    const day = newDate.getDate();
    const month = newDate.getMonth() + 1;
    const year = newDate.getFullYear();
    return `${day}/${month}/${year}`;
};

export const formatTime = (date: string) => {
    const newDate = new Date(date);
    const hours = newDate.getHours().toString().padStart(2, "0");
    const minutes = newDate.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
};

export const isOver24h = (createDate: string) => {
    const now = new Date();
    const created = new Date(createDate);
    const diff = now.getTime() - created.getTime();
    return diff >= 24 * 60 * 60 * 1000; // 24h tính theo milliseconds
};

export const formatNumberWithDot = (value: number | string): string => {
    const num = typeof value === "string" ? Number(value) : value;
    if (isNaN(num)) return "0";
    return new Intl.NumberFormat("vi-VN").format(num);
};
