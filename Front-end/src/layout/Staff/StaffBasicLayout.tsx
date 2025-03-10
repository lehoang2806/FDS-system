import StaffHeader from '@/components/Staff/Header/Header'
import StaffSidebar from '@/components/Staff/Sidebar/Sidebar'
import { Outlet } from 'react-router-dom'

const StaffBasicLayout = () => {
  return (
    <>
        <StaffSidebar />
        <StaffHeader />
        <main id="staff" className='staff-collapsed'>
            <Outlet/>
        </main>
    </>
  )
}

export default StaffBasicLayout