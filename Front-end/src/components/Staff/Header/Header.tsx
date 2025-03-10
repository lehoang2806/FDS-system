import { MenuIcon } from "@/assets/icons";
import { FC } from "react"

const StaffHeader: FC = () => {
    const toggleSidebar = () => {
        const sidebar = document.getElementById('staff-sidebar');
        const backOffice = document.getElementById('staff');
        const header = document.getElementById('staff-header');
        if (sidebar) {
            sidebar.classList.toggle('ss-expanded');
            sidebar.classList.toggle('ss-collapsed');
        }
        if (backOffice) {
            backOffice.classList.toggle('staff-expanded');
            backOffice.classList.toggle('staff-collapsed');
        }
        if (header) {
            header.classList.toggle('sh-expanded');
            header.classList.toggle('sh-collapsed');
        }
    };

    return (
        <header id='staff-header' className='sh-collapsed'>
            <div className="sh-container">
                <div className="shcc1">
                    <MenuIcon className='sh-icon' onClick={toggleSidebar} />
                </div>
            </div>
        </header>
    )
}

export default StaffHeader