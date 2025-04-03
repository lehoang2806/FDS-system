import { selectIsAuthenticated } from '@/app/selector';
import { useAppSelector } from '@/app/store';
import { Post } from '@/components/Elements';
import { CreatePostModal } from '@/components/Modal';
import { routes } from '@/routes/routeName'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const PostForumPage = () => {
    const [activeTab, setActiveTab] = useState<"noibat" | "theodoi">("noibat");

    const isAuthentication = useAppSelector(selectIsAuthenticated)

    const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false)

    return (
        <main id="post-forum">
            <section id="pf-section">
                <div className="pfs-container">
                    <div className="pfscc1">
                        <div className="pfscc1r1">
                            <div className="pfscc1r1r1">
                                <h3>Chiến dịch mới nhất</h3>
                                <Link to={routes.user.campaign.list}>Tất cả</Link>
                            </div>
                            <div className="pfscc1r1r2">
                                <div className="pf-card-item">
                                    <div className="pf-card-img"></div>
                                    <div className="pf-card-info">
                                        <h5 className="pf-card-name">Tên chiến dịch</h5>
                                        <p className='pf-card-time'>Còn lại 2 ngày</p>
                                    </div>
                                </div>
                                <div className="pf-card-item">
                                    <div className="pf-card-img"></div>
                                    <div className="pf-card-info">
                                        <h5 className="pf-card-name">Tên chiến dịch</h5>
                                        <p className='pf-card-time'>Còn lại 2 ngày</p>
                                    </div>
                                </div>
                                <div className="pf-card-item">
                                    <div className="pf-card-img"></div>
                                    <div className="pf-card-info">
                                        <h5 className="pf-card-name">Tên chiến dịch</h5>
                                        <p className='pf-card-time'>Còn lại 2 ngày</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="pfscc1r2">
                            <div className="pfscc1r2r1">
                                <h3>Tin tức mới nhất</h3>
                                <Link to={routes.user.news.list}>Tất cả</Link>
                            </div>
                            <div className="pfscc1r2r2">
                                <div className="pf-card-item">
                                    <div className="pf-card-img"></div>
                                    <div className="pf-card-info">
                                        <p className="pf-card-status">Trạng thái</p>
                                        <h5 className="pf-card-name">Tên tin tức</h5>
                                        <p className='pf-card-time'>Ngày đăng</p>
                                    </div>
                                </div>
                                <div className="pf-card-item">
                                    <div className="pf-card-img"></div>
                                    <div className="pf-card-info">
                                        <p className="pf-card-status">Trạng thái</p>
                                        <h5 className="pf-card-name">Tên tin tức</h5>
                                        <p className='pf-card-time'>Ngày đăng</p>
                                    </div>
                                </div>
                                <div className="pf-card-item">
                                    <div className="pf-card-img"></div>
                                    <div className="pf-card-info">
                                        <p className="pf-card-status">Trạng thái</p>
                                        <h5 className="pf-card-name">Tên tin tức</h5>
                                        <p className='pf-card-time'>Ngày đăng</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="pfscc2">
                        <div className="pfscc2r1">
                            <div className="pf-tabs">
                                <div
                                    className={`pf-tabs-item ${activeTab === "noibat" ? "pf-tabs-item-actived" : ""}`}
                                    onClick={() => setActiveTab("noibat")}
                                >
                                    Nổi bật
                                </div>
                                <div
                                    className={`pf-tabs-item ${activeTab === "theodoi" ? "pf-tabs-item-actived" : ""}`}
                                    onClick={() => setActiveTab("theodoi")}
                                >
                                    Theo dõi
                                </div>
                            </div>

                            <button className="pr-btn" onClick={() => setIsCreatePostModalOpen(true)}>Tạo bài viết</button>
                        </div>
                        <div className="pfscc2r2">
                            {activeTab === "noibat" ? (
                                <>
                                    <Post />
                                    <Post />
                                    <Post />
                                    <Post />
                                    <Post />
                                </>
                            ) : (
                                <>
                                    <Post />
                                    <Post />
                                    <Post />
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>
            <CreatePostModal isOpen={isCreatePostModalOpen} setIsOpen={setIsCreatePostModalOpen} />
        </main>
    )
}

export default PostForumPage