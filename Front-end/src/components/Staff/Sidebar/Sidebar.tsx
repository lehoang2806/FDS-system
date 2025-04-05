import { CampaignIcon, CertificateIcon, DashboardtIcon, LogoutIcon, NewsIcon, PostIcon, StaffIcon, UserIcon } from '@/assets/icons';
import { FC, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import { routes } from '@/routes/routeName';
import { logoutManager } from '@/utils/helper';

const StaffSidebar: FC = () => {
    const location = useLocation();

    const sidebarRef = useRef<HTMLDivElement | null>(null);

    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const handleDropdownToggle = (event: React.MouseEvent<HTMLElement>) => {
        const dropdown = event.currentTarget.nextElementSibling as HTMLElement;
        dropdown.classList.toggle('open');
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
        <nav id="staff-sidebar" className='ss-expanded' ref={sidebarRef} onMouseEnter={handleHover} onMouseLeave={handleMouseOut}>
            <div className="ss-container">
                <div className="sscr1">
                    <p className='ss-logo'>Logo</p>
                </div>

                <div className="sscr2">
                    <Link
                        to={routes.staff.dashboard}
                        className={classNames('sscr2-nav-item', {
                            'nav-active': location.pathname === routes.staff.dashboard,
                        })}
                    >
                        <div className="sscr2-nav-link">
                            <DashboardtIcon className="sscr2-nav-icon" />
                            <span>Trang tổng quan</span>
                        </div>
                    </Link>
                    <Link
                        to={routes.staff.user.list}
                        className={classNames('sscr2-nav-item', {
                            'nav-active': location.pathname.startsWith(routes.staff.user.list),
                        })}
                    >
                        <div className="sscr2-nav-link">
                            <UserIcon className="sscr2-nav-icon" />
                            <span>Người dùng</span>
                        </div>
                    </Link>
                    <div
                        className="sscr2-nav-item asrc2-nav-dropdown"
                        onClick={handleDropdownToggle}
                    >
                        <CampaignIcon className="sscr2-nav-icon" />
                        <span>Chiến dịch</span>
                    </div>
                    <div ref={dropdownRef} className={classNames("ssrc2-nav-dropdown-content", {
                        'open': location.pathname.startsWith(routes.staff.campaign.staff.list || routes.staff.campaign.user.list),
                    })}>
                        <Link
                            to={routes.staff.campaign.staff.list}
                            className={classNames('sscr2-nav-item', {
                                'nav-active': location.pathname.startsWith(routes.staff.campaign.staff.list)
                            })}
                        >
                            <div className="sscr2-nav-link">
                                <StaffIcon className="sscr2-nav-icon" />
                                <span>Nhân viên</span>
                            </div>
                        </Link>
                        <Link
                            to={routes.staff.campaign.user.list}
                            className={classNames('sscr2-nav-item', {
                                'nav-active': location.pathname.startsWith(routes.staff.campaign.user.list)
                            })}
                        >
                            <div className="sscr2-nav-link">
                                <UserIcon className="sscr2-nav-icon" />
                                <span>Người dùng</span>
                            </div>
                        </Link>
                    </div>
                    <Link
                        to={routes.staff.news.list}
                        className={classNames('sscr2-nav-item', {
                            'nav-active': location.pathname.startsWith(routes.staff.news.list),
                        })}
                    >
                        <div className="sscr2-nav-link">
                            <NewsIcon className="sscr2-nav-icon" />
                            <span>Tin tức</span>
                        </div>
                    </Link>
                    <Link
                        to={routes.staff.post}
                        className={classNames('sscr2-nav-item', {
                            'nav-active': location.pathname.startsWith(routes.staff.post),
                        })}
                    >
                        <div className="sscr2-nav-link">
                            <PostIcon className="sscr2-nav-icon" />
                            <span>Bài viết</span>
                        </div>
                    </Link>
                    <div
                        className="sscr2-nav-item asrc2-nav-dropdown"
                        onClick={handleDropdownToggle}
                    >
                        <CertificateIcon className="sscr2-nav-icon" />
                        <span>Đơn xác nhận danh tính</span>
                    </div>
                    <div ref={dropdownRef} className={classNames("ssrc2-nav-dropdown-content", {
                        'open': location.pathname.startsWith(routes.staff.certificate.donor.list || routes.staff.certificate.recipient.list),
                    })}>
                        <Link
                            to={routes.staff.certificate.donor.list}
                            className={classNames('sscr2-nav-item', {
                                'nav-active': location.pathname.startsWith(routes.staff.certificate.donor.list)
                            })}
                        >
                            <div className="sscr2-nav-link">
                                <StaffIcon className="sscr2-nav-icon" />
                                <span>Người hiến tặng thực phẩm</span>
                            </div>
                        </Link>
                        <Link
                            to={routes.staff.certificate.recipient.list}
                            className={classNames('sscr2-nav-item', {
                                'nav-active': location.pathname.startsWith(routes.staff.certificate.recipient.list)
                            })}
                        >
                            <div className="sscr2-nav-link">
                                <StaffIcon className="sscr2-nav-icon" />
                                <span>Người nhận hỗ trợ</span>
                            </div>
                        </Link>
                    </div>
                    <Link
                        to={""}
                        onClick={logoutManager}
                        className='sscr2-nav-item'
                    >
                        <div className="sscr2-nav-link">
                            <LogoutIcon className="sscr2-nav-icon" />
                            <span>Đăng xuất</span>
                        </div>
                    </Link>
                </div>
            </div>
        </nav>
    );
}

export default StaffSidebar