import { ArrowRight, CampaignIcon, DashboardtIcon, LogoutIcon, NewsIcon, StaffIcon, UserIcon } from '@/assets/icons';
import { FC, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import { routes } from '@/routes/routeName';
import { logoutManager } from '@/utils/helper';
import { Logo } from '@/assets/images';

const AdminSidebar: FC = () => {
    const location = useLocation();

    const sidebarRef = useRef<HTMLDivElement | null>(null);

    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const handleDropdownToggle = (event: React.MouseEvent<HTMLElement>) => {
        const dropdown = event.currentTarget.nextElementSibling as HTMLElement;
        dropdown.classList.toggle('open');

        const arrowIcon = event.currentTarget.querySelector('.ascr2-arrow') as HTMLElement;
        arrowIcon.classList.toggle('rotate-180');
    };

    const handleHover = () => {
        if (sidebarRef.current && sidebarRef.current.classList.contains('sidebar-collapsed')) {
            sidebarRef.current.classList.add('sidebar-expanded');
        }
    };

    const handleMouseOut = () => {
        if (sidebarRef.current && sidebarRef.current.classList.contains('sidebar-collapsed')) {
            sidebarRef.current.classList.remove('sidebar-expanded');
        }
    };

    return (
        <nav id="admin-sidebar" className='as-expanded' ref={sidebarRef} onMouseEnter={handleHover} onMouseLeave={handleMouseOut}>
            <div className="as-container">
                <div className="ascr1">
                    <img src={Logo} alt="" className='as-logo' />
                </div>

                <div className="ascr2">
                    <Link
                        to={routes.admin.dashboard}
                        className={classNames('ascr2-nav-item', {
                            'nav-active': location.pathname === routes.admin.dashboard,
                        })}
                    >
                        <div className="ascr2-nav-link">
                            <DashboardtIcon className="ascr2-nav-icon" />
                            <span>Trang tổng quan</span>
                        </div>
                    </Link>
                    <Link
                        to={routes.admin.staff.list}
                        className={classNames('ascr2-nav-item', {
                            'nav-active': location.pathname.startsWith(routes.admin.staff.list),
                        })}
                    >
                        <div className="ascr2-nav-link">
                            <StaffIcon className="ascr2-nav-icon" />
                            <span>Nhân viên</span>
                        </div>
                    </Link>
                    <div
                        className="ascr2-nav-item ascr2-nav-dropdown"
                        onClick={handleDropdownToggle}
                    >
                        <CampaignIcon className="ascr2-nav-icon" />
                        <span>Chiến dịch</span>
                        <ArrowRight className={`mg-left-auto ascr2-arrow`} />
                    </div>
                    <div ref={dropdownRef} className={classNames("ascr2-nav-dropdown-content", {
                        'open': location.pathname.startsWith(routes.admin.campaign.list),
                    })}>
                        <Link
                            to={routes.admin.campaign.list}
                            className={classNames('ascr2-nav-item', {
                                'nav-active': location.pathname.startsWith(routes.admin.campaign.list) &&
                                    !location.pathname.startsWith(routes.admin.campaign.staff.list) &&
                                    !location.pathname.startsWith(routes.admin.campaign.donor.list),
                            })}
                        >
                            <div className="ascr2-nav-link">
                                <StaffIcon className="ascr2-nav-icon" />
                                <span>Tất cả</span>
                            </div>
                        </Link>
                        <Link
                            to={routes.admin.campaign.staff.list}
                            className={classNames('ascr2-nav-item', {
                                'nav-active': location.pathname.startsWith(routes.admin.campaign.staff.list),
                            })}
                        >
                            <div className="ascr2-nav-link">
                                <StaffIcon className="ascr2-nav-icon" />
                                <span>Nhân viên</span>
                            </div>
                        </Link>
                        <Link
                            to={routes.admin.campaign.donor.list}
                            className={classNames('ascr2-nav-item', {
                                'nav-active': location.pathname.startsWith(routes.admin.campaign.donor.list),
                            })}
                        >
                            <div className="ascr2-nav-link">
                                <UserIcon className="ascr2-nav-icon" />
                                <span>Người hiến tặng thực phẩm</span>
                            </div>
                        </Link>
                    </div>
                    <Link
                        to={routes.admin.news.list}
                        className={classNames('ascr2-nav-item', {
                            'nav-active': location.pathname.startsWith(routes.admin.news.list),
                        })}
                    >
                        <div className="ascr2-nav-link">
                            <NewsIcon className="ascr2-nav-icon" />
                            <span>Tin tức</span>
                        </div>
                    </Link>
                    <Link
                        to={""}
                        onClick={logoutManager}
                        className='ascr2-nav-item'
                    >
                        <div className="ascr2-nav-link">
                            <LogoutIcon className="ascr2-nav-icon" />
                            <span>Đăng xuất</span>
                        </div>
                    </Link>
                </div>
            </div>
        </nav>
    );
}

export default AdminSidebar