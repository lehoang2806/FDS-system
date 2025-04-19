import { selectGetAllCampaign, selectGetAllNews, selectGetAllPosts, selectGetProfileUser, selectIsAuthenticated, selectUserLogin } from '@/app/selector';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { Post } from '@/components/Elements';
import { CreatePostModal } from '@/components/Modal';
import { routes } from '@/routes/routeName'
import { setLoading } from '@/services/app/appSlice';
import { getAllCampaignApiThunk } from '@/services/campaign/campaignThunk';
import { getAllNewsApiThunk } from '@/services/news/newsThunk';
import { getAllPostsApiThunk } from '@/services/post/postThunk';
import { getProfileApiThunk } from '@/services/user/userThunk';
import { UserInfo } from '@/types/user';
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const PostForumPage = () => {
    const dispatch = useAppDispatch();

    const [activeTab, setActiveTab] = useState<"noibat" | "cuatoi">("noibat");

    const isAuthentication = useAppSelector(selectIsAuthenticated)
    const userLogin = useAppSelector(selectUserLogin)
    const userProfile = useAppSelector(selectGetProfileUser)

    const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false)

    const posts = useAppSelector(selectGetAllPosts)
    const sortedPosts = [...posts].reverse();
    const campaigns = useAppSelector(selectGetAllCampaign)
    const sortedCampaigns = [...campaigns].reverse();
    const threeCampaigns = sortedCampaigns.slice(0, 3);
    const news = useAppSelector(selectGetAllNews)
    const sortedNews = [...news].reverse();
    const threeNews = sortedNews.slice(0, 3);

    const approvedPost = sortedPosts.filter(post => post.status === "Approved")

    const personalPost = sortedPosts.filter(post => post.posterId === userLogin?.accountId)

    useEffect(() => {
        dispatch(setLoading(true))

        Promise.all([
            dispatch(getAllPostsApiThunk()).unwrap(),
            dispatch(getProfileApiThunk(String(userProfile?.accountId))).unwrap(),
            dispatch(getAllCampaignApiThunk()).unwrap(),
            dispatch(getAllNewsApiThunk()).unwrap(),
        ])
            .catch((error) => {
                console.error("Error fetching data:", error);
            })
            .finally(() => {
                setTimeout(() => {
                    dispatch(setLoading(false));
                }, 1000)
            });
    }, [dispatch])

    const handleCreatePostModalOpen = () => {
        if (isAuthentication) {
            setIsCreatePostModalOpen(true)
        } else {
            alert('Vui lòng đăng nhập')
        }
    }

    const handletoPersonalPost = () => {
        if (isAuthentication) {
            setActiveTab("cuatoi")
        } else {
            alert('Vui lòng đăng nhập')
        }
    }

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
                                {threeCampaigns.map((campaign, index) => (
                                    <div className="pf-card-item" key={index}>
                                        <img className="pf-card-img" src={campaign.images[0]} />
                                        <div className="pf-card-info">
                                            <h5 className="pf-card-name">{campaign.campaignName}</h5>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="pfscc1r2">
                            <div className="pfscc1r2r1">
                                <h3>Tin tức mới nhất</h3>
                                <Link to={routes.user.news.list}>Tất cả</Link>
                            </div>
                            <div className="pfscc1r2r2">
                                {threeNews.map((news, index) => (
                                    <div className="pf-card-item" key={index}>
                                        <img className="pf-card-img" src={news.images[0]} />
                                        <div className="pf-card-info">
                                            <h5 className="pf-card-name">{news.newsTitle}</h5>
                                            <p className='pf-card-time'>{news.createdDate}</p>
                                        </div>
                                    </div>
                                ))}
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
                                    className={`pf-tabs-item ${activeTab === "cuatoi" ? "pf-tabs-item-actived" : ""}`}
                                    onClick={() => handletoPersonalPost()}
                                >
                                    Cá nhân
                                </div>
                            </div>

                            <button className="pr-btn" onClick={() => handleCreatePostModalOpen()}>Tạo bài viết</button>
                        </div>
                        <div className="pfscc2r2">
                            {activeTab === "noibat" ? (
                                <>
                                    {approvedPost.map((post, index) => (
                                        <Post key={index} post={post} user={userProfile as UserInfo} />
                                    ))}
                                </>
                            ) : (
                                <>
                                    {personalPost.map((post, index) => (
                                        <Post key={index} post={post} isStatus={true} user={userProfile as UserInfo} />
                                    ))}
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