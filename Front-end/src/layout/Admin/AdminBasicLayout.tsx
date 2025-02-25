import AdminHeader from '@/components/Admin/Header/Header'
import AdminSidebar from '@/components/Admin/SideBar/Sidebar'
import { Outlet } from 'react-router-dom'

const AdminBasicLayout = () => {
  return (
    <>
        <AdminSidebar />
        <AdminHeader />
        <main id="admin" className='admin-collapsed'>
            <Outlet/>
        </main>
    </>
  )
}

export default AdminBasicLayout