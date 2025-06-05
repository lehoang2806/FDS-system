import { logout } from "@/utils/helper";
import { useEffect } from "react";

export default function () {
    useEffect(() => {
        const timer = setTimeout(() => {
            logout();
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div>
            <h1>403 Unauthorized</h1>
        </div>
    );
}
