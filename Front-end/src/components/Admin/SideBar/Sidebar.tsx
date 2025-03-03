import { CampaignIcon, DashboardtIcon, ForumIcon, NewsIcon, PostIcon, StaffIcon, UserIcon } from '@/assets/icons';
import { FC, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import { routes } from '@/routes/routeName';

const AdminSidebar: FC = () => {
    const location = useLocation();

    const sidebarRef = useRef<HTMLDivElement | null>(null);

    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const handleDropdownToggle = (event: React.MouseEvent<HTMLElement>) => {
        const dropdown = event.currentTarget.nextElementSibling as HTMLElement;
        dropdown.classList.toggle('open');

        const arrowIcon = event.currentTarget.querySelector('.src2-arrow') as HTMLElement;
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
                    <p className='as-logo'>Logo</p>
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
                            <span>Dashboard</span>
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
                            <span>Staff</span>
                        </div>
                    </Link>
                    <div
                        className="ascr2-nav-item asrc2-nav-dropdown"
                        onClick={handleDropdownToggle}
                    >
                        <CampaignIcon className="ascr2-nav-icon" />
                        <span>Campaign</span>
                    </div>
                    <div ref={dropdownRef} className={classNames("asrc2-nav-dropdown-content", {
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
                                <span>All</span>
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
                                <span>Staff</span>
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
                                <span>Donor</span>
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
                            <span>News</span>
                        </div>
                    </Link>
                    <div
                        className="ascr2-nav-item asrc2-nav-dropdown"
                        onClick={handleDropdownToggle}
                    >
                        <PostIcon className="ascr2-nav-icon" />
                        <span>Post</span>
                    </div>
                    <div ref={dropdownRef} className={classNames("asrc2-nav-dropdown-content", {
                        'open': location.pathname.startsWith(routes.admin.post.forum),
                    })}>
                        <Link
                            to={routes.admin.post.forum}
                            className={classNames('ascr2-nav-item', {
                                'nav-active': location.pathname === routes.admin.post.forum,
                            })}
                        >
                            <div className="ascr2-nav-link">
                                <ForumIcon className="ascr2-nav-icon" />
                                <span>Forum</span>
                            </div>
                        </Link>
                        <Link
                            to={routes.admin.post.user}
                            className={classNames('ascr2-nav-item', {
                                'nav-active': location.pathname === routes.admin.post.user,
                            })}
                        >
                            <div className="ascr2-nav-link">
                                <UserIcon className="ascr2-nav-icon" />
                                <span>User</span>
                            </div>
                        </Link>
                        <Link
                            to={routes.admin.post.staff}
                            className={classNames('ascr2-nav-item', {
                                'nav-active': location.pathname === routes.admin.post.staff,
                            })}
                        >
                            <div className="ascr2-nav-link">
                                <StaffIcon className="ascr2-nav-icon" />
                                <span>Staff</span>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default AdminSidebar