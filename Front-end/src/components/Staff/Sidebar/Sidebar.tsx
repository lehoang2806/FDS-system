import { CampaignIcon, CertificateIcon, DashboardtIcon, NewsIcon, PostIcon, StaffIcon, UserIcon } from '@/assets/icons';
import { FC, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import { routes } from '@/routes/routeName';

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
                            <span>Dashboard</span>
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
                            <span>User</span>
                        </div>
                    </Link>
                    <div
                        className="sscr2-nav-item asrc2-nav-dropdown"
                        onClick={handleDropdownToggle}
                    >
                        <CampaignIcon className="sscr2-nav-icon" />
                        <span>Campaign</span>
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
                                <span>Staff</span>
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
                                <span>User</span>
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
                            <span>News</span>
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
                            <span>Post</span>
                        </div>
                    </Link>
                    <div
                        className="sscr2-nav-item asrc2-nav-dropdown"
                        onClick={handleDropdownToggle}
                    >
                        <CertificateIcon className="sscr2-nav-icon" />
                        <span>Certificate</span>
                    </div>
                    <div ref={dropdownRef} className={classNames("ssrc2-nav-dropdown-content", {
                        'open': location.pathname.startsWith(routes.staff.certificate.donor.list),
                    })}>
                        <Link
                            to={routes.staff.certificate.donor.list}
                            className={classNames('sscr2-nav-item', {
                                'nav-active': location.pathname.startsWith(routes.staff.certificate.donor.list)
                            })}
                        >
                            <div className="sscr2-nav-link">
                                <StaffIcon className="sscr2-nav-icon" />
                                <span>Donor</span>
                            </div>
                        </Link>
                    </div>
                    {/* <div
                        className="sscr2-nav-item asrc2-nav-dropdown"
                        onClick={handleDropdownToggle}
                    >
                        <CampaignIcon className="sscr2-nav-icon" />
                        <span>Campaign</span>
                    </div>
                    <div ref={dropdownRef} className={classNames("asrc2-nav-dropdown-content", {
                        'open': location.pathname.startsWith(routes.admin.campaign.list),
                    })}>
                        <Link
                            to={routes.admin.campaign.list}
                            className={classNames('sscr2-nav-item', {
                                'nav-active': location.pathname.startsWith(routes.admin.campaign.list) &&
                                              !location.pathname.startsWith(routes.admin.campaign.staff.list) &&
                                              !location.pathname.startsWith(routes.admin.campaign.donor.list),
                            })}
                        >
                            <div className="sscr2-nav-link">
                                <StaffIcon className="sscr2-nav-icon" />
                                <span>All</span>
                            </div>
                        </Link>
                        <Link
                            to={routes.admin.campaign.staff.list}
                            className={classNames('sscr2-nav-item', {
                                'nav-active': location.pathname.startsWith(routes.admin.campaign.staff.list),
                            })}
                        >
                            <div className="sscr2-nav-link">
                                <StaffIcon className="sscr2-nav-icon" />
                                <span>Staff</span>
                            </div>
                        </Link>
                        <Link
                            to={routes.admin.campaign.donor.list}
                            className={classNames('sscr2-nav-item', {
                                'nav-active': location.pathname.startsWith(routes.admin.campaign.donor.list),
                            })}
                        >
                            <div className="sscr2-nav-link">
                                <UserIcon className="sscr2-nav-icon" />
                                <span>Donor</span>
                            </div>
                        </Link>
                    </div>
                    <Link
                        to={routes.admin.news.list}
                        className={classNames('sscr2-nav-item', {
                            'nav-active': location.pathname.startsWith(routes.admin.news.list),
                        })}
                    >
                        <div className="sscr2-nav-link">
                            <NewsIcon className="sscr2-nav-icon" />
                            <span>News</span>
                        </div>
                    </Link>
                    <div
                        className="sscr2-nav-item asrc2-nav-dropdown"
                        onClick={handleDropdownToggle}
                    >
                        <PostIcon className="sscr2-nav-icon" />
                        <span>Post</span>
                    </div>
                    <div ref={dropdownRef} className={classNames("asrc2-nav-dropdown-content", {
                        'open': location.pathname.startsWith(routes.admin.post.forum),
                    })}>
                        <Link
                            to={routes.admin.post.forum}
                            className={classNames('sscr2-nav-item', {
                                'nav-active': location.pathname === routes.admin.post.forum,
                            })}
                        >
                            <div className="sscr2-nav-link">
                                <ForumIcon className="sscr2-nav-icon" />
                                <span>Forum</span>
                            </div>
                        </Link>
                        <Link
                            to={routes.admin.post.user}
                            className={classNames('sscr2-nav-item', {
                                'nav-active': location.pathname === routes.admin.post.user,
                            })}
                        >
                            <div className="sscr2-nav-link">
                                <UserIcon className="sscr2-nav-icon" />
                                <span>User</span>
                            </div>
                        </Link>
                        <Link
                            to={routes.admin.post.staff}
                            className={classNames('sscr2-nav-item', {
                                'nav-active': location.pathname === routes.admin.post.staff,
                            })}
                        >
                            <div className="sscr2-nav-link">
                                <StaffIcon className="sscr2-nav-icon" />
                                <span>Staff</span>
                            </div>
                        </Link>
                    </div> */}
                </div>
            </div>
        </nav>
    );
}

export default StaffSidebar