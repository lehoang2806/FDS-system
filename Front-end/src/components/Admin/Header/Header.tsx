import { MenuIcon } from "@/assets/icons";
import { FC } from "react"

const AdminHeader: FC = () => {
    const toggleSidebar = () => {
        const sidebar = document.getElementById('admin-sidebar');
        const backOffice = document.getElementById('admin');
        const header = document.getElementById('admin-header');
        if (sidebar) {
            sidebar.classList.toggle('as-expanded');
            sidebar.classList.toggle('as-collapsed');
        }
        if (backOffice) {
            backOffice.classList.toggle('admin-expanded');
            backOffice.classList.toggle('admin-collapsed');
        }
        if (header) {
            header.classList.toggle('ah-expanded');
            header.classList.toggle('ah-collapsed');
        }
    };

    return (
        <header id='admin-header' className='ah-collapsed'>
            <div className="ah-container">
                <div className="ahcc1">
                    <MenuIcon className='ah-icon' onClick={toggleSidebar} />
                </div>
            </div>
        </header>
    )
}

export default AdminHeader